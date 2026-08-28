import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, Droplets, Sun, Layers } from 'lucide-react';
import { Button } from '../ui/Button';
import { BogolanDivider } from '../ui/BogolanPattern';

export function BokolanImmersion() {
  const steps = [
    {
      icon: Layers,
      title: '1. Le Filage & Tissage',
      desc: 'Coton biologique brut égrené et filé au fuseau, puis tissé en bandes étroites sur métiers traditionnels en bois.',
    },
    {
      icon: Droplets,
      title: '2. Le Bain de N’galama',
      desc: 'Immersion dans une décoction de feuilles riches en tanins naturels qui mordance la fibre et donne sa couleur ocre dorée.',
    },
    {
      icon: Sparkles,
      title: '3. La Boue Sacrée du Niger',
      desc: 'Application méticuleuse au roseau de la boue fermentée qui réagit chimiquement avec le fer pour imprimer le noir profond.',
    },
    {
      icon: Sun,
      title: '4. Le Séchage Solaire',
      desc: 'Exposition au soleil sahélien et rinçages multiples dans les eaux du fleuve pour fixer durablement les motifs ancestraux.',
    },
  ];

  return (
    <section className="py-24 bg-mande-black text-mande-ivory relative overflow-hidden border-t border-b border-mande-gold/30">
      {/* Background Subtle Accent */}
      <div className="absolute inset-0 opacity-15">
        <Image
          src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1920&auto=format&fit=crop"
          alt="Textile Bôkôlan texture"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-mande-black/90" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-mande-gold font-sans font-semibold">
            Immersion Culturelle & Textile
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold uppercase tracking-wider text-mande-ivory mt-2">
            L’Art Sacré du Bôkôlan
          </h2>
          <BogolanDivider variant="gold" className="my-4" />
          <p className="font-sans text-sm sm:text-base text-mande-sandLight font-light leading-relaxed">
            Dans la langue bamanan, <em>Bôkôlan</em> signifie « issu de la terre ». Plus qu’un textile, c’est une écriture cryptée et protectrice qui traverse les siècles depuis l’Empire du Mandé.
          </p>
        </div>

        {/* 4 Steps Process */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="bg-mande-surface/60 border border-mande-gold/30 p-6 hover:border-mande-gold transition-all duration-300 relative group"
              >
                <div className="w-12 h-12 rounded-none bg-mande-gold/15 border border-mande-gold/40 flex items-center justify-center text-mande-gold mb-5 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg font-bold text-mande-ivory mb-2">
                  {step.title}
                </h3>
                <p className="font-sans text-xs text-gray-300 leading-relaxed font-light">
                  {step.desc}
                </p>
                <div className="absolute top-4 right-4 text-[10px] text-mande-gold/40 font-serif font-bold">
                  0{idx + 1}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <Link href="/bokolan">
            <Button
              variant="gold"
              size="lg"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Explorer le Dossier Complet Bôkôlan
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
