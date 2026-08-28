'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  Sparkles, 
  CheckCircle, 
  ShieldCheck, 
  Scissors, 
  Crown, 
  Coffee,
  MessageCircle,
  Printer
} from 'lucide-react';
import { BogolanBorder, BogolanDivider } from '../ui/BogolanPattern';
import { Button } from '../ui/Button';

export function AppointmentBookingClient() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<any | null>(null);

  // Form State
  const [location, setLocation] = useState('BAMAKO');
  const [experience, setExperience] = useState('SUR_MESURE');
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('11:00');
  const [guestCount, setGuestCount] = useState(1);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  const SHOWROOMS = [
    {
      id: 'BAMAKO',
      name: 'Showroom Prestige Bamako',
      city: 'Bamako, Mali',
      address: 'Quartier ACI 2000, Avenue du Mali',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=600',
      badge: 'Atelier & Showroom Principal',
    },
    {
      id: 'PARIS',
      name: 'Salon Privé Paris',
      city: 'Paris, France',
      address: 'Le Marais, 75003 Paris (Sur rendez-vous exclusif)',
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=600',
      badge: 'Salon Diaspora Europe',
    },
    {
      id: 'ABIDJAN',
      name: 'Salon Ambassade Abidjan',
      city: 'Abidjan, Côte d’Ivoire',
      address: 'Cocody Ambassades',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600',
      badge: 'Zone UEMOA',
    },
    {
      id: 'VISIO',
      name: 'Consultation Privée en Visioconférence',
      city: 'Partout dans le monde',
      address: 'Accompagnement stylistique en direct via WhatsApp / Zoom',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600',
      badge: 'Clientèle Internationale',
    },
  ];

  const EXPERIENCES = [
    {
      id: 'SUR_MESURE',
      title: 'Confection Sur-Mesure & Pièce Impériale',
      desc: 'Prise intégrale des mensurations, choix des toiles Bôkôlan exclusives et broderie d’initiales en fil d’or.',
      duration: '1h30',
      icon: Scissors,
    },
    {
      id: 'CEREMONIE',
      title: 'Cérémonie, Mariage & Tenue de Prestige',
      desc: 'Accompagnement complet pour mariés et cortèges. Silhouettes de gala coordonnées et accessoires d’apparat.',
      duration: '2h00',
      icon: Crown,
    },
    {
      id: 'DECOUVERTE',
      title: 'Essayage Privé & Nouvelle Collection',
      desc: 'Découverte exclusive des pièces uniques de la saison avec un styliste dédié et conseils personnalisés.',
      duration: '1h00',
      icon: Sparkles,
    },
  ];

  const TIME_SLOTS = ['10:00', '11:30', '14:00', '15:30', '17:00', '18:30'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !date) {
      alert('Veuillez remplir vos coordonnées et choisir une date.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          showroomLocation: SHOWROOMS.find((s) => s.id === location)?.name || location,
          experienceType: EXPERIENCES.find((e) => e.id === experience)?.title || experience,
          appointmentDate: date,
          timeSlot,
          guestCount,
          notes,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setConfirmedBooking(data.appointment);
        setStep(3);
      } else {
        alert(data.error || 'Erreur lors de la réservation.');
      }
    } catch (err) {
      console.error(err);
      alert('Une erreur réseau est survenue.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-24 min-h-screen bg-mande-ivory">
      {/* Header */}
      <div className="bg-mande-black text-mande-ivory py-16 px-4 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10 space-y-4">
          <span className="text-xs uppercase tracking-[0.3em] text-mande-gold font-sans font-semibold flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-mande-gold" />
            <span>Conciergerie Privée &bull; Maison Mandé Héritage</span>
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold uppercase tracking-wider text-mande-ivory">
            Réserver un Essayage Privé
          </h1>
          <BogolanDivider variant="gold" className="my-3" />
          <p className="text-xs sm:text-sm text-gray-300 font-sans font-light max-w-xl mx-auto">
            Vivez un moment d’exception dans nos salons de Bamako, Paris, Abidjan ou en visioconférence avec nos maîtres tailleurs.
          </p>
        </div>
      </div>

      <BogolanBorder className="opacity-40 text-mande-gold" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Step 1 & 2: Booking Wizard */}
        {step !== 3 && (
          <form onSubmit={handleSubmit} className="space-y-12">
            {/* Step Indicators */}
            <div className="flex justify-center items-center gap-4 text-xs font-sans uppercase tracking-wider">
              <button
                type="button"
                onClick={() => setStep(1)}
                className={`flex items-center gap-2 pb-2 border-b-2 font-bold ${
                  step === 1 ? 'border-mande-gold text-mande-black' : 'border-transparent text-gray-400'
                }`}
              >
                <span className="w-6 h-6 rounded-full bg-mande-gold text-mande-black flex items-center justify-center text-xs">1</span>
                <span>Lieu & Expérience</span>
              </button>
              <span className="text-gray-300">&bull;&bull;&bull;</span>
              <button
                type="button"
                onClick={() => {
                  if (date) setStep(2);
                }}
                className={`flex items-center gap-2 pb-2 border-b-2 font-bold ${
                  step === 2 ? 'border-mande-gold text-mande-black' : 'border-transparent text-gray-400'
                }`}
              >
                <span className="w-6 h-6 rounded-full bg-mande-black text-mande-gold flex items-center justify-center text-xs">2</span>
                <span>Date & Coordonnées VIP</span>
              </button>
            </div>

            {/* STEP 1: Select Showroom & Experience */}
            {step === 1 && (
              <div className="space-y-10 animate-fadeIn">
                {/* 1. Showroom Selection */}
                <div className="space-y-4">
                  <h3 className="font-serif text-lg font-bold uppercase tracking-wider text-mande-black flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-mande-gold" />
                    <span>1. Choisissez Votre Salon Privé</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {SHOWROOMS.map((sh) => (
                      <button
                        key={sh.id}
                        type="button"
                        onClick={() => setLocation(sh.id)}
                        className={`text-left p-4 border transition-all flex items-start gap-4 ${
                          location === sh.id
                            ? 'bg-white border-mande-gold ring-2 ring-mande-gold/30 shadow-card'
                            : 'bg-white/70 border-mande-ivoryDark hover:border-mande-gold/60'
                        }`}
                      >
                        <div className="relative w-20 h-24 bg-mande-sand/20 flex-shrink-0 overflow-hidden">
                          <Image src={sh.image} alt={sh.name} fill className="object-cover" />
                        </div>
                        <div className="text-xs font-sans space-y-1">
                          <span className="text-[10px] text-mande-gold font-bold uppercase tracking-wider">
                            {sh.badge}
                          </span>
                          <h4 className="font-serif font-bold text-sm text-mande-black">
                            {sh.name}
                          </h4>
                          <p className="text-gray-600">{sh.address}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Experience Selection */}
                <div className="space-y-4">
                  <h3 className="font-serif text-lg font-bold uppercase tracking-wider text-mande-black flex items-center gap-2">
                    <Crown className="w-5 h-5 text-mande-gold" />
                    <span>2. Choisissez Votre Expérience de Stylisme</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {EXPERIENCES.map((exp) => {
                      const Icon = exp.icon;
                      return (
                        <button
                          key={exp.id}
                          type="button"
                          onClick={() => setExperience(exp.id)}
                          className={`text-left p-5 border transition-all flex flex-col justify-between space-y-4 ${
                            experience === exp.id
                              ? 'bg-white border-mande-gold ring-2 ring-mande-gold/30 shadow-card'
                              : 'bg-white/70 border-mande-ivoryDark hover:border-mande-gold/60'
                          }`}
                        >
                          <div className="space-y-2">
                            <div className="w-10 h-10 bg-mande-black text-mande-gold flex items-center justify-center">
                              <Icon className="w-5 h-5" />
                            </div>
                            <h4 className="font-serif font-bold text-sm text-mande-black">
                              {exp.title}
                            </h4>
                            <p className="text-xs text-gray-600 font-sans leading-relaxed">
                              {exp.desc}
                            </p>
                          </div>
                          <span className="text-[10px] uppercase font-bold text-mande-gold font-mono">
                            Durée : {exp.duration}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    type="button"
                    onClick={() => setStep(2)}
                    variant="gold"
                    size="lg"
                  >
                    Continuer vers la Date & Vos Coordonnées
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 2: Date, Time & Contact info */}
            {step === 2 && (
              <div className="bg-white p-8 border border-mande-ivoryDark shadow-card space-y-8 animate-fadeIn">
                {/* Date & Time Selection */}
                <div className="space-y-6">
                  <h3 className="font-serif text-lg font-bold uppercase tracking-wider text-mande-black flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-mande-gold" />
                    <span>Sélectionnez la Date & l’Heure de Votre Visite</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs uppercase font-sans font-bold text-mande-black block mb-2">
                        Date de rendez-vous souhaitée *
                      </label>
                      <input
                        type="date"
                        required
                        min={new Date().toISOString().split('T')[0]}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full p-3 bg-mande-ivoryLight border border-mande-ivoryDark text-mande-black text-xs font-sans focus:outline-none focus:border-mande-gold"
                      />
                    </div>

                    <div>
                      <label className="text-xs uppercase font-sans font-bold text-mande-black block mb-2">
                        Créneau horaire privilégié *
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {TIME_SLOTS.map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setTimeSlot(slot)}
                            className={`py-2 text-center text-xs font-mono font-bold uppercase border transition-all ${
                              timeSlot === slot
                                ? 'bg-mande-black text-mande-gold border-mande-black'
                                : 'bg-mande-ivoryLight text-gray-700 border-mande-ivoryDark hover:border-mande-gold'
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-6 pt-6 border-t border-mande-ivoryDark">
                  <h3 className="font-serif text-lg font-bold uppercase tracking-wider text-mande-black flex items-center gap-2">
                    <User className="w-5 h-5 text-mande-gold" />
                    <span>Vos Coordonnées Privilège</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-sans">
                    <div>
                      <label className="uppercase font-bold text-gray-700 block mb-1.5">Nom & Prénom *</label>
                      <input
                        type="text"
                        required
                        placeholder="Mansa Keïta"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full p-2.5 bg-mande-ivoryLight border border-mande-ivoryDark text-mande-black focus:outline-none focus:border-mande-gold"
                      />
                    </div>

                    <div>
                      <label className="uppercase font-bold text-gray-700 block mb-1.5">Téléphone / WhatsApp *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+223 70 00 00 00"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full p-2.5 bg-mande-ivoryLight border border-mande-ivoryDark text-mande-black font-mono focus:outline-none focus:border-mande-gold"
                      />
                    </div>

                    <div>
                      <label className="uppercase font-bold text-gray-700 block mb-1.5">Adresse Email</label>
                      <input
                        type="email"
                        placeholder="client@mandeheritage.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2.5 bg-mande-ivoryLight border border-mande-ivoryDark text-mande-black focus:outline-none focus:border-mande-gold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="uppercase font-bold text-gray-700 block mb-1.5 text-xs">
                      Attentes particulières, pièces repérées ou demandes sur-mesure
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Ex: Je prépare un mariage royal en décembre, je souhaiterais essayer le Kimono Soundiata et découvrir vos tissus de Ségou..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full p-3 bg-mande-ivoryLight border border-mande-ivoryDark text-mande-black text-xs font-sans focus:outline-none focus:border-mande-gold"
                    />
                  </div>
                </div>

                {/* VIP Perks Note */}
                <div className="p-4 bg-mande-ivoryLight border border-mande-gold/40 flex items-center gap-4 text-xs font-sans">
                  <Coffee className="w-6 h-6 text-mande-gold flex-shrink-0" />
                  <p className="text-gray-700">
                    <strong>Service d’Accueil Privilégié</strong> : Dégustation offerte de thé à la menthe du Mali et nectar de bissap royal lors de votre visite en salon privé.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs uppercase font-sans font-bold text-gray-500 hover:text-black"
                  >
                    &larr; Retour à l’étape précédente
                  </button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    variant="gold"
                    size="lg"
                    className="shadow-gold-md"
                  >
                    {isLoading ? 'Confirmation en cours...' : 'Confirmer Mon Rendez-vous VIP'}
                  </Button>
                </div>
              </div>
            )}
          </form>
        )}

        {/* STEP 3: Confirmation Screen & Voucher */}
        {step === 3 && confirmedBooking && (
          <div className="bg-white border-2 border-mande-gold p-8 sm:p-12 shadow-2xl space-y-8 animate-fadeIn text-center max-w-3xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-mande-gold/20 text-mande-gold flex items-center justify-center mx-auto border border-mande-gold">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase tracking-[0.25em] text-mande-gold font-sans font-bold">
                Invitation Privée Confirmée &bull; Réf. {confirmedBooking.reference}
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold uppercase tracking-wider text-mande-black">
                Votre Rendez-vous Est Enregistré
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 font-sans max-w-lg mx-auto">
                Cher(e) <strong>{confirmedBooking.fullName}</strong>, notre équipe de stylisme vous accueillera avec les plus grands honneurs.
              </p>
            </div>

            <BogolanDivider variant="gold" className="my-4" />

            {/* Appointment Recap Card */}
            <div className="bg-mande-ivoryLight border border-mande-ivoryDark p-6 text-left text-xs font-sans grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="text-gray-500 uppercase text-[10px] font-bold tracking-widest">Lieu du Rendez-vous :</p>
                <p className="font-serif font-bold text-sm text-mande-black">{confirmedBooking.showroomLocation}</p>
                <p className="text-gray-500 uppercase text-[10px] font-bold tracking-widest pt-2">Expérience :</p>
                <p className="font-semibold text-gray-800">{confirmedBooking.experienceType}</p>
              </div>

              <div className="space-y-2 border-t sm:border-t-0 sm:border-l border-gray-200 pt-4 sm:pt-0 sm:pl-6">
                <p className="text-gray-500 uppercase text-[10px] font-bold tracking-widest">Date & Heure :</p>
                <p className="font-serif font-bold text-base text-mande-earth">
                  {confirmedBooking.appointmentDate} à {confirmedBooking.timeSlot}
                </p>
                <p className="text-gray-500 uppercase text-[10px] font-bold tracking-widest pt-2">Contact Confirmé :</p>
                <p className="font-mono text-gray-700">{confirmedBooking.phone}</p>
              </div>
            </div>

            {/* WhatsApp Contact & Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <a
                href={`https://wa.me/22370000001?text=Bonjour%20Maison%20Mand%C3%A9%20H%C3%A9ritage,%20je%20confirme%20mon%20rendez-vous%20priv%C3%A9%20r%C3%A9f%C3%A9rence%20${confirmedBooking.reference}%20le%20${confirmedBooking.appointmentDate}%20%C3%A0%20${confirmedBooking.timeSlot}.`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 py-3 px-6 bg-green-700 hover:bg-green-600 text-white font-semibold uppercase tracking-wider text-xs transition-colors shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Confirmer sur WhatsApp avec le Styliste</span>
              </a>

              <button
                onClick={() => window.print()}
                className="inline-flex items-center justify-center gap-2 py-3 px-6 bg-mande-black hover:bg-mande-gold hover:text-mande-black text-mande-ivory font-semibold uppercase tracking-wider text-xs transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimer l’Invitation</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
