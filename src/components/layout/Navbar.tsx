import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Shield, Copy, Check, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { neon } from "@/services/neon";

interface WalletData {
  address: string;
  balance: string;
  isConnected: boolean;
}

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const { toast } = useToast();
  const location = useLocation();

  // Load wallet data from localStorage on component mount
  useEffect(() => {
    const savedWalletData = localStorage.getItem('neonWalletData');
    if (savedWalletData) {
      try {
        const parsedData = JSON.parse(savedWalletData);
        setWalletData(parsedData);
      } catch (error) {
        console.error("Error parsing saved wallet data:", error);
        localStorage.removeItem('neonWalletData');
      }
    }
  }, []);

  // Check if already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const isConnected = await neon.wallet.isWalletConnected();
        if (isConnected) {
          const address = await neon.wallet.getWalletAddress();
          if (address) {
            const balance = await neon.wallet.getWalletBalance(address);
            const walletInfo = {
              address,
              balance,
              isConnected: true
            };
            setWalletData(walletInfo);
            localStorage.setItem('neonWalletData', JSON.stringify(walletInfo));
          }
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    };

    checkConnection();
  }, []);

  // Listen for account changes
  useEffect(() => {
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        handleDisconnect();
      } else {
        // Refresh wallet data when account changes
        handleConnectWallet();
      }
    };

    const handleChainChanged = (chainId: string) => {
      // Refresh the page when chain changes
      window.location.reload();
    };

    neon.wallet.onAccountsChanged(handleAccountsChanged);
    neon.wallet.onChainChanged(handleChainChanged);

    return () => {
      neon.wallet.removeWalletListeners();
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleConnectWallet = async () => {
    try {
      setIsLoading(true);
      
      // Check if MetaMask is installed
      if (!window.ethereum) {
        toast({
          title: "MetaMask Required",
          description: "Please install MetaMask to connect your wallet.",
          variant: "destructive",
        });
        return;
      }

      const walletInfo = await neon.wallet.connectWallet();
      
      setWalletData(walletInfo);
      localStorage.setItem('neonWalletData', JSON.stringify(walletInfo));
      
      toast({
        title: "Wallet Connected",
        description: `Connected to Neon EVM with ${walletInfo.address.slice(0, 6)}...${walletInfo.address.slice(-4)}`,
        variant: "default",
      });
    } catch (error: any) {
      console.error("Wallet connection error:", error);
      
      let errorMessage = "An error occurred while connecting wallet";
      if (error.message.includes("User rejected")) {
        errorMessage = "Connection cancelled by user";
      } else if (error.message.includes("MetaMask not installed")) {
        errorMessage = "Please install MetaMask to continue";
      } else if (error.message.includes("No accounts found")) {
        errorMessage = "No accounts found. Please check your MetaMask";
      }

      toast({
        title: "Connection Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    setWalletData(null);
    setIsWalletOpen(false);
    localStorage.removeItem('neonWalletData');
    toast({
      title: "Wallet Disconnected",
      description: "You have been disconnected from your wallet.",
      variant: "default",
    });
  };

  const copyAddress = () => {
    if (walletData) {
      navigator.clipboard.writeText(walletData.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
        variant: "default",
      });
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navigation = [
    { name: 'Home', path: '/' },
    { name: 'Coverage', path: '/explore' },
    { name: 'Capital Pools', path: '/pools' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="p-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                SecurePool
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-purple-600",
                  isActive(item.path)
                    ? "text-purple-600 border-b-2 border-purple-600"
                    : "text-gray-700"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center">
            {walletData ? (
              <div className="relative">
                <Button 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white transition-all flex items-center gap-2 shadow-lg"
                  onClick={() => setIsWalletOpen(!isWalletOpen)}
                >
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  {`${walletData.address.slice(0, 6)}...${walletData.address.slice(-4)}`}
                </Button>
                <div 
                  className={cn(
                    "absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border p-4 z-50",
                    isWalletOpen ? "block" : "hidden"
                  )}
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                      <span className="text-sm font-medium text-green-600">Connected to Neon EVM</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <div className="flex items-center gap-2">
                        <p className="font-mono text-sm break-all">{walletData.address}</p>
                        <button onClick={copyAddress} className="text-gray-500 hover:text-gray-700 shrink-0">
                          {copied ? <Check size={16} /> : <Copy size={16} />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Balance</p>
                      <p className="font-medium">{parseFloat(walletData.balance).toFixed(4)} NEON</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Network</p>
                      <p className="font-medium">Neon EVM DevNet</p>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50"
                      onClick={handleDisconnect}
                    >
                      <LogOut size={16} />
                      Disconnect Wallet
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <Button 
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white transition-all shadow-lg"
                onClick={handleConnectWallet}
                disabled={isLoading}
              >
                {isLoading ? "Connecting..." : "Connect MetaMask"}
              </Button>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-purple-500 transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "md:hidden bg-white border-b transition-all duration-300 ease-in-out",
          isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        )}
      >
        <div className="px-4 py-2 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "block px-3 py-2 rounded-md text-base font-medium transition-colors",
                isActive(item.path)
                  ? "text-purple-600 bg-purple-50"
                  : "text-gray-700 hover:text-purple-600 hover:bg-gray-50"
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}

          <div className="px-3 py-2">
            {walletData ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  <p className="font-mono text-sm">{`${walletData.address.slice(0, 6)}...${walletData.address.slice(-4)}`}</p>
                </div>
                <p className="text-sm text-gray-500">Balance: {parseFloat(walletData.balance).toFixed(4)} NEON</p>
                <Button 
                  variant="outline" 
                  className="w-full flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50"
                  onClick={handleDisconnect}
                >
                  <LogOut size={16} />
                  Disconnect Wallet
                </Button>
              </div>
            ) : (
              <Button 
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white transition-all"
                onClick={handleConnectWallet}
                disabled={isLoading}
              >
                {isLoading ? "Connecting..." : "Connect MetaMask"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
