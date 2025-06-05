
import { Suspense } from 'react';
import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/home/Hero';
import InsuranceOptions from '@/components/home/InsuranceOptions';
import CapitalPools from '@/components/home/CapitalPools';
import HowItWorks from '@/components/home/HowItWorks';
import Footer from '@/components/layout/Footer';

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
  </div>
);

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Suspense fallback={<LoadingFallback />}>
          <Hero />
          <InsuranceOptions />
          <CapitalPools />
          <HowItWorks />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
