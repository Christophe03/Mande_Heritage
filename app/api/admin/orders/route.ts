import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ success: false, message: 'Accès non autorisé.' }, { status: 403 });
    }

    const { orderId, status, paymentStatus, notes } = await req.json();

    if (!orderId) {
      return NextResponse.json({ success: false, message: 'ID commande requis.' }, { status: 400 });
    }

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: status || undefined,
        paymentStatus: paymentStatus || undefined,
        notes: notes !== undefined ? notes : undefined,
      },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    console.error('Update order error:', error);
    return NextResponse.json({ success: false, message: 'Erreur lors de la mise à jour.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ success: false, message: 'Accès non autorisé.' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('id');

    if (!orderId) {
      return NextResponse.json({ success: false, message: 'ID commande requis.' }, { status: 400 });
    }

    // Set order status to ANNULEE or delete
    const updated = await prisma.order.update({
      where: { id: orderId },
      data: { status: 'ANNULEE' },
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    console.error('Cancel order error:', error);
    return NextResponse.json({ success: false, message: 'Erreur lors de l’annulation.' }, { status: 500 });
  }
}
