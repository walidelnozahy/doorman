'use server';

import { encodedRedirect } from '@/utils/encoded-redirect';
import { createClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export const signInSignUpWithOtpAction = async (formData: FormData) => {
  const email = formData.get('email')?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get('origin');
  if (!email) {
    return encodedRedirect('error', '/auth', 'Email is required');
  }
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });
  if (error) {
    return encodedRedirect('error', '/auth', error.message);
  }
  return encodedRedirect(
    'success',
    '/auth',
    'Check your email for a link to sign in.',
  );
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect('/auth');
};
