'use client';

import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  MessageCircle, 
  Send, 
  CheckCircle, 
  Clock, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { BogolanBorder, BogolanDivider } from '@/components/ui/BogolanPattern';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Commande sur-mesure',
    message: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 600);
  };

  const faqs = [
    {
      q: 'Comment passer une commande sur-mesure ?',
      a: 'Vous pouvez sélectionner l’option Sur-Mesure sur les fiches produits éligibles ou contacter directement notre conciergerie via le formulaire ou WhatsApp pour fixer un rendez-vous en atelier.',
    },
    {
      q: 'Quels sont les moyens de paiement acceptés ?',
      a: 'Nous acceptons Orange Money, Wave Mobile Money, Moov Money, ainsi que les cartes bancaires internationales (Visa, Mastercard, American Express). À Bamako, le règlement en espèces à la livraison est également proposé.',
    },
    {
      q: 'Comment entretenir mes vêtements en Bôkôlan authentique ?',
      a: 'Le Bôkôlan étant teint à base de décoctions végétales et de boue naturelle, un nettoyage à sec spécialisé est vivement recommandé pour préserver la vivacité des contrastes. Pour un entretien doux, lavez à la main à l’eau froide sans frotter excessivement.',
    },
    {
      q: 'Livrez-vous dans la diaspora en Europe et en Amérique ?',
      a: 'Oui, nous expédions quotidiennement vers la France, la Belgique, la Suisse, les États-Unis et le Canada via notre partenaire DHL Express avec un délai moyen de 4 à 7 jours ouvrés.',
    },
  ];

  return (
    <div className="pt-24 min-h-screen bg-mande-ivory">
      {/* Header */}
      <div className="bg-mande-ivoryLight py-16 border-b border-mande-ivoryDark text-center px-4">
        <div className="max-w-3xl mx-auto">
          <span className="text-xs uppercase tracking-[0.25em] text-mande-gold font-sans font-semibold">
            Conciergerie Privée
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold uppercase tracking-wider text-mande-black mt-2">
            Contact & Salons Privés
          </h1>
          <BogolanDivider variant="gold" className="my-3" />
          <p className="text-xs sm:text-sm text-gray-600 font-sans font-light max-w-xl mx-auto">
            Nos conseillers de style et maîtres couturiers sont à votre disposition pour vous offrir une expérience d’exception.
          </p>
        </div>
      </div>

      <BogolanBorder className="opacity-30 text-mande-gold" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
          {/* Left Col: Contact Info & Showrooms */}
          <div className="space-y-8">
            {/* Showroom Bamako */}
            <div className="bg-white p-6 sm:p-8 border border-mande-ivoryDark shadow-sm space-y-3">
              <span className="text-[10px] text-mande-gold uppercase tracking-[0.25em] font-sans font-bold">
                Showroom Principal
              </span>
              <h3 className="font-serif text-xl font-bold text-mande-black">
                Maison Mandé Bamako
              </h3>
              <div className="space-y-2 text-xs text-gray-600 font-sans">
                <p className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-mande-gold flex-shrink-0 mt-0.5" />
                  <span>Quartier ACI 2000, Rue 340, Bamako, Mali</span>
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-mande-gold flex-shrink-0" />
                  <span>Du Lundi au Samedi : 09h00 – 19h30</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-mande-gold flex-shrink-0" />
                  <span>+223 70 00 00 01 / +223 76 12 34 56</span>
                </p>
              </div>
            </div>

            {/* Salon Paris */}
            <div className="bg-white p-6 sm:p-8 border border-mande-ivoryDark shadow-sm space-y-3">
              <span className="text-[10px] text-mande-gold uppercase tracking-[0.25em] font-sans font-bold">
                Espace Privé Diaspora
              </span>
              <h3 className="font-serif text-xl font-bold text-mande-black">
                Salon Privé Paris
              </h3>
              <div className="space-y-2 text-xs text-gray-600 font-sans">
                <p className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-mande-gold flex-shrink-0 mt-0.5" />
                  <span>Triangle d’Or &bull; 8e Arrondissement, Paris, France</span>
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-mande-gold flex-shrink-0" />
                  <span>Sur rendez-vous personnalisé uniquement</span>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-mande-gold flex-shrink-0" />
                  <span>paris@mandeheritage.com</span>
                </p>
              </div>
            </div>

            {/* WhatsApp Concierge Box */}
            <div className="bg-mande-black text-mande-ivory p-6 border border-mande-gold/30 shadow-card space-y-4">
              <h4 className="font-serif text-base font-bold text-mande-gold uppercase tracking-wider">
                Assistance Directe WhatsApp
              </h4>
              <p className="text-xs text-gray-300 font-sans font-light">
                Échangez en direct avec notre responsable atelier pour toute demande urgente.
              </p>
              <a
                href="https://wa.me/22370000001"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-3 bg-mande-gold text-mande-black font-semibold uppercase tracking-wider text-xs hover:bg-mande-goldLight transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Ouvrir WhatsApp (+223 70 00 00 01)</span>
              </a>
            </div>
          </div>

          {/* Right 2 Cols: Contact Form */}
          <div className="lg:col-span-2 bg-white p-8 sm:p-12 border border-mande-ivoryDark shadow-card">
            <h2 className="font-serif text-2xl font-bold uppercase tracking-wider text-mande-black mb-2">
              Envoyez-nous un Message
            </h2>
            <p className="text-xs text-gray-500 font-sans mb-8">
              Remplissez le formulaire ci-dessous et notre service client vous répondra sous 24 heures.
            </p>

            {isSubmitted ? (
              <div className="p-8 bg-mande-ivoryLight border border-mande-gold/40 text-center space-y-3 animate-fadeIn">
                <CheckCircle className="w-12 h-12 text-mande-gold mx-auto" />
                <h3 className="font-serif text-lg font-bold text-mande-black">
                  Message Transmis avec Succès
                </h3>
                <p className="text-xs text-gray-600 font-sans max-w-sm mx-auto">
                  Merci de nous avoir contactés. Notre équipe de conciergerie reviendra vers vous dans les plus brefs délais.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-wider font-semibold text-gray-700 font-sans">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Votre nom et prénom"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-mande-ivoryLight border border-mande-sandDark text-xs text-mande-black focus:outline-none focus:border-mande-gold font-sans"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-wider font-semibold text-gray-700 font-sans">
                      Adresse Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="votre@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-mande-ivoryLight border border-mande-sandDark text-xs text-mande-black focus:outline-none focus:border-mande-gold font-sans"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-wider font-semibold text-gray-700 font-sans">
                      Numéro de téléphone
                    </label>
                    <input
                      type="tel"
                      placeholder="+223 ..."
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-mande-ivoryLight border border-mande-sandDark text-xs text-mande-black focus:outline-none focus:border-mande-gold font-sans"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-wider font-semibold text-gray-700 font-sans">
                      Objet de la demande
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 bg-mande-ivoryLight border border-mande-sandDark text-xs text-mande-black focus:outline-none focus:border-mande-gold font-sans"
                    >
                      <option value="Commande sur-mesure">Commande sur-mesure</option>
                      <option value="Question sur un produit">Question sur un produit</option>
                      <option value="Suivi de livraison">Suivi de livraison</option>
                      <option value="Prise de rendez-vous salon">Prise de rendez-vous salon privé</option>
                      <option value="Partenariat / Presse">Partenariat & Presse</option>
                      <option value="Autre">Autre demande</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider font-semibold text-gray-700 font-sans">
                    Votre Message *
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Précisez votre demande, mensurations souhaitées ou références de commande..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 bg-mande-ivoryLight border border-mande-sandDark text-xs text-mande-black focus:outline-none focus:border-mande-gold font-sans"
                  />
                </div>

                <Button
                  type="submit"
                  variant="gold"
                  size="lg"
                  isLoading={isLoading}
                  className="w-full sm:w-auto shadow-gold-sm"
                  rightIcon={<Send className="w-4 h-4" />}
                >
                  Envoyer ma Demande
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto pt-12 border-t border-mande-ivoryDark">
          <div className="text-center mb-10">
            <span className="text-xs uppercase tracking-[0.25em] text-mande-gold font-sans font-semibold">
              Questions Fréquentes
            </span>
            <h3 className="font-serif text-2xl font-bold uppercase tracking-wider text-mande-black mt-1">
              Foire Aux Questions
            </h3>
            <BogolanDivider variant="gold" className="my-3" />
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="bg-white border border-mande-ivoryDark overflow-hidden shadow-sm"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-5 text-left flex items-center justify-between font-serif text-sm font-semibold text-mande-black hover:text-mande-earth transition-colors"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-mande-gold flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-mande-gold flex-shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-gray-600 font-sans leading-relaxed border-t border-mande-ivoryDark pt-3 font-light">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
