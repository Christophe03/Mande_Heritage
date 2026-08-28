import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ success: false, message: 'Non autorisé.' }, { status: 403 });
    }

    const { zoneName, countries, estimatedDays, price, isActive } = await req.json();

    if (!zoneName || price === undefined) {
      return NextResponse.json({ success: false, message: 'Nom de zone et tarif requis.' }, { status: 400 });
    }

    const zone = await prisma.shippingZone.create({
      data: {
        zoneName,
        countries: Array.isArray(countries) ? JSON.stringify(countries) : countries || '["Mali"]',
        estimatedDays: estimatedDays || '24h à 48h',
        price: parseInt(price, 10),
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json({ success: true, zone });
  } catch (error: any) {
    console.error('Create shipping zone error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Erreur création zone.' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ success: false, message: 'Non autorisé.' }, { status: 403 });
    }

    const { id, zoneName, countries, estimatedDays, price, isActive } = await req.json();

    if (!id) {
      return NextResponse.json({ success: false, message: 'ID zone requis.' }, { status: 400 });
    }

    const updated = await prisma.shippingZone.update({
      where: { id },
      data: {
        zoneName: zoneName || undefined,
        countries: countries !== undefined ? (Array.isArray(countries) ? JSON.stringify(countries) : countries) : undefined,
        estimatedDays: estimatedDays !== undefined ? estimatedDays : undefined,
        price: price !== undefined ? parseInt(price, 10) : undefined,
        isActive: isActive !== undefined ? isActive : undefined,
      },
    });

    return NextResponse.json({ success: true, zone: updated });
  } catch (error: any) {
    console.error('Update shipping zone error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Erreur mise à jour zone.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ success: false, message: 'Non autorisé.' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'ID zone requis.' }, { status: 400 });
    }

    await prisma.shippingZone.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Zone supprimée.' });
  } catch (error: any) {
    console.error('Delete shipping zone error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Erreur suppression zone.' }, { status: 500 });
  }
}
