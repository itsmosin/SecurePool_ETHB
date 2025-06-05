// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SecurePool Insurance Protocol
 * @dev A decentralized insurance platform on Neon EVM that uses SPL Token composability
 * to provide cross-runtime insurance coverage with Solana-native token operations
 */
contract SecurePoolInsurance is ReentrancyGuard, Ownable {
    
    // Insurance policy structure
    struct InsurancePolicy {
        uint256 id;
        address policyholder;
        uint256 coverageAmount;
        uint256 premiumPaid;
        uint256 startTime;
        uint256 endTime;
        bool isActive;
        bool claimed;
        string riskType; // "SMART_CONTRACT", "DEFI_PROTOCOL", "BRIDGE", etc.
    }
    
    // Capital pool for liquidity providers
    struct CapitalPool {
        uint256 totalDeposits;
        uint256 availableLiquidity;
        uint256 lockedLiquidity;
        uint256 totalRewards;
        mapping(address => uint256) deposits;
        mapping(address => uint256) rewards;
    }
    
    // Events
    event PolicyPurchased(uint256 indexed policyId, address indexed policyholder, uint256 coverageAmount);
    event ClaimSubmitted(uint256 indexed policyId, address indexed policyholder, uint256 claimAmount);
    event ClaimApproved(uint256 indexed policyId, uint256 payoutAmount);
    event LiquidityProvided(address indexed provider, uint256 amount);
    event RewardsDistributed(address indexed provider, uint256 amount);
    
    // State variables
    mapping(uint256 => InsurancePolicy) public policies;
    mapping(address => uint256[]) public userPolicies;
    CapitalPool public capitalPool;
    
    uint256 public nextPolicyId = 1;
    uint256 public constant PREMIUM_RATE = 200; // 2% annual premium rate (in basis points)
    uint256 public constant MIN_COVERAGE = 1000 * 10**18; // 1000 tokens minimum
    uint256 public constant MAX_COVERAGE = 1000000 * 10**18; // 1M tokens maximum
    
    IERC20 public immutable paymentToken;
    
    // SPL Token composability - we'll add Neon-specific imports here
    // These will be added when we implement the full Neon composability features
    
    constructor(address _paymentToken) {
        paymentToken = IERC20(_paymentToken);
    }
    
    /**
     * @dev Purchase an insurance policy
     * @param coverageAmount Amount of coverage requested
     * @param duration Duration of coverage in seconds
     * @param riskType Type of risk being covered
     */
    function purchasePolicy(
        uint256 coverageAmount,
        uint256 duration,
        string memory riskType
    ) external nonReentrant {
        require(coverageAmount >= MIN_COVERAGE, "Coverage below minimum");
        require(coverageAmount <= MAX_COVERAGE, "Coverage above maximum");
        require(duration >= 30 days, "Minimum 30 days coverage");
        require(duration <= 365 days, "Maximum 365 days coverage");
        
        uint256 premium = calculatePremium(coverageAmount, duration);
        require(capitalPool.availableLiquidity >= coverageAmount, "Insufficient liquidity");
        
        // Transfer premium from user
        require(paymentToken.transferFrom(msg.sender, address(this), premium), "Premium transfer failed");
        
        // Create policy
        InsurancePolicy memory newPolicy = InsurancePolicy({
            id: nextPolicyId,
            policyholder: msg.sender,
            coverageAmount: coverageAmount,
            premiumPaid: premium,
            startTime: block.timestamp,
            endTime: block.timestamp + duration,
            isActive: true,
            claimed: false,
            riskType: riskType
        });
        
        policies[nextPolicyId] = newPolicy;
        userPolicies[msg.sender].push(nextPolicyId);
        
        // Lock liquidity for this policy
        capitalPool.availableLiquidity -= coverageAmount;
        capitalPool.lockedLiquidity += coverageAmount;
        
        emit PolicyPurchased(nextPolicyId, msg.sender, coverageAmount);
        nextPolicyId++;
    }
    
    /**
     * @dev Submit a claim for an insurance policy
     * @param policyId ID of the policy to claim against
     * @param claimAmount Amount being claimed
     * @param evidence IPFS hash or description of evidence
     */
    function submitClaim(
        uint256 policyId,
        uint256 claimAmount,
        string memory evidence
    ) external nonReentrant {
        InsurancePolicy storage policy = policies[policyId];
        require(policy.policyholder == msg.sender, "Not policy holder");
        require(policy.isActive, "Policy not active");
        require(!policy.claimed, "Already claimed");
        require(block.timestamp <= policy.endTime, "Policy expired");
        require(claimAmount <= policy.coverageAmount, "Claim exceeds coverage");
        
        emit ClaimSubmitted(policyId, msg.sender, claimAmount);
        
        // For hackathon demo, auto-approve small claims
        // In production, this would go through a governance/oracle process
        if (claimAmount <= policy.coverageAmount / 2) {
            _approveClaim(policyId, claimAmount);
        }
    }
    
    /**
     * @dev Provide liquidity to the capital pool
     * @param amount Amount of tokens to deposit
     */
    function provideLiquidity(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be positive");
        
        require(paymentToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        
        capitalPool.deposits[msg.sender] += amount;
        capitalPool.totalDeposits += amount;
        capitalPool.availableLiquidity += amount;
        
        emit LiquidityProvided(msg.sender, amount);
    }
    
    /**
     * @dev Withdraw liquidity from the capital pool
     * @param amount Amount to withdraw
     */
    function withdrawLiquidity(uint256 amount) external nonReentrant {
        require(capitalPool.deposits[msg.sender] >= amount, "Insufficient balance");
        require(capitalPool.availableLiquidity >= amount, "Insufficient liquidity");
        
        capitalPool.deposits[msg.sender] -= amount;
        capitalPool.totalDeposits -= amount;
        capitalPool.availableLiquidity -= amount;
        
        require(paymentToken.transfer(msg.sender, amount), "Transfer failed");
    }
    
    /**
     * @dev Calculate premium for a policy
     * @param coverageAmount Amount of coverage
     * @param duration Duration in seconds
     */
    function calculatePremium(uint256 coverageAmount, uint256 duration) public pure returns (uint256) {
        // Annual premium rate applied proportionally
        return (coverageAmount * PREMIUM_RATE * duration) / (10000 * 365 days);
    }
    
    /**
     * @dev Internal function to approve and process a claim
     */
    function _approveClaim(uint256 policyId, uint256 claimAmount) internal {
        InsurancePolicy storage policy = policies[policyId];
        
        policy.claimed = true;
        policy.isActive = false;
        
        // Release locked liquidity
        capitalPool.lockedLiquidity -= policy.coverageAmount;
        capitalPool.availableLiquidity += (policy.coverageAmount - claimAmount);
        
        // Pay out claim
        require(paymentToken.transfer(policy.policyholder, claimAmount), "Claim payout failed");
        
        emit ClaimApproved(policyId, claimAmount);
    }
    
    /**
     * @dev Get user's policies
     * @param user Address of the user
     */
    function getUserPolicies(address user) external view returns (uint256[] memory) {
        return userPolicies[user];
    }
    
    /**
     * @dev Get capital pool stats
     */
    function getCapitalPoolStats() external view returns (
        uint256 totalDeposits,
        uint256 availableLiquidity,
        uint256 lockedLiquidity,
        uint256 totalRewards
    ) {
        return (
            capitalPool.totalDeposits,
            capitalPool.availableLiquidity,
            capitalPool.lockedLiquidity,
            capitalPool.totalRewards
        );
    }
    
    /**
     * @dev Get user's capital pool position
     * @param user Address of the user
     */
    function getUserCapitalPosition(address user) external view returns (
        uint256 deposits,
        uint256 rewards
    ) {
        return (
            capitalPool.deposits[user],
            capitalPool.rewards[user]
        );
    }
} 