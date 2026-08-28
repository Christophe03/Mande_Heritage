import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import prisma from '@/lib/prisma';
import { ArrowRight, Sparkles } from 'lucide-react';
import { BogolanBorder, BogolanDivider } from '@/components/ui/BogolanPattern';

export const metadata = {
  title: 'Les Collections de Haute Confection | Mandé Héritage',
  description: 'Découvrez nos 4 collections signature : Héritage Royal, Signature Mandé, Moderne Sahel et Éditions Limitées Mansa Musa.',
};

export default async function CollectionsPage() {
  const collections = await prisma.collection.findMany({
    include: {
      _count: {
        select: { products: true },
      },
    },
    orderBy: { createdAt: 'asc' },
  });

  return (
    <div className="pt-24 min-h-screen bg-mande-ivory">
      {/* Header */}
      <div className="bg-mande-ivoryLight py-16 border-b border-mande-ivoryDark text-center px-4">
        <div className="max-w-3xl mx-auto">
          <span className="text-xs uppercase tracking-[0.25em] text-mande-gold font-sans font-semibold">
            Vestiaire de Prestige
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold uppercase tracking-wider text-mande-black mt-2">
            Nos Collections
          </h1>
          <BogolanDivider variant="gold" className="my-3" />
          <p className="text-xs sm:text-sm text-gray-600 font-sans font-light max-w-xl mx-auto">
            Chaque collection explore une facette singulière de la majesté mandingue, alliant rigueur sartoriale et spiritualité textile.
          </p>
        </div>
      </div>

      <BogolanBorder className="opacity-30 text-mande-gold" />

      {/* Collections Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {collections.map((col) => (
            <Link
              key={col.id}
              href={`/collections/${col.slug}`}
              className="group relative h-[480px] overflow-hidden border border-mande-ivoryDark hover:border-mande-gold transition-all duration-500 shadow-card flex flex-col justify-end p-8"
            >
              <Image
                src={col.coverImage || 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000'}
                alt={col.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent group-hover:from-black/95 transition-colors" />

              <div className="relative z-10 text-mande-ivory space-y-2">
                <div className="flex items-center justify-between text-xs text-mande-gold uppercase tracking-widest font-sans">
                  <span>Collection</span>
                  <span>{col._count.products} Pièces</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold uppercase tracking-wider">
                  {col.name}
                </h2>
                <p className="font-sans text-xs sm:text-sm text-gray-300 font-light line-clamp-2">
                  {col.description}
                </p>
                <div className="pt-2 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-mande-gold font-semibold group-hover:underline">
                  <span>Explorer la collection</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
