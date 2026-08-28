'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Users, 
  Crown, 
  Mail, 
  Phone, 
  MapPin, 
  ShoppingBag, 
  MessageCircle, 
  Download, 
  Eye, 
  X,
  Calendar,
  DollarSign
} from 'lucide-react';
import { Button } from '../ui/Button';
import { formatPrice, formatDate } from '@/lib/utils';

interface ClientsManagementProps {
  initialClients: any[];
}

export function ClientsManagement({ initialClients }: ClientsManagementProps) {
  const [clients, setClients] = useState<any[]>(initialClients);
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState('ALL');
  const [selectedClient, setSelectedClient] = useState<any | null>(null);

  // Compute VIP tier
  const getClientTier = (totalSpent: number) => {
    if (totalSpent >= 500000) return { label: 'VIP Or', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
    if (totalSpent >= 200000) return { label: 'VIP Argent', color: 'bg-slate-400/20 text-slate-200 border-slate-400/40' };
    return { label: 'Client Mandé', color: 'bg-mande-surface text-gray-300 border-mande-surface' };
  };

  // Filter clients
  const filteredClients = clients.filter((c) => {
    const totalSpent = (c.orders || []).reduce((sum: number, o: any) => sum + o.total, 0);
    const tier = getClientTier(totalSpent);

    if (tierFilter === 'VIP_GOLD' && tier.label !== 'VIP Or') return false;
    if (tierFilter === 'VIP_SILVER' && tier.label !== 'VIP Argent') return false;
    if (tierFilter === 'STANDARD' && tier.label !== 'Client Mandé') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const addr = c.addresses?.[0];
      return (
        c.name?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.phone?.toLowerCase().includes(q) ||
        addr?.city?.toLowerCase().includes(q) ||
        addr?.country?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalClientsSpent = clients.reduce((sum, c) => {
    return sum + (c.orders || []).reduce((s: number, o: any) => s + o.total, 0);
  }, 0);

  const vipCount = clients.filter((c) => {
    const totalSpent = (c.orders || []).reduce((sum: number, o: any) => sum + o.total, 0);
    return totalSpent >= 200000;
  }).length;

  const handleExportCSV = () => {
    const headers = ['Nom', 'Email', 'Telephone', 'Ville', 'Pays', 'Commandes', 'Total_Depense_FCFA', 'Date_Inscription'];
    const rows = filteredClients.map((c) => {
      const totalSpent = (c.orders || []).reduce((s: number, o: any) => s + o.total, 0);
      const addr = c.addresses?.[0] || {};
      return [
        `"${c.name || ''}"`,
        c.email || '',
        c.phone || '',
        `"${addr.city || ''}"`,
        `"${addr.country || ''}"`,
        (c.orders || []).length,
        totalSpent,
        new Date(c.createdAt).toLocaleDateString('fr-FR'),
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `clients_mande_heritage_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Header & Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-mande-gold font-sans font-semibold">
            Relation Clientèle & Conciergerie
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold uppercase tracking-wider text-mande-ivory mt-1">
            Répertoire des Membres & Clients ({clients.length})
          </h1>
        </div>

        <Button
          onClick={handleExportCSV}
          variant="outline"
          size="sm"
          leftIcon={<Download className="w-4 h-4" />}
          className="text-mande-sand border-mande-surface hover:border-mande-gold hover:text-mande-gold"
        >
          Exporter Fichier CRM
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-sans">
        <div className="bg-mande-dark p-5 border border-mande-surface/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-gray-400 uppercase font-semibold">
            <span>Clients Inscrits</span>
            <Users className="w-4 h-4 text-mande-gold" />
          </div>
          <p className="font-serif text-2xl font-bold text-mande-ivory">{clients.length}</p>
          <p className="text-[11px] text-gray-400">Comptes actifs sur la plateforme</p>
        </div>

        <div className="bg-mande-dark p-5 border border-amber-500/20 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-amber-300 uppercase font-semibold">
            <span>Membres VIP</span>
            <Crown className="w-4 h-4 text-amber-400" />
          </div>
          <p className="font-serif text-2xl font-bold text-amber-300">{vipCount}</p>
          <p className="text-[11px] text-gray-400">Dépenses &gt; 200 000 FCFA</p>
        </div>

        <div className="bg-mande-dark p-5 border border-mande-surface/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-gray-400 uppercase font-semibold">
            <span>Volume d’Acquisitions Cumulé</span>
            <DollarSign className="w-4 h-4 text-green-400" />
          </div>
          <p className="font-serif text-2xl font-bold text-mande-gold">{formatPrice(totalClientsSpent)}</p>
          <p className="text-[11px] text-gray-400">Valeur totale du portefeuille client</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-mande-dark p-4 border border-mande-surface/80 flex flex-col md:flex-row gap-4 justify-between items-center text-xs font-sans">
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Rechercher par nom, email, téléphone ou ville..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-mande-surface border border-mande-surface text-mande-ivory focus:outline-none focus:border-mande-gold text-xs"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-gray-400 font-semibold uppercase whitespace-nowrap">Statut VIP :</span>
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="bg-mande-surface border border-mande-surface text-mande-ivory px-3 py-2 text-xs focus:outline-none focus:border-mande-gold"
          >
            <option value="ALL">Tous les clients</option>
            <option value="VIP_GOLD">VIP Or (&gt; 500 000 FCFA)</option>
            <option value="VIP_SILVER">VIP Argent (&gt; 200 000 FCFA)</option>
            <option value="STANDARD">Client Standard</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-mande-dark border border-mande-surface/80 overflow-x-auto shadow-sm">
        <table className="w-full text-xs text-left font-sans">
          <thead className="text-gray-400 uppercase tracking-wider border-b border-mande-surface bg-mande-surface/30">
            <tr>
              <th className="p-3.5">Membre</th>
              <th className="p-3.5">Statut Privilège</th>
              <th className="p-3.5">Coordonnées</th>
              <th className="p-3.5">Localisation</th>
              <th className="p-3.5">Commandes</th>
              <th className="p-3.5">Total Dépenses</th>
              <th className="p-3.5">Inscription</th>
              <th className="p-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-mande-surface">
            {filteredClients.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-12 text-center text-gray-500 font-sans">
                  Aucun client trouvé selon les critères.
                </td>
              </tr>
            ) : (
              filteredClients.map((c) => {
                const totalSpent = (c.orders || []).reduce((sum: number, o: any) => sum + o.total, 0);
                const tier = getClientTier(totalSpent);
                const defaultAddr = c.addresses?.[0];

                return (
                  <tr key={c.id} className="hover:bg-mande-surface/30 transition-colors">
                    {/* Name */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-mande-surface text-mande-gold border border-mande-gold/30 flex items-center justify-center font-serif font-bold uppercase">
                          {c.name?.slice(0, 2) || 'MH'}
                        </div>
                        <div>
                          <p className="font-serif font-bold text-mande-ivory text-sm">{c.name}</p>
                          <p className="text-[11px] text-gray-400">{c.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Tier */}
                    <td className="p-3.5">
                      <span className={`px-2.5 py-1 text-[10px] font-bold uppercase border ${tier.color}`}>
                        {tier.label}
                      </span>
                    </td>

                    {/* Contact */}
                    <td className="p-3.5">
                      <p className="text-mande-gold font-mono">{c.phone || 'Non renseigné'}</p>
                      {c.phone && (
                        <a
                          href={`https://wa.me/${c.phone.replace(/[^0-9]/g, '')}?text=Bonjour%20${encodeURIComponent(c.name)},%20Maison%20Mand%C3%A9%20H%C3%A9ritage%20est%20%C3%A0%20votre%20enti%C3%A8re%20disposition.`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] text-green-400 hover:underline mt-0.5"
                        >
                          <MessageCircle className="w-3 h-3" />
                          <span>WhatsApp</span>
                        </a>
                      )}
                    </td>

                    {/* Location */}
                    <td className="p-3.5 text-gray-300">
                      {defaultAddr ? (
                        <>
                          <p className="font-medium text-mande-ivory">{defaultAddr.city}</p>
                          <p className="text-[11px] text-gray-400">{defaultAddr.country}</p>
                        </>
                      ) : (
                        <span className="text-gray-500">—</span>
                      )}
                    </td>

                    {/* Orders Count */}
                    <td className="p-3.5">
                      <span className="px-2.5 py-1 bg-mande-surface border border-mande-surface text-mande-sand font-mono font-bold">
                        {(c.orders || []).length} cde(s)
                      </span>
                    </td>

                    {/* Total Spent */}
                    <td className="p-3.5 font-serif font-bold text-mande-gold text-sm whitespace-nowrap">
                      {formatPrice(totalSpent)}
                    </td>

                    {/* Registered Date */}
                    <td className="p-3.5 text-gray-400 text-[11px]">
                      {formatDate(c.createdAt)}
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => setSelectedClient(c)}
                        className="px-3 py-1.5 bg-mande-surface hover:bg-mande-gold hover:text-mande-black text-mande-ivory transition-colors uppercase font-semibold text-[10px]"
                      >
                        Historique
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Client Detail Modal */}
      {selectedClient && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm p-4 sm:p-6 flex items-center justify-center">
          <div className="bg-mande-dark border border-mande-gold/40 max-w-2xl w-full p-6 text-mande-ivory shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-mande-surface">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-mande-gold/20 text-mande-gold border border-mande-gold/40 flex items-center justify-center font-serif text-lg font-bold uppercase">
                  {selectedClient.name?.slice(0, 2) || 'MH'}
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold uppercase tracking-wider text-mande-ivory">
                    {selectedClient.name}
                  </h3>
                  <p className="text-xs text-gray-400">{selectedClient.email}</p>
                </div>
              </div>
              <button onClick={() => setSelectedClient(null)}>
                <X className="w-5 h-5 text-gray-400 hover:text-white" />
              </button>
            </div>

            {/* Client Info Grid */}
            <div className="grid grid-cols-2 gap-4 text-xs font-sans bg-mande-surface/30 p-4 border border-mande-surface">
              <div>
                <p className="text-gray-400 uppercase font-semibold">Téléphone :</p>
                <p className="text-mande-gold font-mono text-sm mt-0.5">{selectedClient.phone || 'Non renseigné'}</p>
              </div>
              <div>
                <p className="text-gray-400 uppercase font-semibold">Date d’inscription :</p>
                <p className="text-mande-ivory font-medium mt-0.5">{formatDate(selectedClient.createdAt)}</p>
              </div>
            </div>

            {/* Orders History */}
            <div className="space-y-3">
              <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-mande-gold flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                <span>Historique des Commandes ({(selectedClient.orders || []).length})</span>
              </h4>

              {(selectedClient.orders || []).length === 0 ? (
                <p className="text-xs text-gray-500 italic py-4 text-center">
                  Aucune commande enregistrée pour ce client.
                </p>
              ) : (
                <div className="divide-y divide-mande-surface border-t border-b border-mande-surface">
                  {selectedClient.orders.map((o: any) => (
                    <div key={o.id} className="py-3 flex items-center justify-between text-xs font-sans">
                      <div>
                        <span className="font-mono font-bold text-mande-gold">{o.orderNumber}</span>
                        <p className="text-gray-400 text-[11px]">{formatDate(o.createdAt)} &bull; {o.status}</p>
                      </div>
                      <span className="font-serif font-bold text-mande-ivory">
                        {formatPrice(o.total)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <Button onClick={() => setSelectedClient(null)} variant="gold" size="sm">
                Fermer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
