'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { formatPrice, formatDate, safeJsonParse } from '@/lib/utils';
import { 
  Search, 
  Eye, 
  X, 
  CheckCircle, 
  Truck, 
  Package, 
  Clock, 
  User, 
  MapPin, 
  Phone,
  Mail,
  Download,
  Printer,
  MessageCircle,
  AlertCircle,
  Filter,
  DollarSign,
  ShoppingBag,
  TrendingUp,
  FileText,
  Plus,
  PlusCircle,
  Trash2
} from 'lucide-react';
import { Button } from '../ui/Button';
import { BogolanBorder, BogolanDivider } from '../ui/BogolanPattern';
import { OrderInvoiceModal } from '../shop/OrderInvoiceModal';

interface OrdersManagementProps {
  initialOrders: any[];
  availableProducts?: any[];
}

export function OrdersManagement({ initialOrders, availableProducts = [] }: OrdersManagementProps) {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>(initialOrders);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [paymentFilter, setPaymentFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [invoiceModalOrder, setInvoiceModalOrder] = useState<any | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [internalNotes, setInternalNotes] = useState('');
  const [isNotesSaved, setIsNotesSaved] = useState(false);

  // Manual Order Modal State
  const [manualModalOpen, setManualModalOpen] = useState(false);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [manualCustomer, setManualCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: 'Vente Showroom / Retrait Atelier',
    city: 'Bamako',
    country: 'Mali',
    paymentMethod: 'CASH_ON_DELIVERY',
    paymentStatus: 'PAID',
    status: 'CONFIRMEE',
    shippingCost: '0',
    discount: '0',
    notes: 'Achat direct Showroom',
  });

  const [manualItems, setManualItems] = useState<any[]>([
    {
      productId: availableProducts[0]?.id || '',
      size: 'Unique',
      color: 'Bôkôlan Naturel',
      quantity: 1,
      unitPrice: availableProducts[0]?.price || 75000,
    },
  ]);

  // Status mapping
  const statuses = [
    { key: 'ALL', label: 'Toutes' },
    { key: 'NOUVELLE', label: 'Nouvelles', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' },
    { key: 'CONFIRMEE', label: 'Confirmées', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
    { key: 'EN_PREPARATION', label: 'En Confection', color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' },
    { key: 'EXPEDIEE', label: 'Expédiées', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30' },
    { key: 'LIVREE', label: 'Livrées', color: 'text-green-400 bg-green-500/10 border-green-500/30' },
    { key: 'ANNULEE', label: 'Annulées', color: 'text-red-400 bg-red-500/10 border-red-500/30' },
  ];

  // Financial KPIs
  const totalRevenue = orders
    .filter((o) => o.status !== 'ANNULEE' && (o.paymentStatus === 'PAID' || o.status === 'LIVREE'))
    .reduce((sum, o) => sum + o.total, 0);

  const pendingCount = orders.filter((o) => ['NOUVELLE', 'CONFIRMEE', 'EN_PREPARATION'].includes(o.status)).length;
  const deliveredCount = orders.filter((o) => o.status === 'LIVREE').length;
  const averageBasket = orders.length > 0 ? Math.round(totalRevenue / (orders.length || 1)) : 0;

  // Handle live status change
  const handleStatusChange = async (orderId: string, newStatus: string, newPaymentStatus?: string) => {
    setIsUpdating(true);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          orderId, 
          status: newStatus,
          paymentStatus: newPaymentStatus
        }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus, ...(newPaymentStatus ? { paymentStatus: newPaymentStatus } : {}) } : o))
        );
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus, ...(newPaymentStatus ? { paymentStatus: newPaymentStatus } : {}) });
        }
        router.refresh();
      }
    } catch (e) {
      console.error('Failed to update status:', e);
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle saving atelier notes
  const handleSaveNotes = async () => {
    if (!selectedOrder) return;
    setIsUpdating(true);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          orderId: selectedOrder.id, 
          notes: internalNotes 
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSelectedOrder({ ...selectedOrder, notes: internalNotes });
        setOrders((prev) =>
          prev.map((o) => (o.id === selectedOrder.id ? { ...o, notes: internalNotes } : o))
        );
        setIsNotesSaved(true);
        setTimeout(() => setIsNotesSaved(false), 2500);
      }
    } catch (e) {
      console.error('Failed to save notes:', e);
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle Manual Order Submission
  const handleCreateManualOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingOrder(true);
    try {
      const res = await fetch('/api/admin/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: manualCustomer.name,
          customerEmail: manualCustomer.email,
          customerPhone: manualCustomer.phone,
          address: manualCustomer.address,
          city: manualCustomer.city,
          country: manualCustomer.country,
          paymentMethod: manualCustomer.paymentMethod,
          paymentStatus: manualCustomer.paymentStatus,
          status: manualCustomer.status,
          shippingCost: Number(manualCustomer.shippingCost) || 0,
          discount: Number(manualCustomer.discount) || 0,
          notes: manualCustomer.notes,
          items: manualItems,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setOrders([data.order, ...orders]);
        setManualModalOpen(false);
        setSelectedOrder(data.order);
        router.refresh();
      } else {
        alert(data.message || 'Erreur lors de la création de la commande.');
      }
    } catch (err) {
      console.error(err);
      alert('Erreur de connexion.');
    } finally {
      setIsCreatingOrder(false);
    }
  };

  // Manual Items helpers
  const handleAddItemRow = () => {
    const firstProd = availableProducts[0];
    setManualItems([
      ...manualItems,
      {
        productId: firstProd?.id || '',
        size: 'Unique',
        color: 'Bôkôlan Naturel',
        quantity: 1,
        unitPrice: firstProd?.price || 50000,
      },
    ]);
  };

  const handleRemoveItemRow = (index: number) => {
    if (manualItems.length === 1) return;
    setManualItems(manualItems.filter((_, i) => i !== index));
  };

  const handleProductSelect = (index: number, prodId: string) => {
    const prod = availableProducts.find((p) => p.id === prodId);
    if (!prod) return;
    const updated = [...manualItems];
    updated[index] = {
      ...updated[index],
      productId: prod.id,
      unitPrice: prod.price,
    };
    setManualItems(updated);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Numero', 'Date', 'Client', 'Email', 'Telephone', 'Ville', 'Pays', 'Articles', 'Mode_Paiement', 'Statut_Paiement', 'Statut_Commande', 'Total_FCFA'];
    const rows = filteredOrders.map((o) => {
      const addr = safeJsonParse<any>(o.shippingAddress, {});
      return [
        o.orderNumber,
        new Date(o.createdAt).toLocaleDateString('fr-FR'),
        `"${addr.fullName || ''}"`,
        addr.email || '',
        addr.phone || '',
        `"${addr.city || ''}"`,
        `"${addr.country || ''}"`,
        o.items.length,
        o.paymentMethod,
        o.paymentStatus,
        o.status,
        o.total,
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `commandes_mande_heritage_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredOrders = orders.filter((ord) => {
    if (statusFilter !== 'ALL' && ord.status !== statusFilter) return false;
    if (paymentFilter !== 'ALL' && ord.paymentStatus !== paymentFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const addr = safeJsonParse<{ fullName: string; email: string; phone: string; city: string; country: string }>(
        ord.shippingAddress, 
        { fullName: '', email: '', phone: '', city: '', country: '' }
      );
      return (
        ord.orderNumber.toLowerCase().includes(q) ||
        addr.fullName.toLowerCase().includes(q) ||
        addr.email.toLowerCase().includes(q) ||
        addr.phone.toLowerCase().includes(q) ||
        addr.city.toLowerCase().includes(q) ||
        addr.country.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const manualSubtotal = manualItems.reduce((s, i) => s + (i.unitPrice * i.quantity), 0);
  const manualTotal = Math.max(0, manualSubtotal - Number(manualCustomer.discount) + Number(manualCustomer.shippingCost));

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-mande-gold font-sans font-semibold">
            Centre de Commandement
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold uppercase tracking-wider text-mande-ivory mt-1">
            Gestion des Commandes & Ventes
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setManualModalOpen(true)}
            variant="gold"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Nouvelle Vente Showroom / WhatsApp
          </Button>

          <Button
            onClick={handleExportCSV}
            variant="outline"
            size="sm"
            leftIcon={<Download className="w-4 h-4" />}
            className="text-mande-sand border-mande-surface hover:border-mande-gold hover:text-mande-gold"
          >
            Exporter CSV
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-mande-dark p-5 border border-mande-surface/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-gray-400 text-xs uppercase tracking-wider font-sans font-semibold">
            <span>Total Commandes</span>
            <ShoppingBag className="w-4 h-4 text-mande-gold" />
          </div>
          <p className="font-serif text-2xl font-bold text-mande-ivory">
            {orders.length}
          </p>
          <p className="text-[11px] text-gray-400 font-sans">
            Historique complet de la Maison
          </p>
        </div>

        <div className="bg-mande-dark p-5 border border-amber-500/20 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-amber-400 text-xs uppercase tracking-wider font-sans font-semibold">
            <span>À Traiter / Atelier</span>
            <Clock className="w-4 h-4" />
          </div>
          <p className="font-serif text-2xl font-bold text-amber-400">
            {pendingCount}
          </p>
          <p className="text-[11px] text-gray-400 font-sans">
            Nouvelles, confirmées ou en confection
          </p>
        </div>

        <div className="bg-mande-dark p-5 border border-mande-surface/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-gray-400 text-xs uppercase tracking-wider font-sans font-semibold">
            <span>Chiffre Encaissé</span>
            <DollarSign className="w-4 h-4 text-green-400" />
          </div>
          <p className="font-serif text-2xl font-bold text-mande-gold">
            {formatPrice(totalRevenue)}
          </p>
          <p className="text-[11px] text-green-400/90 font-sans">
            {deliveredCount} commande(s) livrée(s) avec succès
          </p>
        </div>

        <div className="bg-mande-dark p-5 border border-mande-surface/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-gray-400 text-xs uppercase tracking-wider font-sans font-semibold">
            <span>Panier Moyen</span>
            <TrendingUp className="w-4 h-4 text-mande-gold" />
          </div>
          <p className="font-serif text-2xl font-bold text-mande-ivory">
            {formatPrice(averageBasket)}
          </p>
          <p className="text-[11px] text-gray-400 font-sans">
            Moyenne des acquisitions clients
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-mande-dark p-5 border border-mande-surface/80 space-y-4 shadow-sm text-xs font-sans">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Rechercher numéro, client, téléphone, ville, pays..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-mande-surface border border-mande-surface text-mande-ivory focus:outline-none focus:border-mande-gold text-xs"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
          </div>

          {/* Payment Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-gray-400 font-semibold uppercase whitespace-nowrap">Paiement :</span>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="bg-mande-surface border border-mande-surface text-mande-ivory px-3 py-2 text-xs focus:outline-none focus:border-mande-gold"
            >
              <option value="ALL">Tous les paiements</option>
              <option value="PAID">Payées (PAID)</option>
              <option value="PENDING">En attente (PENDING)</option>
              <option value="FAILED">Échouées (FAILED)</option>
              <option value="REFUNDED">Remboursées (REFUNDED)</option>
            </select>
          </div>
        </div>

        {/* Status Tabs with Counters */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-mande-surface/60">
          {statuses.map((st) => {
            const count = st.key === 'ALL' 
              ? orders.length 
              : orders.filter((o) => o.status === st.key).length;

            const isSelected = statusFilter === st.key;
            return (
              <button
                key={st.key}
                onClick={() => setStatusFilter(st.key)}
                className={`px-3 py-1.5 text-xs font-sans uppercase tracking-wider transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-mande-gold text-mande-black font-bold shadow-sm'
                    : 'bg-mande-surface text-gray-300 hover:text-mande-gold hover:bg-mande-surface/80'
                }`}
              >
                <span>{st.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-none font-mono ${
                    isSelected ? 'bg-mande-black text-mande-gold' : 'bg-mande-dark text-gray-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-mande-dark border border-mande-surface/80 overflow-x-auto shadow-sm">
        <table className="w-full text-xs text-left font-sans">
          <thead className="text-gray-400 uppercase tracking-wider border-b border-mande-surface bg-mande-surface/30">
            <tr>
              <th className="p-3.5">Numéro & Date</th>
              <th className="p-3.5">Client & Contact</th>
              <th className="p-3.5">Destination</th>
              <th className="p-3.5">Articles</th>
              <th className="p-3.5">Moyen & Paiement</th>
              <th className="p-3.5">Total TTC</th>
              <th className="p-3.5">Statut Confection / Expédition</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-mande-surface">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-12 text-center text-gray-500 font-sans">
                  Aucune commande ne correspond aux critères de recherche.
                </td>
              </tr>
            ) : (
              filteredOrders.map((ord) => {
                const addr = safeJsonParse<{ fullName: string; email: string; phone: string; city: string; country: string }>(
                  ord.shippingAddress, 
                  { fullName: 'Client Mandé', email: '', phone: '', city: 'Bamako', country: 'Mali' }
                );

                const statusObj = statuses.find((s) => s.key === ord.status) || statuses[1];

                return (
                  <tr key={ord.id} className="hover:bg-mande-surface/30 transition-colors">
                    {/* Order Number & Date */}
                    <td className="p-3.5 font-mono">
                      <span className="font-bold text-mande-gold text-sm block">
                        {ord.orderNumber}
                      </span>
                      <span className="font-sans text-[11px] text-gray-400 font-normal">
                        {formatDate(ord.createdAt)}
                      </span>
                    </td>

                    {/* Customer */}
                    <td className="p-3.5">
                      <p className="font-bold text-mande-ivory font-serif text-sm">{addr.fullName}</p>
                      <p className="text-[11px] text-gray-400">{addr.email}</p>
                      {addr.phone && (
                        <p className="text-[11px] text-mande-gold font-mono">{addr.phone}</p>
                      )}
                    </td>

                    {/* Destination */}
                    <td className="p-3.5 text-gray-300">
                      <p className="font-semibold text-mande-ivory">{addr.city}</p>
                      <p className="text-[11px] text-gray-400">{addr.country}</p>
                    </td>

                    {/* Items */}
                    <td className="p-3.5 text-gray-300">
                      <span className="px-2 py-0.5 bg-mande-surface border border-mande-surface text-mande-sand text-[11px] font-mono">
                        {ord.items.length} pièce(s)
                      </span>
                    </td>

                    {/* Payment Info */}
                    <td className="p-3.5 space-y-1">
                      <span className="block px-2 py-0.5 bg-mande-surface border border-mande-surface text-mande-ivory text-[10px] uppercase font-mono w-fit">
                        {ord.paymentMethod}
                      </span>
                      <span
                        className={`inline-block px-1.5 py-0.2 text-[9px] uppercase font-bold border ${
                          ord.paymentStatus === 'PAID'
                            ? 'bg-green-500/20 text-green-400 border-green-500/30'
                            : ord.paymentStatus === 'PENDING'
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                            : 'bg-red-500/20 text-red-400 border-red-500/30'
                        }`}
                      >
                        {ord.paymentStatus}
                      </span>
                    </td>

                    {/* Total */}
                    <td className="p-3.5 font-serif font-bold text-mande-gold text-sm whitespace-nowrap">
                      {formatPrice(ord.total)}
                    </td>

                    {/* Status Dropdown */}
                    <td className="p-3.5">
                      <select
                        value={ord.status}
                        disabled={isUpdating}
                        onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                        className={`border font-bold py-1.5 px-2.5 text-[11px] focus:outline-none uppercase ${
                          statusObj.color || 'bg-mande-surface border-mande-gold text-mande-gold'
                        }`}
                      >
                        <option value="NOUVELLE" className="bg-mande-dark text-blue-400">Nouvelle</option>
                        <option value="CONFIRMEE" className="bg-mande-dark text-amber-400">Confirmée</option>
                        <option value="EN_PREPARATION" className="bg-mande-dark text-purple-400">En Confection</option>
                        <option value="EXPEDIEE" className="bg-mande-dark text-indigo-400">Expédiée</option>
                        <option value="LIVREE" className="bg-mande-dark text-green-400">Livrée</option>
                        <option value="ANNULEE" className="bg-mande-dark text-red-400">Annulée</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-right whitespace-nowrap space-x-1.5">
                      <button
                        onClick={() => setInvoiceModalOrder(ord)}
                        className="px-2.5 py-1.5 bg-mande-surface hover:bg-mande-gold hover:text-mande-black text-mande-sand transition-colors uppercase tracking-wider font-semibold text-[10px]"
                        title="Facture Officielle PDF"
                      >
                        Facture PDF
                      </button>
                      <button
                        onClick={() => {
                          setSelectedOrder(ord);
                          setInternalNotes(ord.notes || '');
                        }}
                        className="px-3 py-1.5 bg-mande-surface hover:bg-mande-gold hover:text-mande-black text-mande-ivory transition-colors uppercase tracking-wider font-semibold text-[10px]"
                        title="Dossier & Confection"
                      >
                        Examiner
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Manual Order Creation Modal */}
      {manualModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm p-4 sm:p-6 flex items-center justify-center">
          <div className="bg-mande-dark border border-mande-gold/40 max-w-3xl w-full p-6 sm:p-8 text-mande-ivory shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-mande-surface">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-mande-gold" />
                <h3 className="font-serif text-xl font-bold uppercase tracking-wider text-mande-gold">
                  Créer une Vente Directe / Showroom / WhatsApp
                </h3>
              </div>
              <button onClick={() => setManualModalOpen(false)}>
                <X className="w-5 h-5 text-gray-400 hover:text-white" />
              </button>
            </div>

            <form onSubmit={handleCreateManualOrder} className="space-y-6 text-xs font-sans">
              {/* Customer Details */}
              <div className="space-y-3">
                <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-mande-ivory">
                  1. Informations Client
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-gray-300 font-semibold uppercase">Nom du Client *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Babani Koné"
                      value={manualCustomer.name}
                      onChange={(e) => setManualCustomer({ ...manualCustomer, name: e.target.value })}
                      className="w-full px-3 py-2 bg-mande-surface border border-mande-surface text-mande-ivory focus:outline-none focus:border-mande-gold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-gray-300 font-semibold uppercase">Téléphone / WhatsApp</label>
                    <input
                      type="text"
                      placeholder="+223 70 00 00 00"
                      value={manualCustomer.phone}
                      onChange={(e) => setManualCustomer({ ...manualCustomer, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-mande-surface border border-mande-surface text-mande-ivory focus:outline-none focus:border-mande-gold font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-gray-300 font-semibold uppercase">Email</label>
                    <input
                      type="email"
                      placeholder="client@gmail.com"
                      value={manualCustomer.email}
                      onChange={(e) => setManualCustomer({ ...manualCustomer, email: e.target.value })}
                      className="w-full px-3 py-2 bg-mande-surface border border-mande-surface text-mande-ivory focus:outline-none focus:border-mande-gold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-gray-300 font-semibold uppercase">Adresse / Quartier</label>
                    <input
                      type="text"
                      placeholder="Showroom Bamako ACI 2000"
                      value={manualCustomer.address}
                      onChange={(e) => setManualCustomer({ ...manualCustomer, address: e.target.value })}
                      className="w-full px-3 py-2 bg-mande-surface border border-mande-surface text-mande-ivory focus:outline-none focus:border-mande-gold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-gray-300 font-semibold uppercase">Ville & Pays</label>
                    <input
                      type="text"
                      value={manualCustomer.city}
                      onChange={(e) => setManualCustomer({ ...manualCustomer, city: e.target.value })}
                      className="w-full px-3 py-2 bg-mande-surface border border-mande-surface text-mande-ivory focus:outline-none focus:border-mande-gold"
                    />
                  </div>
                </div>
              </div>

              {/* Items Section */}
              <div className="space-y-3 pt-4 border-t border-mande-surface">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-mande-ivory">
                    2. Créations Sélectionnées
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddItemRow}
                    className="text-mande-gold hover:underline text-xs flex items-center gap-1 font-semibold"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Ajouter une pièce</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {manualItems.map((item, idx) => (
                    <div key={idx} className="bg-mande-surface/50 p-3 border border-mande-surface grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                      <div className="sm:col-span-5 space-y-1">
                        <label className="text-[10px] text-gray-400 uppercase">Pièce du Catalogue</label>
                        <select
                          value={item.productId}
                          onChange={(e) => handleProductSelect(idx, e.target.value)}
                          className="w-full px-2 py-1.5 bg-mande-dark border border-mande-surface text-mande-ivory text-xs"
                        >
                          {availableProducts.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} ({p.price.toLocaleString()} FCFA)
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="sm:col-span-2 space-y-1">
                        <label className="text-[10px] text-gray-400 uppercase">Taille</label>
                        <input
                          type="text"
                          value={item.size}
                          onChange={(e) => {
                            const up = [...manualItems];
                            up[idx].size = e.target.value;
                            setManualItems(up);
                          }}
                          className="w-full px-2 py-1.5 bg-mande-dark border border-mande-surface text-mande-ivory text-xs"
                        />
                      </div>

                      <div className="sm:col-span-2 space-y-1">
                        <label className="text-[10px] text-gray-400 uppercase">Quantité</label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => {
                            const up = [...manualItems];
                            up[idx].quantity = Number(e.target.value) || 1;
                            setManualItems(up);
                          }}
                          className="w-full px-2 py-1.5 bg-mande-dark border border-mande-surface text-mande-ivory text-xs font-mono"
                        />
                      </div>

                      <div className="sm:col-span-2 space-y-1">
                        <label className="text-[10px] text-gray-400 uppercase">Prix Unit. (FCFA)</label>
                        <input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => {
                            const up = [...manualItems];
                            up[idx].unitPrice = Number(e.target.value) || 0;
                            setManualItems(up);
                          }}
                          className="w-full px-2 py-1.5 bg-mande-dark border border-mande-surface text-mande-ivory text-xs font-mono"
                        />
                      </div>

                      <div className="sm:col-span-1 flex justify-end pt-3">
                        <button
                          type="button"
                          onClick={() => handleRemoveItemRow(idx)}
                          className="text-gray-400 hover:text-red-400 p-1"
                          title="Supprimer la ligne"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment & Financial Breakdown */}
              <div className="space-y-3 pt-4 border-t border-mande-surface">
                <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-mande-ivory">
                  3. Modalités & Paiement
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <label className="text-gray-300 font-semibold uppercase">Moyen de Paiement</label>
                    <select
                      value={manualCustomer.paymentMethod}
                      onChange={(e) => setManualCustomer({ ...manualCustomer, paymentMethod: e.target.value })}
                      className="w-full px-3 py-2 bg-mande-surface border border-mande-surface text-mande-ivory"
                    >
                      <option value="CASH_ON_DELIVERY">Espèces Showroom</option>
                      <option value="ORANGE_MONEY">Orange Money</option>
                      <option value="WAVE">Wave</option>
                      <option value="CREDIT_CARD">Carte Bancaire / TPE</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-gray-300 font-semibold uppercase">Statut Paiement</label>
                    <select
                      value={manualCustomer.paymentStatus}
                      onChange={(e) => setManualCustomer({ ...manualCustomer, paymentStatus: e.target.value })}
                      className="w-full px-3 py-2 bg-mande-surface border border-mande-surface text-mande-ivory"
                    >
                      <option value="PAID">Payée (PAID)</option>
                      <option value="PENDING">En attente (PENDING)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-gray-300 font-semibold uppercase">Remise Accordée (FCFA)</label>
                    <input
                      type="number"
                      min="0"
                      value={manualCustomer.discount}
                      onChange={(e) => setManualCustomer({ ...manualCustomer, discount: e.target.value })}
                      className="w-full px-3 py-2 bg-mande-surface border border-mande-surface text-mande-ivory font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-gray-300 font-semibold uppercase">Frais Expédition (FCFA)</label>
                    <input
                      type="number"
                      min="0"
                      value={manualCustomer.shippingCost}
                      onChange={(e) => setManualCustomer({ ...manualCustomer, shippingCost: e.target.value })}
                      className="w-full px-3 py-2 bg-mande-surface border border-mande-surface text-mande-ivory font-mono"
                    />
                  </div>
                </div>

                {/* Total Preview */}
                <div className="p-4 bg-mande-surface/30 border border-mande-surface flex items-center justify-between">
                  <span className="font-serif font-bold uppercase tracking-wider text-mande-ivory">
                    Total Final Commande :
                  </span>
                  <span className="font-serif text-xl font-bold text-mande-gold">
                    {formatPrice(manualTotal)}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-mande-surface flex justify-end gap-2">
                <Button
                  type="button"
                  onClick={() => setManualModalOpen(false)}
                  variant="ghost"
                  size="sm"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={isCreatingOrder}
                  variant="gold"
                  size="sm"
                >
                  {isCreatingOrder ? 'Génération en cours...' : 'Valider & Imprimer le Reçu'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Detail & Print Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm p-4 sm:p-6 flex items-center justify-center">
          <div className="relative bg-mande-dark border border-mande-gold/40 max-w-3xl w-full p-6 sm:p-8 text-mande-ivory shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto print:bg-white print:text-black print:p-0 print:border-0">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-mande-surface print:hidden">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10">
                  <Image src="/images/logo/logo.png" alt="Mandé Héritage" fill className="object-contain" />
                </div>
                <div>
                  <span className="text-[10px] text-mande-gold uppercase tracking-[0.25em] font-sans font-bold">
                    Dossier Commande Client
                  </span>
                  <h3 className="font-serif text-xl font-bold uppercase tracking-wider text-mande-ivory mt-0.5">
                    {selectedOrder.orderNumber}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-mande-surface hover:bg-mande-gold hover:text-mande-black text-mande-sand border border-mande-surface transition-colors text-xs flex items-center gap-1.5 uppercase font-semibold"
                  title="Imprimer la facture / bon de livraison"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimer</span>
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1.5 text-gray-400 hover:text-mande-ivory hover:bg-mande-surface transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Official Header (Visible on print) */}
            <div className="hidden print:flex justify-between items-start pb-6 border-b border-black/20">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16">
                  <Image src="/images/logo/logo.png" alt="Mandé Héritage" fill className="object-contain" />
                </div>
                <div>
                  <h1 className="font-serif text-2xl font-bold uppercase">MANDÉ HÉRITAGE</h1>
                  <p className="text-xs uppercase tracking-widest text-gray-600">Maison de Haute Confection &bull; Bamako / Paris</p>
                </div>
              </div>
              <div className="text-right text-xs">
                <p className="font-bold text-base font-mono">{selectedOrder.orderNumber}</p>
                <p className="text-gray-600">{formatDate(selectedOrder.createdAt)}</p>
              </div>
            </div>

            {/* Stepper Progression Visual */}
            <div className="bg-mande-surface/30 p-4 border border-mande-surface text-xs font-sans space-y-2 print:hidden">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                État d’avancement de la commande :
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { key: 'NOUVELLE', label: '1. Nouvelle' },
                  { key: 'CONFIRMEE', label: '2. Confirmée' },
                  { key: 'EN_PREPARATION', label: '3. En Confection' },
                  { key: 'LIVREE', label: '4. Livrée' },
                ].map((step) => {
                  const isCurrent = selectedOrder.status === step.key;
                  return (
                    <button
                      key={step.key}
                      onClick={() => handleStatusChange(selectedOrder.id, step.key)}
                      className={`p-2 text-center text-xs font-semibold uppercase border transition-all ${
                        isCurrent
                          ? 'border-mande-gold bg-mande-gold text-mande-black font-bold'
                          : 'border-mande-surface bg-mande-surface/50 text-gray-300 hover:border-mande-gold/50'
                      }`}
                    >
                      {step.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Shipping & Customer Details */}
            {(() => {
              const addr = safeJsonParse<{
                fullName: string;
                email: string;
                phone: string;
                address: string;
                city: string;
                country: string;
              }>(selectedOrder.shippingAddress, {
                fullName: '',
                email: '',
                phone: '',
                address: '',
                city: '',
                country: '',
              });

              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans bg-mande-surface/40 p-4 border border-mande-surface">
                  <div className="space-y-1.5">
                    <p className="text-gray-400 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-mande-gold" />
                      <span>Destinataire :</span>
                    </p>
                    <p className="font-serif font-bold text-base text-mande-ivory">{addr.fullName}</p>
                    <p className="text-gray-300 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-gray-400" />
                      <span>{addr.email}</span>
                    </p>
                    <p className="text-mande-gold font-mono flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5" />
                      <span>{addr.phone || 'Non renseigné'}</span>
                    </p>
                    {addr.phone && (
                      <div className="pt-2 print:hidden">
                        <a
                          href={`https://wa.me/${addr.phone.replace(/[^0-9]/g, '')}?text=Bonjour%20${encodeURIComponent(addr.fullName)},%20Maison%20Mand%C3%A9%20H%C3%A9ritage%20vous%20informe%20que%20votre%20commande%20${selectedOrder.orderNumber}%20est%20actuellement%20${selectedOrder.status}.`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-600 hover:bg-green-500 text-white font-semibold text-[11px] uppercase transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Notifier sur WhatsApp</span>
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5 border-t sm:border-t-0 sm:border-l border-mande-surface pt-3 sm:pt-0 sm:pl-4">
                    <p className="text-gray-400 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-mande-gold" />
                      <span>Lieu de livraison :</span>
                    </p>
                    <p className="text-gray-200 font-medium">{addr.address || 'Adresse atelier / retrait'}</p>
                    <p className="text-gray-300 font-semibold">{addr.city}, {addr.country}</p>
                    
                    <div className="pt-2 space-y-1">
                      <p className="text-gray-400 uppercase tracking-wider font-semibold">Moyen de paiement :</p>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-mande-surface text-mande-ivory font-mono uppercase text-[11px]">
                          {selectedOrder.paymentMethod}
                        </span>
                        <select
                          value={selectedOrder.paymentStatus}
                          disabled={isUpdating}
                          onChange={(e) => handleStatusChange(selectedOrder.id, selectedOrder.status, e.target.value)}
                          className="bg-mande-surface border border-mande-gold/40 text-mande-gold font-bold py-0.5 px-2 text-[10px] uppercase"
                        >
                          <option value="PAID">PAID (Payée)</option>
                          <option value="PENDING">PENDING (En attente)</option>
                          <option value="FAILED">FAILED (Échouée)</option>
                          <option value="REFUNDED">REFUNDED (Remboursée)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Items List */}
            <div className="space-y-3">
              <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-mande-gold flex items-center gap-2">
                <Package className="w-4 h-4" />
                <span>Pièces Commandées ({selectedOrder.items.length})</span>
              </h4>
              <div className="divide-y divide-mande-surface border-t border-b border-mande-surface">
                {selectedOrder.items.map((item: any) => {
                  const itemImg = item.product?.images 
                    ? (Array.isArray(item.product.images) ? item.product.images[0] : safeJsonParse<string[]>(item.product.images, [])[0])
                    : null;

                  return (
                    <div key={item.id} className="py-3 flex items-center justify-between text-xs font-sans gap-4">
                      <div className="flex items-center gap-3">
                        {itemImg && (
                          <div className="relative w-12 h-14 bg-mande-surface flex-shrink-0 overflow-hidden border border-mande-surface">
                            <Image src={itemImg} alt={item.product?.name || 'Produit'} fill className="object-cover" />
                          </div>
                        )}
                        <div>
                          <p className="font-serif font-bold text-mande-ivory text-sm">
                            {item.product?.name || 'Création Mandé'}
                          </p>
                          <p className="text-gray-400 text-[11px]">
                            Taille : <strong className="text-mande-gold">{item.size || 'Unique'}</strong> &bull; Coloris : {item.color || 'Bôkôlan Naturel'} &bull; Qté : <strong className="text-mande-ivory">{item.quantity}</strong>
                          </p>
                        </div>
                      </div>
                      <span className="font-serif font-bold text-mande-gold text-sm whitespace-nowrap">
                        {formatPrice(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="space-y-1.5 text-xs font-sans bg-mande-surface/20 p-4 border border-mande-surface">
              <div className="flex justify-between text-gray-400">
                <span>Sous-total HT</span>
                <span>{formatPrice(selectedOrder.subtotal)}</span>
              </div>
              {selectedOrder.discount > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Remise Privilège / Code Promo</span>
                  <span>-{formatPrice(selectedOrder.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-400">
                <span>Frais d’expédition et assurance</span>
                <span>{selectedOrder.shippingCost === 0 ? 'Offerts' : formatPrice(selectedOrder.shippingCost)}</span>
              </div>
              <div className="pt-2.5 border-t border-mande-surface flex justify-between font-serif text-base font-bold text-mande-gold">
                <span>Total Net</span>
                <span>{formatPrice(selectedOrder.total)}</span>
              </div>
            </div>

            {/* Internal Atelier Notes Section */}
            <div className="space-y-2 text-xs font-sans print:hidden">
              <div className="flex items-center justify-between">
                <label className="text-gray-400 uppercase font-semibold tracking-wider">
                  Notes Internes & Numéro de Suivi Colis (Atelier) :
                </label>
                {isNotesSaved && (
                  <span className="text-green-400 text-[11px] font-bold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Enregistré !</span>
                  </span>
                )}
              </div>
              <textarea
                rows={2}
                placeholder="Ex: Teinture terminée, remis au coursier le 26/08, numéro DHL 123456789..."
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                className="w-full p-2.5 bg-mande-surface border border-mande-surface text-mande-ivory focus:outline-none focus:border-mande-gold text-xs font-sans"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  disabled={isUpdating}
                  className="px-3 py-1 bg-mande-surface hover:bg-mande-gold hover:text-mande-black text-mande-sand transition-colors font-semibold text-[11px] uppercase tracking-wider"
                >
                  Enregistrer les notes
                </button>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="pt-4 border-t border-mande-surface flex items-center justify-between print:hidden">
              <div className="text-xs text-gray-400 font-sans">
                Créée le : {formatDate(selectedOrder.createdAt)}
              </div>
              <Button
                onClick={() => setSelectedOrder(null)}
                variant="gold"
                size="sm"
              >
                Fermer le Dossier
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Official PDF Invoice Modal */}
      <OrderInvoiceModal
        order={invoiceModalOrder}
        isOpen={Boolean(invoiceModalOrder)}
        onClose={() => setInvoiceModalOrder(null)}
      />
    </div>
  );
}
