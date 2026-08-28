import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Crown } from 'lucide-react';
import { Button } from '../ui/Button';

export function FeaturedCollectionBanner() {
  return (
    <section className="relative py-24 sm:py-32 bg-mande-black text-mande-ivory overflow-hidden my-12">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1920&auto=format&fit=crop"
          alt="Collection Phare L’Héritage Réinventé"
          fill
          className="object-cover object-center opacity-40 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-mande-black via-mande-black/80 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-mande-gold/40 bg-mande-surface/60 text-mande-gold text-xs tracking-[0.25em] uppercase font-sans">
            <Crown className="w-3.5 h-3.5" />
            <span>Collection Capsule Phare</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-bold uppercase tracking-wider leading-tight text-mande-ivory">
            L’Héritage Réinventé
          </h2>

          <p className="font-sans text-sm sm:text-base text-mande-sandLight font-light leading-relaxed">
            Une série limitée de vestes kimonos, robes fourreaux et sacs de voyage conçue pour sublimer votre présence lors des grands rendez-vous diplomatiques et cérémonies de prestige.
          </p>

          <div className="pt-2 flex flex-wrap gap-4">
            <Link href="/collections/heritage-royal">
              <Button
                variant="gold"
                size="md"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Acquérir une Pièce
              </Button>
            </Link>
            <Link href="/collections">
              <Button variant="gold-outline" size="md">
                Voir les 4 Collections
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
