import { signOutAction } from '@/app/actions/auth';
import Link from 'next/link';
import { Button } from './ui/button';
import { createClient } from '@/lib/supabase/server';
import { LogOut } from 'lucide-react';
import AppButton from './app-button';

export default async function Navbar() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className='border-b'>
      <nav className='container mx-auto py-3 flex justify-between items-center'>
        <Link href='/' className='text-xl font-bold text-primary'>
          Doorman
        </Link>
        <div className='flex items-center space-x-4'>
          {user ? (
            <>
              <AppButton />
              <Button variant='ghost' size='icon' onClick={signOutAction}>
                <LogOut className='h-4 w-4' />
              </Button>
            </>
          ) : (
            <Button asChild size='sm'>
              <Link href='/auth'>Get Started</Link>
            </Button>
          )}
        </div>
      </nav>
    </div>
  );
}
