'use client';
import { useRef } from 'react';
import { useIsVisible } from '@/components/hooks/use-is-visible';

const steps = [
  {
    title: 'Create and Publish',
    description:
      'Create your access page, set required permissions, and publish with a few clicks.',
    image: '/placeholder-dashboard-1.png',
  },
  {
    title: 'Share with Users',
    description: 'Send your users to the access page through the shared link.',
    image: '/placeholder-dashboard-2.png',
  },
  {
    title: 'Connect Accounts',
    description:
      'Users grant you least-privileged access to their AWS accounts.',
    image: '/placeholder-dashboard-3.png',
  },
];

export function StepsSection() {
  const ref = useRef<HTMLElement | null>(null);
  const isVisible = useIsVisible(ref);

  return (
    <div
      className={`w-full ${isVisible ? 'animate-fade-up animate-fade-up-delay-1200' : ''}`}
    >
      <section
        ref={ref}
        className='w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8'
      >
        <div className='text-center mb-12'>
          <h2 className='text-2xl font-semibold mb-4'>How It Works</h2>
          <p className='text-muted-foreground max-w-2xl mx-auto'>
            Get started in three simple steps
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {steps.map((step, index) => (
            <div key={index} className='relative group'>
              <div className='flex flex-col items-center text-center'>
                {/* Step number circle */}
                <div className='w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-4 group-hover:bg-muted/80 transition-colors'>
                  <span className='text-foreground font-medium'>
                    {index + 1}
                  </span>
                </div>

                {/* Content */}
                <div className='space-y-3'>
                  <h3 className='text-lg font-medium'>{step.title}</h3>
                  <p className='text-sm text-muted-foreground'>
                    {step.description}
                  </p>
                </div>

                {/* Image placeholder */}
                <div className='mt-6 bg-muted rounded-lg aspect-video w-full group-hover:bg-muted/80 transition-colors' />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
