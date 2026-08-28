import React from 'react';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { OrderConfirmationClient } from '@/components/shop/OrderConfirmationClient';

interface OrderConfirmationPageProps {
  params: { id: string };
}

export default async function OrderConfirmationPage({ params }: OrderConfirmationPageProps) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      items: {
        include: { product: true },
      },
    },
  });

  if (!order) {
    notFound();
  }

  return <OrderConfirmationClient order={order} />;
}
