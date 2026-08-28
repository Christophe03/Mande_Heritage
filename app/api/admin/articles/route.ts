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

    const { title, summary, content, coverImage, author, tags, isPublished } = await req.json();

    if (!title || !content) {
      return NextResponse.json({ success: false, message: 'Titre et contenu obligatoires.' }, { status: 400 });
    }

    // Generate unique slug
    let slug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    if (!slug) slug = `article-${Date.now()}`;

    // Check if slug exists
    const existing = await prisma.article.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Math.floor(100 + Math.random() * 900)}`;
    }

    const article = await prisma.article.create({
      data: {
        title,
        slug,
        summary: summary || '',
        content,
        coverImage: coverImage || 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1200',
        author: author || 'Maison Mandé Héritage',
        tags: Array.isArray(tags) ? JSON.stringify(tags) : (tags || '["Bôkôlan", "Haute Couture"]'),
        isPublished: isPublished ?? true,
        publishedAt: isPublished ? new Date() : undefined,
      },
    });

    return NextResponse.json({ success: true, article });
  } catch (error: any) {
    console.error('Create article error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Erreur création article.' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ success: false, message: 'Non autorisé.' }, { status: 403 });
    }

    const { id, title, summary, content, coverImage, author, tags, isPublished } = await req.json();

    if (!id) {
      return NextResponse.json({ success: false, message: 'ID article requis.' }, { status: 400 });
    }

    const updated = await prisma.article.update({
      where: { id },
      data: {
        title: title || undefined,
        summary: summary !== undefined ? summary : undefined,
        content: content || undefined,
        coverImage: coverImage || undefined,
        author: author || undefined,
        tags: tags !== undefined ? (Array.isArray(tags) ? JSON.stringify(tags) : tags) : undefined,
        isPublished: isPublished !== undefined ? isPublished : undefined,
        publishedAt: isPublished ? new Date() : undefined,
      },
    });

    return NextResponse.json({ success: true, article: updated });
  } catch (error: any) {
    console.error('Update article error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Erreur mise à jour article.' }, { status: 500 });
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
      return NextResponse.json({ success: false, message: 'ID article requis.' }, { status: 400 });
    }

    await prisma.article.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Article supprimé.' });
  } catch (error: any) {
    console.error('Delete article error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Erreur suppression article.' }, { status: 500 });
  }
}
