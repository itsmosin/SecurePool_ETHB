import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useToast } from '@/hooks/use-toast';
import { BarChart3, Zap, Circle, CircleDollarSign } from 'lucide-react';
import PoolsList from '@/components/capital/PoolsList';
import StakeDialog from '@/components/capital/StakeDialog';
import PoolPerformanceChart from '@/components/capital/PoolPerformanceChart';

const CapitalPools = () => {
  const { toast } = useToast();
  const [selectedPool, setSelectedPool] = useState(null);
  const [isStakeDialogOpen, setIsStakeDialogOpen] = useState(false);
  const [userPortfolio, setUserPortfolio] = useState({
    totalStaked: 5000,
    estimatedYield: 425,
    activePools: 3
  });

  const handleStakeSuccess = (amount, pool) => {
    setIsStakeDialogOpen(false);
    // Update user portfolio data
    setUserPortfolio(prev => ({
      totalStaked: prev.totalStaked + amount,
      estimatedYield: prev.estimatedYield + (amount * pool.apy / 100),
      activePools: prev.activePools + (prev.activePools === 3 ? 1 : 0)
    }));
    
    toast({
      title: "Staking Successful",
      description: `You've successfully staked ${amount} NEON in the ${pool.name} pool.`,
      variant: "default",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="gradient-text">Capital Provision</span> Pools
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Stake your NEON tokens in our insurance pools to earn consistent yields while providing
              capital backing for coverage products.
            </p>
          </div>

          {/* User Portfolio Summary */}
          <div className="bg-white rounded-xl shadow-md mb-10">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Your Portfolio</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-r from-safetyblue-50 to-safetyblue-100 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-safetyblue-500 text-white">
                      <CircleDollarSign className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">Total Staked</p>
                      <p className="text-2xl font-bold">{userPortfolio.totalStaked} NEON</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-teal-50 to-teal-100 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-teal-500 text-white">
                      <Zap className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">Est. Monthly Yield</p>
                      <p className="text-2xl font-bold">{userPortfolio.estimatedYield} NEON</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-purple-500 text-white">
                      <Circle className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">Active Pools</p>
                      <p className="text-2xl font-bold">{userPortfolio.activePools}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Pools List - Takes 2/3 of the space on desktop */}
            <div className="lg:col-span-2">
              <PoolsList 
                onStakeClick={(pool) => {
                  setSelectedPool(pool);
                  setIsStakeDialogOpen(true);
                }}
              />
            </div>
            
            {/* Performance Chart - Takes 1/3 of the space on desktop */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Pool Performance</h2>
              <PoolPerformanceChart />
            </div>
          </div>
        </div>
      </main>

      {isStakeDialogOpen && selectedPool && (
        <StakeDialog
          pool={selectedPool}
          isOpen={isStakeDialogOpen} 
          onClose={() => setIsStakeDialogOpen(false)}
          onStakeSubmit={(amount) => handleStakeSuccess(amount, selectedPool)}
        />
      )}
      
      <Footer />
    </div>
  );
};

export default CapitalPools;
