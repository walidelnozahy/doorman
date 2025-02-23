import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ connectionId: string }> },
) {
  try {
    const connectionId = (await params).connectionId;

    if (!connectionId) {
      throw new Error('connection_id is required');
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('connections')
      .select('*')
      .eq('connection_id', connectionId)
      .single();

    if (!data) {
      return NextResponse.json(
        { error: 'Connection not found' },
        { status: 404 },
      );
    }
    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
