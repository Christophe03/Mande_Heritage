'use client';

import React, { useState } from 'react';
import { Tag, Plus, Trash2, CheckCircle, X, Sparkles, Copy, ToggleLeft, ToggleRight, DollarSign, Percent, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { formatPrice } from '@/lib/utils';

interface PromotionsManagementProps {
  initialPromos: any[];
}

export function PromotionsManagement({ initialPromos }: PromotionsManagementProps) {
  const [promos, setPromos] = useState<any[]>(initialPromos);
  const [modalOpen, setModalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [formState, setFormState] = useState({
    code: '',
    discountType: 'PERCENTAGE',
    value: '10',
    minOrderAmount: '50000',
    isActive: true,
  });

  const handleGenerateCode = () => {
    const prefixes = ['MANDE', 'BOKOLAN', 'ROYAL', 'HERITAGE', 'PRIVILEGE', 'SUMMER', 'ELEGANCE'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const num = Math.floor(10 + Math.random() * 90);
    setFormState((prev) => ({ ...prev, code: `${prefix}${num}` }));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/promotions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState),
      });
      const data = await res.json();
      if (data.success) {
        setPromos([data.promo, ...promos]);
        setModalOpen(false);
        setFormState({ code: '', discountType: 'PERCENTAGE', value: '10', minOrderAmount: '0', isActive: true });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch('/api/admin/promotions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isActive: !currentStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setPromos(promos.map((p) => (p.id === id ? { ...p, isActive: !currentStatus } : p)));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer définitivement ce code privilège ?')) return;
    try {
      const res = await fetch(`/api/admin/promotions?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPromos(promos.filter((p) => p.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const totalUsages = promos.reduce((sum, p) => sum + (p.usageCount || 0), 0);
  const activeCount = promos.filter((p) => p.isActive).length;

  return (
    <div className="space-y-8">
      {/* Top Title & CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-mande-gold font-sans font-semibold">
            Privilèges & Fidélité
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold uppercase tracking-wider text-mande-ivory mt-1">
            Codes Promotionnels & Offres Privées
          </h1>
        </div>

        <Button
          onClick={() => {
            handleGenerateCode();
            setModalOpen(true);
          }}
          variant="gold"
          size="md"
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Créer un Code Privilège
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-sans">
        <div className="bg-mande-dark p-5 border border-mande-surface/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-gray-400 uppercase font-semibold">
            <span>Codes Actifs</span>
            <Tag className="w-4 h-4 text-mande-gold" />
          </div>
          <p className="font-serif text-2xl font-bold text-mande-ivory">{activeCount} / {promos.length}</p>
          <p className="text-[11px] text-gray-400">Prêts à être appliqués au panier</p>
        </div>

        <div className="bg-mande-dark p-5 border border-mande-surface/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-gray-400 uppercase font-semibold">
            <span>Utilisations Totales</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <p className="font-serif text-2xl font-bold text-mande-gold">{totalUsages} fois</p>
          <p className="text-[11px] text-gray-400">Rémissions accordées aux membres</p>
        </div>

        <div className="bg-mande-dark p-5 border border-mande-surface/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-gray-400 uppercase font-semibold">
            <span>Type Majoritaire</span>
            <Percent className="w-4 h-4 text-purple-400" />
          </div>
          <p className="font-serif text-2xl font-bold text-mande-ivory">Remise %</p>
          <p className="text-[11px] text-gray-400">Pourcentages et montants fixes</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-mande-dark border border-mande-surface/80 overflow-x-auto shadow-sm">
        <table className="w-full text-xs text-left font-sans">
          <thead className="text-gray-400 uppercase tracking-wider border-b border-mande-surface bg-mande-surface/30">
            <tr>
              <th className="p-3.5">Code Privilège</th>
              <th className="p-3.5">Type & Valeur</th>
              <th className="p-3.5">Panier Minimum</th>
              <th className="p-3.5">Utilisations</th>
              <th className="p-3.5">État</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-mande-surface">
            {promos.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-12 text-center text-gray-500 font-sans">
                  Aucun code privilège n’a encore été créé.
                </td>
              </tr>
            ) : (
              promos.map((p) => (
                <tr key={p.id} className="hover:bg-mande-surface/30 transition-colors">
                  {/* Code */}
                  <td className="p-3.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-mande-gold text-sm tracking-wider px-2.5 py-1 bg-mande-surface border border-mande-gold/30">
                        {p.code}
                      </span>
                      <button
                        onClick={() => copyToClipboard(p.code)}
                        className="p-1 text-gray-400 hover:text-mande-gold transition-colors"
                        title="Copier le code"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      {copiedCode === p.code && (
                        <span className="text-[10px] text-green-400 font-bold">Copié !</span>
                      )}
                    </div>
                  </td>

                  {/* Value */}
                  <td className="p-3.5">
                    <div className="flex items-center gap-1.5 font-serif font-bold text-mande-ivory text-sm">
                      {p.discountType === 'PERCENTAGE' ? (
                        <>
                          <Percent className="w-3.5 h-3.5 text-mande-gold" />
                          <span>{p.value}% de remise</span>
                        </>
                      ) : (
                        <>
                          <DollarSign className="w-3.5 h-3.5 text-mande-gold" />
                          <span>{formatPrice(p.value)}</span>
                        </>
                      )}
                    </div>
                  </td>

                  {/* Min Order */}
                  <td className="p-3.5 text-gray-300 font-mono">
                    {p.minOrderAmount ? formatPrice(p.minOrderAmount) : 'Sans minimum'}
                  </td>

                  {/* Usages */}
                  <td className="p-3.5 font-mono text-mande-sand">
                    <span className="px-2 py-0.5 bg-mande-surface border border-mande-surface">
                      {p.usageCount || 0} utilisation(s)
                    </span>
                  </td>

                  {/* Status Toggle */}
                  <td className="p-3.5">
                    <button
                      onClick={() => handleToggleActive(p.id, p.isActive)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] uppercase font-bold border transition-colors ${
                        p.isActive
                          ? 'bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30'
                          : 'bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${p.isActive ? 'bg-green-400' : 'bg-red-400'}`} />
                      <span>{p.isActive ? 'Actif' : 'Désactivé'}</span>
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="p-1.5 bg-mande-surface hover:bg-red-600 text-gray-300 hover:text-white transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal create promo */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm p-4 flex items-center justify-center">
          <div className="bg-mande-dark border border-mande-gold/40 max-w-md w-full p-6 text-mande-ivory shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-mande-surface">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-mande-gold" />
                <h3 className="font-serif text-lg font-bold uppercase tracking-wider text-mande-gold">
                  Nouveau Code Privilège
                </h3>
              </div>
              <button onClick={() => setModalOpen(false)}>
                <X className="w-5 h-5 text-gray-400 hover:text-white" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs font-sans">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-gray-300 uppercase font-semibold">Code Promotionnel *</label>
                  <button
                    type="button"
                    onClick={handleGenerateCode}
                    className="text-[10px] text-mande-gold hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Générer un code</span>
                  </button>
                </div>
                <input
                  type="text"
                  required
                  placeholder="Ex: MANDE2026"
                  value={formState.code}
                  onChange={(e) => setFormState({ ...formState, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 bg-mande-surface border border-mande-surface text-mande-ivory uppercase font-mono focus:outline-none focus:border-mande-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-300 uppercase font-semibold">Type de Remise</label>
                  <select
                    value={formState.discountType}
                    onChange={(e) => setFormState({ ...formState, discountType: e.target.value })}
                    className="w-full px-3 py-2 bg-mande-surface border border-mande-surface text-mande-ivory focus:outline-none focus:border-mande-gold"
                  >
                    <option value="PERCENTAGE">Pourcentage (%)</option>
                    <option value="FIXED">Montant Fixe (FCFA)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-gray-300 uppercase font-semibold">
                    {formState.discountType === 'PERCENTAGE' ? 'Pourcentage (%) *' : 'Montant (FCFA) *'}
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formState.value}
                    onChange={(e) => setFormState({ ...formState, value: e.target.value })}
                    className="w-full px-3 py-2 bg-mande-surface border border-mande-surface text-mande-ivory focus:outline-none focus:border-mande-gold font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 uppercase font-semibold">Panier Minimum d’Achat (FCFA)</label>
                <input
                  type="number"
                  min="0"
                  placeholder="0 pour aucun minimum"
                  value={formState.minOrderAmount}
                  onChange={(e) => setFormState({ ...formState, minOrderAmount: e.target.value })}
                  className="w-full px-3 py-2 bg-mande-surface border border-mande-surface text-mande-ivory focus:outline-none focus:border-mande-gold font-mono"
                />
              </div>

              <div className="pt-3 border-t border-mande-surface flex justify-end gap-2">
                <Button type="button" onClick={() => setModalOpen(false)} variant="ghost" size="sm">
                  Annuler
                </Button>
                <Button type="submit" variant="gold" size="sm">
                  Activer le Code Privilège
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
