import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Page } from '@/utils/types';
import { getAuthenticatedUser } from '@/lib/supabase/get-authenticate-user';
import { generateTemplate } from '@/utils/queries';

export async function POST(req: Request) {
  try {
    const body: Page = await req.json();

    if (!body.title || !body.provider_account_id || !body.permissions) {
      throw new Error('Missing required fields');
    }

    const supabase = await createClient();
    // Get authenticated user
    const user = await getAuthenticatedUser(supabase);

    // First, create the page
    const { data, error } = await supabase
      .from('pages')
      .insert([
        {
          user_id: user?.id,
          title: body.title,
          provider_account_id: body.provider_account_id,
          permissions: body.permissions,
          note: body.note,
        },
      ])
      .select();

    if (error) throw error;

    // Get the created page with its ID
    const createdPage = data[0];

    // Now generate template with the page ID
    const { url } = await generateTemplate({
      title: createdPage.title,
      pageId: createdPage.id,
      accountId: createdPage.provider_account_id,
      permissions: createdPage.permissions,
      description: createdPage.note || '',
    });

    // Update the page with the template URL
    const { error: updateError } = await supabase
      .from('pages')
      .update({ template_url: url })
      .eq('id', createdPage.id);

    if (updateError) throw updateError;

    // Return the updated page
    return NextResponse.json(
      {
        ...createdPage,
        template_url: url,
      },
      { status: 201 },
    );
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
