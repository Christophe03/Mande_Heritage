'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';
import { formatPrice } from '@/lib/utils';
import { 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  Smartphone, 
  QrCode, 
  Banknote, 
  CheckCircle, 
  AlertCircle, 
  Lock,
  ArrowRight
} from 'lucide-react';
import { Button } from '../ui/Button';
import { BogolanBorder, BogolanDivider } from '../ui/BogolanPattern';

interface ShippingZoneItem {
  id: string;
  zoneName: string;
  countries: string;
  estimatedDays: string;
  price: number;
}

interface CheckoutFormProps {
  shippingZones: ShippingZoneItem[];
  userSession?: any;
}

export function CheckoutForm({ shippingZones, userSession }: CheckoutFormProps) {
  const router = useRouter();
  const { items, subtotal, discountAmount, total, appliedPromo, clearCart } = useCart();
  const { currency } = useCurrency();

  // Form State
  const [formData, setFormData] = useState({
    fullName: userSession?.name || '',
    email: userSession?.email || '',
    phone: '',
    address: '',
    city: 'Bamako',
    country: 'Mali',
    notes: '',
  });

  const [selectedZoneId, setSelectedZoneId] = useState<string>(
    shippingZones[0]?.id || ''
  );

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('ORANGE_MONEY');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Calculate selected shipping cost
  const activeZone = shippingZones.find((z) => z.id === selectedZoneId) || shippingZones[0];
  
  // Free shipping check for Mali above 100k FCFA
  const isFreeShippingApplicable = 
    activeZone && 
    activeZone.zoneName.toLowerCase().includes('bamako') && 
    subtotal >= 100000;

  const actualShippingCost = isFreeShippingApplicable ? 0 : (activeZone?.price || 0);
  const grandTotal = total + actualShippingCost;

  if (items.length === 0) {
    return (
      <div className="text-center py-20 bg-white border border-mande-ivoryDark p-10 max-w-md mx-auto shadow-card">
        <h2 className="font-serif text-xl font-bold mb-4">Votre panier est vide</h2>
        <p className="text-xs text-gray-500 mb-6 font-sans">
          Veuillez sélectionner au moins une création avant de procéder au paiement.
        </p>
        <Button onClick={() => router.push('/boutique')} variant="gold" size="md">
          Explorer la Boutique
        </Button>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Auto-select shipping zone if country changes
    if (name === 'country') {
      const lower = value.toLowerCase();
      if (lower.includes('mali')) {
        const maliZone = shippingZones.find((z) => z.zoneName.toLowerCase().includes('bamako'));
        if (maliZone) setSelectedZoneId(maliZone.id);
      } else if (
        lower.includes('sénégal') ||
        lower.includes('senegal') ||
        lower.includes('ivoire') ||
        lower.includes('burkina') ||
        lower.includes('guinée')
      ) {
        const uemoaZone = shippingZones.find((z) => z.zoneName.toLowerCase().includes('afrique'));
        if (uemoaZone) setSelectedZoneId(uemoaZone.id);
      } else {
        const worldZone = shippingZones.find((z) => z.zoneName.toLowerCase().includes('diaspora') || z.zoneName.toLowerCase().includes('international'));
        if (worldZone) setSelectedZoneId(worldZone.id);
      }
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    if (!formData.fullName || !formData.email || !formData.phone || !formData.address) {
      setErrorMessage('Veuillez renseigner tous les champs obligatoires (nom, email, téléphone, adresse).');
      setIsSubmitting(false);
      return;
    }

    try {
      const orderPayload = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        country: formData.country,
        notes: formData.notes,
        shippingZoneId: selectedZoneId,
        shippingCost: actualShippingCost,
        paymentMethod: selectedPaymentMethod,
        items: items.map((i) => ({
          productId: i.productId,
          size: i.size,
          color: i.color,
          quantity: i.quantity,
          unitPrice: i.price,
        })),
        subtotal,
        discount: discountAmount,
        total: grandTotal,
        promoCode: appliedPromo?.code,
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Erreur lors de la création de votre commande.');
      }

      // Clear cart on success and navigate to confirmation
      clearCart();
      router.push(`/commande/${data.orderId}`);
    } catch (err: any) {
      console.error('Order creation error:', err);
      setErrorMessage(err.message || 'Une erreur inattendue est survenue.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const paymentOptions = [
    {
      id: 'ORANGE_MONEY',
      title: 'Orange Money',
      badge: 'Instantané',
      description: 'Paiement sécurisé via votre compte Orange Money Mali ou Afrique de l’Ouest.',
      icon: Smartphone,
    },
    {
      id: 'WAVE',
      title: 'Wave Mobile Money',
      badge: '0% Frais',
      description: 'Paiement direct sans frais par scan QR Code ou validation dans l’application Wave.',
      icon: QrCode,
    },
    {
      id: 'CARD',
      title: 'Carte Bancaire / Visa & Mastercard',
      badge: 'International',
      description: 'Transaction chiffrée 3D-Secure pour cartes de crédit ou débit bancaires.',
      icon: CreditCard,
    },
    {
      id: 'CASH_ON_DELIVERY',
      title: 'Paiement à la Livraison (Bamako)',
      badge: 'Main propre',
      description: 'Réglez directement en espèces ou Mobile Money auprès du coursier Mandé Héritage.',
      icon: Banknote,
    },
  ];

  return (
    <form onSubmit={handleSubmitOrder} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {errorMessage && (
        <div className="mb-8 p-4 bg-red-50 border border-red-300 text-red-700 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left 2 Cols: Contact, Address, Shipping & Payment Form */}
        <div className="lg:col-span-2 space-y-8">
          {/* Step 1: Coordonnées & Livraison */}
          <div className="bg-white p-6 sm:p-8 border border-mande-ivoryDark shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-mande-ivoryDark">
              <h2 className="font-serif text-lg font-bold uppercase tracking-wider text-mande-black flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-mande-black text-mande-gold text-xs flex items-center justify-center font-mono">
                  1
                </span>
                <span>Coordonnées & Adresse de Livraison</span>
              </h2>
              <span className="text-[10px] text-gray-400 font-sans uppercase tracking-widest">
                Étape 1 sur 2
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wider font-semibold text-gray-700 font-sans">
                  Nom complet *
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder="Ex: Aïssata Coulibaly"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 bg-mande-ivoryLight border border-mande-sandDark text-xs text-mande-black focus:outline-none focus:border-mande-gold font-sans"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wider font-semibold text-gray-700 font-sans">
                  Adresse Email *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Ex: aissata@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 bg-mande-ivoryLight border border-mande-sandDark text-xs text-mande-black focus:outline-none focus:border-mande-gold font-sans"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wider font-semibold text-gray-700 font-sans">
                  Téléphone (pour livraison & Mobile Money) *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="Ex: +223 76 12 34 56"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 bg-mande-ivoryLight border border-mande-sandDark text-xs text-mande-black focus:outline-none focus:border-mande-gold font-sans font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wider font-semibold text-gray-700 font-sans">
                  Pays de Destination *
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 bg-mande-ivoryLight border border-mande-sandDark text-xs text-mande-black focus:outline-none focus:border-mande-gold font-sans"
                >
                  <option value="Mali">Mali</option>
                  <option value="Sénégal">Sénégal</option>
                  <option value="Côte d’Ivoire">Côte d’Ivoire</option>
                  <option value="Burkina Faso">Burkina Faso</option>
                  <option value="Guinée">Guinée</option>
                  <option value="France">France</option>
                  <option value="États-Unis">États-Unis (USA)</option>
                  <option value="Canada">Canada</option>
                  <option value="Belgique">Belgique</option>
                  <option value="Suisse">Suisse</option>
                  <option value="Autre">Autre destination internationale</option>
                </select>
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs uppercase tracking-wider font-semibold text-gray-700 font-sans">
                  Adresse précise, Quartier, Rue ou Porte *
                </label>
                <input
                  type="text"
                  name="address"
                  required
                  placeholder="Ex: ACI 2000, Rue 340, Immeuble Horizon, Apt 4"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 bg-mande-ivoryLight border border-mande-sandDark text-xs text-mande-black focus:outline-none focus:border-mande-gold font-sans"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wider font-semibold text-gray-700 font-sans">
                  Ville / Commune *
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  placeholder="Ex: Bamako"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 bg-mande-ivoryLight border border-mande-sandDark text-xs text-mande-black focus:outline-none focus:border-mande-gold font-sans"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wider font-semibold text-gray-700 font-sans">
                  Instructions de livraison (facultatif)
                </label>
                <input
                  type="text"
                  name="notes"
                  placeholder="Ex: Appeler à l'arrivée / Déposer chez le gardien"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 bg-mande-ivoryLight border border-mande-sandDark text-xs text-mande-black focus:outline-none focus:border-mande-gold font-sans"
                />
              </div>
            </div>

            {/* Shipping Zone Selector */}
            <div className="pt-4 border-t border-mande-ivoryDark">
              <label className="block text-xs uppercase tracking-wider font-bold text-mande-black font-sans mb-3">
                Mode d’expédition & Délais
              </label>
              <div className="space-y-2">
                {shippingZones.map((zone) => {
                  const isZoneFree = 
                    zone.zoneName.toLowerCase().includes('bamako') && subtotal >= 100000;
                  const isSelected = selectedZoneId === zone.id;

                  return (
                    <label
                      key={zone.id}
                      className={`flex items-center justify-between p-3.5 border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-mande-gold bg-mande-gold/10'
                          : 'border-mande-sandDark bg-white hover:border-mande-gold'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shippingZone"
                          checked={isSelected}
                          onChange={() => setSelectedZoneId(zone.id)}
                          className="accent-mande-gold"
                        />
                        <div>
                          <p className="font-serif text-sm font-semibold text-mande-black">
                            {zone.zoneName}
                          </p>
                          <p className="text-[11px] text-gray-500 font-sans">
                            {zone.estimatedDays} &bull; {zone.countries}
                          </p>
                        </div>
                      </div>
                      <div className="text-right font-serif text-sm font-bold text-mande-earth">
                        {isZoneFree ? (
                          <span className="text-green-700 uppercase font-sans text-xs">
                            Offert
                          </span>
                        ) : (
                          formatPrice(zone.price, currency)
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Step 2: Modular Payment Method */}
          <div className="bg-white p-6 sm:p-8 border border-mande-ivoryDark shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-mande-ivoryDark">
              <h2 className="font-serif text-lg font-bold uppercase tracking-wider text-mande-black flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-mande-black text-mande-gold text-xs flex items-center justify-center font-mono">
                  2
                </span>
                <span>Mode de Paiement Sécurisé</span>
              </h2>
              <span className="text-[10px] text-gray-400 font-sans uppercase tracking-widest flex items-center gap-1">
                <Lock className="w-3 h-3 text-mande-gold" /> Chiffrement SSL
              </span>
            </div>

            <div className="space-y-3">
              {paymentOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = selectedPaymentMethod === opt.id;
                return (
                  <label
                    key={opt.id}
                    className={`flex items-start gap-4 p-4 border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-mande-gold bg-mande-gold/10'
                        : 'border-mande-sandDark bg-white hover:border-mande-gold'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={opt.id}
                      checked={isSelected}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      className="mt-1 accent-mande-gold"
                    />
                    <div className="w-9 h-9 rounded-none bg-mande-black text-mande-gold flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-serif text-sm font-bold text-mande-black">
                          {opt.title}
                        </span>
                        <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-mande-surface text-mande-gold border border-mande-gold/30 font-sans">
                          {opt.badge}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 font-sans mt-0.5 font-light">
                        {opt.description}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Col: Order Summary & Validation Button */}
        <div className="space-y-6">
          <div className="bg-white border border-mande-ivoryDark p-6 shadow-card space-y-6 sticky top-28">
            <h3 className="font-serif text-lg font-bold uppercase tracking-wider text-mande-black pb-3 border-b border-mande-ivoryDark">
              Détail de la Commande
            </h3>

            {/* List of ordered items */}
            <div className="max-h-60 overflow-y-auto divide-y divide-mande-ivoryDark space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 pt-3 first:pt-0">
                  <div className="relative w-14 h-16 bg-mande-sand/10 border border-mande-ivoryDark flex-shrink-0 overflow-hidden">
                    <Image
                      src={item.image || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=200'}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                    <span className="absolute top-0 right-0 bg-mande-black text-mande-gold text-[9px] font-bold px-1.5 py-0.5">
                      x{item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 text-xs">
                    <h4 className="font-serif font-semibold text-mande-black line-clamp-1">{item.name}</h4>
                    <p className="text-[11px] text-gray-500">{item.size} &bull; {item.color}</p>
                    <p className="font-serif font-bold text-mande-earth mt-1">
                      {formatPrice(item.price * item.quantity, currency)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Breakdown */}
            <div className="space-y-2.5 pt-4 border-t border-mande-ivoryDark text-xs font-sans">
              <div className="flex justify-between text-gray-600">
                <span>Sous-total</span>
                <span>{formatPrice(subtotal, currency)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-green-700 font-medium">
                  <span>Réduction ({appliedPromo?.code})</span>
                  <span>-{formatPrice(discountAmount, currency)}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-600">
                <span>Frais de livraison</span>
                <span>
                  {actualShippingCost === 0 ? (
                    <strong className="text-green-700 uppercase">Offerte</strong>
                  ) : (
                    formatPrice(actualShippingCost, currency)
                  )}
                </span>
              </div>

              <div className="pt-3 border-t border-mande-ivoryDark flex justify-between items-baseline">
                <span className="font-serif text-base font-bold text-mande-black">Total à Payer</span>
                <span className="font-serif text-2xl font-bold text-mande-earth">
                  {formatPrice(grandTotal, currency)}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="gold"
              size="lg"
              isLoading={isSubmitting}
              className="w-full shadow-gold-md"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Confirmer & Régler la Commande
            </Button>

            <div className="text-[11px] text-gray-500 font-sans text-center space-y-1">
              <p className="flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-mande-gold" />
                <span>Paiement sécurisé et conforme aux normes bancaires</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
