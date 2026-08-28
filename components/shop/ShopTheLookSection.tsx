'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, ShoppingBag, Check, ArrowRight, Eye, Plus } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';
import { formatPrice } from '@/lib/utils';
import { Button } from '../ui/Button';
import { BogolanDivider } from '../ui/BogolanPattern';

interface LookItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  category: string;
  pinX: number; // percentage X
  pinY: number; // percentage Y
}

interface Look {
  id: string;
  title: string;
  subtitle: string;
  tagline: string;
  fullImage: string;
  bundleDiscountPercent: number;
  items: LookItem[];
}

const LOOKS: Look[] = [
  {
    id: 'look-soundiata',
    title: 'La Silhouette Soundiata Impériale',
    subtitle: 'Audace & Noblesse Mandingue',
    tagline: 'L’union magistrale du grand kimono Bôkôlan teinté à l’argile fermentée et du pantalon fuseau.',
    fullImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200',
    bundleDiscountPercent: 15,
    items: [
      {
        id: 'kimono-soundiata-item',
        name: 'Kimono Royal Soundiata',
        slug: 'kimono-royal-soundiata',
        price: 185000,
        image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=600',
        category: 'Vestes & Kimonos',
        pinX: 48,
        pinY: 38,
      },
      {
        id: 'pantalon-mande-item',
        name: 'Pantalon Drapé Mansa',
        slug: 'pantalon-drape-mansa',
        price: 95000,
        image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600',
        category: 'Pantalons',
        pinX: 52,
        pinY: 72,
      },
    ],
  },
  {
    id: 'look-reine-kassa',
    title: 'La Silhouette Reine Kassa',
    subtitle: 'Grâce & Puissance Féminine',
    tagline: 'Une robe fourreau d’apparat aux motifs ancestraux Koumi Dio, sublimée par une étole en soie et coton.',
    fullImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200',
    bundleDiscountPercent: 15,
    items: [
      {
        id: 'robe-kassa-item',
        name: 'Robe Fourreau Kassa',
        slug: 'robe-fourreau-kassa',
        price: 195000,
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600',
        category: 'Robes de Soirée',
        pinX: 50,
        pinY: 42,
      },
      {
        id: 'etole-soie-item',
        name: 'Étole d’Or N’Galama',
        slug: 'etole-dor-ngalama',
        price: 55000,
        image: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?q=80&w=600',
        category: 'Accessoires',
        pinX: 42,
        pinY: 28,
      },
    ],
  },
  {
    id: 'look-diplomate',
    title: 'La Silhouette Diplomate Mandé',
    subtitle: 'Élégance Contemporaine & Racines',
    tagline: 'Veste tailleur structurée en Bôkôlan noir ébène et sac de voyage weekend en cuir tanné végétal.',
    fullImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200',
    bundleDiscountPercent: 15,
    items: [
      {
        id: 'veste-diplomate-item',
        name: 'Veste Tailleur Mandé',
        slug: 'veste-tailleur-mande',
        price: 165000,
        image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600',
        category: 'Vestes & Costumes',
        pinX: 50,
        pinY: 40,
      },
      {
        id: 'sac-weekend-item',
        name: 'Sac Weekend Bôkôlan & Cuir',
        slug: 'sac-weekend-bokolan-cuir',
        price: 145000,
        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=600',
        category: 'Maroquinerie',
        pinX: 72,
        pinY: 65,
      },
    ],
  },
];

