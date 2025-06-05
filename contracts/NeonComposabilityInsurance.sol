// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// Import Neon EVM composability libraries
// Note: These imports will be from the actual Neon composability libraries
// For now, we'll create interfaces that match the expected functionality

interface INeonSPLToken {
    function createSPLToken(
        string memory name,
        string memory symbol,
        uint8 decimals,
        address authority
    ) external returns (bytes32 mint);
    
    function mintTo(
        bytes32 mint,
        address to,
        uint64 amount
    ) external;
    
    function transfer(
        bytes32 mint,
        address from,
        address to,
        uint64 amount
    ) external;
    
    function getTokenSupply(bytes32 mint) external view returns (uint64);
    function getTokenBalance(bytes32 mint, address owner) external view returns (uint64);
}

interface INeonSystemProgram {
    function createAccount(
        address newAccount,
        uint64 lamports,
        uint64 space,
        bytes32 owner
    ) external;
    
    function transfer(
        address from,
        address to,
        uint64 lamports
    ) external;
}

/**
 * @title NeonComposabilityInsurance
 * @dev Advanced insurance contract using Neon EVM's composability libraries
 * to interact directly with Solana programs for enhanced functionality
 */
contract NeonComposabilityInsurance {
    
    // Neon EVM composability interfaces
    INeonSPLToken public immutable splTokenProgram;
    INeonSystemProgram public immutable systemProgram;
    
    // Insurance token mint (created via SPL Token program)
    bytes32 public securePoolToken;
    
    // Pool statistics
    struct PoolStats {
        uint256 totalPolicies;
        uint256 totalCoverage;
        uint256 totalPremiums;
        uint256 activeClaims;
        uint256 paidClaims;
    }
    
    struct CrossChainPolicy {
        uint256 id;
        address evm_holder;
        bytes32 solana_account;
        uint256 coverage_amount;
        uint256 premium_paid;
        string risk_type;
        uint64 solana_tokens_locked;
        bool active;
        uint256 created_at;
        uint256 expires_at;
    }
    
    // Events specific to cross-chain functionality
    event SPLTokenCreated(bytes32 indexed mint, string name, string symbol);
    event CrossChainPolicyCreated(uint256 indexed policyId, address evmHolder, bytes32 solanaAccount);
    event SolanaTokensLocked(bytes32 indexed mint, uint64 amount, uint256 policyId);
    event SolanaTokensReleased(bytes32 indexed mint, uint64 amount, address recipient);
    
    mapping(uint256 => CrossChainPolicy) public crossChainPolicies;
    mapping(address => uint256[]) public userCrossChainPolicies;
    
    PoolStats public poolStats;
    uint256 public nextCrossChainPolicyId = 1;
    
    constructor(address _splTokenProgram, address _systemProgram) {
        splTokenProgram = INeonSPLToken(_splTokenProgram);
        systemProgram = INeonSystemProgram(_systemProgram);
        
        // Create SecurePool SPL token on Solana via Neon composability
        securePoolToken = splTokenProgram.createSPLToken(
            "SecurePool Insurance Token",
            "SPINS",
            9, // 9 decimals (standard for Solana)
            address(this) // This contract is the mint authority
        );
        
        emit SPLTokenCreated(securePoolToken, "SecurePool Insurance Token", "SPINS");
    }
    
    /**
     * @dev Create a cross-chain insurance policy that locks SPL tokens on Solana
     * @param coverageAmount Amount of coverage in USD (18 decimals)
     * @param duration Duration in seconds
     * @param riskType Type of risk being covered
     * @param solanaAccount Solana account to associate with this policy
     */
    function createCrossChainPolicy(
        uint256 coverageAmount,
        uint256 duration,
        string memory riskType,
        bytes32 solanaAccount
    ) external payable {
        require(coverageAmount > 0, "Coverage must be positive");
        require(duration >= 30 days && duration <= 365 days, "Invalid duration");
        require(solanaAccount != bytes32(0), "Invalid Solana account");
        
        // Calculate premium (2% annual rate)
        uint256 premium = (coverageAmount * 200 * duration) / (10000 * 365 days);
        require(msg.value >= premium, "Insufficient premium payment");
        
        // Calculate SPL tokens to lock (coverage amount / 1000 for demo)
        uint64 splTokensToLock = uint64(coverageAmount / 1000);
        
        // Mint SPL tokens to this contract (representing locked collateral)
        splTokenProgram.mintTo(securePoolToken, address(this), splTokensToLock);
        
        // Create cross-chain policy
        CrossChainPolicy memory policy = CrossChainPolicy({
            id: nextCrossChainPolicyId,
            evm_holder: msg.sender,
            solana_account: solanaAccount,
            coverage_amount: coverageAmount,
            premium_paid: premium,
            risk_type: riskType,
            solana_tokens_locked: splTokensToLock,
            active: true,
            created_at: block.timestamp,
            expires_at: block.timestamp + duration
        });
        
        crossChainPolicies[nextCrossChainPolicyId] = policy;
        userCrossChainPolicies[msg.sender].push(nextCrossChainPolicyId);
        
        // Update pool statistics
        poolStats.totalPolicies++;
        poolStats.totalCoverage += coverageAmount;
        poolStats.totalPremiums += premium;
        
        emit CrossChainPolicyCreated(nextCrossChainPolicyId, msg.sender, solanaAccount);
        emit SolanaTokensLocked(securePoolToken, splTokensToLock, nextCrossChainPolicyId);
        
        nextCrossChainPolicyId++;
        
        // Refund excess payment
        if (msg.value > premium) {
            payable(msg.sender).transfer(msg.value - premium);
        }
    }
    
    /**
     * @dev Process claim and release SPL tokens to Solana account
     * @param policyId ID of the policy to claim
     * @param claimAmount Amount to claim
     * @param proof Merkle proof or oracle data (simplified for demo)
     */
    function processCrossChainClaim(
        uint256 policyId,
        uint256 claimAmount,
        bytes32 proof
    ) external {
        CrossChainPolicy storage policy = crossChainPolicies[policyId];
        require(policy.evm_holder == msg.sender, "Not policy holder");
        require(policy.active, "Policy not active");
        require(block.timestamp <= policy.expires_at, "Policy expired");
        require(claimAmount <= policy.coverage_amount, "Claim exceeds coverage");
        require(proof != bytes32(0), "Invalid proof"); // Simplified validation
        
        // Calculate SPL tokens to release proportionally
        uint64 tokensToRelease = uint64((policy.solana_tokens_locked * claimAmount) / policy.coverage_amount);
        
        // Create Solana account for the claimant if needed (using system program)
        // This demonstrates cross-runtime account creation
        systemProgram.createAccount(
            msg.sender, // EVM address mapped to Solana
            1000000, // Minimum lamports for account creation
            0, // No additional space needed
            bytes32(0) // Default system program owner
        );
        
        // Transfer SPL tokens to the Solana account
        // Note: In a real implementation, this would transfer to policy.solana_account
        splTokenProgram.transfer(
            securePoolToken,
            address(this),
            msg.sender, // Simplified - should be converted to Solana address
            tokensToRelease
        );
        
        // Mark policy as claimed and update stats
        policy.active = false;
        poolStats.activeClaims++;
        poolStats.paidClaims += claimAmount;
        
        emit SolanaTokensReleased(securePoolToken, tokensToRelease, msg.sender);
    }
    
    /**
     * @dev Stake NEON tokens and receive SPL insurance tokens
     * @param amount Amount of NEON to stake
     */
    function stakeForInsuranceTokens(uint256 amount) external payable {
        require(msg.value == amount, "Value mismatch");
        require(amount > 0, "Amount must be positive");
        
        // Mint SPL tokens equivalent to staked NEON (1:1 ratio for demo)
        uint64 splTokensToMint = uint64(amount / 1e9); // Convert 18 decimals to 9 decimals
        
        splTokenProgram.mintTo(securePoolToken, msg.sender, splTokensToMint);
    }
    
    /**
     * @dev Get SPL token balance for an address
     * @param account Address to check balance for
     */
    function getSPLTokenBalance(address account) external view returns (uint64) {
        return splTokenProgram.getTokenBalance(securePoolToken, account);
    }
    
    /**
     * @dev Get SPL token total supply
     */
    function getSPLTokenSupply() external view returns (uint64) {
        return splTokenProgram.getTokenSupply(securePoolToken);
    }
    
    /**
     * @dev Get user's cross-chain policies
     * @param user Address of the user
     */
    function getUserCrossChainPolicies(address user) external view returns (uint256[] memory) {
        return userCrossChainPolicies[user];
    }
    
    /**
     * @dev Get detailed pool statistics
     */
    function getPoolStats() external view returns (PoolStats memory) {
        return poolStats;
    }
    
    /**
     * @dev Emergency function to mint more SPL tokens (admin only)
     * @param recipient Address to mint tokens to
     * @param amount Amount of tokens to mint
     */
    function emergencyMint(address recipient, uint64 amount) external {
        // In production, this would have proper access control
        splTokenProgram.mintTo(securePoolToken, recipient, amount);
    }
    
    /**
     * @dev Demonstrate cross-runtime system call
     * @param targetAccount Account to transfer lamports to
     * @param lamports Amount of lamports to transfer
     */
    function crossRuntimeTransfer(address targetAccount, uint64 lamports) external payable {
        require(msg.value >= lamports, "Insufficient payment");
        
        // Use Neon's system program composability to transfer lamports
        systemProgram.transfer(address(this), targetAccount, lamports);
    }
} 