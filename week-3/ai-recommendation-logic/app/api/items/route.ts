import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Item } from '@/models/Item';

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    let query = {};
    if (category) {
      query = { category };
    }

    const items = await Item.find(query).sort({ popularityScore: -1 }).limit(50);
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Admin check should ideally be here using NextAuth getServerSession
    await dbConnect();
    const body = await request.json();
    const item = await Item.create(body);
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create item' }, { status: 500 });
  }
}
