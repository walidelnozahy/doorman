'use client';
import {
  Clock,
  ShieldCheck,
  Globe,
  Bell,
  Layout,
  BarChart3,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useRef } from 'react';
import { useIsVisible } from '@/components/hooks/use-is-visible';

const features = [
  {
    icon: Clock,
    title: 'Access in Minutes',
    subtitle:
      'Create an access page in seconds and get secure AWS access instantly.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure by Design',
    subtitle:
      'Only the permissions you request are granted. Users stay in control.',
  },
  {
    icon: Globe,
    title: 'Branded Access Pages',
    subtitle:
      'Host your access page on your own subdomain with your logo and styling.',
  },
  {
    icon: Bell,
    title: 'Real-Time Notifications',
    subtitle:
      'Get instant webhook and email alerts when users connect or disconnect.',
  },
  {
    icon: Layout,
    title: 'Seamless In-App Integration',
    subtitle:
      'Embed the Doorman Button in your app for a smooth AWS connection experience.',
  },
  {
    icon: BarChart3,
    title: 'Flexible & Scalable',
    subtitle: 'Doorman grows with you, from a few accounts to thousands.',
  },
];

export function FeaturesSection() {
  const ref = useRef<HTMLElement | null>(null);
  const isVisible = useIsVisible(ref);
  return (
    <div
      className={`w-full ${isVisible ? 'animate-fade-up animate-fade-up-delay-1200' : ''}`}
    >
      <section ref={ref}>
        <div className='container max-w-5xl mx-auto px-4'>
          <h2 className='text-2xl font-bold text-center mb-8'>
            Why teams choose Doorman
          </h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <Card
                  className='relative flex flex-col justify-between h-full p-6'
                  key={`features-${i}`}
                >
                  <div className='flex items-center gap-2 mb-2'>
                    <Icon className='w-6 h-6 text-primary' />
                    <span className='font-medium text-base'>
                      {feature.title}
                    </span>
                  </div>
                  <div className='text-muted-foreground text-sm'>
                    {feature.subtitle}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