export function ShopTheLookSection() {
  const { addItem } = useCart();
  const { currency } = useCurrency();
  const [activeLookIndex, setActiveLookIndex] = useState(0);
  const [hoveredPin, setHoveredPin] = useState<LookItem | null>(null);
  const [bundleAdded, setBundleAdded] = useState(false);

  const activeLook = LOOKS[activeLookIndex];

  const totalRawPrice = activeLook.items.reduce((acc, it) => acc + it.price, 0);
  const discountAmount = Math.round((totalRawPrice * activeLook.bundleDiscountPercent) / 100);
  const bundleTotalPrice = totalRawPrice - discountAmount;

  const handleAddBundleToCart = () => {
    activeLook.items.forEach((item) => {
      addItem({
        productId: item.id,
        name: item.name,
        slug: item.slug,
        price: Math.round(item.price * (1 - activeLook.bundleDiscountPercent / 100)),
        image: item.image,
        size: 'Taille Standard',
        color: 'Bôkôlan Naturel',
        quantity: 1,
        maxStock: 10,
      });
    });

    setBundleAdded(true);
    setTimeout(() => setBundleAdded(false), 2000);
  };

  return (
    <section className="py-20 bg-mande-black text-mande-ivory relative overflow-hidden">
      {/* Decorative Gold Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-mande-gold/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-[0.3em] text-mande-gold font-sans font-semibold flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-mande-gold" />
            <span>Harmonie & Allure Haute Couture</span>
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold uppercase tracking-wider text-mande-ivory mt-2">
            Shop The Look
          </h2>
          <BogolanDivider variant="gold" className="my-4" />
          <p className="text-xs sm:text-sm text-gray-300 font-sans font-light max-w-xl mx-auto">
            Découvrez nos silhouettes complètes composées par nos stylistes. Cliquez sur les pastilles interactives pour explorer chaque pièce ou acquérez la silhouette complète avec un privilège exclusif de 15%.
          </p>

          {/* Look Selector Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            {LOOKS.map((lk, idx) => (
              <button
                key={lk.id}
                onClick={() => {
                  setActiveLookIndex(idx);
                  setHoveredPin(null);
                }}
                className={`px-4 py-2 text-xs uppercase font-sans tracking-widest font-semibold transition-all border ${
                  activeLookIndex === idx
                    ? 'bg-mande-gold text-mande-black border-mande-gold shadow-gold-md'
                    : 'bg-mande-surface/60 text-gray-300 border-mande-surface hover:border-mande-gold/60'
                }`}
              >
                {lk.title}
              </button>
            ))}
          </div>
        </div>

        {/* Main Interactive Stage Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-mande-surface/40 p-6 sm:p-10 border border-mande-gold/30">
          {/* Left: Full Interactive Look Image with Hotspots (7 Cols) */}
          <div className="lg:col-span-7 relative aspect-[3/4] w-full bg-mande-black overflow-hidden border border-mande-gold/20 shadow-2xl">
            <Image
              src={activeLook.fullImage}
              alt={activeLook.title}
              fill
              className="object-cover object-top"
              priority
            />

            {/* Interactive Pins / Hotspots */}
            {activeLook.items.map((item) => (
              <div
                key={item.id}
                style={{ top: `${item.pinY}%`, left: `${item.pinX}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
              >
                <button
                  onMouseEnter={() => setHoveredPin(item)}
                  onClick={() => setHoveredPin(item)}
                  className="relative group w-8 h-8 rounded-full bg-mande-gold text-mande-black flex items-center justify-center font-bold text-xs shadow-lg transition-transform hover:scale-125 focus:outline-none"
                  aria-label={`Voir ${item.name}`}
                >
                  <span className="absolute inset-0 rounded-full bg-mande-gold animate-ping opacity-60 pointer-events-none" />
                  <Plus className="w-4 h-4 text-mande-black relative z-10" />
                </button>

                {/* Pin Tooltip Box */}
                {hoveredPin?.id === item.id && (
                  <div className="absolute left-1/2 bottom-full mb-3 -translate-x-1/2 w-56 bg-mande-black/95 text-mande-ivory border border-mande-gold p-3 shadow-2xl z-30 animate-fadeIn text-xs font-sans">
                    <p className="text-[10px] text-mande-gold uppercase font-bold tracking-widest">{item.category}</p>
                    <p className="font-serif font-bold text-sm text-white mt-0.5">{item.name}</p>
                    <p className="text-mande-gold font-serif font-bold text-xs mt-1">{formatPrice(item.price, currency)}</p>
                    <div className="mt-2 pt-2 border-t border-mande-surface flex items-center justify-between">
                      <Link href={`/produit/${item.slug}`} className="text-[10px] uppercase font-semibold text-gray-300 hover:text-mande-gold flex items-center gap-1">
                        <span>Explorer</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right: Look Breakdown & Bundle Purchase Box (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-mande-gold font-sans font-bold">
                {activeLook.subtitle}
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold uppercase tracking-wider text-mande-ivory mt-1">
                {activeLook.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 font-sans font-light leading-relaxed mt-2">
                {activeLook.tagline}
              </p>
            </div>

            {/* Itemized List of the Look */}
            <div className="space-y-3 pt-2">
              <h4 className="font-serif text-xs font-bold uppercase tracking-widest text-gray-400">
                Composition de la Silhouette :
              </h4>
              <div className="divide-y divide-mande-surface border border-mande-surface bg-mande-black/40">
                {activeLook.items.map((item) => (
                  <div key={item.id} className="p-3.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-14 bg-mande-surface flex-shrink-0 overflow-hidden">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="text-xs font-sans">
                        <p className="font-serif font-bold text-sm text-white">{item.name}</p>
                        <p className="text-gray-400 text-[11px]">{item.category}</p>
                      </div>
                    </div>
                    <span className="font-serif font-bold text-sm text-mande-gold">
                      {formatPrice(item.price, currency)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bundle Price & Special Discount CTA */}
            <div className="bg-mande-surface p-5 border border-mande-gold/40 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-mande-gold font-bold block">
                    Privilège Silhouette Complète
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-serif text-xl sm:text-2xl font-bold text-mande-gold">
                      {formatPrice(bundleTotalPrice, currency)}
                    </span>
                    <span className="font-serif text-sm text-gray-400 line-through">
                      {formatPrice(totalRawPrice, currency)}
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-mande-gold text-mande-black font-bold uppercase text-[10px] tracking-wider">
                  -{activeLook.bundleDiscountPercent}% Inclus
                </span>
              </div>

              <Button
                onClick={handleAddBundleToCart}
                variant="gold"
                size="md"
                className="w-full shadow-gold-md"
                leftIcon={bundleAdded ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
              >
                {bundleAdded ? 'Silhouette Complète Ajoutée !' : 'Acquérir la Silhouette Complète'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
