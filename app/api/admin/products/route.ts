import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { slugify } from '@/lib/utils';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ success: false, message: 'Accès non autorisé.' }, { status: 403 });
    }

    const body = await req.json();
    const {
      name,
      slug,
      description,
      shortDescription,
      price,
      originalPrice,
      categoryId,
      collectionId,
      gender,
      sizes,
      colors,
      images,
      stock,
      materials,
      careInstructions,
      isNew,
      isFeatured,
    } = body;

    const generatedSlug = slug ? slugify(slug) : slugify(name);

    const product = await prisma.product.create({
      data: {
        name,
        slug: generatedSlug,
        description,
        shortDescription,
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : null,
        categoryId,
        collectionId: collectionId || null,
        gender: gender || 'UNISEX',
        sizes: typeof sizes === 'string' ? sizes : JSON.stringify(sizes),
        colors: typeof colors === 'string' ? colors : JSON.stringify(colors),
        images: typeof images === 'string' ? images : JSON.stringify(images),
        stock: Number(stock) || 0,
        materials,
        careInstructions,
        isNew: Boolean(isNew),
        isFeatured: Boolean(isFeatured),
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error('Admin create product error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Erreur lors de la création du produit.' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ success: false, message: 'Accès non autorisé.' }, { status: 403 });
    }

    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: 'ID produit requis.' }, { status: 400 });
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...updateData,
        price: updateData.price ? Number(updateData.price) : undefined,
        originalPrice: updateData.originalPrice ? Number(updateData.originalPrice) : null,
        stock: updateData.stock !== undefined ? Number(updateData.stock) : undefined,
        sizes: typeof updateData.sizes === 'string' ? updateData.sizes : JSON.stringify(updateData.sizes),
        colors: typeof updateData.colors === 'string' ? updateData.colors : JSON.stringify(updateData.colors),
        images: typeof updateData.images === 'string' ? updateData.images : JSON.stringify(updateData.images),
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error('Admin update product error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Erreur lors de la modification.' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ success: false, message: 'Accès non autorisé.' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'ID produit requis.' }, { status: 400 });
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Produit supprimé avec succès.' });
  } catch (error: any) {
    console.error('Admin delete product error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Erreur lors de la suppression.' },
      { status: 500 }
    );
  }
}
