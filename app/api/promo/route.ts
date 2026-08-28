import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code')?.trim().toUpperCase();

    if (!code) {
      return NextResponse.json({ valid: false, message: 'Code manquant.' }, { status: 400 });
    }

    const promo = await prisma.promoCode.findUnique({
      where: { code },
    });

    if (!promo || !promo.isActive) {
      return NextResponse.json({ valid: false, message: 'Code promo invalide ou inactif.' });
    }

    if (promo.endDate && new Date(promo.endDate) < new Date()) {
      return NextResponse.json({ valid: false, message: 'Ce code promo a expiré.' });
    }

    return NextResponse.json({
      valid: true,
      promo: {
        code: promo.code,
        discountType: promo.discountType,
        value: promo.value,
        minOrderAmount: promo.minOrderAmount,
      },
    });
  } catch (error) {
    console.error('Promo check error:', error);
    return NextResponse.json({ valid: false, message: 'Erreur lors de la vérification.' }, { status: 500 });
  }
}
