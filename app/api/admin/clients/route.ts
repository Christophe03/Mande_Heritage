import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ success: false, message: 'Non autorisé.' }, { status: 403 });
    }

    const clients = await prisma.user.findMany({
      where: { role: 'CLIENT' },
      include: {
        orders: {
          include: { items: true },
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, clients });
  } catch (error: any) {
    console.error('Fetch clients error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Erreur chargement clients.' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ success: false, message: 'Non autorisé.' }, { status: 403 });
    }

    const { id, name, phone, address, city, country } = await req.json();

    if (!id) {
      return NextResponse.json({ success: false, message: 'ID client requis.' }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id },
      data: {
        name: name || undefined,
        phone: phone !== undefined ? phone : undefined,
        address: address !== undefined ? address : undefined,
        city: city !== undefined ? city : undefined,
        country: country !== undefined ? country : undefined,
      },
    });

    return NextResponse.json({ success: true, client: updated });
  } catch (error: any) {
    console.error('Update client error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Erreur mise à jour client.' }, { status: 500 });
  }
}
