import React from 'react';
import prisma from '@/lib/prisma';
import { PromotionsManagement } from '@/components/admin/PromotionsManagement';

export const metadata = {
  title: 'Codes Promotionnels & Privilèges | Admin Mandé Héritage',
};

export default async function AdminPromotionsPage() {
  const promos = await prisma.promoCode.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return <PromotionsManagement initialPromos={promos} />;
}
