import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function handleDomainRoutingMiddleware(req: NextRequest) {
  const hostname = req.headers.get('host')?.replace(/^www\./, '');

  // Skip middleware on Vercel preview deployments, localhost, or root domain
  const isInternal =
    hostname?.includes('vercel.app') ||
    hostname?.includes('localhost') ||
    hostname ===
      process.env.NEXT_PUBLIC_APP_URL?.replace('https://', '').replace(
        'http://',
        '',
      );

  if (!hostname || isInternal) {
    return NextResponse.next();
  }
  const supabase = await createClient();

  // Look up custom domain
  const { data: domainRecord, error } = await supabase
    .from('custom_domains')
    .select('page_id')
    .eq('domain', hostname)
    .eq('is_verified', true)
    .single();

  if (error) {
    console.error('Error fetching domain mapping:', error);
    return NextResponse.next();
  }

  if (domainRecord?.page_id) {
    // Check if the current pathname is already the page_id
    const currentPathname = req.nextUrl.pathname;

    // If the pathname is empty (root) or not already the page_id, redirect
    if (
      currentPathname === '/' ||
      currentPathname !== `/${domainRecord.page_id}`
    ) {
      // Create a new URL for the redirect
      return NextResponse.redirect(
        new URL(`/${domainRecord.page_id}`, req.url),
      );
    }

    // If already on the correct page, continue without redirecting
    return NextResponse.next();
  }

  // No matching domain found, continue with default behavior
  return NextResponse.next();
}
