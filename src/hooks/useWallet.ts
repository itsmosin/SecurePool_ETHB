import { useState, useEffect } from 'react';
import { neon } from '@/services/neon';

interface WalletState {
  address: string | null;
  balance: string;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
}

export const useWallet = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    address: null,
    balance: '0',
    isConnected: false,
    isLoading: false,
    error: null,
  });

  const connectWallet = async () => {
    try {
      setWalletState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const walletData = await neon.wallet.connectWallet();
      
      setWalletState({
        address: walletData.address,
        balance: walletData.balance,
        isConnected: walletData.isConnected,
        isLoading: false,
        error: null,
      });

      // Save to localStorage
      localStorage.setItem('neonWalletData', JSON.stringify(walletData));
      
      return walletData;
    } catch (error: any) {
      setWalletState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to connect wallet',
      }));
      throw error;
    }
  };

  const disconnectWallet = () => {
    setWalletState({
      address: null,
      balance: '0',
      isConnected: false,
      isLoading: false,
      error: null,
    });
    localStorage.removeItem('neonWalletData');
  };

  const refreshBalance = async () => {
    if (!walletState.address) return;
    
    try {
      const balance = await neon.wallet.getWalletBalance(walletState.address);
      setWalletState(prev => ({ ...prev, balance }));
    } catch (error) {
      console.error('Error refreshing balance:', error);
    }
  };

  // Initialize wallet state from localStorage
  useEffect(() => {
    const initializeWallet = async () => {
      try {
        const savedWalletData = localStorage.getItem('neonWalletData');
        if (savedWalletData) {
          const parsedData = JSON.parse(savedWalletData);
          
          // Check if still connected
          const isConnected = await neon.wallet.isWalletConnected();
          if (isConnected && parsedData.address) {
            // Refresh balance
            const balance = await neon.wallet.getWalletBalance(parsedData.address);
            setWalletState({
              address: parsedData.address,
              balance,
              isConnected: true,
              isLoading: false,
              error: null,
            });
          } else {
            // Clean up if not actually connected
            localStorage.removeItem('neonWalletData');
          }
        }
      } catch (error) {
        console.error('Error initializing wallet:', error);
        localStorage.removeItem('neonWalletData');
      }
    };

    initializeWallet();
  }, []);

  // Listen for account/chain changes
  useEffect(() => {
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else if (accounts[0] !== walletState.address) {
        // Account changed, reconnect
        connectWallet();
      }
    };

    const handleChainChanged = () => {
      // Refresh the page when chain changes
      window.location.reload();
    };

    neon.wallet.onAccountsChanged(handleAccountsChanged);
    neon.wallet.onChainChanged(handleChainChanged);

    return () => {
      neon.wallet.removeWalletListeners();
    };
  }, [walletState.address]);

  return {
    ...walletState,
    connectWallet,
    disconnectWallet,
    refreshBalance,
  };
}; 