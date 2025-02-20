import { NextResponse } from 'next/server';

import { createClient } from '@/utils/supabase/server';
import { Page } from '@/utils/types';
import { getAuthenticatedUser } from '@/utils/get-authenticate-user';

export async function POST(req: Request) {
  try {
    const body: Page = await req.json();

    if (!body.name || !body.account_id || !body.permissions) {
      throw new Error('Missing required fields');
    }
    const supabase = await createClient();
    // Get authenticated user
    const user = await getAuthenticatedUser(supabase);
    const { data, error } = await supabase.from('pages').insert([
      {
        user_id: user?.id,
        name: body.name,
        account_id: body.account_id,
        permissions: body.permissions,
        note: body.note,
      },
    ]);

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function GET() {
  try {
    const supabase = await createClient();
    // Get authenticated user
    const user = await getAuthenticatedUser(supabase);
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('user_id', user?.id);

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
