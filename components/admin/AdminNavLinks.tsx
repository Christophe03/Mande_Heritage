'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Tag, 
  FileText, 
  Truck 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const ADMIN_LINKS = [
  { name: 'Tableau de Bord', href: '/admin', icon: LayoutDashboard },
  { name: 'Gestion Produits', href: '/admin/produits', icon: Package },
  { name: 'Commandes', href: '/admin/commandes', icon: ShoppingBag },
  { name: 'Clients', href: '/admin/clients', icon: Users },
  { name: 'Codes Promo', href: '/admin/promotions', icon: Tag },
  { name: 'Contenu & Journal', href: '/admin/contenu', icon: FileText },
  { name: 'Zones de Livraison', href: '/admin/livraison', icon: Truck },
];

export function AdminNavLinks() {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {ADMIN_LINKS.map((link) => {
        const Icon = link.icon;
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.name}
            href={link.href}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 text-xs uppercase tracking-wider font-sans transition-all duration-200',
              isActive
                ? 'bg-mande-surface text-mande-gold font-bold border-l-2 border-mande-gold'
                : 'text-gray-400 hover:text-mande-ivory hover:bg-mande-surface/50'
            )}
          >
            <Icon className={cn('w-4 h-4', isActive ? 'text-mande-gold' : 'text-gray-400')} />
            <span>{link.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
