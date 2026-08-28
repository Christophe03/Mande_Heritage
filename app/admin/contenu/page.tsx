import React from 'react';
import prisma from '@/lib/prisma';
import { ContentManagement } from '@/components/admin/ContentManagement';

export const metadata = {
  title: 'Gestion de Contenu & Journal | Admin Mandé Héritage',
};

export default async function AdminContenuPage() {
  const articles = await prisma.article.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const collections = await prisma.collection.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { createdAt: 'asc' },
  });

  return (
    <ContentManagement
      initialArticles={articles}
      initialCollections={collections}
    />
  );
}
