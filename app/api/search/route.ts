import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q')?.trim();

    if (!q) {
      return NextResponse.json({ products: [] });
    }

    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: q } },
          { description: { contains: q } },
          { materials: { contains: q } },
        ],
      },
      include: {
        category: true,
        collection: true,
      },
      take: 8,
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ products: [] }, { status: 500 });
  }
}
