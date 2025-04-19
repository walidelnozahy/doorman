import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

export const updateSession = async (request: NextRequest) => {
  // This `try/catch` block is only here for the interactive tutorial.
  // Feel free to remove once you have Supabase connected.
  try {
    // Create an unmodified response
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            );
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            );
          },
        },
      },
    );

    // This will refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/server-side/nextjs
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    const isAuthenticated = !!user && !error;
    const isAuthPage = request.nextUrl.pathname.startsWith('/auth');
    const isAppPage = request.nextUrl.pathname.startsWith('/pages');

    // Redirect authenticated users away from auth pages to app
    if (isAuthPage && isAuthenticated) {
      console.log('Redirecting authenticated user from auth page to /pages');
      return NextResponse.redirect(new URL('/pages', request.url));
    }

    // Redirect unauthenticated users to auth page only when trying to access /pages routes
    if (isAppPage && !isAuthenticated) {
      console.log('Redirecting unauthenticated user from app page to /auth');
      const url = new URL('/auth', request.url);
      // Preserve query parameters and hash from original URL
      url.search = request.nextUrl.search;
      url.hash = request.nextUrl.hash;

      return NextResponse.redirect(url);
    }

    return response;
  } catch (e) {
    // If you are here, a Supabase client could not be created!
    // This is likely because you have not set up environment variables.
    console.error('Middleware error:', e);
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
