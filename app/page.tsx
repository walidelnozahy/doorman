import RootLayout from '@/components/root-layout';
import { HeroSection } from '@/components/features/home/hero-section';
import { HeroesSection } from '@/components/features/home/heroes-section';
import { FeaturesSection } from '@/components/features/home/features-section';
import { PricingSection } from '@/components/features/home/pricing-section';
import { FAQSection } from '@/components/features/home/faq-section';

export default async function Home() {
  return (
    <RootLayout>
      <div className='flex items-center flex-col justify-center min-h-full pb-16 space-y-32'>
        <HeroSection />
        <HeroesSection />
        <FeaturesSection />
        <PricingSection />
        <FAQSection />
      </div>
    </RootLayout>
  );
}
