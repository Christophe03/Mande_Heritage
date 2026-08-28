import React from 'react';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Tag, 
  FileText, 
  Truck, 
  Globe, 
  LogOut, 
  ShieldAlert,
  ChevronRight
} from 'lucide-react';
import { AdminNavLinks } from '@/components/admin/AdminNavLinks';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Administration & Back-Office | Mandé Héritage',
  description: 'Tableau de bord de gestion pour la Maison Mandé Héritage.',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Security check: Must be authenticated and have ADMIN role
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    redirect('/connexion?callbackUrl=/admin');
  }

  return (
    <div className="min-h-screen bg-mande-black text-mande-ivory flex">
      {/* Sidebar */}
      <aside className="w-64 bg-mande-dark border-r border-mande-surface/80 flex flex-col justify-between p-4 hidden md:flex">
        <div className="space-y-8">
          {/* Admin Brand */}
          <div className="px-2 pt-2">
            <Link href="/admin" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 flex-shrink-0">
                <Image
                  src="/images/logo/logo.png"
                  alt="Mandé Héritage"
                  width={40}
                  height={40}
                  className="object-contain transition-transform group-hover:scale-105"
                />
              </div>
              <div>
                <span className="font-serif text-sm font-bold tracking-[0.16em] text-mande-ivory uppercase block group-hover:text-mande-gold transition-colors">
                  MANDÉ HÉRITAGE
                </span>
                <span className="text-[8px] uppercase tracking-[0.2em] text-mande-gold font-sans font-semibold block -mt-0.5">
                  Directoire &bull; Admin
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <AdminNavLinks />
        </div>

        {/* Footer actions */}
        <div className="pt-4 border-t border-mande-surface space-y-2 text-xs font-sans">
          <Link
            href="/"
            className="flex items-center gap-2.5 px-3 py-2 text-gray-400 hover:text-mande-gold hover:bg-mande-surface/50 transition-colors"
          >
            <Globe className="w-4 h-4 text-mande-gold" />
            <span>Voir la boutique publique</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#111111] overflow-y-auto">
        {/* Top bar */}
        <header className="h-16 bg-mande-dark border-b border-mande-surface/80 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs uppercase tracking-widest font-sans text-gray-400">
              Système Opérationnel &bull; Base de Données Sécurisée
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-sans">
            <div className="text-right">
              <p className="font-bold text-mande-gold">{session.user.name}</p>
              <p className="text-[10px] text-gray-400">Rôle : ADMIN DIRECTEUR</p>
            </div>
            <div className="w-9 h-9 rounded-none bg-mande-gold text-mande-black font-serif font-bold text-sm flex items-center justify-center">
              AD
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="p-6 sm:p-8 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
