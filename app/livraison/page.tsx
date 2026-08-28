import React from 'react';
import prisma from '@/lib/prisma';
import { formatPrice } from '@/lib/utils';
import { Truck, ShieldCheck, Clock, Globe, MapPin } from 'lucide-react';
import { BogolanBorder, BogolanDivider } from '@/components/ui/BogolanPattern';

export const metadata = {
  title: 'Expédition & Zones de Livraison | Mandé Héritage',
  description: 'Découvrez nos zones de livraison, tarifs et délais d’expédition au Mali, en Afrique et à l’International.',
};

export default async function LivraisonPage() {
  const zones = await prisma.shippingZone.findMany({
    where: { isActive: true },
    orderBy: { price: 'asc' },
  });

  return (
    <div className="pt-24 min-h-screen bg-mande-ivory">
      {/* Header */}
      <div className="bg-mande-ivoryLight py-16 border-b border-mande-ivoryDark text-center px-4">
        <div className="max-w-3xl mx-auto">
          <span className="text-xs uppercase tracking-[0.25em] text-mande-gold font-sans font-semibold">
            Expédition Sécurisée & Suivie
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold uppercase tracking-wider text-mande-black mt-2">
            Livraison & Tarifs
          </h1>
          <BogolanDivider variant="gold" className="my-3" />
          <p className="text-xs sm:text-sm text-gray-600 font-sans font-light max-w-xl mx-auto">
            Nous expédions vos créations d’exception dans le monde entier avec le plus grand soin et des emballages de prestige.
          </p>
        </div>
      </div>

      <BogolanBorder className="opacity-30 text-mande-gold" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Active Zones Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {zones.map((zone) => (
            <div
              key={zone.id}
              className="bg-white p-8 border border-mande-ivoryDark hover:border-mande-gold shadow-sm transition-all duration-300 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-mande-ivoryDark">
                <h3 className="font-serif text-xl font-bold text-mande-black">
                  {zone.zoneName}
                </h3>
                <span className="font-serif text-lg font-bold text-mande-earth">
                  {formatPrice(zone.price)}
                </span>
              </div>

              <div className="space-y-2 text-xs font-sans text-gray-600">
                <div className="flex items-start gap-2">
                  <Globe className="w-4 h-4 text-mande-gold flex-shrink-0 mt-0.5" />
                  <span><strong>Pays & Régions couverts :</strong> {zone.countries}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-mande-gold flex-shrink-0" />
                  <span><strong>Délai indicatif :</strong> {zone.estimatedDays}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-mande-gold flex-shrink-0" />
                  <span>Numéro de suivi transmis dès l’expédition</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Reassurance Policy */}
        <div className="bg-mande-black text-mande-ivory p-8 sm:p-12 border border-mande-gold/30 shadow-card">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-none bg-mande-gold/15 border border-mande-gold/40 text-mande-gold flex items-center justify-center mx-auto mb-3">
                <Truck className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-base font-bold uppercase tracking-wider text-mande-ivory">
                Livraison Gratuite
              </h4>
              <p className="text-xs text-gray-300 font-sans font-light">
                Offerte sur toutes les commandes à destination du Mali à partir de 100 000 FCFA.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-12 h-12 rounded-none bg-mande-gold/15 border border-mande-gold/40 text-mande-gold flex items-center justify-center mx-auto mb-3">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-base font-bold uppercase tracking-wider text-mande-ivory">
                Emballage Haute Couture
              </h4>
              <p className="text-xs text-gray-300 font-sans font-light">
                Chaque pièce est enveloppée dans du papier de soie et livrée dans son coffret ou pochon Mandé Héritage.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-12 h-12 rounded-none bg-mande-gold/15 border border-mande-gold/40 text-mande-gold flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-base font-bold uppercase tracking-wider text-mande-ivory">
                Conciergerie 7j/7
              </h4>
              <p className="text-xs text-gray-300 font-sans font-light">
                Notre équipe est joignable en continu sur WhatsApp pour le suivi personnalisé de votre colis.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
