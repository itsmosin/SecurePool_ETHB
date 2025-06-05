
import React from 'react';
import { Plane, Cpu, Car, Home, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

type InsuranceCardProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  popular?: boolean;
};

const InsuranceCard = ({ title, description, icon, color, popular = false }: InsuranceCardProps) => {
  return (
    <div className={`relative bg-white rounded-xl border ${popular ? 'border-teal-500 shadow-lg shadow-teal-100' : 'border-gray-100'} p-6 hover-scale`}>
      {popular && (
        <div className="absolute -top-3 right-5 bg-teal-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
          Popular
        </div>
      )}
      <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <Button variant="outline" className="w-full mt-2 border-gray-200 text-gray-700 hover:bg-gray-50">
        <span>View details</span>
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};

const InsuranceOptions = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">
            <span className="gradient-text">Insurance Coverage</span> Options
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose from a variety of insurance products designed to protect what matters to you.
            Our smart contracts ensure transparent and reliable coverage.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <InsuranceCard
            title="Flight Delay"
            description="Get compensated automatically if your flight is delayed or cancelled."
            icon={<Plane className="h-6 w-6 text-white" />}
            color="bg-blue-500"
            popular={true}
          />
          
          <InsuranceCard
            title="Tech Protection"
            description="Coverage against hacks, data breaches, and digital asset theft."
            icon={<Cpu className="h-6 w-6 text-white" />}
            color="bg-purple-500"
          />
          
          <InsuranceCard
            title="Auto Insurance"
            description="Comprehensive coverage for your vehicle with instant claim processing."
            icon={<Car className="h-6 w-6 text-white" />}
            color="bg-green-500"
          />
          
          <InsuranceCard
            title="Home Insurance"
            description="Protect your home against natural disasters and unforeseen damages."
            icon={<Home className="h-6 w-6 text-white" />}
            color="bg-orange-500"
          />
        </div>
        
        <div className="text-center mt-10">
          <Button className="bg-safetyblue-500 hover:bg-safetyblue-600 text-white px-6 py-5 rounded-xl">
            View All Insurance Options
          </Button>
        </div>
      </div>
    </section>
  );
};

export default InsuranceOptions;
