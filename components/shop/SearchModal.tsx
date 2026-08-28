'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, X, ArrowRight } from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';
import { formatPrice } from '@/lib/utils';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { currency } = useCurrency();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.products || []);
      } catch (e) {
        console.error('Search error:', e);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const popularSearches = ['Bôkôlan', 'Kimono', 'Robe Soundiata', 'Cabas Cuir', 'Mocassins', 'Étole Soie'];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="min-h-screen px-4 text-center">
        {/* Backdrop */}
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        />

        {/* Modal Container */}
        <div className="inline-block w-full max-w-2xl my-16 p-6 sm:p-8 text-left align-middle transition-all transform bg-mande-ivory shadow-2xl border border-mande-gold/40 relative z-10 text-mande-black">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-gray-500 hover:text-mande-black transition-colors"
            aria-label="Fermer la recherche"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Search Bar Input */}
          <div className="relative mt-2">
            <Search className="w-6 h-6 absolute left-4 top-4 text-mande-gold" />
            <input
              type="text"
              autoFocus
              placeholder="Rechercher une pièce d’exception, une matière, un motif..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-14 pr-4 py-3.5 bg-white border border-mande-sandDark font-sans text-sm focus:outline-none focus:border-mande-gold text-mande-black"
            />
          </div>

          {/* Suggestions */}
          {!query && (
            <div className="mt-6">
              <p className="text-xs uppercase tracking-widest text-gray-500 font-sans mb-3">
                Recherches fréquentes
              </p>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-3 py-1.5 bg-mande-sand/20 border border-mande-sand text-xs hover:border-mande-gold hover:text-mande-gold transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Results */}
          <div className="mt-6 max-h-96 overflow-y-auto">
            {loading ? (
              <div className="py-8 text-center text-xs text-gray-500">
                Recherche en cours dans la collection Mandé Héritage...
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-4 divide-y divide-mande-ivoryDark">
                {results.map((product) => {
                  const images = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
                  const firstImg = images?.[0] || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=300';
                  return (
                    <Link
                      key={product.id}
                      href={`/produit/${product.slug}`}
                      onClick={onClose}
                      className="flex items-center gap-4 pt-4 group first:pt-0"
                    >
                      <div className="relative w-14 h-16 bg-mande-sand/20 flex-shrink-0 overflow-hidden border border-mande-sand">
                        <Image src={firstImg} alt={product.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-serif text-sm font-semibold group-hover:text-mande-gold transition-colors">
                          {product.name}
                        </h4>
                        <p className="text-xs text-gray-500">{product.category?.name}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-serif text-sm font-bold text-mande-earth">
                          {formatPrice(product.price, currency)}
                        </span>
                        <div className="text-[10px] text-mande-gold flex items-center gap-1 mt-0.5 justify-end">
                          <span>Voir la pièce</span>
                          <ArrowRight className="w-3 h-3" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : query.trim() ? (
              <div className="py-8 text-center text-xs text-gray-500">
                Aucune création ne correspond à &quot;{query}&quot;.
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
