import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { formatPrice, formatDate } from '@/lib/utils';
import { 
  User, 
  ShoppingBag, 
  Heart, 
  MapPin, 
  Package, 
  ArrowRight, 
  Clock, 
  ShieldCheck,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { BogolanBorder, BogolanDivider } from '@/components/ui/BogolanPattern';

export default async function ComptePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/connexion?callbackUrl=/compte');
  }

  const userId = (session.user as any).id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      addresses: true,
      orders: {
        orderBy: { createdAt: 'desc' },
        take: 3,
        include: { items: { include: { product: true } } },
      },
      _count: {
        select: { orders: true, wishlist: true },
      },
    },
  });

  if (!user) {
    redirect('/connexion');
  }

  return (
    <div className="pt-24 min-h-screen bg-mande-ivory pb-20">
      {/* Header */}
      <div className="bg-mande-ivoryLight py-12 border-b border-mande-ivoryDark px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-mande-gold font-sans font-semibold">
              Espace Client Privilège
            </span>
            <h1 className="font-serif text-2xl sm:text-4xl font-bold uppercase tracking-wider text-mande-black mt-1">
              Bienvenue, {user.name}
            </h1>
            <p className="text-xs text-gray-500 font-sans mt-0.5">{user.email}</p>
          </div>

          <div className="flex gap-3">
            {user.role === 'ADMIN' && (
              <Link href="/admin">
                <Button variant="gold" size="sm">
                  Accéder au Back-Office Admin
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      <BogolanBorder className="opacity-30 text-mande-gold" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <Link
            href="/compte/commandes"
            className="bg-white p-6 border border-mande-ivoryDark hover:border-mande-gold shadow-sm transition-all duration-300 group flex items-center justify-between"
          >
            <div className="space-y-1">
              <span className="text-xs text-gray-500 font-sans uppercase tracking-wider">
                Commandes passées
              </span>
              <p className="font-serif text-3xl font-bold text-mande-black">
                {user._count.orders}
              </p>
            </div>
            <div className="w-12 h-12 rounded-none bg-mande-gold/15 text-mande-gold flex items-center justify-center group-hover:scale-110 transition-transform">
              <Package className="w-6 h-6" />
            </div>
          </Link>

          <Link
            href="/compte/favoris"
            className="bg-white p-6 border border-mande-ivoryDark hover:border-mande-gold shadow-sm transition-all duration-300 group flex items-center justify-between"
          >
            <div className="space-y-1">
              <span className="text-xs text-gray-500 font-sans uppercase tracking-wider">
                Créations favorites
              </span>
              <p className="font-serif text-3xl font-bold text-mande-black">
                {user._count.wishlist}
              </p>
            </div>
            <div className="w-12 h-12 rounded-none bg-mande-gold/15 text-mande-gold flex items-center justify-center group-hover:scale-110 transition-transform">
              <Heart className="w-6 h-6" />
            </div>
          </Link>

          <div className="bg-mande-black text-mande-ivory p-6 border border-mande-gold/30 shadow-card flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-mande-gold font-sans uppercase tracking-wider">
                Statut Membre
              </span>
              <p className="font-serif text-xl font-bold text-mande-ivory">
                {user.role === 'ADMIN' ? 'Directoire Maison' : 'Cercle Privé Mandé'}
              </p>
            </div>
            <div className="w-12 h-12 rounded-none bg-mande-gold/20 text-mande-gold flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* 2 Columns: Recent Orders & Saved Addresses */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Recent Orders (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-mande-ivoryDark">
              <h3 className="font-serif text-xl font-bold uppercase tracking-wider text-mande-black">
                Dernières Commandes
              </h3>
              <Link href="/compte/commandes" className="text-xs text-mande-gold hover:underline font-sans uppercase tracking-wider">
                Historique complet →
              </Link>
            </div>

            {user.orders.length === 0 ? (
              <div className="bg-white p-10 border border-mande-ivoryDark text-center space-y-4 shadow-sm">
                <ShoppingBag className="w-10 h-10 text-gray-400 mx-auto" />
                <h4 className="font-serif text-base font-bold text-mande-black">
                  Vous n’avez pas encore passé de commande
                </h4>
                <p className="text-xs text-gray-500 font-sans max-w-sm mx-auto font-light">
                  Explorez la boutique et découvrez nos pièces uniques en Bôkôlan véritable.
                </p>
                <Link href="/boutique">
                  <Button variant="gold" size="sm">
                    Découvrir la Boutique
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {user.orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white p-6 border border-mande-ivoryDark hover:border-mande-gold shadow-sm transition-all duration-300 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-mande-ivoryDark text-xs font-sans">
                      <div>
                        <span className="font-mono font-bold text-mande-black text-sm">
                          {order.orderNumber}
                        </span>
                        <span className="text-gray-400 ml-2">({formatDate(order.createdAt)})</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-0.5 bg-mande-gold/15 text-mande-gold font-bold uppercase text-[10px] border border-mande-gold/30">
                          {order.status}
                        </span>
                        <span className="font-serif font-bold text-mande-earth text-sm">
                          {formatPrice(order.total)}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs text-gray-600 font-sans space-y-1">
                      <p>
                        <strong>{(order.items || []).length} article(s) :</strong>{' '}
                        {(order.items || []).map((i: any) => i.product?.name).filter(Boolean).join(', ')}
                      </p>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <Link
                        href={`/commande/${order.id}`}
                        className="text-xs uppercase tracking-wider text-mande-gold font-semibold hover:underline flex items-center gap-1 font-sans"
                      >
                        <span>Suivre la commande</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Saved Addresses & Profile */}
          <div className="space-y-6">
            <div className="bg-white p-6 border border-mande-ivoryDark shadow-sm space-y-4">
              <h3 className="font-serif text-base font-bold uppercase tracking-wider text-mande-black pb-3 border-b border-mande-ivoryDark flex items-center gap-2">
                <MapPin className="w-4 h-4 text-mande-gold" />
                <span>Adresse Enregistrée</span>
              </h3>

              {user.addresses.length > 0 ? (
                <div className="text-xs text-gray-600 font-sans space-y-1">
                  <p className="font-bold text-mande-black">{user.addresses[0].fullName}</p>
                  <p>{user.addresses[0].address}</p>
                  <p>{user.addresses[0].city}, {user.addresses[0].country}</p>
                  <p>Tél : {user.addresses[0].phone || user.phone}</p>
                </div>
              ) : (
                <p className="text-xs text-gray-500 font-sans font-light">
                  Votre adresse sera automatiquement enregistrée lors de votre première commande.
                </p>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 border border-mande-ivoryDark shadow-sm space-y-3 font-sans text-xs">
              <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-mande-black pb-2 border-b border-mande-ivoryDark">
                Assistance Personnalisée
              </h4>
              <p className="text-gray-500 font-light">
                Une question sur une pièce ou un projet de commande sur-mesure ?
              </p>
              <a
                href="https://wa.me/22370000001"
                target="_blank"
                rel="noreferrer"
                className="block text-center py-2.5 px-4 bg-mande-black text-mande-gold font-bold uppercase tracking-wider hover:bg-mande-gold hover:text-mande-black transition-colors"
              >
                Contacter le Concierge
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
