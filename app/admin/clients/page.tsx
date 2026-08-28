import React from 'react';
import prisma from '@/lib/prisma';
import { ClientsManagement } from '@/components/admin/ClientsManagement';

export const metadata = {
  title: 'Clients & Membres VIP | Admin Mandé Héritage',
};

export default async function AdminClientsPage() {
  const clients = await prisma.user.findMany({
    where: { role: 'CLIENT' },
    include: {
      orders: {
        orderBy: { createdAt: 'desc' },
      },
      addresses: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return <ClientsManagement initialClients={clients} />;
}
