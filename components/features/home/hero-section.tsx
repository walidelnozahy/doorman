'use client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export function HeroSection() {
  return (
    <div className={`w-full animate-fade-up animate-fade-up-delay-0`}>
      <section className='container relative px-4 bg-grid-pattern bg-grid py-36'>
        <div className='absolute pointer-events-none inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]' />
        <div className='flex flex-col items-center justify-center text-center max-w-4xl mx-auto relative'>
          <div className='mb-8 opacity-0 animate-fade-up'>
            <Badge
              variant='outline'
              className='flex items-center gap-1.5 font-medium'
            >
              <ShieldCheck className='h-3 w-3' />
              AWS Access Made Simple
            </Badge>
          </div>

          <h1 className='text-2xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 mb-6 opacity-0 animate-fade-up-delay-200'>
            The easiest and most secure way
            <br />
            to access your user's AWS accounts
          </h1>

          <p className='text-base text-muted-foreground mb-8 max-w-2xl opacity-0 animate-fade-up-delay-400 font-light'>
            Doorman is a hosted page that enables your users to easily and
            securely grant you least-privileged access to their AWS accounts.
          </p>

          <div className='space-y-4 opacity-0 animate-fade-up-delay-400'>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <Button asChild className=''>
                <Link href='/pages'>Get Started</Link>
              </Button>
              <Button asChild variant='outline' className=''>
                <Link href='/demo'>View Demo Page</Link>
              </Button>
            </div>
            <p className='text-sm text-muted-foreground'>
              Example of your branded access page:
              <code className='relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm'>
                doorman.page/yourbrand
              </code>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
