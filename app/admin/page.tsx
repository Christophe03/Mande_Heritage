import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import prisma from '@/lib/prisma';
import { formatPrice, formatDate, safeJsonParse } from '@/lib/utils';
import { 
  DollarSign, 
  ShoppingBag, 
  Package, 
  Users, 
  AlertTriangle, 
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle,
  Tag,
  FileText,
  Truck,
  PlusCircle,
  Sparkles,
  Crown
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default async function AdminDashboardPage() {
  // Aggregate KPI stats
  const totalOrders = await prisma.order.count();
  const pendingOrders = await prisma.order.count({
    where: { status: { in: ['NOUVELLE', 'CONFIRMEE', 'EN_PREPARATION'] } },
  });

  const orders = await prisma.order.findMany();
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  const totalClients = await prisma.user.count({
    where: { role: 'CLIENT' },
  });

  const totalProducts = await prisma.product.count();

  const lowStockProducts = await prisma.product.findMany({
    where: { stock: { lte: 5 } },
    take: 6,
    include: { category: true },
  });

  const recentOrders = await prisma.order.findMany({
    take: 6,
    orderBy: { createdAt: 'desc' },
    include: {
      items: { include: { product: true } },
    },
  });

  return (
    <div className="space-y-10">
      {/* Top Executive Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-mande-gold font-sans font-semibold">
            Direction Générale & Tableau de Bord
          </span>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold uppercase tracking-wider text-mande-ivory mt-1">
            Maison Mandé Héritage &bull; ERP
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/commandes">
            <Button variant="gold" size="sm" leftIcon={<ShoppingBag className="w-4 h-4" />}>
              Gérer les Commandes
            </Button>
          </Link>
          <Link href="/admin/produits">
            <Button variant="outline" size="sm" leftIcon={<PlusCircle className="w-4 h-4" />} className="text-mande-sand border-mande-surface hover:border-mande-gold hover:text-mande-gold">
              Nouveau Produit
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-mande-dark p-6 border border-mande-surface/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-gray-400 text-xs uppercase tracking-wider font-sans">
            <span>Chiffre d’Affaires Total</span>
            <div className="w-8 h-8 bg-mande-gold/15 text-mande-gold flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-mande-gold">
            {formatPrice(totalRevenue)}
          </p>
          <p className="text-[11px] text-gray-400 font-sans">{totalOrders} commandes enregistrées</p>
        </div>

        {/* Pending Orders */}
        <div className="bg-mande-dark p-6 border border-amber-500/30 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-amber-400 text-xs uppercase tracking-wider font-sans">
            <span>Commandes en Atelier</span>
            <div className="w-8 h-8 bg-amber-500/15 text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-amber-400">
            {pendingOrders}
          </p>
          <p className="text-[11px] text-gray-400 font-sans">À confectionner ou expédier</p>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-mande-dark p-6 border border-red-500/30 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-red-400 text-xs uppercase tracking-wider font-sans">
            <span>Alertes Stock (&le; 5)</span>
            <div className="w-8 h-8 bg-red-500/15 text-red-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-red-400">
            {lowStockProducts.length}
          </p>
          <p className="text-[11px] text-gray-400 font-sans">Pièces nécessitant réassort</p>
        </div>

        {/* Total Clients */}
        <div className="bg-mande-dark p-6 border border-mande-surface/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-gray-400 text-xs uppercase tracking-wider font-sans">
            <span>Clientèle & Membres</span>
            <div className="w-8 h-8 bg-purple-500/15 text-purple-400 flex items-center justify-center">
              <Crown className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-mande-ivory">
            {totalClients}
          </p>
          <p className="text-[11px] text-gray-400 font-sans">{totalProducts} créations au catalogue</p>
        </div>
      </div>

      {/* Quick Access Action Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <Link
          href="/admin/commandes"
          className="bg-mande-dark p-4 border border-mande-surface hover:border-mande-gold transition-all text-center group flex flex-col items-center justify-center space-y-2"
        >
          <ShoppingBag className="w-5 h-5 text-mande-gold group-hover:scale-110 transition-transform" />
          <span className="text-xs uppercase font-sans font-semibold text-mande-ivory">Commandes</span>
        </Link>

        <Link
          href="/admin/produits"
          className="bg-mande-dark p-4 border border-mande-surface hover:border-mande-gold transition-all text-center group flex flex-col items-center justify-center space-y-2"
        >
          <Package className="w-5 h-5 text-mande-gold group-hover:scale-110 transition-transform" />
          <span className="text-xs uppercase font-sans font-semibold text-mande-ivory">Produits</span>
        </Link>

        <Link
          href="/admin/clients"
          className="bg-mande-dark p-4 border border-mande-surface hover:border-mande-gold transition-all text-center group flex flex-col items-center justify-center space-y-2"
        >
          <Users className="w-5 h-5 text-mande-gold group-hover:scale-110 transition-transform" />
          <span className="text-xs uppercase font-sans font-semibold text-mande-ivory">Clients & VIP</span>
        </Link>

        <Link
          href="/admin/promotions"
          className="bg-mande-dark p-4 border border-mande-surface hover:border-mande-gold transition-all text-center group flex flex-col items-center justify-center space-y-2"
        >
          <Tag className="w-5 h-5 text-mande-gold group-hover:scale-110 transition-transform" />
          <span className="text-xs uppercase font-sans font-semibold text-mande-ivory">Codes Promo</span>
        </Link>

        <Link
          href="/admin/contenu"
          className="bg-mande-dark p-4 border border-mande-surface hover:border-mande-gold transition-all text-center group flex flex-col items-center justify-center space-y-2"
        >
          <FileText className="w-5 h-5 text-mande-gold group-hover:scale-110 transition-transform" />
          <span className="text-xs uppercase font-sans font-semibold text-mande-ivory">Journal & Lignes</span>
        </Link>

        <Link
          href="/admin/livraison"
          className="bg-mande-dark p-4 border border-mande-surface hover:border-mande-gold transition-all text-center group flex flex-col items-center justify-center space-y-2"
        >
          <Truck className="w-5 h-5 text-mande-gold group-hover:scale-110 transition-transform" />
          <span className="text-xs uppercase font-sans font-semibold text-mande-ivory">Logistique</span>
        </Link>
      </div>

      {/* Main Two Column Area: Recent Orders & Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-bold uppercase tracking-wider text-mande-ivory flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-mande-gold" />
              <span>Dernières Commandes Passées</span>
            </h2>
            <Link
              href="/admin/commandes"
              className="text-xs text-mande-gold hover:underline flex items-center gap-1 font-sans uppercase tracking-wider"
            >
              <span>Voir tout</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-mande-dark border border-mande-surface/80 overflow-x-auto shadow-sm">
            <table className="w-full text-xs text-left font-sans">
              <thead className="text-gray-400 uppercase tracking-wider border-b border-mande-surface bg-mande-surface/30">
                <tr>
                  <th className="p-3">Numéro</th>
                  <th className="p-3">Client</th>
                  <th className="p-3">Articles</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-mande-surface">
                {recentOrders.map((ord) => {
                  const addr = safeJsonParse<{ fullName: string; city: string }>(ord.shippingAddress, {
                    fullName: 'Client Mandé',
                    city: 'Bamako',
                  });

                  return (
                    <tr key={ord.id} className="hover:bg-mande-surface/30 transition-colors">
                      <td className="p-3 font-mono font-bold text-mande-gold">
                        <Link href="/admin/commandes" className="hover:underline">
                          {ord.orderNumber}
                        </Link>
                      </td>
                      <td className="p-3">
                        <p className="font-serif font-bold text-mande-ivory">{addr.fullName}</p>
                        <p className="text-[10px] text-gray-400">{addr.city}</p>
                      </td>
                      <td className="p-3 text-gray-300 font-mono">
                        {ord.items.length} pièce(s)
                      </td>
                      <td className="p-3 font-serif font-bold text-mande-gold">
                        {formatPrice(ord.total)}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 text-[9px] uppercase font-bold border ${
                            ord.status === 'LIVREE'
                              ? 'bg-green-500/20 text-green-400 border-green-500/30'
                              : ord.status === 'EXPEDIEE'
                              ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
                              : ord.status === 'EN_PREPARATION'
                              ? 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                              : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                          }`}
                        >
                          {ord.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts (1 Col) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-bold uppercase tracking-wider text-red-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Niveaux de Stock Critiques</span>
            </h2>
            <Link
              href="/admin/produits"
              className="text-xs text-mande-gold hover:underline flex items-center gap-1 font-sans uppercase tracking-wider"
            >
              <span>Inventaire</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-mande-dark border border-mande-surface/80 divide-y divide-mande-surface shadow-sm">
            {lowStockProducts.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-500 font-sans">
                Tous les stocks sont à des niveaux optimaux.
              </div>
            ) : (
              lowStockProducts.map((p) => {
                const images = safeJsonParse<string[]>(p.images, []);
                const firstImg = images[0] || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=200';

                return (
                  <div key={p.id} className="p-3.5 flex items-center justify-between gap-3 hover:bg-mande-surface/20 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-12 bg-mande-surface border border-mande-surface overflow-hidden flex-shrink-0">
                        <Image src={firstImg} alt={p.name} fill className="object-cover" />
                      </div>
                      <div className="text-xs">
                        <p className="font-serif font-bold text-mande-ivory line-clamp-1">{p.name}</p>
                        <p className="text-[10px] text-gray-400">{p.category?.name}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="px-2 py-0.5 bg-red-500/20 text-red-400 border border-red-500/40 text-[10px] font-mono font-bold block mb-1">
                        {p.stock === 0 ? 'Rupture' : `${p.stock} ex.`}
                      </span>
                      <Link href="/admin/produits" className="text-[10px] text-mande-gold hover:underline">
                        Ajuster &rarr;
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
