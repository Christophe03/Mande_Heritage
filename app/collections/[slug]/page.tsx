import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { ProductCard } from '@/components/shop/ProductCard';
import { BogolanBorder, BogolanDivider } from '@/components/ui/BogolanPattern';
import { Metadata } from 'next';

interface CollectionPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const col = await prisma.collection.findUnique({
    where: { slug: params.slug },
  });

  if (!col) return { title: 'Collection | Mandé Héritage' };

  return {
    title: `Collection ${col.name} | Mandé Héritage`,
    description: col.description || 'Créations d’exception de la Maison Mandé Héritage.',
  };
}

export default async function SingleCollectionPage({ params }: CollectionPageProps) {
  const collection = await prisma.collection.findUnique({
    where: { slug: params.slug },
    include: {
      products: {
        include: {
          category: true,
          collection: true,
        },
      },
    },
  });

  if (!collection) {
    notFound();
  }

  return (
    <div className="pt-24 min-h-screen bg-mande-ivory">
      {/* Collection Hero Header */}
      <section className="relative h-[55vh] flex items-center justify-center bg-mande-black text-center text-mande-ivory overflow-hidden">
        <Image
          src={collection.coverImage || 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1920'}
          alt={collection.name}
          fill
          priority
          className="object-cover opacity-40 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-mande-black via-black/40 to-black/70" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
          <span className="inline-block text-xs uppercase tracking-[0.3em] text-mande-gold font-sans font-semibold mb-2">
            Collection Signature
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold uppercase tracking-wider leading-tight text-mande-ivory">
            {collection.name}
          </h1>
          <BogolanDivider variant="gold" className="my-3" />
          <p className="font-sans text-xs sm:text-sm text-mande-sandLight font-light max-w-xl mx-auto">
            {collection.description}
          </p>
        </div>
      </section>

      <BogolanBorder className="opacity-30 text-mande-gold" />

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-mande-ivoryDark">
          <h2 className="font-serif text-xl font-bold uppercase tracking-wider text-mande-black">
            Les Pièces de la Collection ({(collection.products || []).length})
          </h2>
          <Link href="/boutique" className="text-xs uppercase tracking-wider text-mande-gold hover:underline font-sans">
            Voir toute la boutique →
          </Link>
        </div>

        {(collection.products || []).length === 0 ? (
          <div className="text-center py-16 bg-white border border-mande-ivoryDark p-8">
            <h3 className="font-serif text-lg font-bold mb-2">Pièces en cours de confection</h3>
            <p className="text-xs text-gray-500 font-sans">
              Les créations de cette collection seront dévoilées très prochainement.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {(collection.products || []).map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
