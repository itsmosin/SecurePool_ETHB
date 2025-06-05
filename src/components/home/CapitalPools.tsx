
import React from 'react';
import { BarChart, CircleDollarSign, TrendingUp, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const PoolCard = ({ poolName, capitalTotal, riskLevel, apy, participants, utilization }: {
  poolName: string;
  capitalTotal: string;
  riskLevel: string;
  apy: string;
  participants: number;
  utilization: number;
}) => {
  let riskColor = 'bg-green-100 text-green-700';
  if (riskLevel === 'Medium') {
    riskColor = 'bg-yellow-100 text-yellow-700';
  } else if (riskLevel === 'High') {
    riskColor = 'bg-red-100 text-red-700';
  }

  return (
    <Card className="hover-scale border border-gray-200">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{poolName}</CardTitle>
            <CardDescription className="text-sm mt-1">Capital Pool</CardDescription>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${riskColor}`}>{riskLevel} Risk</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500">Total Capital</p>
            <p className="text-lg font-semibold flex items-center">
              <CircleDollarSign className="h-4 w-4 mr-1 text-safetyblue-500" />
              {capitalTotal}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Est. APY</p>
            <p className="text-lg font-semibold flex items-center text-teal-500">
              <TrendingUp className="h-4 w-4 mr-1" />
              {apy}
            </p>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-gray-500">Pool Utilization</span>
            <span className="text-sm font-medium">{utilization}%</span>
          </div>
          <Progress value={utilization} className="h-2" />
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center text-sm text-gray-500">
            <Users className="h-4 w-4 mr-1" />
            <span>{participants} participants</span>
          </div>
          <Button variant="outline" className="text-safetyblue-500 border-safetyblue-500 hover:bg-safetyblue-50">
            Join Pool
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const CapitalPools = () => {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">
            <span className="gradient-text">Earn Yields</span> With Capital Pools
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Provide capital to insurance pools and earn consistent returns. 
            Unused premiums generate yield for capital providers.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <PoolCard 
            poolName="Global Travel Protection"
            capitalTotal="$2.4M"
            riskLevel="Low"
            apy="5.8%"
            participants={182}
            utilization={65}
          />
          
          <PoolCard 
            poolName="Tech Security Shield"
            capitalTotal="$4.1M"
            riskLevel="Medium"
            apy="8.2%"
            participants={247}
            utilization={78}
          />
          
          <PoolCard 
            poolName="Natural Disaster Recovery"
            capitalTotal="$5.7M"
            riskLevel="High"
            apy="12.5%"
            participants={156}
            utilization={42}
          />
        </div>
        
        <div className="mt-12 bg-gradient-to-r from-safetyblue-500 to-teal-500 rounded-2xl p-8 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-6">
              <h3 className="text-2xl font-bold mb-2">Ready to start earning?</h3>
              <p className="max-w-xl opacity-90">
                Join our capital pools today and put your assets to work. 
                Earn competitive returns while helping provide insurance coverage to those who need it.
              </p>
            </div>
            <Button className="bg-white text-safetyblue-500 hover:bg-gray-100 px-6 py-5 rounded-xl whitespace-nowrap">
              Provide Capital
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CapitalPools;
