'use client';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';
import Link from 'next/link';
import { useRef } from 'react';
import { useIsVisible } from '@/components/hooks/use-is-visible';

const plans = [
  {
    price: 'Free',
    connections: '10 Connections',
    popular: false,
  },
  {
    price: '$9',
    period: '/mo',
    connections: '1,000 Connections',
    popular: true,
  },
  {
    price: '$49',
    period: '/mo',
    connections: '10,000 Connections',
    popular: false,
  },
  {
    price: '$99',
    period: '/mo',
    connections: 'Unlimited Connections',
    popular: false,
  },
];

export function PricingSection() {
  const ref = useRef<HTMLElement | null>(null);
  const isVisible = useIsVisible(ref);
  return (
    <div
      className={`w-full ${isVisible ? 'animate-fade-up animate-fade-up-delay-1200' : ''}`}
    >
      <section ref={ref} className='bg-grid-pattern bg-grid relative'>
        <div className='absolute pointer-events-none inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]' />
        <div className='container max-w-5xl mx-auto px-4 relative'>
          <div className='flex flex-col items-center text-center mb-8'>
            <h2 className='text-2xl font-semibold mb-4'>Pricing</h2>
            <p className='text-muted-foreground max-w-2xl'>
              Choose the perfect plan for your needs
            </p>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto mb-8'>
            {plans.map((plan, index) => (
              <div
                key={index}
                className={cn(
                  'bg-card rounded-lg p-4 shadow-sm h-[120px] flex flex-col justify-center',
                  'border border-border/50',
                  plan.popular && 'border-primary/50',
                )}
              >
                <div className='text-center'>
                  <div className='flex items-baseline justify-center gap-1'>
                    <span className='text-2xl font-bold'>{plan.price}</span>
                    {plan.period && (
                      <span className='text-muted-foreground'>
                        {plan.period}
                      </span>
                    )}
                  </div>
                  <p className='text-xs text-muted-foreground mt-1'>
                    {plan.connections}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <p className='text-center text-xs text-muted-foreground mb-6 max-w-2xl mx-auto'>
            A connection represents a single AWS account that your users can
            grant you access to. Each time a user connects their AWS account, it
            counts as one connection.
          </p>
          <div className='flex justify-center'>
            <Button asChild size='sm' className='px-6'>
              <Link href='/pages'>Get Started</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
