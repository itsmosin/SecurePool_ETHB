import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum?: {
      request: (request: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (...args: any[]) => void) => void;
      removeListener: (event: string, callback: (...args: any[]) => void) => void;
      selectedAddress: string | null;
    };
  }
}

const NEON_DEVNET_CONFIG = {
  chainId: '0xe9ac0ce', // 245022926 in hex
  chainName: 'Neon EVM DevNet',
  rpcUrls: ['https://devnet.neonevm.org'],
  nativeCurrency: {
    name: 'NEON',
    symbol: 'NEON',
    decimals: 18,
  },
  blockExplorerUrls: ['https://devnet.neonscan.org'],
};

export interface WalletData {
  address: string;
  balance: string;
  isConnected: boolean;
}

export const connectWallet = async (): Promise<WalletData> => {
  if (!window.ethereum) {
    throw new Error('MetaMask not installed');
  }

  try {
    // Request account access
    const accounts = await window.ethereum.request({ 
      method: 'eth_requestAccounts' 
    });

    if (accounts.length === 0) {
      throw new Error('No accounts found');
    }

    // Add Neon DevNet if not already added
    await addNeonNetwork();

    // Switch to Neon DevNet
    await switchToNeonNetwork();

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(accounts[0]);

    return {
      address: accounts[0],
      balance: ethers.utils.formatEther(balance),
      isConnected: true
    };
  } catch (error) {
    console.error('Error connecting wallet:', error);
    throw new Error('Failed to connect wallet');
  }
};

export const addNeonNetwork = async (): Promise<void> => {
  if (!window.ethereum) {
    throw new Error('MetaMask not installed');
  }

  try {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [NEON_DEVNET_CONFIG],
    });
  } catch (error: any) {
    // Error code 4902 means the chain is not added to MetaMask
    if (error.code === 4902) {
      throw new Error('Please add Neon DevNet to MetaMask manually');
    }
    throw error;
  }
};

export const switchToNeonNetwork = async (): Promise<void> => {
  if (!window.ethereum) {
    throw new Error('MetaMask not installed');
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: NEON_DEVNET_CONFIG.chainId }],
    });
  } catch (error) {
    console.error('Error switching to Neon network:', error);
    throw new Error('Failed to switch to Neon network');
  }
};

export const getWalletAddress = async (): Promise<string | null> => {
  if (!window.ethereum) {
    return null;
  }

  try {
    const accounts = await window.ethereum.request({ 
      method: 'eth_accounts' 
    });
    return accounts.length > 0 ? accounts[0] : null;
  } catch (error) {
    console.error('Error getting wallet address:', error);
    return null;
  }
};

export const getWalletBalance = async (address: string): Promise<string> => {
  try {
    const provider = new ethers.providers.JsonRpcProvider('https://devnet.neonevm.org');
    const balance = await provider.getBalance(address);
    return ethers.utils.formatEther(balance);
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    throw new Error('Failed to fetch wallet balance');
  }
};

export const isWalletConnected = async (): Promise<boolean> => {
  const address = await getWalletAddress();
  return address !== null;
};

export const onAccountsChanged = (callback: (accounts: string[]) => void) => {
  if (window.ethereum) {
    window.ethereum.on('accountsChanged', callback);
  }
};

export const onChainChanged = (callback: (chainId: string) => void) => {
  if (window.ethereum) {
    window.ethereum.on('chainChanged', callback);
  }
};

export const removeWalletListeners = () => {
  if (window.ethereum) {
    window.ethereum.removeListener('accountsChanged', () => {});
    window.ethereum.removeListener('chainChanged', () => {});
  }
}; 