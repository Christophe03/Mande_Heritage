import React from 'react';
import { Award, Feather, Scissors, Globe } from 'lucide-react';
import { BogolanDivider } from '../ui/BogolanPattern';

export function WhyMandeSection() {
  const pillars = [
    {
      icon: Award,
      title: 'Bôkôlan d’Art Certifié',
      description: 'Chaque étoffe est certifiée authentique, réalisée selon les méthodes traditionnelles sans aucun substitut synthétique.',
    },
    {
      icon: Feather,
      title: 'Fibres Pures & Éco-Luxe',
      description: 'Coton biologique récolté à la main en Afrique de l’Ouest et pigments 100% minéraux et végétaux bienfaisants.',
    },
    {
      icon: Scissors,
      title: 'Confection & Sur-Mesure',
      description: 'Des finitions intérieures soignées, des tombés irréprochables et la possibilité d’ajustement personnalisé en atelier.',
    },
    {
      icon: Globe,
      title: 'Rayonnement International',
      description: 'Une conciergerie dédiée et une expédition rapide avec numéro de suivi partout au Mali, en Afrique et dans la diaspora.',
    },
  ];

  return (
    <section className="py-20 bg-mande-ivory border-t border-mande-ivoryDark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-[0.25em] text-mande-gold font-sans font-semibold">
            Nos Engagements
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold uppercase tracking-wider text-mande-black mt-2">
            Pourquoi Choisir Mandé Héritage ?
          </h2>
          <BogolanDivider variant="gold" className="my-4" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="bg-white p-8 border border-mande-ivoryDark hover:border-mande-gold transition-all duration-300 shadow-sm flex flex-col items-center text-center group"
              >
                <div className="w-14 h-14 bg-mande-sand/20 border border-mande-sand text-mande-earth flex items-center justify-center mb-6 group-hover:bg-mande-black group-hover:text-mande-gold group-hover:border-mande-gold transition-all duration-300">
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="font-serif text-lg font-bold text-mande-black mb-2">
                  {pillar.title}
                </h3>
                <p className="font-sans text-xs text-gray-600 leading-relaxed font-light">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
