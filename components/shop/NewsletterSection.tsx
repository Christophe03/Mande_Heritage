'use client';

import React, { useState } from 'react';
import { Mail, CheckCircle, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { BogolanBorder } from '../ui/BogolanPattern';

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 600);
  };

  return (
    <section className="relative py-24 bg-mande-black text-mande-ivory overflow-hidden">
      {/* Subtle Bogolan background accents */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-mande-gold blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-mande-earth blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 border border-mande-gold/40 bg-mande-surface/50 text-mande-gold text-xs tracking-[0.25em] uppercase font-sans">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Le Cercle Privé Mandé</span>
        </div>

        <h2 className="font-serif text-2xl sm:text-4xl font-bold uppercase tracking-wider mb-4 text-mande-ivory">
          Rejoignez les Privilèges de notre Maison
        </h2>

        <p className="font-sans text-xs sm:text-sm text-mande-sandLight max-w-xl mx-auto mb-8 font-light leading-relaxed">
          Recevez nos invitations exclusives aux défilés privés, les annonces en avant-première des pièces numérotées et profitez de <strong className="text-mande-gold">15% de bienvenue</strong> sur votre première acquisition.
        </p>

        {isSubmitted ? (
          <div className="p-6 bg-mande-surface/80 border border-mande-gold/40 max-w-md mx-auto text-center animate-fadeIn">
            <CheckCircle className="w-8 h-8 text-mande-gold mx-auto mb-2" />
            <h4 className="font-serif text-base font-bold text-mande-ivory mb-1">
              Bienvenue dans la Maison Mandé
            </h4>
            <p className="text-xs text-gray-300">
              Votre invitation est enregistrée. Utilisez votre code privilège <span className="text-mande-gold font-mono font-bold">BIENVENUE15</span> lors de votre commande.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                type="email"
                required
                placeholder="Votre adresse email personnelle..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 bg-mande-dark border border-mande-surface text-mande-ivory text-xs focus:outline-none focus:border-mande-gold placeholder-gray-500 font-sans"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute right-3 top-3.5 pointer-events-none" />
            </div>
            <Button
              type="submit"
              variant="gold"
              size="md"
              isLoading={isLoading}
              className="w-full sm:w-auto"
            >
              S’inscrire
            </Button>
          </form>
        )}

        <p className="text-[11px] text-gray-500 mt-4 font-sans">
          Nous respectons votre confidentialité. Aucun courrier superflu, uniquement l’excellence.
        </p>

        <div className="mt-12">
          <BogolanBorder className="opacity-20 text-mande-gold" />
        </div>
      </div>
    </section>
  );
}
