'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { BogolanBorder } from '../ui/BogolanPattern';

export function HeroSection() {
  return (
    <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center bg-mande-black overflow-hidden">
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1920&auto=format&fit=crop"
          alt="Haute couture Bôkôlan Mandé Héritage"
          fill
          priority
          className="object-cover object-center scale-105 animate-pulse-slow opacity-60"
        />
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-mande-black via-black/50 to-black/70" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/40 to-mande-black" />
      </div>

      {/* Decorative Gold & Bogolan Borders */}
      <div className="absolute top-28 inset-x-0 z-10 px-4 sm:px-8">
        <BogolanBorder className="opacity-20 text-mande-gold" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-mande-ivory py-20 sm:py-28">
        {/* Overline Badge & Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 mb-4 filter drop-shadow-2xl">
            <Image
              src="/images/logo/logo.png"
              alt="Mandé Héritage"
              fill
              priority
              className="object-contain"
            />
          </div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 border border-mande-gold/40 bg-black/50 backdrop-blur-sm text-mande-gold text-[11px] tracking-[0.25em] uppercase font-sans">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Maison de Haute Confection &bull; Bôkôlan Sacré</span>
          </div>
        </div>

        {/* Main Title */}
        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-[0.12em] uppercase leading-tight sm:leading-none mb-6 text-mande-ivory">
          MANDÉ HÉRITAGE
        </h1>

        {/* Subtitle */}
        <p className="font-sans text-sm sm:text-base md:text-lg text-mande-sandLight font-light tracking-wide max-w-2xl mx-auto mb-10 leading-relaxed">
          L’alchimie entre la noblesse des étoffes millénaires et l’élégance intemporelle de la haute confection. Des pièces d’exception façonnées à la main par nos maîtres artisans du Mali.
        </p>

        {/* CTA Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <Link href="/boutique">
            <Button
              variant="gold"
              size="lg"
              className="w-full sm:w-auto shadow-gold-md"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Découvrir la Collection
            </Button>
          </Link>
          <Link href="/notre-histoire">
            <Button
              variant="gold-outline"
              size="lg"
              className="w-full sm:w-auto backdrop-blur-sm"
            >
              Notre Histoire & Vision
            </Button>
          </Link>
        </div>

        {/* Heritage Trust Badges */}
        <div className="mt-16 pt-8 border-t border-mande-gold/20 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <span className="block font-serif text-lg sm:text-xl font-bold text-mande-gold">100%</span>
            <span className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-widest font-sans">
              Coton Pur Filé Main
            </span>
          </div>
          <div>
            <span className="block font-serif text-lg sm:text-xl font-bold text-mande-gold">XIIIe</span>
            <span className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-widest font-sans">
              Siècle d’Histoire
            </span>
          </div>
          <div>
            <span className="block font-serif text-lg sm:text-xl font-bold text-mande-gold">120+</span>
            <span className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-widest font-sans">
              Familles d’Artisans
            </span>
          </div>
          <div>
            <span className="block font-serif text-lg sm:text-xl font-bold text-mande-gold">Express</span>
            <span className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-widest font-sans">
              Livraison Internationale
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Subtle Gradient Transition to Page */}
      <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-mande-ivory to-transparent pointer-events-none" />
    </section>
  );
}
