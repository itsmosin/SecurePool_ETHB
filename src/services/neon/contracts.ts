import { ethers } from 'ethers';

// Contract ABIs (simplified for demo - in production, import from artifacts)
const INSURANCE_ABI = [
  "function purchasePolicy(uint256 coverageAmount, uint256 duration, string riskType) payable",
  "function submitClaim(uint256 policyId, uint256 claimAmount, string evidence)",
  "function provideLiquidity(uint256 amount)",
  "function withdrawLiquidity(uint256 amount)",
  "function calculatePremium(uint256 coverageAmount, uint256 duration) view returns (uint256)",
  "function getUserPolicies(address user) view returns (uint256[])",
  "function getCapitalPoolStats() view returns (uint256, uint256, uint256, uint256)",
  "function policies(uint256) view returns (uint256, address, uint256, uint256, uint256, uint256, bool, bool, string)",
  "event PolicyPurchased(uint256 indexed policyId, address indexed policyholder, uint256 coverageAmount)",
  "event ClaimSubmitted(uint256 indexed policyId, address indexed policyholder, uint256 claimAmount)"
];

const ERC20_ABI = [
  "function approve(address spender, uint256 amount) returns (bool)",
  "function balanceOf(address account) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function faucet()",
  "function allowance(address owner, address spender) view returns (uint256)"
];

// Neon EVM DevNet configuration
const NEON_DEVNET_CONFIG = {
  chainId: 245022926,
  name: 'Neon EVM DevNet',
  rpcUrl: 'https://devnet.neonevm.org',
  blockExplorer: 'https://devnet.neonscan.org'
};

// Contract addresses (will be set after deployment)
let INSURANCE_CONTRACT_ADDRESS = '';
let ERC20_TOKEN_ADDRESS = '';

export const setContractAddresses = (insuranceAddress: string, tokenAddress: string) => {
  INSURANCE_CONTRACT_ADDRESS = insuranceAddress;
  ERC20_TOKEN_ADDRESS = tokenAddress;
};

export const getProvider = () => {
  return new ethers.providers.JsonRpcProvider(NEON_DEVNET_CONFIG.rpcUrl);
};

export const getSigner = async () => {
  if (typeof window !== 'undefined' && (window as any).ethereum) {
    const provider = new ethers.providers.Web3Provider((window as any).ethereum);
    return provider.getSigner();
  }
  throw new Error('No wallet detected');
};

export const getInsuranceContract = async () => {
  if (!INSURANCE_CONTRACT_ADDRESS) {
    throw new Error('Insurance contract address not set');
  }
  const signer = await getSigner();
  return new ethers.Contract(INSURANCE_CONTRACT_ADDRESS, INSURANCE_ABI, signer);
};

export const getTokenContract = async () => {
  if (!ERC20_TOKEN_ADDRESS) {
    throw new Error('Token contract address not set');
  }
  const signer = await getSigner();
  return new ethers.Contract(ERC20_TOKEN_ADDRESS, ERC20_ABI, signer);
};

// Insurance contract functions
export const purchasePolicy = async (
  coverageAmount: string,
  duration: number,
  riskType: string
): Promise<{ success: boolean; txHash: string; policyId?: number }> => {
  try {
    const contract = await getInsuranceContract();
    const coverageAmountWei = ethers.utils.parseEther(coverageAmount);
    
    // Calculate premium
    const premium = await contract.calculatePremium(coverageAmountWei, duration);
    
    // Purchase policy
    const tx = await contract.purchasePolicy(coverageAmountWei, duration, riskType, {
      value: premium
    });
    
    const receipt = await tx.wait();
    
    // Extract policy ID from events
    const policyPurchasedEvent = receipt.events?.find((event: any) => 
      event.event === 'PolicyPurchased'
    );
    
    const policyId = policyPurchasedEvent?.args?.policyId ? 
      policyPurchasedEvent.args.policyId.toNumber() : undefined;
    
    return {
      success: true,
      txHash: tx.hash,
      policyId
    };
  } catch (error) {
    console.error('Error purchasing policy:', error);
    throw new Error('Failed to purchase policy');
  }
};

