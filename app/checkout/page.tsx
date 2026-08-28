import React from 'react';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { CheckoutForm } from '@/components/shop/CheckoutForm';
import { BogolanBorder, BogolanDivider } from '@/components/ui/BogolanPattern';

export const metadata = {
  title: 'Paiement Sécurisé & Livraison | Mandé Héritage',
  description: 'Finalisez votre acquisition de pièces d’exception Mandé Héritage.',
};

export default async function CheckoutPage() {
  const session = await getServerSession(authOptions);

  let shippingZones: any[] = [];
  try {
    shippingZones = await prisma.shippingZone.findMany({
      where: { isActive: true },
      orderBy: { price: 'asc' },
    });
  } catch (e) {
    console.error('Error loading shipping zones:', e);
  }

  return (
    <div className="pt-24 min-h-screen bg-mande-ivory">
      {/* Header */}
      <div className="bg-mande-ivoryLight py-10 border-b border-mande-ivoryDark text-center px-4">
        <div className="max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-[0.25em] text-mande-gold font-sans font-semibold">
            Protocole Sécurisé 256 bits
          </span>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold uppercase tracking-wider text-mande-black mt-2">
            Finalisation de Commande
          </h1>
          <BogolanDivider variant="gold" className="my-3" />
        </div>
      </div>

      <BogolanBorder className="opacity-25 text-mande-gold" />

      {/* Checkout Form */}
      <CheckoutForm shippingZones={shippingZones} userSession={session?.user} />
    </div>
  );
}
