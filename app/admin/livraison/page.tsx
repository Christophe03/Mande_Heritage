import React from 'react';
import prisma from '@/lib/prisma';
import { ShippingManagement } from '@/components/admin/ShippingManagement';

export const metadata = {
  title: 'Zones & Tarifs de Livraison | Admin Mandé Héritage',
};

export default async function AdminLivraisonPage() {
  const zones = await prisma.shippingZone.findMany({
    orderBy: { price: 'asc' },
  });

  return <ShippingManagement initialZones={zones} />;
}
