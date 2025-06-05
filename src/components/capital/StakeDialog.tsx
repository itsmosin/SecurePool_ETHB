import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Shield, Zap } from 'lucide-react';

interface StakeDialogProps {
  pool: {
    id: number;
    name: string;
    apy: number;
    minStake: number;
    color: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onStakeSubmit: (amount: number) => void;
}

const StakeDialog: React.FC<StakeDialogProps> = ({ pool, isOpen, onClose, onStakeSubmit }) => {
  const [amount, setAmount] = useState(pool.minStake);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const maxAmount = 10000; // Mock max amount from user wallet
  
  const expectedYield = (amount * pool.apy / 100).toFixed(2);

  const handleAmountChange = (value: number) => {
    setAmount(value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      setAmount(Math.min(Math.max(value, pool.minStake), maxAmount));
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      onStakeSubmit(amount);
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Stake in {pool.name}</DialogTitle>
          <DialogDescription>
            Stake your NEON tokens to earn yields while providing capital for insurance products.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="stake-amount">Amount to Stake</Label>
              <span className="text-sm text-gray-500">
                Available: {maxAmount} NEON
              </span>
            </div>
            
            <div className="flex space-x-2">
              <Input
                id="stake-amount"
                type="number"
                value={amount}
                onChange={handleInputChange}
                min={pool.minStake}
                max={maxAmount}
                className="flex-grow"
              />
              <Button 
                variant="outline" 
                className="shrink-0"
                onClick={() => setAmount(maxAmount)}
              >
                Max
              </Button>
            </div>
            
            <Slider
              value={[amount]}
              min={pool.minStake}
              max={maxAmount}
              step={10}
              onValueChange={(value) => handleAmountChange(value[0])}
              className="mt-4"
            />
            
            <div className="flex justify-between text-sm text-gray-500">
              <span>{pool.minStake} NEON</span>
              <span>{maxAmount} NEON</span>
            </div>
          </div>
          
          <div className="space-y-2 bg-gray-50 p-4 rounded-md">
            <div className="flex justify-between">
              <span className="text-gray-600">APY Rate</span>
              <span className="font-medium text-teal-600">{pool.apy}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Est. Monthly Yield</span>
              <span className="font-medium text-teal-600">{expectedYield} NEON</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pool Risk Level</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Low
              </span>
            </div>
          </div>
        </div>
        
        <DialogFooter className="sm:justify-between">
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            className="bg-gradient-to-r from-safetyblue-500 to-teal-500 hover:opacity-90"
            onClick={handleSubmit}
            disabled={isSubmitting || amount < pool.minStake}
          >
            {isSubmitting ? (
              <>Processing...</>
            ) : (
              <>
                <Shield className="h-4 w-4 mr-2" />
                Stake {amount} NEON
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StakeDialog;
