import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { formatPrice, formatDate, safeJsonParse } from '@/lib/utils';
import { ArrowLeft, ArrowRight, Package, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { BogolanBorder, BogolanDivider } from '@/components/ui/BogolanPattern';

export default async function MesCommandesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/connexion?callbackUrl=/compte/commandes');
  }

  const userId = (session.user as any).id;

  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: { product: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="pt-24 min-h-screen bg-mande-ivory pb-20">
      {/* Header */}
      <div className="bg-mande-ivoryLight py-12 border-b border-mande-ivoryDark px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <Link
              href="/compte"
              className="inline-flex items-center gap-1 text-xs uppercase tracking-widest text-mande-gold font-sans font-semibold mb-2 hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Retour à Mon Espace Client</span>
            </Link>
            <h1 className="font-serif text-2xl sm:text-4xl font-bold uppercase tracking-wider text-mande-black">
              Historique de mes Commandes
            </h1>
          </div>
        </div>
      </div>

      <BogolanBorder className="opacity-30 text-mande-gold" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {orders.length === 0 ? (
          <div className="bg-white p-12 border border-mande-ivoryDark text-center space-y-4 shadow-card max-w-lg mx-auto">
            <Package className="w-12 h-12 text-gray-400 mx-auto" />
            <h2 className="font-serif text-xl font-bold text-mande-black">
              Aucune commande passée pour l’instant
            </h2>
            <p className="text-xs text-gray-500 font-sans font-light">
              Parcourez nos collections et effectuez votre première acquisition.
            </p>
            <Link href="/boutique">
              <Button variant="gold" size="md">
                Découvrir la Boutique
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white border border-mande-ivoryDark shadow-sm p-6 sm:p-8 space-y-6"
              >
                {/* Order Top Summary */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-mande-ivoryDark text-xs font-sans">
                  <div>
                    <span className="font-mono text-base font-bold text-mande-black">
                      {order.orderNumber}
                    </span>
                    <p className="text-gray-500 text-[11px] mt-0.5">
                      Date de commande : {formatDate(order.createdAt)}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="px-3 py-1 bg-mande-gold/15 text-mande-gold font-bold uppercase text-[10px] border border-mande-gold/30">
                      Statut : {order.status}
                    </span>
                    <span className="font-serif text-lg font-bold text-mande-earth">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="divide-y divide-mande-ivoryDark">
                  {order.items.map((item) => {
                    const images = item.product?.images ? safeJsonParse<string[]>(item.product.images, []) : [];
                    const img = images[0] || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=200';
                    return (
                      <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="relative w-14 h-16 bg-mande-sand/10 border border-mande-ivoryDark flex-shrink-0 overflow-hidden">
                            <Image src={img} alt={item.product?.name || 'Création Mandé'} fill className="object-cover" />
                          </div>
                          <div className="text-xs">
                            <h4 className="font-serif font-bold text-mande-black">
                              {item.product?.name || 'Création Mandé'}
                            </h4>
                            <p className="text-gray-500">
                              Taille : {item.size} &bull; {item.color} &bull; Quantité : {item.quantity}
                            </p>
                          </div>
                        </div>
                        <span className="font-serif font-bold text-xs text-mande-black">
                          {formatPrice((item.unitPrice || item.price || 0) * item.quantity)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Link to order receipt */}
                <div className="pt-2 flex justify-end">
                  <Link href={`/commande/${order.id}`}>
                    <Button variant="dark-outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                      Voir la Facture & Suivi en Direct
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
