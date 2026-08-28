import React from 'react';
import { Metadata } from 'next';
import { WishlistClient } from '@/components/shop/WishlistClient';

export const metadata: Metadata = {
  title: 'Mes Coups de Cœur & Favoris | Mandé Héritage',
  description:
    'Retrouvez vos créations d’exception favorites chez Maison Mandé Héritage. Partagez votre liste de souhaits et transférez-les dans votre panier.',
};

export default function FavorisPage() {
  return <WishlistClient />;
}
