'use client';

import React from 'react';
import Image from 'next/image';
import { Printer, Download, X, CheckCircle, ShieldCheck } from 'lucide-react';
import { formatPrice, formatDate, safeJsonParse } from '@/lib/utils';
import { Button } from '../ui/Button';

interface OrderInvoiceModalProps {
  order: any;
  isOpen: boolean;
  onClose: () => void;
}

export function OrderInvoiceModal({ order, isOpen, onClose }: OrderInvoiceModalProps) {
  if (!isOpen || !order) return null;

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
    address: 'Bamako',
    city: 'Bamako',
    country: 'Mali',
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm p-4 sm:p-6 flex items-center justify-center">
      <div className="relative bg-white text-mande-black border border-mande-gold max-w-3xl w-full p-8 sm:p-12 shadow-2xl space-y-8 print:p-0 print:border-0 print:shadow-none">
        {/* Modal Top Actions (Hidden on Print) */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200 print:hidden">
          <span className="text-xs uppercase tracking-widest text-mande-gold font-sans font-bold">
            Facture Officielle Proforma &bull; Maison Mandé Héritage
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-mande-black hover:bg-mande-gold hover:text-mande-black text-mande-ivory transition-colors text-xs font-semibold uppercase tracking-wider flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimer / Sauvegarder PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-6 border-b-2 border-mande-gold">
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 flex-shrink-0">
              <Image
                src="/images/logo/logo.png"
                alt="Mandé Héritage"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold tracking-widest uppercase text-mande-black">
                MANDÉ HÉRITAGE
              </h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-mande-gold font-sans font-semibold">
                Maison de Haute Confection &bull; Bamako / Paris
              </p>
              <p className="text-[11px] text-gray-500 font-sans mt-0.5">
                contact@mandeheritage.com &bull; +223 70 00 00 01
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right font-sans text-xs space-y-1">
            <div className="inline-block px-3 py-1 bg-mande-black text-mande-gold font-mono font-bold text-xs uppercase tracking-wider">
              FACTURE #{order.orderNumber}
            </div>
            <p className="text-gray-600">Date d’émission : <strong>{formatDate(order.createdAt)}</strong></p>
            <p className="text-gray-600">Statut Règlement : <strong className="text-green-700 uppercase">{order.paymentStatus}</strong></p>
          </div>
        </div>

        {/* Client & Delivery Addresses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs font-sans bg-mande-ivoryLight p-6 border border-mande-ivoryDark">
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase tracking-widest text-mande-gold font-bold block">
              Destinataire & Facturation :
            </span>
            <p className="font-serif text-base font-bold text-mande-black">{shippingInfo.fullName}</p>
            <p className="text-gray-600">{shippingInfo.email}</p>
            <p className="text-gray-600 font-mono">{shippingInfo.phone}</p>
          </div>

          <div className="space-y-1.5 border-t sm:border-t-0 sm:border-l border-gray-200 pt-4 sm:pt-0 sm:pl-6">
            <span className="text-[10px] uppercase tracking-widest text-mande-gold font-bold block">
              Lieu de Livraison & Acheminement :
            </span>
            <p className="text-gray-800 font-medium">{shippingInfo.address}</p>
            <p className="text-gray-800 font-semibold">{shippingInfo.city}, {shippingInfo.country}</p>
            <p className="text-gray-600 mt-2">
              Mode de paiement : <strong>{order.paymentMethod}</strong>
            </p>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="space-y-2">
          <table className="w-full text-xs text-left font-sans border-collapse">
            <thead>
              <tr className="border-b-2 border-mande-black text-gray-700 uppercase tracking-wider text-[11px]">
                <th className="py-3">Désignation de la Pièce</th>
                <th className="py-3 text-center">Taille / Coloris</th>
                <th className="py-3 text-center">Quantité</th>
                <th className="py-3 text-right">Prix Unitaire</th>
                <th className="py-3 text-right">Total Net</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {order.items?.map((item: any) => (
                <tr key={item.id}>
                  <td className="py-3.5">
                    <p className="font-serif font-bold text-sm text-mande-black">
                      {item.product?.name || 'Création Mandé Héritage'}
                    </p>
                    <p className="text-[11px] text-gray-500 font-sans">
                      Bôkôlan véritable peint main &bull; Coton biologique
                    </p>
                  </td>
                  <td className="py-3.5 text-center font-medium text-gray-700">
                    {item.size || 'Unique'} / {item.color || 'Bôkôlan'}
                  </td>
                  <td className="py-3.5 text-center font-mono font-bold">
                    {item.quantity}
                  </td>
                  <td className="py-3.5 text-right font-mono text-gray-700">
                    {formatPrice(item.unitPrice)}
                  </td>
                  <td className="py-3.5 text-right font-serif font-bold text-mande-black">
                    {formatPrice(item.unitPrice * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Breakdown */}
        <div className="flex justify-end pt-4 border-t-2 border-mande-gold">
          <div className="w-full sm:w-80 space-y-2 text-xs font-sans">
            <div className="flex justify-between text-gray-600">
              <span>Sous-total HT :</span>
              <span className="font-mono">{formatPrice(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-green-700 font-medium">
                <span>Remise Privilège / Code :</span>
                <span className="font-mono">-{formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-600">
              <span>Frais d’expédition :</span>
              <span className="font-mono">
                {order.shippingCost === 0 ? 'Offerts' : formatPrice(order.shippingCost)}
              </span>
            </div>
            <div className="pt-3 border-t border-mande-black flex justify-between font-serif text-lg font-bold text-mande-black">
              <span>TOTAL NET TTC :</span>
              <span className="text-mande-earth">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Official Sceau & Legal Notice */}
        <div className="pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-gray-500 font-sans text-center sm:text-left">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-mande-gold" />
            <span>
              Certificat d’Authenticité &bull; Pièce garantie confectionnée selon les règles ancestrales du Bôkôlan malien.
            </span>
          </div>
          <div className="text-right font-serif uppercase tracking-widest text-mande-gold font-bold">
            Maison Mandé Héritage
          </div>
        </div>
      </div>
    </div>
  );
}
