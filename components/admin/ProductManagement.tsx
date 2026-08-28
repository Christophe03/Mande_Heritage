'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  X, 
  Check, 
  AlertCircle,
  Eye,
  SlidersHorizontal,
  Copy,
  PlusCircle,
  MinusCircle,
  Package,
  AlertTriangle,
  DollarSign
} from 'lucide-react';
import { formatPrice, safeJsonParse } from '@/lib/utils';
import { Button } from '../ui/Button';

interface ProductManagementProps {
  initialProducts: any[];
  categories: any[];
  collections: any[];
}

export function ProductManagement({
  initialProducts,
  categories,
  collections,
}: ProductManagementProps) {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [stockFilter, setStockFilter] = useState('ALL');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Form fields
  const [formState, setFormState] = useState({
    name: '',
    slug: '',
    description: '',
    shortDescription: '',
    price: '',
    originalPrice: '',
    categoryId: categories[0]?.id || '',
    collectionId: collections[0]?.id || '',
    gender: 'UNISEX',
    sizes: 'S, M, L, XL',
    colors: 'Noir & Ocre Bôkôlan, Ivoire & Terre',
    images: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800',
    stock: '10',
    materials: '100% Coton peigné biologique filé main, teinture végétale à la boue du Niger.',
    careInstructions: 'Nettoyage à sec spécialisé textile délicat.',
    isNew: true,
    isFeatured: false,
  });

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormState({
      name: '',
      slug: '',
      description: '',
      shortDescription: '',
      price: '',
      originalPrice: '',
      categoryId: categories[0]?.id || '',
      collectionId: collections[0]?.id || '',
      gender: 'UNISEX',
      sizes: 'S, M, L, XL',
      colors: 'Noir & Ocre Bôkôlan, Ivoire & Terre',
      images: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800',
      stock: '10',
      materials: '100% Coton peigné biologique filé main, teinture végétale à la boue du Niger.',
      careInstructions: 'Nettoyage à sec spécialisé textile délicat.',
      isNew: true,
      isFeatured: false,
    });
    setModalError(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (product: any) => {
    setEditingProduct(product);
    const sizes = safeJsonParse<string[]>(product.sizes, []).join(', ');
    const colors = safeJsonParse<string[]>(product.colors, []).join(', ');
    const images = safeJsonParse<string[]>(product.images, []).join('\n');

    setFormState({
      name: product.name,
      slug: product.slug,
      description: product.description,
      shortDescription: product.shortDescription || '',
      price: product.price.toString(),
      originalPrice: product.originalPrice ? product.originalPrice.toString() : '',
      categoryId: product.categoryId,
      collectionId: product.collectionId || '',
      gender: product.gender || 'UNISEX',
      sizes,
      colors,
      images,
      stock: product.stock.toString(),
      materials: product.materials || '',
      careInstructions: product.careInstructions || '',
      isNew: product.isNew,
      isFeatured: product.isFeatured,
    });
    setModalError(null);
    setModalOpen(true);
  };

  // Duplicate Product
  const handleDuplicateProduct = (product: any) => {
    setEditingProduct(null);
    const sizes = safeJsonParse<string[]>(product.sizes, []).join(', ');
    const colors = safeJsonParse<string[]>(product.colors, []).join(', ');
    const images = safeJsonParse<string[]>(product.images, []).join('\n');

    setFormState({
      name: `${product.name} (Copie)`,
      slug: `${product.slug}-copie-${Math.floor(10 + Math.random() * 90)}`,
      description: product.description,
      shortDescription: product.shortDescription || '',
      price: product.price.toString(),
      originalPrice: product.originalPrice ? product.originalPrice.toString() : '',
      categoryId: product.categoryId,
      collectionId: product.collectionId || '',
      gender: product.gender || 'UNISEX',
      sizes,
      colors,
      images,
      stock: product.stock.toString(),
      materials: product.materials || '',
      careInstructions: product.careInstructions || '',
      isNew: true,
      isFeatured: false,
    });
    setModalError(null);
    setModalOpen(true);
  };

  // Quick Inline Stock Update
  const handleQuickStockUpdate = async (productId: string, newStock: number) => {
    const safeStock = Math.max(0, newStock);
    try {
      const res = await fetch('/api/admin/products/stock', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, stock: safeStock }),
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === productId ? { ...p, stock: safeStock } : p))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setModalError(null);

    const sizesArr = formState.sizes.split(',').map((s) => s.trim()).filter(Boolean);
    const colorsArr = formState.colors.split(',').map((c) => c.trim()).filter(Boolean);
    const imagesArr = formState.images.split(/[\n,]/).map((img) => img.trim()).filter(Boolean);

    const payload = {
      name: formState.name,
      slug: formState.slug,
      description: formState.description,
      shortDescription: formState.shortDescription,
      price: Number(formState.price),
      originalPrice: formState.originalPrice ? Number(formState.originalPrice) : null,
      categoryId: formState.categoryId,
      collectionId: formState.collectionId || null,
      gender: formState.gender,
      sizes: sizesArr,
      colors: colorsArr,
      images: imagesArr,
      stock: Number(formState.stock),
      materials: formState.materials,
      careInstructions: formState.careInstructions,
      isNew: formState.isNew,
      isFeatured: formState.isFeatured,
    };

    try {
      if (editingProduct) {
        const res = await fetch(`/api/admin/products?id=${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          setProducts((prev) =>
            prev.map((p) => (p.id === editingProduct.id ? data.product : p))
          );
          setModalOpen(false);
          router.refresh();
        } else {
          setModalError(data.message || 'Erreur lors de la mise à jour.');
        }
      } else {
        const res = await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          setProducts((prev) => [data.product, ...prev]);
          setModalOpen(false);
          router.refresh();
        } else {
          setModalError(data.message || 'Erreur lors de la création.');
        }
      }
    } catch (err: any) {
      setModalError(err.message || 'Une erreur imprévue est survenue.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer définitivement ce produit du catalogue ?')) return;
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        router.refresh();
      } else {
        alert(data.message || 'Impossible de supprimer.');
      }
    } catch (e) {
      alert('Erreur lors de la suppression.');
    }
  };

  // Filter products
  const filtered = products.filter((p) => {
    if (selectedCat !== 'all' && p.categoryId !== selectedCat) return false;
    if (stockFilter === 'OUT_OF_STOCK' && p.stock > 0) return false;
    if (stockFilter === 'LOW_STOCK' && (p.stock === 0 || p.stock > 5)) return false;
    if (stockFilter === 'IN_STOCK' && p.stock <= 5) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.materials?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // KPIs
  const totalStockCount = products.reduce((sum, p) => sum + (p.stock || 0), 0);
  const outOfStockCount = products.filter((p) => p.stock === 0).length;
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 5).length;
  const totalInventoryValue = products.reduce((sum, p) => sum + (p.price * (p.stock || 0)), 0);

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-mande-gold font-sans font-semibold">
            Vestiaire & Confection
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold uppercase tracking-wider text-mande-ivory mt-1">
            Catalogue des Produits ({products.length})
          </h1>
        </div>

        <Button
          onClick={handleOpenAddModal}
          variant="gold"
          size="md"
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Créer un Produit
        </Button>
      </div>

      {/* KPI Inventory Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-sans">
        <div className="bg-mande-dark p-5 border border-mande-surface/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-gray-400 uppercase font-semibold">
            <span>Références Actives</span>
            <Package className="w-4 h-4 text-mande-gold" />
          </div>
          <p className="font-serif text-2xl font-bold text-mande-ivory">{products.length}</p>
          <p className="text-[11px] text-gray-400">{totalStockCount} pièces au total en atelier</p>
        </div>

        <div className="bg-mande-dark p-5 border border-amber-500/20 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-amber-400 uppercase font-semibold">
            <span>Stock Faible (&le; 5)</span>
            <AlertTriangle className="w-4 h-4" />
          </div>
          <p className="font-serif text-2xl font-bold text-amber-400">{lowStockCount}</p>
          <p className="text-[11px] text-gray-400">À réapprovisionner rapidement</p>
        </div>

        <div className="bg-mande-dark p-5 border border-red-500/20 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-red-400 uppercase font-semibold">
            <span>Ruptures de Stock</span>
            <AlertCircle className="w-4 h-4" />
          </div>
          <p className="font-serif text-2xl font-bold text-red-400">{outOfStockCount}</p>
          <p className="text-[11px] text-gray-400">Indisponibles à l’achat direct</p>
        </div>

        <div className="bg-mande-dark p-5 border border-mande-surface/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-gray-400 uppercase font-semibold">
            <span>Valeur Marchande du Stock</span>
            <DollarSign className="w-4 h-4 text-green-400" />
          </div>
          <p className="font-serif text-2xl font-bold text-mande-gold">{formatPrice(totalInventoryValue)}</p>
          <p className="text-[11px] text-gray-400">Actifs physiques en inventaire</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-mande-dark p-4 border border-mande-surface/80 flex flex-col md:flex-row gap-4 justify-between items-center text-xs font-sans">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Rechercher par nom, matière, slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-mande-surface border border-mande-surface text-mande-ivory focus:outline-none focus:border-mande-gold text-xs"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400 font-semibold uppercase">Catégorie :</span>
            <select
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
              className="bg-mande-surface border border-mande-surface text-mande-ivory py-2 px-3 focus:outline-none focus:border-mande-gold text-xs"
            >
              <option value="all">Toutes les catégories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Stock Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400 font-semibold uppercase">Stock :</span>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="bg-mande-surface border border-mande-surface text-mande-ivory py-2 px-3 focus:outline-none focus:border-mande-gold text-xs"
            >
              <option value="ALL">Tous les stocks</option>
              <option value="IN_STOCK">En stock (&gt; 5)</option>
              <option value="LOW_STOCK">Stock faible (1 à 5)</option>
              <option value="OUT_OF_STOCK">En rupture (0)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-mande-dark border border-mande-surface/80 overflow-x-auto shadow-sm">
        <table className="w-full text-xs text-left font-sans">
          <thead className="text-gray-400 uppercase tracking-wider border-b border-mande-surface bg-mande-surface/30">
            <tr>
              <th className="p-3.5">Visuel</th>
              <th className="p-3.5">Nom du Produit</th>
              <th className="p-3.5">Catégorie</th>
              <th className="p-3.5">Collection</th>
              <th className="p-3.5">Prix</th>
              <th className="p-3.5">Stock Rapide</th>
              <th className="p-3.5">Badges</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-mande-surface">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-12 text-center text-gray-500 font-sans">
                  Aucun produit ne correspond aux filtres.
                </td>
              </tr>
            ) : (
              filtered.map((prod) => {
                const images = safeJsonParse<string[]>(prod.images, []);
                const firstImg = images[0] || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=200';
                return (
                  <tr key={prod.id} className="hover:bg-mande-surface/30 transition-colors">
                    {/* Visual */}
                    <td className="p-3">
                      <div className="relative w-12 h-14 bg-mande-surface border border-mande-surface overflow-hidden">
                        <Image src={firstImg} alt={prod.name} fill className="object-cover" />
                      </div>
                    </td>

                    {/* Name & Slug */}
                    <td className="p-3 font-serif font-bold text-mande-ivory max-w-xs">
                      {prod.name}
                      <span className="block font-sans text-[10px] text-gray-500 font-normal">
                        /{prod.slug}
                      </span>
                    </td>

                    {/* Category */}
                    <td className="p-3 text-gray-300">
                      {prod.category?.name || categories.find((c) => c.id === prod.categoryId)?.name || '—'}
                    </td>

                    {/* Collection */}
                    <td className="p-3 text-gray-400">
                      {prod.collection?.name || collections.find((col) => col.id === prod.collectionId)?.name || '—'}
                    </td>

                    {/* Price */}
                    <td className="p-3 font-serif font-bold text-mande-gold">
                      {formatPrice(prod.price)}
                    </td>

                    {/* Quick Inline Stock Editor */}
                    <td className="p-3">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleQuickStockUpdate(prod.id, prod.stock - 1)}
                          className="p-1 hover:text-mande-gold text-gray-400 transition-colors"
                          title="Décrémenter stock"
                        >
                          <MinusCircle className="w-3.5 h-3.5" />
                        </button>
                        <span
                          className={`px-2 py-0.5 font-bold font-mono text-[11px] ${
                            prod.stock === 0
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                              : prod.stock <= 5
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : 'bg-green-500/15 text-green-400 border border-green-500/30'
                          }`}
                        >
                          {prod.stock} ex.
                        </span>
                        <button
                          onClick={() => handleQuickStockUpdate(prod.id, prod.stock + 1)}
                          className="p-1 hover:text-mande-gold text-gray-400 transition-colors"
                          title="Incrémenter stock"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* Badges */}
                    <td className="p-3 space-x-1">
                      {prod.isNew && (
                        <span className="px-1.5 py-0.5 bg-mande-gold/20 text-mande-gold text-[9px] uppercase font-bold">
                          Nouveau
                        </span>
                      )}
                      {prod.isFeatured && (
                        <span className="px-1.5 py-0.5 bg-purple-500/20 text-purple-300 text-[9px] uppercase font-bold">
                          En Vedette
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => handleDuplicateProduct(prod)}
                        className="p-1.5 bg-mande-surface hover:bg-mande-gold hover:text-mande-black text-gray-300 transition-colors"
                        title="Dupliquer le produit"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleOpenEditModal(prod)}
                        className="p-1.5 bg-mande-surface hover:bg-mande-gold hover:text-mande-black text-gray-300 transition-colors"
                        title="Modifier"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(prod.id)}
                        className="p-1.5 bg-mande-surface hover:bg-red-600 text-gray-300 hover:text-white transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal create / edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm p-4 sm:p-6 flex items-center justify-center">
          <div className="bg-mande-dark border border-mande-gold/40 max-w-3xl w-full p-6 sm:p-8 text-mande-ivory shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-mande-surface">
              <div>
                <span className="text-[10px] text-mande-gold uppercase tracking-widest font-sans font-bold">
                  {editingProduct ? 'Édition Produit' : 'Création Produit'}
                </span>
                <h3 className="font-serif text-xl font-bold uppercase tracking-wider text-mande-ivory mt-0.5">
                  {editingProduct ? formState.name : 'Nouvelle Pièce d’Exception'}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <div className="p-3 bg-red-500/20 border border-red-500/40 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-gray-300 uppercase font-semibold">Nom de la Création *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Kimono Royal en Bôkôlan Noir"
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    className="w-full px-3 py-2 bg-mande-surface border border-mande-surface text-mande-ivory focus:outline-none focus:border-mande-gold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-gray-300 uppercase font-semibold">Slug (URL personnalisée)</label>
                  <input
                    type="text"
                    placeholder="kimono-royal-bokolan-noir"
                    value={formState.slug}
                    onChange={(e) => setFormState({ ...formState, slug: e.target.value })}
                    className="w-full px-3 py-2 bg-mande-surface border border-mande-surface text-mande-ivory focus:outline-none focus:border-mande-gold font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-gray-300 uppercase font-semibold">Prix (FCFA) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="125000"
                    value={formState.price}
                    onChange={(e) => setFormState({ ...formState, price: e.target.value })}
                    className="w-full px-3 py-2 bg-mande-surface border border-mande-surface text-mande-ivory focus:outline-none focus:border-mande-gold font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-gray-300 uppercase font-semibold">Prix Barré (Optionnel)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="150000"
                    value={formState.originalPrice}
                    onChange={(e) => setFormState({ ...formState, originalPrice: e.target.value })}
                    className="w-full px-3 py-2 bg-mande-surface border border-mande-surface text-mande-ivory focus:outline-none focus:border-mande-gold font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-gray-300 uppercase font-semibold">Catégorie *</label>
                  <select
                    value={formState.categoryId}
                    onChange={(e) => setFormState({ ...formState, categoryId: e.target.value })}
                    className="w-full px-3 py-2 bg-mande-surface border border-mande-surface text-mande-ivory focus:outline-none focus:border-mande-gold"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-gray-300 uppercase font-semibold">Collection</label>
                  <select
                    value={formState.collectionId}
                    onChange={(e) => setFormState({ ...formState, collectionId: e.target.value })}
                    className="w-full px-3 py-2 bg-mande-surface border border-mande-surface text-mande-ivory focus:outline-none focus:border-mande-gold"
                  >
                    <option value="">Aucune collection</option>
                    {collections.map((col) => (
                      <option key={col.id} value={col.id}>
                        {col.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-gray-300 uppercase font-semibold">Genre / Vestiaire</label>
                  <select
                    value={formState.gender}
                    onChange={(e) => setFormState({ ...formState, gender: e.target.value })}
                    className="w-full px-3 py-2 bg-mande-surface border border-mande-surface text-mande-ivory focus:outline-none focus:border-mande-gold"
                  >
                    <option value="HOMME">Homme</option>
                    <option value="FEMME">Femme</option>
                    <option value="UNISEX">Unisexe</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-gray-300 uppercase font-semibold">Stock Disponible *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formState.stock}
                    onChange={(e) => setFormState({ ...formState, stock: e.target.value })}
                    className="w-full px-3 py-2 bg-mande-surface border border-mande-surface text-mande-ivory focus:outline-none focus:border-mande-gold font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-gray-300 uppercase font-semibold">Tailles (séparées par virgule)</label>
                  <input
                    type="text"
                    placeholder="S, M, L, XL"
                    value={formState.sizes}
                    onChange={(e) => setFormState({ ...formState, sizes: e.target.value })}
                    className="w-full px-3 py-2 bg-mande-surface border border-mande-surface text-mande-ivory focus:outline-none focus:border-mande-gold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 uppercase font-semibold">Coloris & Motifs (séparés par virgule)</label>
                <input
                  type="text"
                  placeholder="Noir & Ocre Bôkôlan, Ivoire & Terre"
                  value={formState.colors}
                  onChange={(e) => setFormState({ ...formState, colors: e.target.value })}
                  className="w-full px-3 py-2 bg-mande-surface border border-mande-surface text-mande-ivory focus:outline-none focus:border-mande-gold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 uppercase font-semibold">Photos / Visuels (1 URL par ligne ou séparées par virgule)</label>
                <textarea
                  rows={3}
                  placeholder="https://images.unsplash.com/..."
                  value={formState.images}
                  onChange={(e) => setFormState({ ...formState, images: e.target.value })}
                  className="w-full p-2.5 bg-mande-surface border border-mande-surface text-mande-ivory focus:outline-none focus:border-mande-gold font-mono text-[11px]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 uppercase font-semibold">Description Détaillée & Héritage *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Décrivez l'étoffe, la symbolique et la coupe..."
                  value={formState.description}
                  onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                  className="w-full p-2.5 bg-mande-surface border border-mande-surface text-mande-ivory focus:outline-none focus:border-mande-gold leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-gray-300 uppercase font-semibold">Matières & Teintures</label>
                  <input
                    type="text"
                    value={formState.materials}
                    onChange={(e) => setFormState({ ...formState, materials: e.target.value })}
                    className="w-full px-3 py-2 bg-mande-surface border border-mande-surface text-mande-ivory focus:outline-none focus:border-mande-gold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-gray-300 uppercase font-semibold">Conseils d’Entretien</label>
                  <input
                    type="text"
                    value={formState.careInstructions}
                    onChange={(e) => setFormState({ ...formState, careInstructions: e.target.value })}
                    className="w-full px-3 py-2 bg-mande-surface border border-mande-surface text-mande-ivory focus:outline-none focus:border-mande-gold"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formState.isNew}
                    onChange={(e) => setFormState({ ...formState, isNew: e.target.checked })}
                    className="w-4 h-4 accent-mande-gold"
                  />
                  <span className="text-gray-300 font-semibold">Marquer comme Nouveauté</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formState.isFeatured}
                    onChange={(e) => setFormState({ ...formState, isFeatured: e.target.checked })}
                    className="w-4 h-4 accent-mande-gold"
                  />
                  <span className="text-gray-300 font-semibold">Mettre en Vedette (Accueil)</span>
                </label>
              </div>

              <div className="pt-4 border-t border-mande-surface flex justify-end gap-2">
                <Button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  variant="ghost"
                  size="sm"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  variant="gold"
                  size="sm"
                >
                  {isSubmitting
                    ? 'Enregistrement...'
                    : editingProduct
                    ? 'Mettre à Jour la Pièce'
                    : 'Créer la Pièce'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
