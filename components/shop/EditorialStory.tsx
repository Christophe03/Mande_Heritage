import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { BogolanDivider } from '../ui/BogolanPattern';

export function EditorialStory() {
  return (
    <section className="py-24 bg-mande-ivory overflow-hidden border-t border-mande-ivoryDark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image composition */}
          <div className="relative">
            {/* Main large photo */}
            <div className="relative h-[480px] sm:h-[560px] w-full border border-mande-sandDark shadow-card overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1000&auto=format&fit=crop"
                alt="Maître artisan tisserand Mandé Héritage"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>

            {/* Overlaid secondary image card */}
            <div className="absolute -bottom-8 -right-4 sm:-right-8 w-48 sm:w-64 h-56 sm:h-72 border-4 border-mande-ivory bg-mande-black shadow-2xl hidden sm:block overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600&auto=format&fit=crop"
                alt="Détail broderie Bôkôlan"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-3">
                <span className="text-[10px] text-mande-gold font-sans uppercase tracking-widest font-semibold">
                  Tissage Manuel &bull; San, Mali
                </span>
              </div>
            </div>

            {/* Floating Heritage Seal */}
            <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full bg-mande-black border-2 border-mande-gold flex flex-col items-center justify-center text-center p-2 shadow-xl text-mande-ivory hidden md:flex">
              <span className="text-[8px] tracking-[0.2em] uppercase text-mande-gold">Atelier</span>
              <span className="font-serif text-base font-bold text-mande-gold">100%</span>
              <span className="text-[8px] tracking-wider uppercase text-gray-300">Artisanal</span>
            </div>
          </div>

          {/* Text Editorial Content */}
          <div className="space-y-6 lg:pl-6">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-mande-gold font-sans font-semibold">
              <span>Section Éditoriale</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-wider text-mande-black leading-tight">
              Notre Héritage, Notre Fierté
            </h2>

            <BogolanDivider variant="gold" className="justify-start my-2" />

            <p className="font-sans text-sm sm:text-base text-gray-700 leading-relaxed font-light">
              Née au carrefour de l’empire du Mali et de la scène internationale contemporaine, la Maison <strong>Mandé Héritage</strong> élève l’art du textile africain au rang des plus grandes maisons de couture.
            </p>

            <p className="font-sans text-sm text-gray-600 leading-relaxed font-light">
              Nous refusons les raccourcis synthétiques. Chaque mètre de nos cotonnades est filé au fuseau par des coopératives de femmes dans le terroir malien, puis teinté dans le respect des cycles naturels de fermentation avec les limons fertilisants du fleuve Niger.
            </p>

            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-mande-ivoryDark">
              <div>
                <h4 className="font-serif text-base font-bold text-mande-earth mb-1">
                  Éthique & Dignité
                </h4>
                <p className="text-xs text-gray-500 font-sans leading-relaxed">
                  Rémunération équitable de nos 120 artisans partenaires et valorisation de leur savoir-faire.
                </p>
              </div>
              <div>
                <h4 className="font-serif text-base font-bold text-mande-earth mb-1">
                  Luxe Éco-Conscient
                </h4>
                <p className="text-xs text-gray-500 font-sans leading-relaxed">
                  Pigments 100% végétaux et minéraux sans aucun additif chimique polluant.
                </p>
              </div>
            </div>

            <div className="pt-4">
              <Link href="/notre-histoire">
                <Button variant="dark" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Découvrir Notre Histoire Complète
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
