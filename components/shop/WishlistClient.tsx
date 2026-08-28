'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Heart, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  Share2, 
  Check, 
  MessageCircle, 
  Sparkles,
  ArrowLeft,
  X
} from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { BogolanBorder, BogolanDivider } from '@/components/ui/BogolanPattern';

export function WishlistClient() {
  const { items, toggleWishlist } = useWishlist();
  const { addItem } = useCart();
  const { currency } = useCurrency();
  const [copiedLink, setCopiedLink] = useState(false);
  const [allAddedAnimation, setAllAddedAnimation] = useState(false);
  const [singleAddedId, setSingleAddedId] = useState<string | null>(null);

  const totalValue = items.reduce((acc, item) => acc + item.price, 0);

  const handleAddToCart = (item: any) => {
    addItem({
      productId: item.productId,
      name: item.name,
      slug: item.slug,
      price: item.price,
      image: item.image,
      size: 'Taille Standard',
      color: 'Bôkôlan Naturel',
      quantity: 1,
      maxStock: 10,
    });

    setSingleAddedId(item.productId);
    setTimeout(() => setSingleAddedId(null), 1500);
  };

  const handleAddAllToCart = () => {
    items.forEach((item) => {
      addItem({
        productId: item.productId,
        name: item.name,
        slug: item.slug,
        price: item.price,
        image: item.image,
        size: 'Taille Standard',
        color: 'Bôkôlan Naturel',
        quantity: 1,
        maxStock: 10,
      });
    });

    setAllAddedAnimation(true);
    setTimeout(() => setAllAddedAnimation(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const listText = items
      .map((it, idx) => `${idx + 1}. ${it.name} (${formatPrice(it.price, currency)})`)
      .join('%0A');
    const msg = `Bonjour,%20voici%20ma%20sélection%20de%20créations%20coup%20de%20cœur%20chez%20Maison%20Mandé%20Héritage%20:%0A%0A${listText}%0A%0AValeur%20totale:%20${encodeURIComponent(
      formatPrice(totalValue, currency)
    )}%0A%0ADécouvrez-les%20sur%20https://mandeheritage.com/boutique`;

    window.open(`https://wa.me/?text=${msg}`, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="pt-24 min-h-screen bg-mande-ivory pb-24">
      {/* Header */}
      <div className="bg-mande-ivoryLight py-14 border-b border-mande-ivoryDark px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-mande-gold font-sans font-semibold flex items-center justify-center gap-2">
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            <span>Vos Coups de Cœur &bull; Vestiaire Idéal</span>
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold uppercase tracking-wider text-mande-black">
            Mes Créations Favorites ({items.length})
          </h1>
          <BogolanDivider variant="gold" className="my-3" />
          <p className="text-xs sm:text-sm text-gray-600 font-sans font-light max-w-xl mx-auto">
            Retrouvez toutes les pièces que vous avez aimées. Partagez votre liste de souhaits ou transférez-les directement dans votre panier.
          </p>
        </div>
      </div>

      <BogolanBorder className="opacity-40 text-mande-gold" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {items.length === 0 ? (
          <div className="bg-white p-12 sm:p-16 border border-mande-ivoryDark text-center space-y-6 shadow-card max-w-xl mx-auto">
            <div className="w-20 h-20 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto border border-red-200">
              <Heart className="w-10 h-10 stroke-[1.5]" />
            </div>
            <div className="space-y-2">
              <h2 className="font-serif text-2xl font-bold uppercase tracking-wider text-mande-black">
                Votre sélection est vide
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 font-sans font-light max-w-md mx-auto">
                Explorez nos créations en Bôkôlan et cliquez sur le cœur pour composer votre vestiaire idéal.
              </p>
            </div>
            <Link href="/boutique">
              <Button variant="gold" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Découvrir la Boutique
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Top Toolbar with Actions & Value */}
            <div className="bg-white p-6 border border-mande-ivoryDark shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <span className="text-xs text-gray-500 font-sans block">Valeur marchande de vos favoris :</span>
                <span className="font-serif text-2xl font-bold text-mande-earth">
                  {formatPrice(totalValue, currency)}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                {/* Share on WhatsApp */}
                <button
                  onClick={handleShareWhatsApp}
                  className="px-4 py-2.5 bg-green-700 hover:bg-green-600 text-white font-sans text-xs uppercase tracking-wider font-semibold flex items-center gap-2 transition-colors shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Partager sur WhatsApp</span>
                </button>

                {/* Move all to cart */}
                <Button
                  onClick={handleAddAllToCart}
                  variant="gold"
                  size="md"
                  leftIcon={allAddedAnimation ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                >
                  {allAddedAnimation ? 'Tous les articles ajoutés !' : 'Tout Ajouter au Panier'}
                </Button>
              </div>
            </div>

            {/* Grid of Favorited Items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {items.map((item) => {
                const isSingleAdded = singleAddedId === item.productId;
                return (
                  <div
                    key={item.productId}
                    className="bg-white border border-mande-ivoryDark hover:border-mande-gold transition-all duration-300 shadow-sm hover:shadow-card-hover p-4 flex flex-col justify-between group"
                  >
                    <div>
                      {/* Product Image & Remove Button */}
                      <div className="relative aspect-[3/4] w-full mb-3 bg-mande-sand/10 overflow-hidden border border-mande-ivoryDark">
                        <Link href={`/produit/${item.slug}`}>
                          <Image
                            src={item.image || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=600'}
                            alt={item.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </Link>

                        {/* Unlike Button */}
                        <button
                          onClick={() => toggleWishlist(item)}
                          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/95 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200 flex items-center justify-center shadow-md z-10"
                          title="Retirer des favoris"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Info */}
                      <div className="space-y-1">
                        <span className="text-[10px] text-mande-gold uppercase tracking-widest font-sans font-bold block">
                          {item.categoryName || 'Maison Mandé'}
                        </span>
                        <Link href={`/produit/${item.slug}`}>
                          <h3 className="font-serif text-sm sm:text-base font-bold text-mande-black group-hover:text-mande-earth transition-colors line-clamp-1 uppercase">
                            {item.name}
                          </h3>
                        </Link>
                        <p className="font-serif font-bold text-base text-mande-earth pt-1">
                          {formatPrice(item.price, currency)}
                        </p>
                      </div>
                    </div>

                    {/* Direct Add to Cart Button */}
                    <div className="mt-4 pt-3 border-t border-mande-ivoryDark">
                      <Button
                        onClick={() => handleAddToCart(item)}
                        variant="gold"
                        size="sm"
                        className="w-full text-xs uppercase"
                        leftIcon={isSingleAdded ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                      >
                        {isSingleAdded ? 'Ajouté !' : 'Ajouter au Panier'}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
