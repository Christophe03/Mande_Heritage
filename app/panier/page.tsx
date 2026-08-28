'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';
import { formatPrice } from '@/lib/utils';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShoppingBag, 
  Tag, 
  ShieldCheck, 
  Truck, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { BogolanBorder, BogolanDivider } from '@/components/ui/BogolanPattern';

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
    discountAmount,
    total,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
  } = useCart();
  const { currency } = useCurrency();

  const [promoInput, setPromoInput] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoMessage, setPromoMessage] = useState<{ success: boolean; text: string } | null>(null);

  const FREE_SHIPPING_THRESHOLD = 100000;
  const progressPercent = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput) return;
    setPromoLoading(true);
    setPromoMessage(null);
    const res = await applyPromoCode(promoInput);
    setPromoLoading(false);
    setPromoMessage({ success: res.success, text: res.message });
    if (res.success) setPromoInput('');
  };

  if (items.length === 0) {
    return (
      <div className="pt-28 pb-20 min-h-[75vh] flex items-center justify-center bg-mande-ivory px-4">
        <div className="max-w-md w-full text-center bg-white p-10 border border-mande-ivoryDark shadow-card flex flex-col items-center">
          <div className="relative w-24 h-24 mb-4">
            <Image
              src="/images/logo/logo.png"
              alt="Mandé Héritage"
              fill
              className="object-contain"
            />
          </div>
          <h1 className="font-serif text-2xl font-bold uppercase tracking-wider text-mande-black mb-2">
            Votre Panier est Vide
          </h1>
          <BogolanDivider variant="gold" className="my-3" />
          <p className="text-xs text-gray-500 font-sans leading-relaxed mb-8">
            Explorez notre vestiaire royal et laissez-vous séduire par la noblesse du Bôkôlan authentique.
          </p>
          <Link href="/boutique" className="w-full">
            <Button variant="gold" size="md" className="w-full" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Découvrir la Boutique
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 min-h-screen bg-mande-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Title */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-[0.25em] text-mande-gold font-sans font-semibold">
            Votre Sélection
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold uppercase tracking-wider text-mande-black mt-1">
            Mon Panier d’Achat
          </h1>
          <BogolanDivider variant="gold" className="my-3" />
        </div>

        {/* Free Shipping Progress Alert */}
        <div className="mb-8 p-4 bg-mande-black text-mande-ivory border border-mande-gold/40 shadow-sm max-w-4xl mx-auto">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-mande-gold" />
              {remainingForFreeShipping > 0 ? (
                <span>
                  Plus que <strong className="text-mande-gold">{formatPrice(remainingForFreeShipping, currency)}</strong> pour obtenir la <strong>livraison offerte au Mali</strong>
                </span>
              ) : (
                <span className="text-mande-gold font-bold">
                  ✨ Félicitations ! Votre commande bénéficie de la livraison offerte.
                </span>
              )}
            </span>
            <span className="text-[10px] text-gray-400 font-mono">
              {Math.round(progressPercent)}%
            </span>
          </div>
          <div className="w-full bg-mande-surface h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-mande-gold to-mande-goldDark h-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Two Columns Grid: Cart Items List + Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left: Cart Items Table */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white border border-mande-ivoryDark p-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-mande-ivoryDark text-xs font-serif uppercase tracking-wider text-gray-500">
                <span>Création ({items.length})</span>
                <button
                  onClick={clearCart}
                  className="text-[11px] text-red-500 hover:underline font-sans normal-case"
                >
                  Vider le panier
                </button>
              </div>

              <div className="divide-y divide-mande-ivoryDark">
                {items.map((item) => (
                  <div key={item.id} className="py-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 group">
                    {/* Image */}
                    <div className="relative w-24 h-32 bg-mande-sand/10 flex-shrink-0 border border-mande-ivoryDark overflow-hidden">
                      <Image
                        src={item.image || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=300'}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 space-y-1">
                      <Link
                        href={`/produit/${item.slug}`}
                        className="font-serif text-base font-bold text-mande-black hover:text-mande-earth transition-colors line-clamp-1"
                      >
                        {item.name}
                      </Link>
                      <div className="text-xs text-gray-500 font-sans space-x-3">
                        {item.size && <span>Taille : <strong>{item.size}</strong></span>}
                        {item.color && <span>&bull; Coloris : <strong>{item.color}</strong></span>}
                      </div>
                      <div className="font-serif text-sm font-semibold text-mande-earth pt-1">
                        Prix unitaire : {formatPrice(item.price, currency)}
                      </div>
                    </div>

                    {/* Quantity & Subtotal */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4">
                      <div className="flex items-center border border-mande-sandDark bg-mande-ivoryLight">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1.5 hover:bg-mande-sand/30 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1.5 hover:bg-mande-sand/30 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="font-serif text-base font-bold text-mande-black">
                          {formatPrice(item.price * item.quantity, currency)}
                        </span>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                          aria-label="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reassurance Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs text-gray-600 font-sans">
              <div className="bg-white p-4 border border-mande-ivoryDark flex items-center gap-3">
                <Truck className="w-5 h-5 text-mande-gold flex-shrink-0" />
                <span>Expédition suivie par transporteur agréé</span>
              </div>
              <div className="bg-white p-4 border border-mande-ivoryDark flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-mande-gold flex-shrink-0" />
                <span>Paiement crypté 256 bits</span>
              </div>
              <div className="bg-white p-4 border border-mande-ivoryDark flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-mande-gold flex-shrink-0" />
                <span>Certificat d’authenticité Bôkôlan inclus</span>
              </div>
            </div>
          </div>

          {/* Right: Order Summary Box */}
          <div className="space-y-6">
            <div className="bg-white border border-mande-ivoryDark p-6 shadow-card space-y-6">
              <h3 className="font-serif text-lg font-bold uppercase tracking-wider text-mande-black pb-4 border-b border-mande-ivoryDark">
                Récapitulatif de Commande
              </h3>

              {/* Promo Code Form */}
              <form onSubmit={handleApplyPromo} className="space-y-2">
                <label className="text-xs uppercase tracking-wider font-semibold text-gray-700 font-sans block">
                  Code Privilège / Carte Cadeau
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Ex: MANDE10"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="w-full text-xs px-3 py-2.5 bg-mande-ivoryLight border border-mande-sandDark uppercase font-mono focus:outline-none focus:border-mande-gold"
                    />
                    <Tag className="w-4 h-4 text-gray-400 absolute right-3 top-3" />
                  </div>
                  <button
                    type="submit"
                    disabled={promoLoading || !promoInput}
                    className="px-4 py-2.5 bg-mande-black text-mande-gold text-xs uppercase tracking-wider font-bold hover:bg-mande-gold hover:text-mande-black transition-colors disabled:opacity-50"
                  >
                    {promoLoading ? '...' : 'Appliquer'}
                  </button>
                </div>

                {promoMessage && (
                  <p className={`text-xs ${promoMessage.success ? 'text-green-700' : 'text-red-600'}`}>
                    {promoMessage.text}
                  </p>
                )}

                {appliedPromo && (
                  <div className="flex items-center justify-between text-xs bg-mande-gold/15 border border-mande-gold/40 p-2.5 text-mande-gold font-medium">
                    <span>
                      Code <strong>{appliedPromo.code}</strong> actif (-
                      {appliedPromo.discountType === 'PERCENTAGE'
                        ? `${appliedPromo.value}%`
                        : `${appliedPromo.value} FCFA`}
                      )
                    </span>
                    <button
                      onClick={removePromoCode}
                      className="text-red-500 hover:text-red-700 font-bold ml-2 text-sm"
                    >
                      ×
                    </button>
                  </div>
                )}
              </form>

              {/* Breakdown */}
              <div className="space-y-3 pt-4 border-t border-mande-ivoryDark text-xs font-sans">
                <div className="flex justify-between text-gray-600">
                  <span>Sous-total articles</span>
                  <span className="font-semibold text-mande-black">{formatPrice(subtotal, currency)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-700 font-medium">
                    <span>Réduction appliquée</span>
                    <span>-{formatPrice(discountAmount, currency)}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-600">
                  <span>Frais de livraison estimés</span>
                  <span>Calculés au paiement</span>
                </div>

                <div className="pt-3 border-t border-mande-ivoryDark flex justify-between items-baseline">
                  <span className="font-serif text-base font-bold text-mande-black">Total Estimé</span>
                  <span className="font-serif text-xl font-bold text-mande-earth">
                    {formatPrice(total, currency)}
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              <div className="pt-2 space-y-3">
                <Link href="/checkout" className="block w-full">
                  <Button
                    variant="gold"
                    size="lg"
                    className="w-full shadow-gold-md"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Procéder au Paiement
                  </Button>
                </Link>

                <Link href="/boutique" className="block text-center text-xs text-gray-500 hover:text-mande-black transition-colors font-sans underline">
                  Continuer mes achats
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
