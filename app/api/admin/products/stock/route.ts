import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ success: false, message: 'Non autorisé.' }, { status: 403 });
    }

    const { productId, stock } = await req.json();

    if (!productId || stock === undefined) {
      return NextResponse.json({ success: false, message: 'ID et niveau de stock requis.' }, { status: 400 });
    }

    const updated = await prisma.product.update({
      where: { id: productId },
      data: { stock: Math.max(0, parseInt(stock, 10)) },
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (error) {
    console.error('Update product stock error:', error);
    return NextResponse.json({ success: false, message: 'Erreur lors de la mise à jour.' }, { status: 500 });
  }
}
