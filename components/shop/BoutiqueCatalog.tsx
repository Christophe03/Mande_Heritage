'use client';

import React, { useState, useMemo } from 'react';
import { ProductCard } from './ProductCard';
import { QuickViewModal } from './QuickViewModal';
import { formatPrice, safeJsonParse } from '@/lib/utils';
import { useCurrency } from '@/context/CurrencyContext';
import { 
  SlidersHorizontal, 
  X, 
  RotateCcw, 
  Search, 
  ChevronDown, 
  ChevronUp,
  Check,
  LayoutGrid,
  Columns,
  Sparkles,
  Layers
} from 'lucide-react';
import { Button } from '../ui/Button';

interface BoutiqueCatalogProps {
  products: any[];
  categories: any[];
  collections: any[];
  initialCategory?: string;
  initialCollection?: string;
}

export function BoutiqueCatalog({
  products,
  categories,
  collections,
  initialCategory,
  initialCollection,
}: BoutiqueCatalogProps) {
  const { currency } = useCurrency();

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [selectedCollection, setSelectedCollection] = useState<string>(initialCollection || 'all');
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [selectedMotif, setSelectedMotif] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(500000);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('newest');

  // Grid Layout Mode: '4' (Catalog) or '2' (Magazine / High-Res)
  const [gridColumns, setGridColumns] = useState<'2' | '4'>('4');

  // Quick View Modal
  const [quickViewProduct, setQuickViewProduct] = useState<any | null>(null);

  // Mobile Filter Drawer State
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Traditional Bôkôlan Motifs definitions
  const bokolanMotifs = [
    { key: 'all', label: 'Tous les motifs' },
    { key: 'Tiranke', label: 'Tiranké (Courage & Guerrier)', query: 'tiranke' },
    { key: 'Koumi Dio', label: 'Koumi Dio (Sagesse & Foyer)', query: 'koumi' },
    { key: 'Gana Dio', label: 'Gana Dio (Harmonie & Paix)', query: 'gana' },
    { key: 'Sigui', label: 'Sigui (Stabilité & Enracinement)', query: 'sigui' },
    { key: 'Sceau Royal', label: 'Sceau Royal (Noblesse & Prestige)', query: 'royal' },
  ];

  // Extract all available sizes from products
  const allSizes = useMemo(() => {
    const sizeSet = new Set<string>();
    products.forEach((p) => {
      const sizes = safeJsonParse<string[]>(p.sizes, []);
      sizes.forEach((s) => sizeSet.add(s));
    });
    return Array.from(sizeSet);
  }, [products]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category filter
      if (selectedCategory !== 'all' && product.category?.slug !== selectedCategory) {
        return false;
      }
      // Collection filter
      if (selectedCollection !== 'all' && product.collection?.slug !== selectedCollection) {
        return false;
      }
      // Gender filter
      if (selectedGender !== 'all') {
        if (selectedGender === 'HOMME' && product.gender !== 'HOMME' && product.gender !== 'UNISEX') return false;
        if (selectedGender === 'FEMME' && product.gender !== 'FEMME' && product.gender !== 'UNISEX') return false;
      }
      // Size filter
      if (selectedSize !== 'all') {
        const sizes = safeJsonParse<string[]>(product.sizes, []);
        if (!sizes.includes(selectedSize)) return false;
      }
      // Motif Bôkôlan filter
      if (selectedMotif !== 'all') {
        const motifObj = bokolanMotifs.find((m) => m.key === selectedMotif);
        if (motifObj && motifObj.query) {
          const content = `${product.name} ${product.description} ${product.materials || ''}`.toLowerCase();
          if (!content.includes(motifObj.query)) return false;
        }
      }
      // Price filter
      if (product.price > maxPrice) {
        return false;
      }
      // In stock filter
      if (inStockOnly && (product.stock ?? 0) <= 0) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = product.name.toLowerCase().includes(q);
        const matchDesc = product.description.toLowerCase().includes(q);
        if (!matchName && !matchDesc) return false;
      }

      return true;
    });
  }, [
    products,
    selectedCategory,
    selectedCollection,
    selectedGender,
    selectedSize,
    selectedMotif,
    maxPrice,
    inStockOnly,
    searchQuery,
  ]);

  // Sort products
  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [filteredProducts, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedCollection('all');
    setSelectedGender('all');
    setSelectedSize('all');
    setSelectedMotif('all');
    setMaxPrice(500000);
    setInStockOnly(false);
    setSearchQuery('');
    setSortBy('newest');
  };

  const activeFiltersCount = [
    selectedCategory !== 'all',
    selectedCollection !== 'all',
    selectedGender !== 'all',
    selectedSize !== 'all',
    selectedMotif !== 'all',
    maxPrice < 500000,
    inStockOnly,
    searchQuery.trim() !== '',
  ].filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Search & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-mande-ivoryDark">
        {/* Left: Search input */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Rechercher une création, une matière..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-mande-ivoryDark text-xs font-sans focus:outline-none focus:border-mande-gold text-mande-black"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-mande-black"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Right: Sort & Grid Switcher & Mobile Filter Toggle */}
        <div className="flex items-center gap-3 justify-between md:justify-end">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden px-4 py-2 bg-white border border-mande-ivoryDark text-xs uppercase tracking-wider font-sans font-semibold flex items-center gap-2 text-mande-black hover:border-mande-gold transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4 text-mande-gold" />
            <span>Filtres {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
          </button>

          {/* Grid Layout Switcher (Desktop) */}
          <div className="hidden sm:flex items-center border border-mande-ivoryDark bg-white p-0.5">
            <button
              onClick={() => setGridColumns('4')}
              className={`p-1.5 transition-colors ${
                gridColumns === '4' ? 'bg-mande-black text-mande-gold' : 'text-gray-400 hover:text-black'
              }`}
              title="Mode Catalogue (4 Colonnes)"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setGridColumns('2')}
              className={`p-1.5 transition-colors ${
                gridColumns === '2' ? 'bg-mande-black text-mande-gold' : 'text-gray-400 hover:text-black'
              }`}
              title="Mode Magazine Haute Définition (2 Grandes Colonnes)"
            >
              <Columns className="w-4 h-4" />
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-sans hidden sm:inline">Trier :</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-mande-ivoryDark text-mande-black py-2 px-3 text-xs font-sans focus:outline-none focus:border-mande-gold cursor-pointer"
            >
              <option value="newest">Nouveautés Récentes</option>
              <option value="price-asc">Prix Croissant</option>
              <option value="price-desc">Prix Décroissant</option>
              <option value="name">Alphabétique (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-8">
        {/* Left Sidebar: Desktop Filters (1 Col) */}
        <div className="hidden lg:block space-y-6 text-xs font-sans">
          {/* Active filters and reset */}
          <div className="flex items-center justify-between pb-4 border-b border-mande-ivoryDark">
            <span className="font-serif text-sm font-bold uppercase tracking-wider text-mande-black flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-mande-gold" />
              <span>Filtres</span>
            </span>
            {activeFiltersCount > 0 && (
              <button
                onClick={resetFilters}
                className="text-[11px] text-mande-gold hover:underline flex items-center gap-1 font-semibold"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Réinitialiser ({activeFiltersCount})</span>
              </button>
            )}
          </div>

          {/* 1. Motifs & Symboles Bôkôlan Filter */}
          <div className="space-y-3 pb-6 border-b border-mande-ivoryDark">
            <h4 className="font-serif text-xs font-bold uppercase tracking-widest text-mande-black flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-mande-gold" />
              <span>Symboles Bôkôlan</span>
            </h4>
            <div className="space-y-1.5">
              {bokolanMotifs.map((motif) => (
                <button
                  key={motif.key}
                  onClick={() => setSelectedMotif(motif.key)}
                  className={`w-full text-left py-1.5 px-2.5 transition-colors flex items-center justify-between rounded-none ${
                    selectedMotif === motif.key
                      ? 'bg-mande-black text-mande-gold font-bold'
                      : 'text-gray-700 hover:bg-mande-sand/20'
                  }`}
                >
                  <span>{motif.label}</span>
                  {selectedMotif === motif.key && <Check className="w-3.5 h-3.5 text-mande-gold" />}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Categories Filter */}
          <div className="space-y-3 pb-6 border-b border-mande-ivoryDark">
            <h4 className="font-serif text-xs font-bold uppercase tracking-widest text-mande-black">
              Vestiaire & Catégories
            </h4>
            <div className="space-y-1.5">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left py-1 px-2 transition-colors flex items-center justify-between ${
                  selectedCategory === 'all'
                    ? 'text-mande-gold font-bold bg-mande-gold/10'
                    : 'text-gray-700 hover:text-mande-black'
                }`}
              >
                <span>Toutes les catégories</span>
                <span className="text-[10px] text-gray-400 font-mono">({products.length})</span>
              </button>
              {categories.map((cat) => {
                const count = products.filter((p) => p.categoryId === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`w-full text-left py-1 px-2 transition-colors flex items-center justify-between ${
                      selectedCategory === cat.slug
                        ? 'text-mande-gold font-bold bg-mande-gold/10'
                        : 'text-gray-700 hover:text-mande-black'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] text-gray-400 font-mono">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Collections Filter */}
          <div className="space-y-3 pb-6 border-b border-mande-ivoryDark">
            <h4 className="font-serif text-xs font-bold uppercase tracking-widest text-mande-black">
              Collections
            </h4>
            <div className="space-y-1.5">
              <button
                onClick={() => setSelectedCollection('all')}
                className={`w-full text-left py-1 px-2 transition-colors flex items-center justify-between ${
                  selectedCollection === 'all'
                    ? 'text-mande-gold font-bold bg-mande-gold/10'
                    : 'text-gray-700 hover:text-mande-black'
                }`}
              >
                <span>Toutes les collections</span>
              </button>
              {collections.map((col) => (
                <button
                  key={col.id}
                  onClick={() => setSelectedCollection(col.slug)}
                  className={`w-full text-left py-1 px-2 transition-colors flex items-center justify-between ${
                    selectedCollection === col.slug
                      ? 'text-mande-gold font-bold bg-mande-gold/10'
                      : 'text-gray-700 hover:text-mande-black'
                  }`}
                >
                  <span>{col.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 4. Gender Filter */}
          <div className="space-y-3 pb-6 border-b border-mande-ivoryDark">
            <h4 className="font-serif text-xs font-bold uppercase tracking-widest text-mande-black">
              Genre
            </h4>
            <div className="flex gap-2">
              {[
                { key: 'all', label: 'Tous' },
                { key: 'HOMME', label: 'Homme' },
                { key: 'FEMME', label: 'Femme' },
              ].map((g) => (
                <button
                  key={g.key}
                  onClick={() => setSelectedGender(g.key)}
                  className={`flex-1 py-1.5 text-center uppercase tracking-wider font-semibold border transition-all ${
                    selectedGender === g.key
                      ? 'bg-mande-black text-mande-gold border-mande-black'
                      : 'bg-white text-gray-700 border-mande-ivoryDark hover:border-mande-gold'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* 5. Sizes Filter */}
          {allSizes.length > 0 && (
            <div className="space-y-3 pb-6 border-b border-mande-ivoryDark">
              <h4 className="font-serif text-xs font-bold uppercase tracking-widest text-mande-black">
                Tailles
              </h4>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setSelectedSize('all')}
                  className={`px-2.5 py-1 uppercase font-semibold border transition-all ${
                    selectedSize === 'all'
                      ? 'bg-mande-black text-mande-gold border-mande-black'
                      : 'bg-white text-gray-700 border-mande-ivoryDark hover:border-mande-gold'
                  }`}
                >
                  Toutes
                </button>
                {allSizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`px-2.5 py-1 uppercase font-semibold border transition-all ${
                      selectedSize === sz
                        ? 'bg-mande-black text-mande-gold border-mande-black'
                        : 'bg-white text-gray-700 border-mande-ivoryDark hover:border-mande-gold'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 6. Price Range */}
          <div className="space-y-3 pb-6 border-b border-mande-ivoryDark">
            <div className="flex items-center justify-between">
              <h4 className="font-serif text-xs font-bold uppercase tracking-widest text-mande-black">
                Prix Maximum
              </h4>
              <span className="font-serif font-bold text-mande-earth">
                {formatPrice(maxPrice, currency)}
              </span>
            </div>
            <input
              type="range"
              min="20000"
              max="500000"
              step="10000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-mande-gold cursor-pointer"
            />
          </div>

          {/* 7. In Stock Checkbox */}
          <div className="pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 accent-mande-gold"
              />
              <span className="text-gray-800 font-semibold">Pièces en stock uniquement</span>
            </label>
          </div>
        </div>

        {/* Right Stage: Products Grid (3 Cols) */}
        <div className="lg:col-span-3">
          {/* Results Count & Badges */}
          <div className="flex items-center justify-between mb-6 text-xs text-gray-500 font-sans">
            <p>
              Affichage de <strong className="text-mande-black font-serif text-sm">{sortedProducts.length}</strong> création(s) d’exception
            </p>
          </div>

          {/* Products Grid */}
          {sortedProducts.length === 0 ? (
            <div className="bg-white p-12 border border-mande-ivoryDark text-center space-y-4 shadow-card">
              <div className="w-16 h-16 rounded-full bg-mande-sand/20 text-mande-gold flex items-center justify-center mx-auto">
                <Search className="w-8 h-8 opacity-70" />
              </div>
              <h3 className="font-serif text-xl font-bold uppercase tracking-wider text-mande-black">
                Aucune création trouvée
              </h3>
              <p className="text-xs text-gray-500 font-sans max-w-sm mx-auto">
                Aucune pièce ne correspond à vos critères de recherche. Essayez d’ajuster vos filtres.
              </p>
              <Button onClick={resetFilters} variant="gold" size="sm">
                Réinitialiser les Filtres
              </Button>
            </div>
          ) : (
            <div
              className={`grid gap-6 ${
                gridColumns === '2'
                  ? 'grid-cols-1 sm:grid-cols-2'
                  : 'grid-cols-2 sm:grid-cols-3 xl:grid-cols-3'
              }`}
            >
              {sortedProducts.map((product, idx) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  priority={idx < 4}
                  onQuickView={(p) => setQuickViewProduct(p)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer Modal */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          <div
            onClick={() => setMobileFiltersOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xs bg-mande-ivory text-mande-black shadow-2xl flex flex-col p-6 overflow-y-auto space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-mande-ivoryDark">
                <h3 className="font-serif text-lg font-bold uppercase tracking-wider">
                  Filtres & Motifs
                </h3>
                <button onClick={() => setMobileFiltersOpen(false)}>
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              {/* Mobile Bôkôlan Motifs */}
              <div className="space-y-2">
                <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-mande-gold">
                  Symboles Bôkôlan
                </h4>
                <select
                  value={selectedMotif}
                  onChange={(e) => setSelectedMotif(e.target.value)}
                  className="w-full p-2 bg-white border border-mande-ivoryDark text-xs font-sans"
                >
                  {bokolanMotifs.map((m) => (
                    <option key={m.key} value={m.key}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Mobile Category */}
              <div className="space-y-2">
                <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-mande-gold">
                  Catégories
                </h4>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 bg-white border border-mande-ivoryDark text-xs font-sans"
                >
                  <option value="all">Toutes les catégories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-4 border-t border-mande-ivoryDark flex gap-2">
                <Button onClick={resetFilters} variant="ghost" size="sm" className="flex-1">
                  Effacer
                </Button>
                <Button onClick={() => setMobileFiltersOpen(false)} variant="gold" size="sm" className="flex-1">
                  Appliquer
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={Boolean(quickViewProduct)}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
}
