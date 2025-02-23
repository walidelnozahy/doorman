import { NextResponse } from 'next/server';
import { generateTemplate } from '@/utils/queries';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (
      !body.pageId ||
      !body.accountId ||
      !body.permissions ||
      !body.title ||
      !body.description
    ) {
      throw new Error('Missing required fields');
    }

    const response = await generateTemplate(body);

    if (!response.url) {
      throw new Error('Failed to generate template');
    }
    return NextResponse.json(response);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
