import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useWallet } from '@/hooks/useWallet';
import { Copy, ExternalLink, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface WalletButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

export const WalletButton = ({ 
  variant = 'default', 
  size = 'default',
  className = '' 
}: WalletButtonProps) => {
  const { address, balance, isConnected, isLoading, connectWallet, disconnectWallet } = useWallet();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleConnect = async () => {
    try {
      await connectWallet();
      toast({
        title: "Wallet Connected",
        description: "Successfully connected to Neon EVM",
        variant: "default",
      });
    } catch (error: any) {
      let errorMessage = "Failed to connect wallet";
      if (error.message.includes("User rejected")) {
        errorMessage = "Connection cancelled by user";
      } else if (error.message.includes("MetaMask not installed")) {
        errorMessage = "Please install MetaMask to continue";
      }

      toast({
        title: "Connection Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    toast({
      title: "Wallet Disconnected",
      description: "You have been disconnected from your wallet",
      variant: "default",
    });
  };

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
        variant: "default",
      });
    }
  };

  const openExplorer = () => {
    if (address) {
      window.open(`https://devnet.neonscan.org/address/${address}`, '_blank');
    }
  };

  if (!isConnected) {
    return (
      <Button
        variant={variant}
        size={size}
        className={`bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white ${className}`}
        onClick={handleConnect}
        disabled={isLoading}
      >
        {isLoading ? "Connecting..." : "Connect MetaMask"}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={`bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white ${className}`}
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
            <span className="font-mono">
              {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Connected'}
            </span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="p-3">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <span className="text-sm font-medium text-green-600">Connected to Neon EVM</span>
          </div>
          
          <div className="space-y-2">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Address</p>
              <p className="font-mono text-sm break-all">{address}</p>
            </div>
            
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Balance</p>
              <p className="font-semibold">{parseFloat(balance).toFixed(4)} NEON</p>
            </div>
            
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Network</p>
              <p className="text-sm">Neon EVM DevNet</p>
            </div>
          </div>
        </div>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={copyAddress} className="cursor-pointer">
          <Copy className="mr-2 h-4 w-4" />
          {copied ? "Copied!" : "Copy Address"}
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={openExplorer} className="cursor-pointer">
          <ExternalLink className="mr-2 h-4 w-4" />
          View on NeonScan
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={handleDisconnect} 
          className="cursor-pointer text-red-600 focus:text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}; 