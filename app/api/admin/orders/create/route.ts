import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ success: false, message: 'Non autorisé.' }, { status: 403 });
    }

    const {
      customerName,
      customerEmail,
      customerPhone,
      address,
      city,
      country,
      paymentMethod,
      paymentStatus,
      status,
      shippingCost,
      discount,
      notes,
      items, // Array of { productId, size, color, quantity, unitPrice }
    } = await req.json();

    if (!customerName || !items || items.length === 0) {
      return NextResponse.json({ success: false, message: 'Nom du client et articles requis.' }, { status: 400 });
    }

    const subtotal = items.reduce((sum: number, item: any) => sum + (item.unitPrice * item.quantity), 0);
    const total = Math.max(0, subtotal - (Number(discount) || 0) + (Number(shippingCost) || 0));

    // Generate unique order number (e.g. MH-SR-2026-XXXX)
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `MH-${Date.now().toString().slice(-4)}${randomSuffix}`;

    const shippingAddressJson = JSON.stringify({
      fullName: customerName,
      email: customerEmail || 'vente-directe@mandeheritage.com',
      phone: customerPhone || '',
      address: address || 'Vente Showroom / Retrait Atelier',
      city: city || 'Bamako',
      country: country || 'Mali',
    });

    // Create order and order items in a transaction
    const newOrder = await prisma.order.create({
      data: {
        orderNumber,
        status: status || 'CONFIRMEE',
        paymentStatus: paymentStatus || 'PAID',
        paymentMethod: paymentMethod || 'CASH_ON_DELIVERY',
        subtotal,
        shippingCost: Number(shippingCost) || 0,
        discount: Number(discount) || 0,
        total,
        shippingAddress: shippingAddressJson,
        notes: notes ? `[Vente Directe/Showroom] ${notes}` : '[Vente Directe/Showroom]',
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            size: item.size || 'Unique',
            color: item.color || 'Bôkôlan Naturel',
            quantity: Number(item.quantity) || 1,
            unitPrice: Number(item.unitPrice),
          })),
        },
      },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    // Decrement stock for purchased products
    for (const item of items) {
      if (item.productId) {
        await prisma.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: Number(item.quantity) || 1 } },
        }).catch(() => {});
      }
    }

    return NextResponse.json({ success: true, order: newOrder });
  } catch (error: any) {
    console.error('Create manual order error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Erreur lors de la création.' }, { status: 500 });
  }
}
