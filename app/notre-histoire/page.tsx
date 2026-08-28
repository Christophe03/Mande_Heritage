import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles, Heart, Globe, Award } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { BogolanBorder, BogolanDivider } from '@/components/ui/BogolanPattern';

export const metadata = {
  title: 'Notre Histoire, Vision & Savoir-Faire | Mandé Héritage',
  description:
    'Découvrez la genèse de la Maison Mandé Héritage : l’union sacrée entre l’héritage impérial mandingue et la haute couture contemporaine.',
};

export default function NotreHistoirePage() {
  return (
    <div className="pt-24 min-h-screen bg-mande-ivory">
      {/* Hero Header */}
      <section className="relative h-[65vh] sm:h-[75vh] flex items-center justify-center bg-mande-black text-center text-mande-ivory overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1920&auto=format&fit=crop"
          alt="Notre Histoire Mandé Héritage"
          fill
          priority
          className="object-cover opacity-45 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-mande-black via-black/40 to-black/70" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
          <span className="inline-block text-xs uppercase tracking-[0.3em] text-mande-gold font-sans font-semibold mb-3">
            Maison de Haute Confection
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold uppercase tracking-wider leading-tight text-mande-ivory">
            Notre Histoire, Notre Fierté
          </h1>
          <BogolanDivider variant="gold" className="my-4" />
          <p className="font-sans text-sm sm:text-base text-mande-sandLight font-light max-w-2xl mx-auto">
            Porter Mandé Héritage, c’est revêtir la dignité, la sagesse et le prestige d’une civilisation millénaire.
          </p>
        </div>
      </section>

      <BogolanBorder className="opacity-30 text-mande-gold" />

      {/* 1. Origine */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-6">
            <span className="text-xs uppercase tracking-[0.25em] text-mande-gold font-sans font-semibold">
              01 &bull; L’Origine
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold uppercase tracking-wider text-mande-black">
              Au Cœur de la Terre Mandingue
            </h2>
            <BogolanDivider variant="gold" className="justify-start my-2" />
            <p className="font-sans text-sm text-gray-700 leading-relaxed font-light">
              La Maison <strong>Mandé Héritage</strong> est née d’une conviction inébranlable : le patrimoine textile ouest-africain, et tout particulièrement l’art du <em>Bôkôlan</em>, possède une valeur artistique et culturelle égale aux plus nobles soieries et draps de laine des capitales de la mode occidentale.
            </p>
            <p className="font-sans text-sm text-gray-600 leading-relaxed font-light">
              Depuis le XIIIe siècle et l’avènement de la charte de Kouroukan Fouga sous Soundiata Keïta, le vêtement en Afrique de l’Ouest n’a jamais été un simple apparat superficiel. Il est un symbole de souveraineté, un traité de paix et un bouclier spirituel.
            </p>
          </div>

          <div className="relative h-[420px] sm:h-[500px] border border-mande-sandDark shadow-card overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1000&auto=format&fit=crop"
              alt="Origine et artisanat Mandé"
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>
      </section>

      {/* 2. Vision & Mission */}
      <section className="py-20 bg-mande-ivoryLight border-t border-b border-mande-ivoryDark">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Vision */}
            <div className="bg-white p-8 sm:p-10 border border-mande-ivoryDark shadow-sm space-y-4">
              <div className="w-12 h-12 bg-mande-gold/15 border border-mande-gold/40 text-mande-gold flex items-center justify-center">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl font-bold uppercase tracking-wider text-mande-black">
                Notre Vision
              </h3>
              <p className="font-sans text-xs sm:text-sm text-gray-600 leading-relaxed font-light">
                Positionner le Bôkôlan d’art sur l’échiquier du luxe mondial comme le parangon de la haute couture éco-responsable, célébré de Bamako à Paris, de Dakar à New York, sans jamais renier son authenticité première.
              </p>
            </div>

            {/* Mission */}
            <div className="bg-white p-8 sm:p-10 border border-mande-ivoryDark shadow-sm space-y-4">
              <div className="w-12 h-12 bg-mande-gold/15 border border-mande-gold/40 text-mande-gold flex items-center justify-center">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl font-bold uppercase tracking-wider text-mande-black">
                Notre Mission
              </h3>
              <p className="font-sans text-xs sm:text-sm text-gray-600 leading-relaxed font-light">
                Garantir une transmission vivante des savoir-faire ancestraux, offrir une rémunération digne et pérenne à plus de 120 familles d’artisans au Mali et sublimer chaque création par des finitions d’orfèvre.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. L'Inspiration & L'Ambition */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="order-2 lg:order-1 relative h-[420px] sm:h-[500px] border border-mande-sandDark shadow-card overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1000&auto=format&fit=crop"
              alt="Inspiration Haute Couture Mandé"
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>

          <div className="order-1 lg:order-2 space-y-6">
            <span className="text-xs uppercase tracking-[0.25em] text-mande-gold font-sans font-semibold">
              03 &bull; Inspiration & Ambition
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold uppercase tracking-wider text-mande-black">
              L’Élégance Impériale Réinventée
            </h2>
            <BogolanDivider variant="gold" className="justify-start my-2" />
            <p className="font-sans text-sm text-gray-700 leading-relaxed font-light">
              Nos designers puisent leur inspiration dans la majesté de l’Empire de Mansa Musa, dont la prodigalité et le goût du raffinement émerveillèrent le monde au XIVe siècle.
            </p>
            <p className="font-sans text-sm text-gray-600 leading-relaxed font-light">
              Chaque coupe est soigneusement sculptée pour magnifier la stature de celui ou celle qui la porte : des kimonos d’apparat aux vestes structurées, chaque pièce impose le respect et sublime votre présence.
            </p>

            <div className="pt-4">
              <Link href="/boutique">
                <Button variant="gold" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Découvrir les Créations
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
