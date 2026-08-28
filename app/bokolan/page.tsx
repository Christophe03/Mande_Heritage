import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles, Droplets, Sun, Layers, Shield } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { BogolanBorder, BogolanDivider } from '@/components/ui/BogolanPattern';

export const metadata = {
  title: 'L’Art du Bôkôlan Sacré | Mandé Héritage',
  description:
    'Plongez au cœur du Bôkôlan traditionnel : alchimie de la terre sacrée du fleuve Niger, teintures végétales et géométrie protectrice.',
};

export default function BokolanPage() {
  const symbols = [
    {
      name: 'Le Cheval de Bataille (So)',
      meaning: 'Symbole suprême de bravoure, de loyauté et de commandement noble.',
      desc: 'Porté traditionnellement par les grands dignitaires et guides de communauté.',
    },
    {
      name: 'La Ceinture de Mariée (Biri Kolo)',
      meaning: 'Harmonie conjugale, transmission filiale et prospérité du foyer.',
      desc: 'Motif géométrique délicat tissé pour célébrer les alliances sacrées.',
    },
    {
      name: 'L’Arête du Poisson (Kulu)',
      meaning: 'Fécondité, abondance et bénédiction des eaux vives du fleuve Niger.',
      desc: 'Invoque la clémence des crues pour nourrir les récoltes du Sahel.',
    },
    {
      name: 'Le Losange Protecteur (Dunya)',
      meaning: 'Bouclier spirituel repoussant les ondes négatives et attirant la lumière.',
      desc: 'Présent aux quatre angles des tuniques d’apparat des rois du Mandé.',
    },
  ];

  return (
    <div className="pt-24 min-h-screen bg-mande-ivory">
      {/* Hero Header */}
      <section className="relative h-[70vh] flex items-center justify-center bg-mande-black text-center text-mande-ivory overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1920&auto=format&fit=crop"
          alt="L’Art du Bôkôlan Mandé"
          fill
          priority
          className="object-cover opacity-40 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-mande-black via-black/50 to-black/80" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
          <span className="inline-block text-xs uppercase tracking-[0.3em] text-mande-gold font-sans font-semibold mb-3">
            Patrimoine Textile Immatériel
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold uppercase tracking-wider leading-tight text-mande-ivory">
            L’Art Sacré du Bôkôlan
          </h1>
          <BogolanDivider variant="gold" className="my-4" />
          <p className="font-sans text-sm sm:text-base text-mande-sandLight font-light max-w-2xl mx-auto">
            Une écriture vivante où la terre, le soleil et l’esprit des anciens se rencontrent pour tisser l’excellence.
          </p>
        </div>
      </section>

      <BogolanBorder className="opacity-30 text-mande-gold" />

      {/* 1. The Alchemy of Bôkôlan */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-mande-gold font-sans font-semibold">
            Alchimie Végétale & Minérale
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold uppercase tracking-wider text-mande-black mt-2">
            La Rencontre des Éléments Pures
          </h2>
          <BogolanDivider variant="gold" className="my-4" />
          <p className="font-sans text-sm text-gray-600 font-light leading-relaxed">
            Le véritable Bôkôlan est une prouesse de chimie naturelle. Ni pigment synthétique, ni fixateur artificiel : uniquement la générosité de la terre malienne.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white p-8 border border-mande-ivoryDark shadow-sm space-y-4">
            <div className="w-14 h-14 bg-mande-sand/20 text-mande-earth flex items-center justify-center border border-mande-sand">
              <Layers className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-xl font-bold text-mande-black">
              1. Le Coton Brut Filé Main
            </h3>
            <p className="font-sans text-xs text-gray-600 leading-relaxed font-light">
              Cultivé dans le respect des sols maliens, le coton est égrené manuellement puis filé au fuseau par les femmes du village avant d’être tissé en bandes de 10 à 15 cm sur d’antiques métiers à pédales.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-8 border border-mande-ivoryDark shadow-sm space-y-4">
            <div className="w-14 h-14 bg-mande-sand/20 text-mande-earth flex items-center justify-center border border-mande-sand">
              <Droplets className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-xl font-bold text-mande-black">
              2. Le Bain Mordant de N’Galama
            </h3>
            <p className="font-sans text-xs text-gray-600 leading-relaxed font-light">
              Les feuilles de l’arbre <em>Anogeissus leiocarpus</em> (N’galama) sont bouillies pour extraire un tanin naturel ambré. Le tissu y est immergé plusieurs fois, lui conférant sa teinte dorée et préparant la fixation de la boue.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-8 border border-mande-ivoryDark shadow-sm space-y-4">
            <div className="w-14 h-14 bg-mande-sand/20 text-mande-earth flex items-center justify-center border border-mande-sand">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-xl font-bold text-mande-black">
              3. L’Argile Fermentée du Niger
            </h3>
            <p className="font-sans text-xs text-gray-600 leading-relaxed font-light">
              Prélevée dans les méandres calmes du fleuve Niger, la boue est conservée dans des jarres pour fermenter pendant un an. Riche en oxyde de fer, elle réagit au contact du tanin pour imprimer un noir éternel.
            </p>
          </div>
        </div>
      </section>

      {/* 2. The Sacred Motifs */}
      <section className="py-24 bg-mande-black text-mande-ivory border-t border-b border-mande-gold/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-[0.25em] text-mande-gold font-sans font-semibold">
              Alphabet Sacré Mandingue
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold uppercase tracking-wider text-mande-ivory mt-2">
              Le Langage des Motifs
            </h2>
            <BogolanDivider variant="gold" className="my-4" />
            <p className="font-sans text-xs sm:text-sm text-mande-sandLight font-light">
              Dans la culture Mandé, le Bôkôlan ne se contente pas d’habiller : il dialogue avec celui qui sait déchiffrer ses lignes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {symbols.map((sym, idx) => (
              <div
                key={idx}
                className="bg-mande-surface/80 border border-mande-gold/30 p-6 hover:border-mande-gold transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="text-mande-gold font-serif text-2xl font-bold mb-2">
                    ◆ 0{idx + 1}
                  </div>
                  <h3 className="font-serif text-base font-bold text-mande-ivory mb-2">
                    {sym.name}
                  </h3>
                  <p className="font-sans text-xs text-mande-sandLight font-light mb-3">
                    {sym.meaning}
                  </p>
                </div>
                <p className="text-[11px] text-gray-400 font-sans border-t border-mande-surface pt-3">
                  {sym.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link href="/boutique">
              <Button variant="gold" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Découvrir Toutes les Créations en Bôkôlan
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
