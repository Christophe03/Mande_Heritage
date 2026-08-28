'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Truck, 
  Globe, 
  Clock, 
  Plus, 
  Edit, 
  Trash2, 
  X, 
  CheckCircle, 
  DollarSign,
  ShieldCheck
} from 'lucide-react';
import { Button } from '../ui/Button';
import { formatPrice } from '@/lib/utils';

interface ShippingManagementProps {
  initialZones: any[];
}

export function ShippingManagement({ initialZones }: ShippingManagementProps) {
  const router = useRouter();
  const [zones, setZones] = useState<any[]>(initialZones);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formState, setFormState] = useState({
    zoneName: '',
    countries: 'Mali',
    estimatedDays: '24h à 48h',
    price: '2500',
    isActive: true,
  });

  const handleOpenModal = (zone?: any) => {
    if (zone) {
      setEditingZone(zone);
      setFormState({
        zoneName: zone.zoneName,
        countries: Array.isArray(zone.countries) ? zone.countries.join(', ') : (zone.countries || ''),
        estimatedDays: zone.estimatedDays,
        price: zone.price.toString(),
        isActive: zone.isActive,
      });
    } else {
      setEditingZone(null);
      setFormState({
        zoneName: '',
        countries: 'Mali',
        estimatedDays: '24h à 48h',
        price: '2500',
        isActive: true,
      });
    }
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        zoneName: formState.zoneName,
        countries: formState.countries.split(',').map((c) => c.trim()).filter(Boolean),
        estimatedDays: formState.estimatedDays,
        price: parseInt(formState.price, 10),
        isActive: formState.isActive,
      };

      if (editingZone) {
        const res = await fetch('/api/admin/shipping', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingZone.id, ...payload }),
        });
        const data = await res.json();
        if (data.success) {
          setZones(zones.map((z) => (z.id === editingZone.id ? data.zone : z)));
          setModalOpen(false);
          router.refresh();
        }
      } else {
        const res = await fetch('/api/admin/shipping', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          setZones([...zones, data.zone]);
          setModalOpen(false);
          router.refresh();
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch('/api/admin/shipping', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isActive: !currentStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setZones(zones.map((z) => (z.id === id ? { ...z, isActive: !currentStatus } : z)));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette zone de livraison ?')) return;
    try {
      const res = await fetch(`/api/admin/shipping?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setZones(zones.filter((z) => z.id !== id));
        router.refresh();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-mande-gold font-sans font-semibold">
            Expédition & Logistique Mondiale
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold uppercase tracking-wider text-mande-ivory mt-1">
            Zones & Tarifs de Livraison ({zones.length})
          </h1>
        </div>

        <Button
          onClick={() => handleOpenModal()}
          variant="gold"
          size="md"
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Ajouter une Zone
        </Button>
      </div>

      {/* Grid of Shipping Zones */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {zones.map((zone) => (
          <div
            key={zone.id}
            className="bg-mande-dark p-6 border border-mande-surface/80 space-y-4 shadow-sm flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-mande-surface">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-mande-gold" />
                  <h3 className="font-serif text-lg font-bold text-mande-ivory">
                    {zone.zoneName}
                  </h3>
                </div>
                <span className="font-serif text-base font-bold text-mande-gold">
                  {zone.price === 0 ? 'Offerte' : formatPrice(zone.price)}
                </span>
              </div>

              <div className="space-y-2 text-xs font-sans text-gray-300">
                <p className="flex items-start gap-2">
                  <Globe className="w-4 h-4 text-mande-gold flex-shrink-0 mt-0.5" />
                  <span><strong>Destinations :</strong> {zone.countries}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-mande-gold flex-shrink-0" />
                  <span><strong>Délai garanti :</strong> {zone.estimatedDays}</span>
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-mande-surface flex items-center justify-between">
              <button
                onClick={() => handleToggleActive(zone.id, zone.isActive)}
                className={`px-2.5 py-1 font-bold uppercase text-[10px] border transition-colors ${
                  zone.isActive
                    ? 'bg-green-500/20 text-green-400 border-green-500/30'
                    : 'bg-red-500/20 text-red-400 border-red-500/30'
                }`}
              >
                {zone.isActive ? 'Active' : 'Désactivée'}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenModal(zone)}
                  className="p-1.5 bg-mande-surface hover:bg-mande-gold hover:text-mande-black text-gray-300 transition-colors"
                  title="Modifier"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(zone.id)}
                  className="p-1.5 bg-mande-surface hover:bg-red-600 text-gray-300 hover:text-white transition-colors"
                  title="Supprimer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm p-4 flex items-center justify-center">
          <div className="bg-mande-dark border border-mande-gold/40 max-w-md w-full p-6 text-mande-ivory shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-mande-surface">
              <h3 className="font-serif text-lg font-bold uppercase tracking-wider text-mande-gold">
                {editingZone ? 'Modifier la Zone' : 'Nouvelle Zone de Livraison'}
              </h3>
              <button onClick={() => setModalOpen(false)}>
                <X className="w-5 h-5 text-gray-400 hover:text-white" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs font-sans">
              <div className="space-y-1">
                <label className="text-gray-300 uppercase font-semibold">Nom de la Zone *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Bamako Express / France & Europe"
                  value={formState.zoneName}
                  onChange={(e) => setFormState({ ...formState, zoneName: e.target.value })}
                  className="w-full px-3 py-2 bg-mande-surface border border-mande-surface text-mande-ivory focus:outline-none focus:border-mande-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-300 uppercase font-semibold">Tarif (FCFA) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formState.price}
                    onChange={(e) => setFormState({ ...formState, price: e.target.value })}
                    className="w-full px-3 py-2 bg-mande-surface border border-mande-surface text-mande-ivory focus:outline-none focus:border-mande-gold font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-gray-300 uppercase font-semibold">Délai Estimé *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: 24h à 48h"
                    value={formState.estimatedDays}
                    onChange={(e) => setFormState({ ...formState, estimatedDays: e.target.value })}
                    className="w-full px-3 py-2 bg-mande-surface border border-mande-surface text-mande-ivory focus:outline-none focus:border-mande-gold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 uppercase font-semibold">Pays / Régions Inclus (séparés par virgule)</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Mali, Sénégal, Côte d'Ivoire, Guinée..."
                  value={formState.countries}
                  onChange={(e) => setFormState({ ...formState, countries: e.target.value })}
                  className="w-full p-2.5 bg-mande-surface border border-mande-surface text-mande-ivory focus:outline-none focus:border-mande-gold"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="zoneActive"
                  checked={formState.isActive}
                  onChange={(e) => setFormState({ ...formState, isActive: e.target.checked })}
                  className="w-4 h-4 accent-mande-gold"
                />
                <label htmlFor="zoneActive" className="text-gray-300 font-semibold cursor-pointer">
                  Activer immédiatement cette option au passage en caisse
                </label>
              </div>

              <div className="pt-3 border-t border-mande-surface flex justify-end gap-2">
                <Button type="button" onClick={() => setModalOpen(false)} variant="ghost" size="sm">
                  Annuler
                </Button>
                <Button type="submit" disabled={isSubmitting} variant="gold" size="sm">
                  {isSubmitting ? 'Enregistrement...' : 'Enregistrer la Zone'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
