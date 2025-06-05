import React from 'react';
import { Plane, Cpu, Car, Home, ArrowRight, Shield, Calendar } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Mock data for available coverages
const AVAILABLE_COVERAGES = [
  {
    id: 1,
    title: "Flight Delay Protection",
    description: "Get compensated automatically if your flight is delayed by more than 2 hours or cancelled.",
    icon: <Plane className="h-6 w-6 text-white" />,
    color: "bg-blue-500",
    premium: 150,
    coverage: 1500,
    popular: true,
    term: "3 months",
    processingTime: "Instant",
  },
  {
    id: 2,
    title: "Tech Protection",
    description: "Coverage against hacks, data breaches, and digital asset theft for your devices and online accounts.",
    icon: <Cpu className="h-6 w-6 text-white" />,
    color: "bg-purple-500",
    premium: 250,
    coverage: 2500,
    popular: false,
    term: "6 months",
    processingTime: "24 hours",
  },
  {
    id: 3,
    title: "Auto Insurance",
    description: "Comprehensive coverage for your vehicle with instant claim processing for minor damages.",
    icon: <Car className="h-6 w-6 text-white" />,
    color: "bg-green-500",
    premium: 350,
    coverage: 7500,
    popular: false,
    term: "12 months",
    processingTime: "48 hours",
  },
  {
    id: 4,
    title: "Home Insurance",
    description: "Protect your home against natural disasters and unforeseen damages with our comprehensive coverage.",
    icon: <Home className="h-6 w-6 text-white" />,
    color: "bg-orange-500",
    premium: 500,
    coverage: 15000,
    popular: true,
    term: "12 months",
    processingTime: "72 hours",
  }
];

interface CoverageCardProps {
  coverage: any;
  onPurchase: (coverage: any) => void;
}

const CoverageCard: React.FC<CoverageCardProps> = ({ coverage, onPurchase }) => {
  const [showDialog, setShowDialog] = React.useState(false);
  
  return (
    <Card className={`relative bg-white rounded-xl border ${coverage.popular ? 'border-teal-500 shadow-lg shadow-teal-100' : 'border-gray-100'} overflow-hidden hover-scale`}>
      {coverage.popular && (
        <div className="absolute -top-3 right-5 bg-teal-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
          Popular
        </div>
      )}
      <div className={`h-1.5 ${coverage.color}`}></div>
      <CardContent className="p-6">
        <div className={`w-12 h-12 rounded-lg ${coverage.color} flex items-center justify-center mb-4`}>
          {coverage.icon}
        </div>
        <h3 className="text-xl font-bold mb-2">{coverage.title}</h3>
        <p className="text-gray-600 mb-4">{coverage.description}</p>
        
        <div className="flex justify-between items-center py-2 border-t border-b border-gray-100 my-4">
          <div>
            <p className="text-sm text-gray-500">Premium</p>
            <p className="font-semibold">{coverage.premium} NEON</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Coverage</p>
            <p className="font-semibold">{coverage.coverage} NEON</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Term</p>
            <p className="font-semibold">{coverage.term}</p>
          </div>
        </div>
        
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button className="w-full mt-4 bg-safetyblue-500 hover:bg-safetyblue-600 text-white">
              Purchase Coverage
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Purchase {coverage.title}</DialogTitle>
              <DialogDescription>
                You are about to purchase insurance coverage. Please review the details below.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Coverage Type</span>
                <span className="font-medium">{coverage.title}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Premium Cost</span>
                <span className="font-medium">{coverage.premium} NEON</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Coverage Amount</span>
                <span className="font-medium">{coverage.coverage} NEON</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Term Length</span>
                <span className="font-medium">{coverage.term}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Claim Processing</span>
                <span className="font-medium">{coverage.processingTime}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Start Date</span>
                <span className="font-medium">Immediate</span>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
              <Button 
                className="bg-safetyblue-500 hover:bg-safetyblue-600"
                onClick={() => {
                  setShowDialog(false);
                  onPurchase(coverage);
                }}
              >
                Confirm Purchase
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

interface CoverageMarketplaceProps {
  onPurchaseSuccess: (coverage: any) => void;
}

const CoverageMarketplace: React.FC<CoverageMarketplaceProps> = ({ onPurchaseSuccess }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Available Coverage Options</h2>
        <span className="text-sm text-gray-500">
          <Shield className="inline h-4 w-4 mr-1 text-safetyblue-500" />
          Your wallet: 10,000 NEON
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {AVAILABLE_COVERAGES.map((coverage) => (
          <CoverageCard 
            key={coverage.id} 
            coverage={coverage} 
            onPurchase={onPurchaseSuccess}
          />
        ))}
      </div>
    </div>
  );
};

export default CoverageMarketplace;
