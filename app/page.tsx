import RootLayout from '@/components/root-layout';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function Home() {
  return (
    <RootLayout>
      <div className='flex items-center justify-center min-h-full bg-grid-pattern bg-grid relative'>
        <div className='absolute pointer-events-none inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]' />
        <section className='container relative px-4 py-16'>
          <div className='flex flex-col items-center justify-center text-center max-w-4xl mx-auto'>
            <div className='rounded-full bg-background-secondary border px-4 py-1.5 mb-8 flex items-center gap-2 opacity-0 animate-fade-up'>
              <div className='h-2 w-2 rounded-full bg-green-500'></div>
              <span className='text-sm font-medium'>Ready for production</span>
            </div>

            <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 mb-6 opacity-0 animate-fade-up-delay-200'>
              The easiest way to access your user's AWS account
            </h1>

            <p className='text-xl text-muted-foreground mb-8 max-w-2xl opacity-0 animate-fade-up-delay-400'>
              A simple hosted page that enables your users to securely grant you
              access to their AWS accounts. Just specify the IAM permissions you
              need and share a link.
            </p>

            <div className='space-x-4 opacity-0 animate-fade-up-delay-400'>
              <Button asChild size='lg' className='text-lg px-8'>
                <Link href='/pages'>Get Started</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </RootLayout>
  );
}
