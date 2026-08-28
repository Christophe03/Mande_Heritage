import React from 'react';
import prisma from '@/lib/prisma';
import { OrdersManagement } from '@/components/admin/OrdersManagement';

export const metadata = {
  title: 'Gestion des Commandes & Ventes | Admin Mandé Héritage',
};

export default async function AdminCommandesPage() {
  const orders = await prisma.order.findMany({
    include: {
      items: {
        include: { product: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      price: true,
      stock: true,
      sizes: true,
      colors: true,
      images: true,
    },
    orderBy: { name: 'asc' },
  });

  return <OrdersManagement initialOrders={orders} availableProducts={products} />;
}
