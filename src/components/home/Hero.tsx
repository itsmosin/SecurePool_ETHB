import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Shield, Zap, BarChart3, Network } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-white to-blue-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-24">
        <div className="text-center">
          {/* Neon EVM Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium mb-6 shadow-lg">
            <Network className="w-4 h-4 mr-2" />
            Powered by Neon EVM • Cross-Runtime DeFi
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-safetyblue-500 mb-6">
            <span className="relative inline-block animate-float">
              SecurePool
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 338 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 5.26001C81 -0.339994 331.5 -1.30267 337 7.53732" stroke="#20C997" strokeWidth="2"/>
              </svg>
            </span>
            {" "}Insurance
          </h1>
          
          <p className="max-w-3xl mx-auto mt-5 text-xl text-gray-600">
            Revolutionary insurance DeFi protocol built on <span className="font-semibold text-purple-600">Neon EVM</span>. 
            Experience true cross-runtime composability with <span className="font-semibold text-orange-600">Solana SPL tokens</span> and 
            <span className="font-semibold text-blue-600"> EVM smart contracts</span> working seamlessly together.
          </p>
          
          <div className="mt-8 flex justify-center space-x-4">
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-5 rounded-xl text-lg shadow-lg" asChild>
              <Link to="/explore">Get Coverage</Link>
            </Button>
            <Button variant="outline" className="bg-white border-purple-500 text-purple-500 hover:bg-purple-50 px-6 py-5 rounded-xl text-lg shadow-lg" asChild>
              <Link to="/pools">Provide Capital</Link>
            </Button>
          </div>
          
          {/* Neon EVM Features */}
          <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-gray-600">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
              SPL Token Creation
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
              Cross-Runtime Claims
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              Solana System Calls
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              EVM Composability
            </div>
          </div>
          
          {/* Added margin below the CTA buttons */}
          <div className="mb-12 md:mb-16"></div>
        </div>
      </div>
      
      {/* Stats section */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 -mt-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-lg hover-scale overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-purple-400 to-purple-500"></div>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-purple-50">
                  <Shield className="h-6 w-6 text-purple-500" />
                </div>
                <h3 className="ml-4 text-lg font-semibold text-gray-900">Cross-Chain Coverage</h3>
              </div>
              <p className="text-gray-600">Revolutionary insurance policies that span EVM and Solana runtimes using Neon's composability libraries.</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg hover-scale overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-orange-400 to-orange-500"></div>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-orange-50">
                  <Zap className="h-6 w-6 text-orange-500" />
                </div>
                <h3 className="ml-4 text-lg font-semibold text-gray-900">SPL Token Collateral</h3>
              </div>
              <p className="text-gray-600">Lock and unlock Solana SPL tokens as collateral directly from EVM smart contracts via Neon composability.</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg hover-scale overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-blue-400 to-blue-500"></div>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-blue-50">
                  <BarChart3 className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="ml-4 text-lg font-semibold text-gray-900">Hybrid Liquidity</h3>
              </div>
              <p className="text-gray-600">Combine EVM and Solana liquidity sources for optimal capital efficiency and cross-runtime yield farming.</p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Added padding/margin at the bottom of the Hero section */}
      <div className="pb-24 md:pb-32"></div>
      
      {/* Background elements */}
      <div className="absolute top-1/2 -left-96 w-[500px] h-[500px] rounded-full bg-purple-200 mix-blend-multiply opacity-20 filter blur-3xl animate-pulse-slow"></div>
      <div className="absolute top-1/3 -right-96 w-[600px] h-[600px] rounded-full bg-orange-200 mix-blend-multiply opacity-20 filter blur-3xl animate-pulse-slow"></div>
    </div>
  );
};

export default Hero;
