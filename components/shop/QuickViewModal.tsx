'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  X, 
  ShoppingBag, 
  Heart, 
  Check, 
  ArrowRight, 
  Eye, 
  ShieldCheck, 
  Sparkles 
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCurrency } from '@/context/CurrencyContext';
import { formatPrice, safeJsonParse } from '@/lib/utils';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface QuickViewModalProps {
  product: any | null;
  isOpen: boolean;
  onClose: () => void;
}

export function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { currency } = useCurrency();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  if (!isOpen || !product) return null;

  const imagesList = Array.isArray(product.images)
    ? product.images
    : safeJsonParse<string[]>(product.images, []);

  const sizesList = Array.isArray(product.sizes)
    ? product.sizes
    : safeJsonParse<string[]>(product.sizes, ['M']);

  const colorsList = Array.isArray(product.colors)
    ? product.colors
    : safeJsonParse<string[]>(product.colors, ['Bôkôlan Naturel']);

  const currentSize = selectedSize || sizesList[0] || 'Unique';
  const currentColor = selectedColor || colorsList[0] || 'Bôkôlan Naturel';

  const isFavorite = isInWishlist(product.id);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: imagesList[0] || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=600',
      size: currentSize,
      color: currentColor,
      quantity,
      maxStock: product.stock ?? 10,
    });

    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm p-4 sm:p-6 flex items-center justify-center animate-fadeIn">
      <div className="relative bg-white text-mande-black border border-mande-gold/50 max-w-4xl w-full p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-black transition-colors z-20"
          aria-label="Fermer l'aperçu"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
          {/* Visual Gallery */}
          <div className="space-y-3">
            <div className="relative aspect-[3/4] w-full bg-mande-sand/10 border border-mande-ivoryDark overflow-hidden">
              <Image
                src={imagesList[activeImageIndex] || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=600'}
                alt={product.name}
                fill
                className="object-cover"
              />
              {product.isNew && (
                <div className="absolute top-3 left-3 z-10">
                  <Badge variant="gold">Nouveau</Badge>
                </div>
              )}
            </div>

            {imagesList.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {imagesList.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-14 h-16 bg-mande-sand/10 border transition-all flex-shrink-0 ${
                      activeImageIndex === idx ? 'border-mande-gold ring-1 ring-mande-gold' : 'border-mande-ivoryDark opacity-70'
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-4 text-xs font-sans">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-mande-gold font-bold">
                {product.category?.name || 'Maison Mandé Héritage'}
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold uppercase tracking-wider text-mande-black mt-0.5">
                {product.name}
              </h2>
              <div className="mt-2 flex items-baseline gap-3">
                <span className="font-serif text-xl font-bold text-mande-earth">
                  {formatPrice(product.price, currency)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="font-serif text-sm text-gray-400 line-through">
                    {formatPrice(product.originalPrice, currency)}
                  </span>
                )}
              </div>
            </div>

            <p className="text-gray-600 font-light line-clamp-3 leading-relaxed">
              {product.description}
            </p>

            {/* Size Selector */}
            <div className="space-y-2 pt-2 border-t border-mande-ivoryDark">
              <span className="font-semibold uppercase text-mande-black">
                Taille : <strong className="text-mande-earth">{currentSize}</strong>
              </span>
              <div className="flex flex-wrap gap-2">
                {sizesList.map((sz: string) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`px-3 py-1.5 font-bold uppercase text-xs border transition-all ${
                      currentSize === sz
                        ? 'bg-mande-black text-mande-gold border-mande-black'
                        : 'bg-white text-mande-black border-mande-ivoryDark hover:border-mande-gold'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selector */}
            <div className="space-y-2">
              <span className="font-semibold uppercase text-mande-black">
                Coloris : <strong className="text-mande-earth">{currentColor}</strong>
              </span>
              <div className="flex flex-wrap gap-2">
                {colorsList.map((col: string) => (
                  <button
                    key={col}
                    onClick={() => setSelectedColor(col)}
                    className={`px-3 py-1 text-xs uppercase border transition-all ${
                      currentColor === col
                        ? 'bg-mande-gold/20 text-mande-black font-bold border-mande-gold'
                        : 'bg-white text-gray-700 border-mande-ivoryDark hover:border-mande-gold'
                    }`}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-mande-ivoryDark space-y-2">
              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                variant="gold"
                size="md"
                className="w-full shadow-gold-md"
                leftIcon={addedAnimation ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
              >
                {addedAnimation ? 'Ajouté au Panier !' : product.stock === 0 ? 'En Rupture' : 'Ajouter au Panier Express'}
              </Button>

              <div className="flex justify-between items-center pt-2">
                <Link
                  href={`/produit/${product.slug}`}
                  onClick={onClose}
                  className="text-xs uppercase font-semibold text-mande-black hover:text-mande-gold transition-colors flex items-center gap-1"
                >
                  <span>Voir la fiche complète & options sur-mesure</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
