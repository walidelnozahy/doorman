import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the SSR package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;
  const redirectTo = requestUrl.searchParams.get('redirect_to')?.toString();

  // Check for error parameters
  const error = requestUrl.searchParams.get('error');
  const errorDescription = requestUrl.searchParams.get('error_description');

  // If there's an error, redirect to auth page with just the error description
  if (error) {
    // Get error description or use a default message
    const errorMessage =
      errorDescription || 'Authentication failed. Please try again.';

    // Create an absolute URL with ONLY the error message as a query parameter
    const authUrl = new URL(`${origin}/auth`);
    authUrl.searchParams.set('error', errorMessage);

    // Use a 302 redirect with an absolute URL
    return NextResponse.redirect(authUrl.toString(), 302);
  }

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  if (redirectTo) {
    // Ensure redirectTo doesn't have hash parameters
    const cleanRedirectUrl = new URL(redirectTo, origin);
    return NextResponse.redirect(cleanRedirectUrl.toString(), 302);
  }

  // URL to redirect to after sign up process completes
  return NextResponse.redirect(`${origin}/pages`, 302);
}
