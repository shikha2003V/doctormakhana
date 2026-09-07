import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { WhyChooseUs } from '../components/home/WhyChooseUs';
import { FeaturedProducts } from '../components/home/FeaturedProducts';
import { HealthBenefits } from '../components/home/HealthBenefits';

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <WhyChooseUs />
      <FeaturedProducts />
      <HealthBenefits />
    </div>
  );
};
