import { getAuthenticatedUser } from '@/lib/supabase/get-authenticate-user';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ pageId: string }> },
) {
  try {
    const pageId = (await params).pageId;

    const supabase = await createClient();
    // Get authenticated user

    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('id', pageId)
      .single();

    if (error) throw error;
    if (!data) throw new Error('Page not found');

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ pageId: string }> },
) {
  try {
    const pageId = (await params).pageId;
    const supabase = await createClient();

    const user = await getAuthenticatedUser(supabase);
    const { error } = await supabase
      .from('pages')
      .delete()
      .eq('id', pageId)
      .eq('user_id', user?.id);

    if (error) throw error;

    return NextResponse.json({ message: 'Page deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ pageId: string }> },
) {
  try {
    const pageId = (await params).pageId;
    const supabase = await createClient();
    const user = await getAuthenticatedUser(supabase);
    const body = await req.json();

    const { data, error } = await supabase
      .from('pages')
      .update(body)
      .eq('id', pageId)
      .eq('user_id', user?.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Page not found');

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
