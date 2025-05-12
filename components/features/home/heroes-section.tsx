'use client';
import { useRef, useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import AutoScroll from 'embla-carousel-auto-scroll';
import { UserCheck } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useIsVisible } from '@/components/hooks/use-is-visible';

const heroes = [
  {
    name: 'Maya Chen',
    role: 'Senior Cloud Architect',
    quote:
      "Doorman makes it incredibly easy to get secure access to customer AWS accounts. It's exactly what we needed.",
  },
  {
    name: 'Alex Rivera',
    role: 'DevOps Lead',
    quote:
      "The most elegant solution for managing AWS access I've seen. Simple, secure, and developer-friendly.",
  },
  {
    name: 'Sarah Okafor',
    role: 'Security Engineering Manager',
    quote:
      'Finally, a proper way to handle AWS access delegation. Doorman nails it.',
  },
  {
    name: 'James Nakamura',
    role: 'Cloud Solutions Architect',
    quote:
      'A must-have for anyone building SaaS on AWS. Secure, simple, and fast.',
  },
  {
    name: 'Priya Patel',
    role: 'Infrastructure Team Lead',
    quote:
      'Doorman is the missing piece for secure AWS integrations. Highly recommended.',
  },
];

export function HeroesSection() {
  const [plugins] = useState([
    AutoScroll({ speed: 1.5, stopOnInteraction: false }),
  ]);
  const emblaApiRef = useRef<any>(null);
  const ref = useRef<HTMLElement | null>(null);
  const isVisible = useIsVisible(ref);

  // Pause on hover
  const handleMouseEnter = () => {
    const autoScroll = emblaApiRef.current?.plugins()?.autoScroll;
    if (autoScroll) autoScroll.stop();
  };
  const handleMouseLeave = () => {
    const autoScroll = emblaApiRef.current?.plugins()?.autoScroll;
    if (autoScroll) autoScroll.play();
  };

  return (
    <div
      className={`w-full ${isVisible ? 'animate-fade-up animate-fade-up-delay-1200' : ''}`}
    >
      <section ref={ref}>
        <div className='container px-4'>
          <div className='flex flex-col items-center text-center mb-12'>
            <h2 className='text-2xl font-semibold mb-4'>
              Trusted by Top AWS Heroes
            </h2>
            <p className='text-muted-foreground max-w-2xl'>
              Join the growing list of companies using Doorman to securely
              manage AWS access
            </p>
          </div>
          <div
            className='relative w-full max-w-5xl mx-auto'
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Left fade */}
            <div className='pointer-events-none absolute left-0 top-0 h-full w-16 z-10 bg-gradient-to-r from-background/100 via-background/60 to-transparent' />
            {/* Right fade */}
            <div className='pointer-events-none absolute right-0 top-0 h-full w-16 z-10 bg-gradient-to-l from-background/100 via-background/60 to-transparent' />
            <Carousel
              opts={{ align: 'start', loop: true }}
              plugins={plugins}
              className='w-full'
              setApi={(api) => (emblaApiRef.current = api)}
            >
              <CarouselContent>
                {heroes.map((hero, index) => (
                  <CarouselItem
                    key={hero.name + index}
                    className='md:basis-1/3'
                  >
                    <div
                      className={cn(
                        'bg-card rounded-lg p-6 shadow-sm transition-all hover:shadow-md h-48',
                        'border border-border/50 hover:border-border flex flex-col justify-between h-full overflow-hidden',
                      )}
                    >
                      <div className='flex items-center gap-4 mb-2'>
                        <div className='flex items-center justify-center w-10 h-10 rounded-full bg-muted'>
                          <UserCheck className='w-6 h-6 text-primary' />
                        </div>
                        <div>
                          <h3 className='font-medium text-sm'>{hero.name}</h3>
                          <p className='text-xs text-muted-foreground'>
                            {hero.role}
                          </p>
                        </div>
                      </div>
                      <div className='h-12 overflow-hidden flex items-center'>
                        <blockquote className='text-muted-foreground text-xs leading-relaxed line-clamp-3 w-full'>
                          "{hero.quote}"
                        </blockquote>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </div>
      </section>
    </div>
  );
}
