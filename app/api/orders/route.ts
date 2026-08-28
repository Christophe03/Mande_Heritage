import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();

    const {
      fullName,
      email,
      phone,
      address,
      city,
      country,
      notes,
      shippingCost,
      paymentMethod,
      items,
      subtotal,
      discount,
      total,
      promoCode,
    } = body;

    if (!fullName || !email || !items || items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Données de commande incomplètes.' },
        { status: 400 }
      );
    }

    // Generate unique order number e.g. MH-2026-8942
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `MH-${new Date().getFullYear()}-${randomDigits}`;

    const shippingAddressJson = JSON.stringify({
      fullName,
      email,
      phone,
      address,
      city,
      country,
    });

    // Create Order with nested items
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: (session?.user as any)?.id || null,
        status: 'NOUVELLE',
        paymentStatus: paymentMethod === 'CASH_ON_DELIVERY' ? 'PENDING' : 'PAID',
        paymentMethod: paymentMethod || 'ORANGE_MONEY',
        subtotal: Number(subtotal),
        shippingCost: Number(shippingCost) || 0,
        discount: Number(discount) || 0,
        total: Number(total),
        shippingAddress: shippingAddressJson,
        notes: notes || null,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            size: item.size || 'Taille Unique',
            color: item.color || 'Bôkôlan Naturel',
            quantity: Number(item.quantity) || 1,
            unitPrice: Number(item.unitPrice),
          })),
        },
      },
    });

    // Increment promo code usage if applied
    if (promoCode) {
      await prisma.promoCode.updateMany({
        where: { code: promoCode },
        data: { usageCount: { increment: 1 } },
      });
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
    });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur lors de la création de la commande.' },
      { status: 500 }
    );
  }
}
