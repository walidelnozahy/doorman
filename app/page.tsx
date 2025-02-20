import { ThemeToggle } from '@/components/theme-toggle';
import ConnectSupabaseSteps from '@/components/tutorial/connect-supabase-steps';
import SignUpUserSteps from '@/components/tutorial/sign-up-user-steps';
import { Button } from '@/components/ui/button';
import { hasEnvVars } from '@/utils/supabase/check-env-vars';
import Link from 'next/link';

export default async function Home() {
  return (
    <div className='flex items-center justify-center flex-1 h-full my-auto'>
      <section className='container mx-auto px-4 py-16'>
        <div className='flex flex-col items-center justify-center text-center max-w-4xl mx-auto'>
          <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6'>
            The easiest way to access your user's AWS account
          </h1>
          <p className='text-xl text-muted-foreground mb-8'>
            A simple hosted page that enables your users to securely grant you
            access to their AWS accounts. Just specify the IAM permissions you
            need and share a link.
          </p>
          <Button asChild size='lg' className='text-lg px-8'>
            <Link href='/app'>Get Started</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
