import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import config from '@/config';

export async function handleDomainRoutingMiddleware(req: NextRequest) {
  const hostname = req.headers.get('host')?.replace(/^www\./, '');

  // Skip middleware on development environments (including Vercel preview) or root domain
  if (!hostname || config.isDev || hostname === config.rootHost) {
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
    // Instead of redirecting, rewrite the URL to serve the public page directly
    return NextResponse.rewrite(new URL(`/${domainRecord.page_id}`, req.url));
  }

  // No matching domain found, continue with default behavior
  return NextResponse.next();
}
