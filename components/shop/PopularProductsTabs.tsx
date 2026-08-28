'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ProductCard } from './ProductCard';
import { Button } from '../ui/Button';
import { BogolanDivider } from '../ui/BogolanPattern';
import { ArrowRight, SlidersHorizontal } from 'lucide-react';

interface PopularProductsProps {
  products: any[];
  categories: { id: string; name: string; slug: string }[];
}

export function PopularProductsTabs({ products, categories }: PopularProductsProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');

  // Filter products by active category
  const filteredProducts = products.filter((p) => {
    if (activeCategory === 'all') return true;
    return p.category?.slug === activeCategory;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    // default newest
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Title */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs uppercase tracking-[0.25em] text-mande-gold font-sans font-semibold">
          Sélection Signature
        </span>
        <h2 className="font-serif text-2xl sm:text-4xl font-bold uppercase tracking-wider text-mande-black mt-2">
          Créations Populaires
        </h2>
        <BogolanDivider variant="gold" className="my-4" />
      </div>

      {/* Tabs and Sort controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-4 border-b border-mande-ivoryDark">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 text-xs uppercase tracking-wider font-sans transition-all duration-300 ${
              activeCategory === 'all'
                ? 'bg-mande-black text-mande-gold font-semibold shadow-sm'
                : 'bg-white text-gray-600 border border-mande-ivoryDark hover:border-mande-gold'
            }`}
          >
            Tous les univers ({products.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.slug)}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-sans transition-all duration-300 ${
                activeCategory === cat.slug
                  ? 'bg-mande-black text-mande-gold font-semibold shadow-sm'
                  : 'bg-white text-gray-600 border border-mande-ivoryDark hover:border-mande-gold'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 text-xs text-gray-600 font-sans">
          <SlidersHorizontal className="w-3.5 h-3.5 text-mande-gold" />
          <span>Trier par :</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-mande-sandDark text-xs py-1.5 px-3 focus:outline-none focus:border-mande-gold text-mande-black"
          >
            <option value="newest">Nouveautés</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
            <option value="name">Ordre alphabétique</option>
          </select>
        </div>
      </div>

      {/* Products Grid (3-4 desktop, 2 mobile) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {sortedProducts.map((product, index) => (
          <ProductCard key={product.id} product={product} priority={index < 4} />
        ))}
      </div>

      {/* Explore full catalogue CTA */}
      <div className="mt-14 text-center">
        <Link href="/boutique">
          <Button variant="dark-outline" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
            Explorer toute la boutique
          </Button>
        </Link>
      </div>
    </section>
  );
}
