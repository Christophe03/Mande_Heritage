import React from 'react';
import { Metadata } from 'next';
import { AppointmentBookingClient } from '@/components/shop/AppointmentBookingClient';

export const metadata: Metadata = {
  title: 'Rendez-vous Privé & Essayage en Salon | Mandé Héritage',
  description:
    'Réservez votre essayage privé haute couture dans nos salons de Bamako ACI 2000, Paris Le Marais, Abidjan ou en visioconférence personnalisée avec nos maîtres tailleurs.',
};

export default function AppointmentPage() {
  return <AppointmentBookingClient />;
}
