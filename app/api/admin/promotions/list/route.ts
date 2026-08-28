import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ success: false, message: 'Non autorisé.' }, { status: 403 });
    }

    const promos = await prisma.promoCode.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, promos });
  } catch (error) {
    return NextResponse.json({ success: false, promos: [] }, { status: 500 });
  }
}
