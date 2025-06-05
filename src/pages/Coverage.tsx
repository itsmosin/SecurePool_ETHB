import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Shield, FileText, Calendar, Check } from 'lucide-react';
import CoverageMarketplace from '@/components/coverage/CoverageMarketplace';
import ActiveCoverages from '@/components/coverage/ActiveCoverages';
import FileClaim from '@/components/coverage/FileClaim';

const Coverage = () => {
  const { toast } = useToast();
  const [isClaimDialogOpen, setIsClaimDialogOpen] = useState(false);
  const [selectedCoverage, setSelectedCoverage] = useState(null);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="gradient-text">Insurance Coverage</span> Dashboard
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Monitor your active coverages, file claims, and discover new protection options
              designed to safeguard what matters most to you.
            </p>
          </div>

          <Tabs defaultValue="active" className="space-y-8">
            <TabsList className="grid w-full grid-cols-2 md:max-w-md mx-auto">
              <TabsTrigger value="active">My Coverages</TabsTrigger>
              <TabsTrigger value="marketplace">Coverage Marketplace</TabsTrigger>
            </TabsList>
            
            <TabsContent value="active" className="space-y-8">
              <ActiveCoverages 
                onFileClaimClick={(coverage) => {
                  setSelectedCoverage(coverage);
                  setIsClaimDialogOpen(true);
                }} 
              />
            </TabsContent>
            
            <TabsContent value="marketplace">
              <CoverageMarketplace 
                onPurchaseSuccess={(coverage) => {
                  toast({
                    title: "Purchase Successful",
                    description: `You've successfully purchased coverage for ${coverage.title}. 250 NEON tokens were deducted from your wallet.`,
                    variant: "default",
                  });
                }} 
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {isClaimDialogOpen && selectedCoverage && (
        <FileClaim 
          coverage={selectedCoverage}
          isOpen={isClaimDialogOpen}
          onClose={() => setIsClaimDialogOpen(false)}
          onClaimSubmitted={() => {
            setIsClaimDialogOpen(false);
            toast({
              title: "Claim Submitted",
              description: "Your claim has been successfully submitted and will be processed within 24 hours.",
              variant: "default",
            });
          }}
        />
      )}
      
      <Footer />
    </div>
  );
};

export default Coverage;
