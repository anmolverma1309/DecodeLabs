import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import { Interaction } from '@/models/Interaction';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();
    const { itemId, type, weight } = body;

    const interaction = await Interaction.create({
      userId: (session.user as any).id,
      itemId,
      type,
      weight: weight || 1, // Default weight is 1 if not provided
    });

    return NextResponse.json(interaction, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to record interaction' }, { status: 500 });
  }
}
