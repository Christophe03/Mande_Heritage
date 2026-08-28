'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, Eye, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCurrency } from '@/context/CurrencyContext';
import { formatPrice, safeJsonParse } from '@/lib/utils';
import { Badge } from '../ui/Badge';

export interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    description?: string;
    price: number;
    originalPrice?: number | null;
    images: string | string[];
    category?: { name: string; slug: string } | null;
    collection?: { name: string; slug: string } | null;
    isNew?: boolean;
    isFeatured?: boolean;
    sizes?: string | string[];
    colors?: string | string[];
    stock?: number;
  };
  priority?: boolean;
  onQuickView?: (product: any) => void;
}

export function ProductCard({ product, priority = false, onQuickView }: ProductCardProps) {
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { currency } = useCurrency();

  const [isHovered, setIsHovered] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const imagesList = Array.isArray(product.images)
    ? product.images
    : safeJsonParse<string[]>(product.images, []);

  const primaryImage = imagesList[0] || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=600';
  const secondaryImage = imagesList[1] || primaryImage;

  const sizesList = Array.isArray(product.sizes)
    ? product.sizes
    : safeJsonParse<string[]>(product.sizes, ['M']);

  const colorsList = Array.isArray(product.colors)
    ? product.colors
    : safeJsonParse<string[]>(product.colors, ['Bôkôlan Naturel']);

  const isFavorite = isInWishlist(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: primaryImage,
      size: sizesList[0] || 'Taille Unique',
      color: colorsList[0] || 'Bôkôlan Naturel',
      quantity: 1,
      maxStock: product.stock ?? 10,
    });

    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: primaryImage,
      categoryName: product.category?.name,
    });
  };

  return (
    <div
      className="group relative flex flex-col bg-white border border-mande-ivoryDark hover:border-mande-gold/60 transition-all duration-500 shadow-sm hover:shadow-card-hover overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Container */}
      <Link href={`/produit/${product.slug}`} className="relative aspect-[3/4] w-full overflow-hidden bg-mande-sand/10">
        <Image
          src={isHovered && secondaryImage !== primaryImage ? secondaryImage : primaryImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          priority={priority}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isNew && <Badge variant="gold">Nouveau</Badge>}
          {product.collection?.slug === 'editions-limitees' && (
            <Badge variant="dark">Édition Limitée</Badge>
          )}
          {product.originalPrice && product.originalPrice > product.price && (
            <Badge variant="earth">Offre Privilège</Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm border border-mande-sand flex items-center justify-center text-mande-black hover:text-red-500 hover:scale-110 transition-all duration-200 z-10"
          aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorite ? 'fill-red-500 text-red-500' : 'text-mande-black'
            }`}
          />
        </button>

        {/* Quick Actions Overlay on Desktop */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 hidden sm:flex items-center gap-2">
          {onQuickView && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQuickView(product);
              }}
              className="p-2.5 bg-mande-black/90 hover:bg-mande-gold hover:text-mande-black text-mande-ivory transition-colors border border-mande-gold/40"
              title="Aperçu Rapide"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={handleQuickAdd}
            disabled={product.stock === 0}
            className="flex-1 py-2.5 px-3 bg-mande-gold hover:bg-mande-goldLight text-mande-black text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors shadow-sm"
          >
            {addedAnimation ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Ajouté !</span>
              </>
            ) : product.stock === 0 ? (
              <span>Rupture</span>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Ajout Express</span>
              </>
            )}
          </button>
        </div>
      </Link>

      {/* Product Information */}
      <div className="p-4 flex flex-col flex-1 justify-between bg-mande-ivoryLight">
        <div>
          {/* Category / Collection Tag */}
          <div className="flex items-center justify-between text-[11px] uppercase tracking-widest text-gray-500 font-sans mb-1">
            <span>{product.category?.name || 'Maison Mandé'}</span>
            {product.collection && (
              <span className="text-mande-gold font-medium">{product.collection.name}</span>
            )}
          </div>

          {/* Product Title */}
          <Link href={`/produit/${product.slug}`}>
            <h3 className="font-serif text-sm sm:text-base font-bold text-mande-black group-hover:text-mande-earth transition-colors line-clamp-1 uppercase tracking-wide">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Price and Sizes row */}
        <div className="mt-3 pt-3 border-t border-mande-ivoryDark flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-serif font-bold text-base text-mande-earth">
              {formatPrice(product.price, currency)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-gray-400 line-through font-serif">
                {formatPrice(product.originalPrice, currency)}
              </span>
            )}
          </div>

          {/* Available Sizes preview */}
          {sizesList.length > 0 && (
            <div className="text-[10px] text-gray-500 font-mono">
              {sizesList.slice(0, 3).join(' ')}
              {sizesList.length > 3 ? '+' : ''}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
