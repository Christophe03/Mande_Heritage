import React from 'react';
import { Metadata } from 'next';
import { SymbolsGuideClient } from '@/components/shop/SymbolsGuideClient';

export const metadata: Metadata = {
  title: 'Le Livre des Symboles du Bôkôlan | Mandé Héritage',
  description:
    'Découvrez la signification secrète et sacrée des motifs géométriques Bôkôlan : Tiranké, Koumi Dio, Gana Dio, Mansa Kourou et Sigui.',
};

export default function SymbolsPage() {
  return <SymbolsGuideClient />;
}