export const submitClaim = async (
  policyId: number,
  claimAmount: string,
  evidence: string
): Promise<{ success: boolean; txHash: string }> => {
  try {
    const contract = await getInsuranceContract();
    const claimAmountWei = ethers.utils.parseEther(claimAmount);
    
    const tx = await contract.submitClaim(policyId, claimAmountWei, evidence);
    await tx.wait();
    
    return {
      success: true,
      txHash: tx.hash
    };
  } catch (error) {
    console.error('Error submitting claim:', error);
    throw new Error('Failed to submit claim');
  }
};

export const provideLiquidity = async (amount: string): Promise<{ success: boolean; txHash: string }> => {
  try {
    const [tokenContract, insuranceContract] = await Promise.all([
      getTokenContract(),
      getInsuranceContract()
    ]);
    
    const amountWei = ethers.utils.parseEther(amount);
    
    // First approve the insurance contract to spend tokens
    const approveTx = await tokenContract.approve(INSURANCE_CONTRACT_ADDRESS, amountWei);
    await approveTx.wait();
    
    // Then provide liquidity
    const liquidityTx = await insuranceContract.provideLiquidity(amountWei);
    await liquidityTx.wait();
    
    return {
      success: true,
      txHash: liquidityTx.hash
    };
  } catch (error) {
    console.error('Error providing liquidity:', error);
    throw new Error('Failed to provide liquidity');
  }
};

export const getUserPolicies = async (userAddress: string): Promise<number[]> => {
  try {
    const contract = await getInsuranceContract();
    const policies = await contract.getUserPolicies(userAddress);
    return policies.map((id: any) => id.toNumber());
  } catch (error) {
    console.error('Error fetching user policies:', error);
    throw new Error('Failed to fetch user policies');
  }
};

export const getPolicyDetails = async (policyId: number) => {
  try {
    const contract = await getInsuranceContract();
    const policy = await contract.policies(policyId);
    
    return {
      id: policy[0].toNumber(),
      policyholder: policy[1],
      coverageAmount: ethers.utils.formatEther(policy[2]),
      premiumPaid: ethers.utils.formatEther(policy[3]),
      startTime: policy[4].toNumber(),
      endTime: policy[5].toNumber(),
      isActive: policy[6],
      claimed: policy[7],
      riskType: policy[8]
    };
  } catch (error) {
    console.error('Error fetching policy details:', error);
    throw new Error('Failed to fetch policy details');
  }
};

export const getCapitalPoolStats = async () => {
  try {
    const contract = await getInsuranceContract();
    const stats = await contract.getCapitalPoolStats();
    
    return {
      totalDeposits: ethers.utils.formatEther(stats[0]),
      availableLiquidity: ethers.utils.formatEther(stats[1]),
      lockedLiquidity: ethers.utils.formatEther(stats[2]),
      totalRewards: ethers.utils.formatEther(stats[3])
    };
  } catch (error) {
    console.error('Error fetching capital pool stats:', error);
    throw new Error('Failed to fetch capital pool stats');
  }
};

// Token functions
export const getTokenBalance = async (userAddress: string): Promise<string> => {
  try {
    const contract = await getTokenContract();
    const balance = await contract.balanceOf(userAddress);
    return ethers.utils.formatEther(balance);
  } catch (error) {
    console.error('Error fetching token balance:', error);
    throw new Error('Failed to fetch token balance');
  }
};

export const useFaucet = async (): Promise<{ success: boolean; txHash: string }> => {
  try {
    const contract = await getTokenContract();
    const tx = await contract.faucet();
    await tx.wait();
    
    return {
      success: true,
      txHash: tx.hash
    };
  } catch (error) {
    console.error('Error using faucet:', error);
    throw new Error('Failed to use faucet');
  }
}; 