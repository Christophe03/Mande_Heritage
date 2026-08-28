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

    const { name, description, coverImage, isFeatured } = await req.json();

    if (!name) {
      return NextResponse.json({ success: false, message: 'Nom de collection requis.' }, { status: 400 });
    }

    let slug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const existing = await prisma.collection.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Math.floor(100 + Math.random() * 900)}`;

    const collection = await prisma.collection.create({
      data: {
        name,
        slug,
        description: description || '',
        coverImage: coverImage || 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200',
        isFeatured: isFeatured ?? true,
      },
    });

    return NextResponse.json({ success: true, collection });
  } catch (error: any) {
    console.error('Create collection error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Erreur création collection.' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ success: false, message: 'Non autorisé.' }, { status: 403 });
    }

    const { id, name, description, coverImage, isFeatured } = await req.json();

    if (!id) {
      return NextResponse.json({ success: false, message: 'ID collection requis.' }, { status: 400 });
    }

    const updated = await prisma.collection.update({
      where: { id },
      data: {
        name: name || undefined,
        description: description !== undefined ? description : undefined,
        coverImage: coverImage || undefined,
        isFeatured: isFeatured !== undefined ? isFeatured : undefined,
      },
    });

    return NextResponse.json({ success: true, collection: updated });
  } catch (error: any) {
    console.error('Update collection error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Erreur mise à jour collection.' }, { status: 500 });
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
      return NextResponse.json({ success: false, message: 'ID requis.' }, { status: 400 });
    }

    await prisma.collection.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Collection supprimée.' });
  } catch (error: any) {
    console.error('Delete collection error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Erreur suppression collection.' }, { status: 500 });
  }
}
