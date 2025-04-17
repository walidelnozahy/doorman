import { NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { handleDomainRoutingMiddleware } from '@/lib/domain-routing-middleware';

export async function middleware(req: NextRequest) {
  // First update the session
  const response = await updateSession(req);

  // If updateSession returned a redirect response, return it immediately
  // This ensures auth redirects take precedence over domain routing
  if (response instanceof NextResponse && response.headers.get('location')) {
    console.log('Auth redirect detected, skipping domain routing');
    return response;
  }

  // Handle domain routing only if no auth redirect was triggered
  const domainRoutingResponse = await handleDomainRoutingMiddleware(req);
  if (domainRoutingResponse) {
    return domainRoutingResponse;
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
