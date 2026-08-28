import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      fullName,
      email,
      phone,
      showroomLocation,
      experienceType,
      appointmentDate,
      timeSlot,
      guestCount,
      notes,
    } = body;

    if (!fullName || !phone || !showroomLocation || !appointmentDate || !timeSlot) {
      return NextResponse.json(
        { error: 'Veuillez renseigner tous les champs obligatoires.' },
        { status: 400 }
      );
    }

    const appointmentRef = `RDV-${Math.floor(100000 + Math.random() * 900000)}`;

    return NextResponse.json({
      success: true,
      appointment: {
        id: appointmentRef,
        reference: appointmentRef,
        fullName,
        email,
        phone,
        showroomLocation,
        experienceType,
        appointmentDate,
        timeSlot,
        guestCount: guestCount || 1,
        notes: notes || '',
        status: 'CONFIRMED',
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la réservation de votre rendez-vous privé.' },
      { status: 500 }
    );
  }
}
