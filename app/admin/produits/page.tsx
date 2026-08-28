import React from 'react';
import prisma from '@/lib/prisma';
import { ProductManagement } from '@/components/admin/ProductManagement';

export const metadata = {
  title: 'Gestion des Produits | Admin Mandé Héritage',
};

export default async function AdminProduitsPage() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      collection: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  });

  const collections = await prisma.collection.findMany({
    orderBy: { name: 'asc' },
  });

  return (
    <ProductManagement
      initialProducts={products}
      categories={categories}
      collections={collections}
    />
  );
}
