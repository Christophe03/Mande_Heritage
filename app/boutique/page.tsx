import React from 'react';
import prisma from '@/lib/prisma';
import { BoutiqueCatalog } from '@/components/shop/BoutiqueCatalog';
import { BogolanBorder, BogolanDivider } from '@/components/ui/BogolanPattern';

export const metadata = {
  title: 'Boutique & Créations Bôkôlan | Mandé Héritage',
  description:
    'Explorez l’ensemble de nos vêtements, vestes kimonos, robes, sacs et souliers en Bôkôlan authentique et coton tissé main.',
};

export default async function BoutiquePage({
  searchParams,
}: {
  searchParams: { category?: string; collection?: string };
}) {
  let products: any[] = [];
  let categories: any[] = [];
  let collections: any[] = [];

  try {
    categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });

    collections = await prisma.collection.findMany({
      orderBy: { name: 'asc' },
    });

    products = await prisma.product.findMany({
      include: {
        category: true,
        collection: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  } catch (e) {
    console.error('Error fetching boutique data:', e);
  }

  return (
    <div className="pt-24 min-h-screen bg-mande-ivory">
      {/* Page Header */}
      <div className="bg-mande-ivoryLight py-12 border-b border-mande-ivoryDark text-center px-4">
        <div className="max-w-3xl mx-auto">
          <span className="text-xs uppercase tracking-[0.25em] text-mande-gold font-sans font-semibold">
            Haute Confection Africaine
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold uppercase tracking-wider text-mande-black mt-2">
            La Boutique
          </h1>
          <BogolanDivider variant="gold" className="my-3" />
          <p className="text-xs sm:text-sm text-gray-600 font-sans font-light max-w-xl mx-auto">
            Découvrez nos pièces de prestige où chaque motif géométrique raconte la mémoire vive du Mandé.
          </p>
        </div>
      </div>

      <BogolanBorder className="opacity-30 text-mande-gold" />

      {/* Catalog Component */}
      <BoutiqueCatalog
        products={products}
        categories={categories}
        collections={collections}
        initialCategory={searchParams.category}
        initialCollection={searchParams.collection}
      />
    </div>
  );
}
