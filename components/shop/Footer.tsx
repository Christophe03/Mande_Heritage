'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  Instagram, 
  Facebook, 
  MessageCircle, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Sparkles 
} from 'lucide-react';
import { BogolanDivider } from '../ui/BogolanPattern';

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith('/admin')) return null;

  return (
    <footer className="bg-mande-black text-mande-ivory border-t border-mande-gold/30">
      {/* Brand Values / Trust Bar */}
      <div className="border-b border-mande-surface/80 bg-mande-dark py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-none bg-mande-gold/10 border border-mande-gold/30 flex items-center justify-center flex-shrink-0 text-mande-gold">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-mande-ivory">
                Bôkôlan 100% Authentique
              </h4>
              <p className="text-xs text-gray-400 font-sans mt-0.5">
                Teintures végétales et argile sacrée du fleuve Niger.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-none bg-mande-gold/10 border border-mande-gold/30 flex items-center justify-center flex-shrink-0 text-mande-gold">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-mande-ivory">
                Livraison Sécurisée
              </h4>
              <p className="text-xs text-gray-400 font-sans mt-0.5">
                À Bamako, en Afrique de l’Ouest et dans le monde entier.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-none bg-mande-gold/10 border border-mande-gold/30 flex items-center justify-center flex-shrink-0 text-mande-gold">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-mande-ivory">
                Échange & Retours
              </h4>
              <p className="text-xs text-gray-400 font-sans mt-0.5">
                Service client privilégié et retour sous 14 jours.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-none bg-mande-gold/10 border border-mande-gold/30 flex items-center justify-center flex-shrink-0 text-mande-gold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-mande-ivory">
                Confection & Sur-Mesure
              </h4>
              <p className="text-xs text-gray-400 font-sans mt-0.5">
                Service atelier d’exception et ajustement personnalisé.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Intro Column */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <Link href="/" className="inline-flex items-center gap-4 group">
                <div className="relative w-16 h-16 flex-shrink-0">
                  <Image
                    src="/images/logo/logo.png"
                    alt="Mandé Héritage"
                    fill
                    className="object-contain transition-transform group-hover:scale-105"
                  />
                </div>
                <div>
                  <span className="font-serif text-2xl font-bold tracking-[0.18em] uppercase text-mande-ivory group-hover:text-mande-gold transition-colors">
                    MANDÉ HÉRITAGE
                  </span>
                  <span className="block text-[9px] tracking-[0.25em] uppercase text-mande-gold mt-0.5 font-sans font-semibold">
                    Élégance en Bôkôlan &bull; Haute Confection
                  </span>
                </div>
              </Link>
            </div>
            <p className="text-xs text-gray-400 font-sans leading-relaxed max-w-md">
              Mandé Héritage célèbre la noblesse des étoffes ancestrales d’Afrique de l’Ouest. Chaque création est le fruit d’un dialogue intime entre les maîtres artisans teinturiers du Mali et les exigences de la haute couture contemporaine.
            </p>
            <div className="flex items-center space-x-4 text-mande-sand">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-none border border-mande-surface flex items-center justify-center hover:border-mande-gold hover:text-mande-gold transition-colors"
                aria-label="Instagram Mandé Héritage"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-none border border-mande-surface flex items-center justify-center hover:border-mande-gold hover:text-mande-gold transition-colors"
                aria-label="Facebook Mandé Héritage"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/22370000001"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-none border border-mande-surface flex items-center justify-center hover:border-mande-gold hover:text-mande-gold transition-colors"
                aria-label="WhatsApp Concierge Mandé Héritage"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navigation Links Column */}
          <div>
            <h4 className="font-serif text-xs uppercase tracking-[0.2em] font-bold text-mande-gold mb-5">
              La Maison
            </h4>
            <ul className="space-y-3 text-xs text-gray-400 font-sans">
              <li>
                <Link href="/notre-histoire" className="hover:text-mande-gold transition-colors">
                  Notre Histoire & Vision
                </Link>
              </li>
              <li>
                <Link href="/bokolan" className="hover:text-mande-gold transition-colors">
                  L’Art du Bôkôlan
                </Link>
              </li>
              <li>
                <Link href="/symboles" className="hover:text-mande-gold transition-colors text-mande-gold">
                  Le Livre des Symboles
                </Link>
              </li>
              <li>
                <Link href="/rendez-vous" className="hover:text-mande-gold transition-colors">
                  Rendez-vous VIP & Essayage
                </Link>
              </li>
              <li>
                <Link href="/journal" className="hover:text-mande-gold transition-colors">
                  Le Journal Mandé
                </Link>
              </li>
              <li>
                <Link href="/collections" className="hover:text-mande-gold transition-colors">
                  Toutes les Collections
                </Link>
              </li>
              <li>
                <Link href="/boutique" className="hover:text-mande-gold transition-colors">
                  Catalogue Complet
                </Link>
              </li>
            </ul>
          </div>

          {/* Collections Column */}
          <div>
            <h4 className="font-serif text-xs uppercase tracking-[0.2em] font-bold text-mande-gold mb-5">
              Collections
            </h4>
            <ul className="space-y-3 text-xs text-gray-400 font-sans">
              <li>
                <Link href="/collections/heritage-royal" className="hover:text-mande-gold transition-colors">
                  Héritage Royal
                </Link>
              </li>
              <li>
                <Link href="/collections/signature-mande" className="hover:text-mande-gold transition-colors">
                  Signature Mandé
                </Link>
              </li>
              <li>
                <Link href="/collections/moderne-sahel" className="hover:text-mande-gold transition-colors">
                  Moderne Sahel
                </Link>
              </li>
              <li>
                <Link href="/collections/editions-limitees" className="hover:text-mande-gold transition-colors">
                  Éditions Limitées Mansa Musa
                </Link>
              </li>
              <li>
                <Link href="/boutique?category=vetements" className="hover:text-mande-gold transition-colors">
                  Vêtements & Kimonos
                </Link>
              </li>
              <li>
                <Link href="/boutique?category=sacs" className="hover:text-mande-gold transition-colors">
                  Sacs & Maroquinerie
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Showroom */}
          <div>
            <h4 className="font-serif text-xs uppercase tracking-[0.2em] font-bold text-mande-gold mb-5">
              Showrooms & Conciergerie
            </h4>
            <ul className="space-y-3 text-xs text-gray-400 font-sans">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-mande-gold flex-shrink-0 mt-0.5" />
                <span>Showroom ACI 2000, Bamako, Mali</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-mande-gold flex-shrink-0 mt-0.5" />
                <span>Espace Privé &bull; 8e Arrondissement, Paris</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-mande-gold flex-shrink-0" />
                <span>+223 70 00 00 01</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-mande-gold flex-shrink-0" />
                <span>concierge@mandeheritage.com</span>
              </li>
              <li className="pt-2">
                <Link href="/contact" className="text-mande-gold hover:underline">
                  Prendre rendez-vous en salon privé →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <BogolanDivider variant="gold" className="my-12 opacity-40" />

        {/* Bottom Bar: Copyright & Payment icons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-500 font-sans">
          <p>
            &copy; {new Date().getFullYear()} Mandé Héritage. Tous droits réservés. Maison de mode africaine d’exception.
          </p>
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-wider text-mande-sand">Paiements acceptés :</span>
            <span className="px-2 py-0.5 bg-mande-surface border border-mande-gold/20 text-mande-ivory text-[10px]">
              Orange Money
            </span>
            <span className="px-2 py-0.5 bg-mande-surface border border-mande-gold/20 text-mande-ivory text-[10px]">
              Wave
            </span>
            <span className="px-2 py-0.5 bg-mande-surface border border-mande-gold/20 text-mande-ivory text-[10px]">
              Visa / CB
            </span>
            <span className="px-2 py-0.5 bg-mande-surface border border-mande-gold/20 text-mande-ivory text-[10px]">
              Mastercard
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
