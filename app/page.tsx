import React from 'react';
import prisma from '@/lib/prisma';
import { HeroSection } from '@/components/shop/HeroSection';
import { CategoryUniverse } from '@/components/shop/CategoryUniverse';
import { ProductCard } from '@/components/shop/ProductCard';
import { EditorialStory } from '@/components/shop/EditorialStory';
import { BokolanImmersion } from '@/components/shop/BokolanImmersion';
import { FeaturedCollectionBanner } from '@/components/shop/FeaturedCollectionBanner';
import { ShopTheLookSection } from '@/components/shop/ShopTheLookSection';
import { WhyMandeSection } from '@/components/shop/WhyMandeSection';
import { PopularProductsTabs } from '@/components/shop/PopularProductsTabs';
import { InstagramFeed } from '@/components/shop/InstagramFeed';
import { NewsletterSection } from '@/components/shop/NewsletterSection';
import { BogolanDivider } from '@/components/ui/BogolanPattern';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export const revalidate = 60; // ISR 60 seconds

export default async function HomePage() {
  // Fetch categories, new in products, and all products for tabs
  let categories: any[] = [];
  let newProducts: any[] = [];
  let allProducts: any[] = [];

  try {
    categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });

    newProducts = await prisma.product.findMany({
      where: { isNew: true },
      include: { category: true, collection: true },
      take: 8,
      orderBy: { createdAt: 'desc' },
    });

    allProducts = await prisma.product.findMany({
      include: { category: true, collection: true },
      take: 16,
      orderBy: { createdAt: 'desc' },
    });
  } catch (e) {
    console.error('Error loading data for homepage:', e);
  }

  return (
    <div className="bg-mande-ivory">
      {/* 1. Hero Fullscreen */}
      <HeroSection />

      {/* 2. Category Universe (4 categories) */}
      <CategoryUniverse categories={categories} />

      {/* 3. Nouvelle Collection Section */}
      <section className="py-20 bg-mande-ivoryLight border-t border-b border-mande-ivoryDark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-mande-gold font-sans font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Nouveautés &bull; Saison Impériale</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold uppercase tracking-wider text-mande-black">
                Nouvelle Collection
              </h2>
            </div>
            <Link href="/boutique" className="mt-4 md:mt-0">
              <Button variant="dark-outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Voir Toutes les Nouveautés
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {newProducts.map((product, idx) => (
              <ProductCard key={product.id} product={product} priority={idx < 4} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Section Éditoriale "Notre Héritage, Notre Fierté" */}
      <EditorialStory />

      {/* 5. Section Immersive "L'Art du Bôkôlan" */}
      <BokolanImmersion />

      {/* 6. Bannière Collection Phare "L'Héritage Réinventé" */}
      <FeaturedCollectionBanner />

      {/* 6bis. Lookbook Interactif "Shop The Look" */}
      <ShopTheLookSection />

      {/* 7. Section "Pourquoi Mandé Héritage ?" (4 piliers) */}
      <WhyMandeSection />

      {/* 8. Produits Populaires avec Onglets & Tri */}
      <PopularProductsTabs products={allProducts} categories={categories} />

      {/* 9. Instagram Grid */}
      <InstagramFeed />

      {/* 10. Newsletter */}
      <NewsletterSection />
    </div>
  );
}
