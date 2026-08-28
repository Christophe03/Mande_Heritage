import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { BogolanDivider } from '../ui/BogolanPattern';

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  productCount?: number;
}

export function CategoryUniverse({ categories }: { categories: CategoryItem[] }) {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="text-xs uppercase tracking-[0.25em] text-mande-gold font-sans font-semibold">
          L’Excellence Artisanale
        </span>
        <h2 className="font-serif text-2xl sm:text-4xl font-bold uppercase tracking-wider text-mande-black mt-2">
          L’Univers Mandé Héritage
        </h2>
        <BogolanDivider variant="gold" className="my-4" />
        <p className="text-xs sm:text-sm text-gray-600 font-sans font-light">
          Chaque création est conçue comme une œuvre d’art vivante, associant le Bôkôlan traditionnel aux silhouettes les plus contemporaines.
        </p>
      </div>

      {/* Grid of Categories (Vêtements, Robes, Sacs, Chaussures, Accessoires) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/boutique?category=${category.slug}`}
            className="group relative h-96 sm:h-[420px] overflow-hidden border border-mande-ivoryDark hover:border-mande-gold transition-all duration-500 shadow-sm flex flex-col justify-end p-6"
          >
            {/* Category Cover Image */}
            <Image
              src={
                category.image ||
                'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=600'
              }
              alt={category.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent group-hover:from-black/95 transition-colors duration-300" />

            {/* Content */}
            <div className="relative z-10 text-mande-ivory transform transition-transform duration-300 group-hover:-translate-y-2">
              <span className="text-[10px] uppercase tracking-[0.25em] text-mande-gold font-sans block mb-1">
                Catégorie
              </span>
              <h3 className="font-serif text-xl font-bold uppercase tracking-wider mb-2">
                {category.name}
              </h3>
              <p className="text-xs text-gray-300 line-clamp-2 font-sans mb-4 font-light opacity-90">
                {category.description}
              </p>
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-mande-gold font-semibold group-hover:underline">
                <span>Découvrir</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Delicate gold corner accent */}
            <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-mande-gold/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
        ))}
      </div>
    </section>
  );
}
