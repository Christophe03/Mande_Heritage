'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';
import { formatPrice } from '@/lib/utils';
import { Button } from '../ui/Button';

export function CartDrawer() {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeItem,
    updateQuantity,
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

  if (!isCartOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 100000; // 100,000 FCFA
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

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-mande-ivory text-mande-black shadow-2xl flex flex-col border-l border-mande-gold/30 animate-slideLeft">
          {/* Header */}
          <div className="p-6 border-b border-mande-ivoryDark flex items-center justify-between bg-mande-ivoryLight">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-mande-gold" />
              <h2 className="font-serif text-lg uppercase tracking-wider font-bold">
                Votre Panier ({items.reduce((s, i) => s + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 hover:text-mande-gold transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Free Shipping Progress */}
          <div className="bg-mande-black text-mande-ivory px-6 py-3 text-xs border-b border-mande-gold/30">
            {remainingForFreeShipping > 0 ? (
              <p className="mb-1 text-center">
                Plus que{' '}
                <span className="text-mande-gold font-bold">
                  {formatPrice(remainingForFreeShipping, currency)}
                </span>{' '}
                pour la <strong className="text-mande-gold">livraison offerte</strong> au Mali
              </p>
            ) : (
              <p className="mb-1 text-center text-mande-gold font-bold">
                ✨ Félicitations ! Vous bénéficiez de la livraison offerte.
              </p>
            )}
            <div className="w-full bg-mande-surface h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-mande-gold to-mande-goldDark h-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="relative w-20 h-20 mb-4">
                  <Image
                    src="/images/logo/logo.png"
                    alt="Mandé Héritage"
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="font-serif text-lg font-bold mb-2">Votre panier est vide</h3>
                <p className="text-xs text-gray-500 max-w-xs mb-6 font-sans">
                  Découvrez nos créations d’exception en Bôkôlan véritable et sublimez votre allure.
                </p>
                <Button
                  onClick={() => setIsCartOpen(false)}
                  variant="gold"
                  size="sm"
                >
                  <Link href="/boutique">Explorer la Boutique</Link>
                </Button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 pb-6 border-b border-mande-ivoryDark group"
                >
                  {/* Thumbnail */}
                  <div className="relative w-20 h-24 bg-mande-sand/20 flex-shrink-0 overflow-hidden border border-mande-ivoryDark">
                    <Image
                      src={item.image || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=300'}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <Link
                          href={`/produit/${item.slug}`}
                          onClick={() => setIsCartOpen(false)}
                          className="font-serif text-sm font-semibold hover:text-mande-gold transition-colors line-clamp-1"
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                          aria-label="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-[11px] text-gray-500 mt-0.5 space-x-2">
                        {item.size && <span>Taille : {item.size}</span>}
                        {item.color && <span>&bull; {item.color}</span>}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Controller */}
                      <div className="flex items-center border border-mande-sandDark">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-mande-sand/30 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-mande-sand/30 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-serif text-sm font-bold text-mande-earth">
                        {formatPrice(item.price * item.quantity, currency)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with summary & checkout */}
          {items.length > 0 && (
            <div className="p-6 border-t border-mande-ivoryDark bg-mande-ivoryLight space-y-4">
              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="space-y-1.5">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Code promo (ex: MANDE10)"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-mande-sandDark bg-white focus:outline-none focus:border-mande-gold uppercase font-mono"
                    />
                    <Tag className="w-3.5 h-3.5 absolute right-2.5 top-2.5 text-gray-400" />
                  </div>
                  <button
                    type="submit"
                    disabled={promoLoading || !promoInput}
                    className="px-3 py-2 bg-mande-black text-mande-ivory text-xs uppercase tracking-wider hover:bg-mande-gold hover:text-mande-black transition-colors disabled:opacity-50 font-medium"
                  >
                    {promoLoading ? '...' : 'Appliquer'}
                  </button>
                </div>

                {promoMessage && (
                  <p
                    className={`text-[11px] ${
                      promoMessage.success ? 'text-green-700' : 'text-red-600'
                    }`}
                  >
                    {promoMessage.text}
                  </p>
                )}

                {appliedPromo && (
                  <div className="flex items-center justify-between text-xs bg-mande-gold/10 border border-mande-gold/30 px-3 py-1 text-mande-gold font-medium">
                    <span>
                      Code <strong>{appliedPromo.code}</strong> actif (-
                      {appliedPromo.discountType === 'PERCENTAGE'
                        ? `${appliedPromo.value}%`
                        : `${appliedPromo.value} FCFA`}
                      )
                    </span>
                    <button
                      onClick={removePromoCode}
                      className="text-gray-500 hover:text-red-600 text-xs font-bold ml-2"
                    >
                      ×
                    </button>
                  </div>
                )}
              </form>

              {/* Subtotal / Total */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Sous-total</span>
                  <span>{formatPrice(subtotal, currency)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-700 font-medium">
                    <span>Réduction</span>
                    <span>-{formatPrice(discountAmount, currency)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-serif font-bold text-mande-black pt-2 border-t border-mande-ivoryDark">
                  <span>Total estimé</span>
                  <span className="text-mande-earth">{formatPrice(total, currency)}</span>
                </div>
                <p className="text-[10px] text-gray-500">
                  Frais de livraison calculés lors de l’étape de paiement selon votre pays.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="block w-full"
                >
                  <Button variant="gold" size="md" className="w-full" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Passer la Commande
                  </Button>
                </Link>
                <Link
                  href="/panier"
                  onClick={() => setIsCartOpen(false)}
                  className="block w-full"
                >
                  <Button variant="dark-outline" size="sm" className="w-full">
                    Voir le Panier Détaillé
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
