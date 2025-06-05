
import React from 'react';
import { Shield, Users, Zap, ArrowRight } from 'lucide-react';

const HowItWorks = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">
            How <span className="gradient-text">SafetyNet</span> Works
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our platform connects those seeking protection with those providing capital, 
            creating an efficient and transparent insurance ecosystem.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-safetyblue-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">1. Choose Protection</h3>
            <p className="text-gray-600">
              Select from a variety of insurance options tailored to your specific needs, 
              with transparent terms and pricing.
            </p>
          </div>
          
          <div className="text-center relative">
            <div className="hidden md:block absolute top-8 -left-10 w-10 h-1 bg-gray-200">
              <ArrowRight className="absolute -right-3 -top-2 text-gray-300" />
            </div>
            <div className="w-16 h-16 mx-auto bg-teal-100 rounded-full flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-teal-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">2. Pool Aggregation</h3>
            <p className="text-gray-600">
              Premiums are pooled together with capital from providers, creating 
              diversified risk portfolios for maximum efficiency.
            </p>
          </div>
          
          <div className="text-center relative">
            <div className="hidden md:block absolute top-8 -left-10 w-10 h-1 bg-gray-200">
              <ArrowRight className="absolute -right-3 -top-2 text-gray-300" />
            </div>
            <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <Zap className="h-8 w-8 text-purple-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">3. Claims & Returns</h3>
            <p className="text-gray-600">
              Claims are processed swiftly, while unused premiums generate returns 
              for capital providers in the pool.
            </p>
          </div>
        </div>
        
        <div className="mt-16 p-8 bg-gray-50 rounded-2xl">
          <h3 className="text-2xl font-bold text-center mb-6">Common Questions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h4 className="font-semibold text-lg mb-2">How are premiums calculated?</h4>
              <p className="text-gray-600">
                Premiums are determined by risk analysis algorithms that consider 
                historical data, coverage amount, and specific risk factors for each type of insurance.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h4 className="font-semibold text-lg mb-2">How are claims verified and paid?</h4>
              <p className="text-gray-600">
                Claims are verified using real-world data sources and processed automatically 
                when predefined conditions are met, ensuring fast and fair payouts.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h4 className="font-semibold text-lg mb-2">What returns can capital providers expect?</h4>
              <p className="text-gray-600">
                Returns vary based on pool performance, risk level, and capital utilization. 
                Typically, providers can expect annual yields between 5-15%.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h4 className="font-semibold text-lg mb-2">How is my capital protected?</h4>
              <p className="text-gray-600">
                Capital is diversified across multiple insurance types, with risk management 
                systems in place to maintain solvency and protect provider funds.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
