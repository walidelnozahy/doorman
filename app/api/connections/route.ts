import { Connection } from '@/utils/types';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function PUT(req: Request) {
  try {
    const body: Connection = await req.json();

    if (!body.page_id || !body.provider_account_id || !body.connection_id) {
      throw new Error('Missing required fields');
    }

    const supabase = await createClient();

    const { data, error } = await supabase.from('connections').upsert(
      [
        {
          connection_id: body.connection_id,
          page_id: body.page_id,
          provider_account_id: body.provider_account_id,
          consumer_account_id: body.consumer_account_id,
          status: body.status || 'disconnected', // Default status if not provided
        },
      ],
      {
        onConflict: 'connection_id',
        ignoreDuplicates: false,
      },
    );

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const pageId = searchParams.get('pageId');
    const supabase = await createClient();

    const query = supabase.from('connections').select('*');

    if (pageId) {
      query.eq('page_id', pageId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
