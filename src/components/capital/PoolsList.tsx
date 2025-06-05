import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Zap, BarChart3 } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

// Mock data for capital pools
const CAPITAL_POOLS = [
  {
    id: 1,
    name: "Flight Delay Pool",
    description: "Capital backing for flight delay and cancellation insurance products.",
    totalCapital: 500000,
    utilization: 65,
    apy: 8.5,
    minStake: 100,
    risk: "Low",
    term: "Flexible",
    color: "bg-blue-500"
  },
  {
    id: 2,
    name: "Tech Protection Pool",
    description: "Backing for technology-related insurance coverage including data breaches and device protection.",
    totalCapital: 350000,
    utilization: 82,
    apy: 12.2,
    minStake: 250,
    risk: "Medium",
    term: "30 days",
    color: "bg-purple-500"
  },
  {
    id: 3,
    name: "Auto Insurance Pool",
    description: "Capital pool for comprehensive vehicle insurance products.",
    totalCapital: 1250000,
    utilization: 45,
    apy: 7.8,
    minStake: 500,
    risk: "Low",
    term: "90 days",
    color: "bg-green-500"
  },
  {
    id: 4,
    name: "Home Insurance Pool",
    description: "Capital backing for home and property insurance coverage.",
    totalCapital: 2000000,
    utilization: 72,
    apy: 9.5,
    minStake: 750,
    risk: "Medium",
    term: "180 days",
    color: "bg-orange-500"
  }
];

const getRiskBadgeColor = (risk) => {
  switch (risk) {
    case 'Low':
      return 'bg-green-100 text-green-800';
    case 'Medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'High':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

interface PoolsListProps {
  onStakeClick: (pool: any) => void;
}

const PoolsList: React.FC<PoolsListProps> = ({ onStakeClick }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Available Capital Pools</h2>
        <span className="text-sm text-gray-500">
          <Shield className="inline h-4 w-4 mr-1 text-safetyblue-500" />
          Your wallet: 10,000 NEON
        </span>
      </div>
      
      <div className="space-y-4">
        {CAPITAL_POOLS.map((pool) => (
          <Card key={pool.id} className="hover-scale">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className={`p-3 rounded-full ${pool.color} text-white`}>
                  <Shield className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-bold">{pool.name}</h3>
                  <p className="text-sm text-gray-600">{pool.description}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Total Capital</span>
                    <span className="font-medium">{pool.totalCapital.toLocaleString()} NEON</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Minimum Stake</span>
                    <span className="font-medium">{pool.minStake} NEON</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Risk Level</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRiskBadgeColor(pool.risk)}`}>
                      {pool.risk}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Utilization</span>
                    <span className="font-medium">{pool.utilization}%</span>
                  </div>
                  <Progress value={pool.utilization} className="h-2" />
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Zap className="h-4 w-4 text-teal-500 mr-1" />
                      <span className="text-sm text-teal-600 font-semibold">{pool.apy}% APY</span>
                    </div>
                    <span className="text-xs text-gray-500">{pool.term} term</span>
                  </div>
                </div>
              </div>
              
              <Button 
                className="w-full bg-gradient-to-r from-safetyblue-500 to-teal-500 hover:opacity-90 text-white"
                onClick={() => onStakeClick(pool)}
              >
                Stake NEON
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PoolsList;
