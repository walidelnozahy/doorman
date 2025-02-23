import { signOutAction } from '@/app/actions';
import Link from 'next/link';
import { Button } from './ui/button';
import { createClient } from '@/lib/supabase/server';
import { LogOut } from 'lucide-react';
import AppButton from './app-button';

export default async function AuthButton() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      {user ? (
        <>
          <AppButton />
          <Button variant='ghost' size='icon' onClick={signOutAction}>
            <LogOut className='mr-2 h-4 w-4' />
          </Button>
        </>
      ) : (
        <Button asChild size='sm'>
          <Link href='/auth'>Get Started</Link>
        </Button>
      )}
    </>
  );
}
