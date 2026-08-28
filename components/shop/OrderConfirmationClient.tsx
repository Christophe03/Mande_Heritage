'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  CheckCircle, 
  Package, 
  Truck, 
  Clock, 
  Printer, 
  MessageCircle, 
  ArrowRight,
  ShieldCheck,
  Download,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { BogolanBorder, BogolanDivider } from '@/components/ui/BogolanPattern';
import { formatPrice, formatDate, safeJsonParse } from '@/lib/utils';
import { OrderInvoiceModal } from './OrderInvoiceModal';

interface OrderConfirmationClientProps {
  order: any;
}

export function OrderConfirmationClient({ order }: OrderConfirmationClientProps) {
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);

  const shippingInfo = safeJsonParse<{
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
  }>(order.shippingAddress, {
    fullName: 'Client Mandé',
    email: '',
    phone: '',
    address: '',
    city: 'Bamako',
    country: 'Mali',
  });

  const statuses = [
    { key: 'NOUVELLE', label: 'Enregistrée' },
    { key: 'CONFIRMEE', label: 'Confirmée' },
    { key: 'EN_PREPARATION', label: 'En Confection / Préparation' },
    { key: 'EXPEDIEE', label: 'Expédiée' },
    { key: 'LIVREE', label: 'Livrée' },
  ];

  const currentStatusIndex = statuses.findIndex((s) => s.key === order.status);

  return (
    <div className="pt-28 pb-24 min-h-screen bg-mande-ivory">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Banner */}
        <div className="bg-white p-8 border border-mande-ivoryDark shadow-card text-center mb-8 relative overflow-hidden flex flex-col items-center">
          <div className="relative w-20 h-20 mb-3">
            <Image
              src="/images/logo/logo.png"
              alt="Mandé Héritage"
              fill
              className="object-contain"
              priority
            />
          </div>

          <div className="w-12 h-12 rounded-full bg-mande-gold/20 text-mande-gold flex items-center justify-center mx-auto mb-3 border border-mande-gold/40">
            <CheckCircle className="w-6 h-6" />
          </div>

          <span className="text-xs uppercase tracking-[0.25em] text-mande-gold font-sans font-semibold">
            Commande Validée avec Succès
          </span>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold uppercase tracking-wider text-mande-black mt-1 mb-2">
            Merci pour Votre Confiance
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 font-sans max-w-lg mx-auto">
            Votre commande <strong className="text-mande-black font-mono">{order.orderNumber}</strong> a été transmise à notre atelier. Un email de confirmation vous a été adressé.
          </p>

          {/* Quick Invoice Action Button */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setInvoiceModalOpen(true)}
              className="inline-flex items-center gap-2 py-2 px-4 bg-mande-black hover:bg-mande-gold hover:text-mande-black text-mande-ivory font-sans font-semibold uppercase tracking-wider text-xs transition-colors shadow-sm"
            >
              <FileText className="w-4 h-4 text-mande-gold" />
              <span>Télécharger Facture PDF / Imprimer</span>
            </button>
          </div>

          <BogolanDivider variant="gold" className="my-6" />

          {/* Status Stepper */}
          <div className="mt-4 pt-4 border-t border-mande-ivoryDark w-full">
            <h3 className="font-serif text-xs uppercase tracking-widest font-bold text-gray-500 mb-6 text-center">
              Suivi d’Acheminement en Temps Réel
            </h3>
            <div className="relative flex items-center justify-between">
              {/* Progress Line */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-mande-ivoryDark w-full -z-0" />
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-mande-gold transition-all duration-700 -z-0"
                style={{
                  width: `${(Math.max(0, currentStatusIndex) / (statuses.length - 1)) * 100}%`,
                }}
              />

              {statuses.map((st, idx) => {
                const isPassed = idx <= currentStatusIndex;
                const isCurrent = idx === currentStatusIndex;

                return (
                  <div key={st.key} className="relative z-10 flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                        isPassed
                          ? 'bg-mande-gold border-mande-gold text-mande-black'
                          : 'bg-white border-mande-ivoryDark text-gray-400'
                      } ${isCurrent ? 'ring-4 ring-mande-gold/30 scale-110' : ''}`}
                    >
                      {isPassed ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                    </div>
                    <span
                      className={`mt-2 text-[10px] sm:text-xs font-sans uppercase tracking-wider max-w-[80px] sm:max-w-none text-center ${
                        isCurrent ? 'font-bold text-mande-black' : isPassed ? 'text-gray-700' : 'text-gray-400'
                      }`}
                    >
                      {st.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Order Details Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Column 1: Order Details */}
          <div className="bg-white p-6 border border-mande-ivoryDark shadow-sm space-y-2 text-xs font-sans">
            <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-mande-black pb-2 border-b border-mande-ivoryDark">
              Détails Commande
            </h3>
            <p className="text-gray-600">Numéro : <strong className="text-mande-black font-mono">{order.orderNumber}</strong></p>
            <p className="text-gray-600">Date : <strong>{formatDate(order.createdAt)}</strong></p>
            <p className="text-gray-600">Paiement : <strong>{order.paymentMethod}</strong></p>
            <p className="text-gray-600">Statut : <span className="px-2 py-0.5 bg-green-50 text-green-700 font-bold border border-green-200 uppercase text-[10px]">{order.paymentStatus}</span></p>
          </div>

          {/* Column 2: Delivery Destination */}
          <div className="bg-white p-6 border border-mande-ivoryDark shadow-sm space-y-2 text-xs font-sans">
            <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-mande-black pb-2 border-b border-mande-ivoryDark">
              Adresse de Livraison
            </h3>
            <p className="font-semibold text-mande-black">{shippingInfo.fullName}</p>
            <p className="text-gray-600">{shippingInfo.address}</p>
            <p className="text-gray-600">{shippingInfo.city}, {shippingInfo.country}</p>
            <p className="text-gray-600">Tél : <strong>{shippingInfo.phone}</strong></p>
          </div>

          {/* Column 3: Concierge Help */}
          <div className="bg-mande-black text-mande-ivory p-6 border border-mande-gold/30 shadow-sm space-y-3 text-xs font-sans flex flex-col justify-between">
            <div>
              <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-mande-gold pb-2 border-b border-mande-surface">
                Conciergerie Dédiée
              </h3>
              <p className="text-gray-300 font-light mt-2">
                Pour toute modification, demande d’ajustement sur-mesure ou question sur l’expédition.
              </p>
            </div>
            <a
              href={`https://wa.me/22370000001?text=Bonjour%20Mand%C3%A9%20H%C3%A9ritage,%20je%20vous%20contacte%20concernant%20ma%20commande%20${order.orderNumber}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 py-2 px-3 bg-mande-gold text-mande-black font-semibold uppercase tracking-wider text-xs hover:bg-mande-goldLight transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Contacter sur WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Ordered Items Table */}
        <div className="bg-white border border-mande-ivoryDark shadow-card overflow-hidden mb-8">
          <div className="p-6 border-b border-mande-ivoryDark flex items-center justify-between">
            <h2 className="font-serif text-lg font-bold uppercase tracking-wider text-mande-black">
              Pièces Commandées ({order.items.length})
            </h2>
            <span className="text-xs font-sans text-gray-500">
              Total TTC : <strong className="text-mande-earth font-serif text-base">{formatPrice(order.total)}</strong>
            </span>
          </div>

          <div className="divide-y divide-mande-ivoryDark p-6">
            {order.items.map((item: any) => {
              const images = item.product?.images ? safeJsonParse<string[]>(item.product.images, []) : [];
              const firstImage = images[0] || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=200';

              return (
                <div key={item.id} className="py-4 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-20 bg-mande-sand/10 border border-mande-ivoryDark flex-shrink-0 overflow-hidden">
                      <Image src={firstImage} alt={item.product?.name || 'Produit'} fill className="object-cover" />
                    </div>
                    <div className="text-xs font-sans">
                      <h4 className="font-serif font-bold text-sm text-mande-black">
                        {item.product?.name || 'Création Mandé'}
                      </h4>
                      <p className="text-gray-500 mt-1">
                        Taille : <strong className="text-mande-black">{item.size}</strong> &bull; Coloris : {item.color}
                      </p>
                      <p className="text-gray-500">
                        Quantité : <strong className="text-mande-black">{item.quantity}</strong> &times; {formatPrice(item.unitPrice)}
                      </p>
                    </div>
                  </div>

                  <span className="font-serif font-bold text-sm text-mande-earth">
                    {formatPrice(item.unitPrice * item.quantity)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Pricing Totals Footer */}
          <div className="bg-mande-ivoryLight p-6 border-t border-mande-ivoryDark flex flex-col items-end text-xs font-sans space-y-2">
            <div className="w-64 flex justify-between text-gray-600">
              <span>Sous-total :</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="w-64 flex justify-between text-green-700 font-semibold">
                <span>Remise Privilège :</span>
                <span>-{formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="w-64 flex justify-between text-gray-600">
              <span>Frais de livraison :</span>
              <span>{order.shippingCost === 0 ? 'Offerts' : formatPrice(order.shippingCost)}</span>
            </div>
            <div className="w-64 pt-2 border-t border-mande-ivoryDark flex justify-between font-serif text-base font-bold text-mande-black">
              <span>Total Payé :</span>
              <span className="text-mande-earth">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/boutique">
            <Button variant="gold" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Continuer vers la Boutique
            </Button>
          </Link>
          <button
            onClick={() => setInvoiceModalOpen(true)}
            className="text-xs uppercase font-sans font-semibold tracking-wider text-mande-earth hover:text-mande-gold transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimer la Facture Proforma</span>
          </button>
        </div>
      </div>

      {/* Official Invoice Modal */}
      <OrderInvoiceModal
        order={order}
        isOpen={invoiceModalOpen}
        onClose={() => setInvoiceModalOpen(false)}
      />
    </div>
  );
}
