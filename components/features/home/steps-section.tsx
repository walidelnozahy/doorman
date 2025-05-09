'use client';
import { useRef, useState } from 'react';
import { useIsVisible } from '@/components/hooks/use-is-visible';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

const steps = [
  {
    title: 'Create and Publish',
    description:
      'Create your access page, set required permissions, and publish with a few clicks.',
    image: '/step-01.png',
  },
  {
    title: 'Share with Users',
    description: 'Send your users to the access page through the shared link.',
    image: '/step-02.png',
  },
  {
    title: 'Connect Accounts',
    description:
      'Users grant you least-privileged access to their AWS accounts.',
    image: '/step-03.png',
  },
];

export function StepsSection() {
  const ref = useRef<HTMLElement | null>(null);
  const isVisible = useIsVisible(ref);
  const [activeIndex, setActiveIndex] = useState(0);
  const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));
  const emblaApiRef = useRef<any>(null);

  // Update active index on slide change
  const handleSetApi = (api: any) => {
    emblaApiRef.current = api;
    if (api) {
      setActiveIndex(api.selectedScrollSnap());
      api.on('select', () => setActiveIndex(api.selectedScrollSnap()));
    }
  };

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

        <div className='w-full max-w-3xl mx-auto relative'>
          <Carousel
            plugins={[plugin.current]}
            opts={{ align: 'center', loop: true }}
            setApi={handleSetApi}
            className='w-full'
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
          >
            <CarouselContent>
              {steps.map((step, index) => (
                <CarouselItem key={index}>
                  <div className='flex flex-col items-center bg-card rounded-2xl shadow-lg p-6 group'>
                    <img
                      src={step.image}
                      alt={step.title}
                      className='w-full rounded-xl shadow-md object-contain mb-6 aspect-video border border-border/40 bg-white'
                    />
                    <div className='w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 border-2 border-primary group-hover:bg-primary/20 transition-colors'>
                      <span className='text-primary font-bold text-lg'>
                        {index + 1}
                      </span>
                    </div>
                    <div className='space-y-2 text-center'>
                      <h3 className='text-xl font-semibold'>{step.title}</h3>
                      <p className='text-base text-muted-foreground'>
                        {step.description}
                      </p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
            {/* Step Circles Navigation (smaller, subtle, at bottom) */}
            <div className='flex justify-center gap-3 mt-6 mb-2'>
              {steps.map((_, idx) => (
                <button
                  key={idx}
                  className={`w-3 h-3 rounded-full border-2 transition-all duration-200 focus:outline-none ${activeIndex === idx ? 'bg-primary border-primary scale-110' : 'bg-muted border-border hover:border-primary/60'}`}
                  onClick={() =>
                    emblaApiRef.current && emblaApiRef.current.scrollTo(idx)
                  }
                  aria-label={`Go to step ${idx + 1}`}
                />
              ))}
            </div>
          </Carousel>
        </div>
      </section>
    </div>
  );
}
