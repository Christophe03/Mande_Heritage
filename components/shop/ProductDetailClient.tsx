'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Heart, 
  ShoppingBag, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  Sparkles, 
  Plus, 
  Minus, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  Share2, 
  Ruler,
  Globe,
  Scissors,
  AlertTriangle,
  Clock,
  MessageCircle
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCurrency } from '@/context/CurrencyContext';
import { formatPrice, safeJsonParse } from '@/lib/utils';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ProductCard } from './ProductCard';
import { BogolanDivider } from '../ui/BogolanPattern';

interface ProductDetailClientProps {
  product: any;
  relatedProducts: any[];
}

export function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { currency } = useCurrency();

  const imagesList = Array.isArray(product.images)
    ? product.images
    : safeJsonParse<string[]>(product.images, []);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });

  const sizesList = Array.isArray(product.sizes)
    ? product.sizes
    : safeJsonParse<string[]>(product.sizes, ['M']);

  const colorsList = Array.isArray(product.colors)
    ? product.colors
    : safeJsonParse<string[]>(product.colors, ['Bôkôlan Naturel']);

  const [selectedSize, setSelectedSize] = useState<string>(sizesList[0] || 'Taille Unique');
  const [selectedColor, setSelectedColor] = useState<string>(colorsList[0] || 'Bôkôlan Naturel');
  const [quantity, setQuantity] = useState<number>(1);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  // Custom Tailoring State
  const [customTailoringOpen, setCustomTailoringOpen] = useState(false);
  const [customInitials, setCustomInitials] = useState('');
  const [customMeasurements, setCustomMeasurements] = useState({
    chest: '',
    waist: '',
    length: '',
    notes: '',
  });

  // Country Delivery Calculator State
  const [selectedCountry, setSelectedCountry] = useState('MALI');

  const deliveryEstimates: Record<string, { days: string; cost: string; badge: string }> = {
    MALI: { days: '24h à 48h (Coursier Bamako Express)', cost: 'Gratuit dès 100 000 FCFA (sinon 2 500 FCFA)', badge: 'Livraison Locale Express' },
    SENEGAL: { days: '2 à 4 jours ouvrés', cost: '12 500 FCFA (DHL Express)', badge: 'Zone UEMOA' },
    COTE_DIVOIRE: { days: '2 à 4 jours ouvrés', cost: '12 500 FCFA (DHL Express)', badge: 'Zone UEMOA' },
    GUINEE: { days: '3 à 5 jours ouvrés', cost: '15 000 FCFA (DHL Express)', badge: 'Afrique de l’Ouest' },
    FRANCE: { days: '3 à 5 jours ouvrés', cost: '25 000 FCFA (~38 €) (DHL Express)', badge: 'Europe Express' },
    BELGIQUE: { days: '3 à 5 jours ouvrés', cost: '25 000 FCFA (~38 €) (DHL Express)', badge: 'Europe Express' },
    USA: { days: '4 à 7 jours ouvrés', cost: '35 000 FCFA (~55 $) (DHL Express)', badge: 'Amérique du Nord' },
    CANADA: { days: '4 à 7 jours ouvrés', cost: '35 000 FCFA (~55 $) (DHL Express)', badge: 'Amérique du Nord' },
    OTHER: { days: '5 à 8 jours ouvrés', cost: '40 000 FCFA (DHL Worldwide)', badge: 'International' },
  };

  const currentDelivery = deliveryEstimates[selectedCountry] || deliveryEstimates.OTHER;

  // Accordion tabs state
  const [activeAccordion, setActiveAccordion] = useState<string>('description');

  const toggleAccordion = (tab: string) => {
    setActiveAccordion(activeAccordion === tab ? '' : tab);
  };

  const isFavorite = isInWishlist(product.id);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  const handleAddToCart = () => {
    let customNote = '';
    if (customTailoringOpen) {
      const parts = [];
      if (customInitials.trim()) parts.push(`Initiales brodées: ${customInitials.trim()}`);
      if (customMeasurements.chest) parts.push(`Poitrine: ${customMeasurements.chest}cm`);
      if (customMeasurements.waist) parts.push(`Taille: ${customMeasurements.waist}cm`);
      if (customMeasurements.length) parts.push(`Longueur: ${customMeasurements.length}cm`);
      if (customMeasurements.notes) parts.push(`Notes: ${customMeasurements.notes}`);
      customNote = parts.join(' | ');
    }

    addItem({
      productId: product.id,
      name: customTailoringOpen && customInitials ? `${product.name} (Sur-Mesure: ${customInitials})` : product.name,
      slug: product.slug,
      price: product.price,
      image: imagesList[0] || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=600',
      size: customTailoringOpen ? `Sur-Mesure (${selectedSize})` : selectedSize,
      color: selectedColor,
      quantity,
      maxStock: product.stock ?? 10,
    });

    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/checkout');
  };

  // Stock scarcity level
  const stockCount = product.stock ?? 10;

  return (
    <div className="pt-28 pb-24 min-h-screen bg-mande-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-xs text-gray-500 font-sans mb-8">
          <Link href="/" className="hover:text-mande-gold transition-colors">
            Accueil
          </Link>
          <span>/</span>
          <Link href="/boutique" className="hover:text-mande-gold transition-colors">
            Boutique
          </Link>
          {product.category && (
            <>
              <span>/</span>
              <Link
                href={`/boutique?category=${product.category.slug}`}
                className="hover:text-mande-gold transition-colors"
              >
                {product.category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-mande-black font-medium truncate max-w-xs sm:max-w-none">
            {product.name}
          </span>
        </nav>

        {/* Main Product Presentation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Image Gallery (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Stage Image with High-Res Zoom */}
            <div
              className="relative aspect-[3/4] w-full bg-mande-sand/10 border border-mande-ivoryDark overflow-hidden cursor-crosshair group shadow-card"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
            >
              <Image
                src={imagesList[activeImageIndex] || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800'}
                alt={product.name}
                fill
                priority
                className={`object-cover object-center transition-transform duration-300 ${
                  isZoomed ? 'scale-150' : 'scale-100'
                }`}
                style={
                  isZoomed
                    ? {
                        transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                      }
                    : undefined
                }
              />

              {/* Badges Top Left */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                {product.isNew && <Badge variant="gold">Nouveauté Royale</Badge>}
                {product.collection?.slug === 'editions-limitees' && (
                  <Badge variant="dark">Édition Limitée</Badge>
                )}
                {product.originalPrice && product.originalPrice > product.price && (
                  <Badge variant="earth">Offre Privilège</Badge>
                )}
              </div>

              {/* Wishlist Button Top Right */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  toggleWishlist({
                    productId: product.id,
                    name: product.name,
                    slug: product.slug,
                    price: product.price,
                    image: imagesList[0],
                    categoryName: product.category?.name,
                  });
                }}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm border border-mande-sand flex items-center justify-center text-mande-black hover:text-red-500 hover:scale-110 transition-all duration-200 shadow-md z-10"
                aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
              >
                <Heart
                  className={`w-5 h-5 transition-colors ${
                    isFavorite ? 'fill-red-500 text-red-500' : 'text-mande-black'
                  }`}
                />
              </button>
            </div>

            {/* Thumbnail Carousel */}
            {imagesList.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-mande-gold">
                {imagesList.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-24 flex-shrink-0 bg-mande-sand/10 border-2 transition-all ${
                      activeImageIndex === idx
                        ? 'border-mande-gold ring-2 ring-mande-gold/20 scale-105'
                        : 'border-mande-ivoryDark opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt={`${product.name} vue ${idx + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Details & Buying Actions (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            {/* Header info */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs tracking-widest text-mande-gold uppercase font-sans font-semibold">
                <span>{product.collection?.name || 'Maison Mandé Héritage'}</span>
                <span>{product.gender || 'UNISEXE'}</span>
              </div>

              <h1 className="font-serif text-2xl sm:text-4xl font-bold tracking-wide text-mande-black uppercase">
                {product.name}
              </h1>

              {/* Price & Scarcity Badge */}
              <div className="flex items-baseline gap-4 pt-1">
                <span className="font-serif text-2xl sm:text-3xl font-bold text-mande-earth">
                  {formatPrice(product.price, currency)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="font-serif text-base text-gray-400 line-through">
                    {formatPrice(product.originalPrice, currency)}
                  </span>
                )}
              </div>

              {/* Live Stock & Scarcity Indicator */}
              <div className="pt-2">
                {stockCount <= 5 ? (
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-800 text-xs font-sans font-semibold">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                    <span>Édition Rare &bull; Seulement <strong>{stockCount} pièce(s)</strong> confectionnée(s)</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/30 text-green-800 text-xs font-sans font-semibold">
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    <span>Pièce disponible en atelier</span>
                  </div>
                )}
              </div>
            </div>

            <BogolanDivider variant="gold" className="my-2" />

            {/* Size Selector */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-mande-black font-semibold font-sans">
                  Taille : <strong className="text-mande-earth">{selectedSize}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setSizeGuideOpen(!sizeGuideOpen)}
                  className="inline-flex items-center gap-1 text-xs text-mande-gold hover:underline font-sans"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Guide des tailles</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {sizesList.map((sz: string) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`min-w-[48px] h-10 px-3 flex items-center justify-center text-xs font-sans uppercase tracking-wider font-semibold border transition-all ${
                      selectedSize === sz
                        ? 'bg-mande-black text-mande-gold border-mande-black shadow-sm scale-105'
                        : 'bg-white text-mande-black border-mande-ivoryDark hover:border-mande-gold'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Color / Pattern Selector */}
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-wider text-mande-black font-semibold font-sans">
                Motif & Teinture : <strong className="text-mande-earth">{selectedColor}</strong>
              </span>
              <div className="flex flex-wrap gap-2">
                {colorsList.map((col: string) => (
                  <button
                    key={col}
                    onClick={() => setSelectedColor(col)}
                    className={`px-3.5 py-2 text-xs font-sans uppercase tracking-wider border transition-all ${
                      selectedColor === col
                        ? 'bg-mande-gold/20 text-mande-black font-bold border-mande-gold'
                        : 'bg-white text-gray-700 border-mande-ivoryDark hover:border-mande-gold'
                    }`}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Tailoring & Embroidery Option Accordion */}
            <div className="border border-mande-gold/30 bg-mande-ivoryLight p-4 space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-2">
                  <Scissors className="w-4 h-4 text-mande-gold" />
                  <span className="font-serif text-sm font-bold uppercase tracking-wider text-mande-black">
                    Confection Sur-Mesure & Broderie d’Initiales
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={customTailoringOpen}
                  onChange={(e) => setCustomTailoringOpen(e.target.checked)}
                  className="w-4 h-4 accent-mande-gold"
                />
              </label>

              {customTailoringOpen && (
                <div className="pt-3 border-t border-mande-ivoryDark space-y-3 text-xs font-sans animate-fadeIn">
                  <p className="text-gray-600 font-light">
                    Nos maîtres artisans façonnent cette pièce selon vos mensurations précises et peuvent broder vos initiales en fil d’or.
                  </p>
                  <div className="space-y-1">
                    <label className="text-gray-700 uppercase font-semibold">Initiales à broder (Optionnel)</label>
                    <input
                      type="text"
                      maxLength={5}
                      placeholder="Ex: M.K."
                      value={customInitials}
                      onChange={(e) => setCustomInitials(e.target.value.toUpperCase())}
                      className="w-full px-3 py-1.5 bg-white border border-mande-ivoryDark text-mande-black font-mono focus:outline-none focus:border-mande-gold uppercase"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-600 uppercase">Poitrine (cm)</label>
                      <input
                        type="number"
                        placeholder="102"
                        value={customMeasurements.chest}
                        onChange={(e) => setCustomMeasurements({ ...customMeasurements, chest: e.target.value })}
                        className="w-full px-2 py-1 bg-white border border-mande-ivoryDark text-xs font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-600 uppercase">Taille (cm)</label>
                      <input
                        type="number"
                        placeholder="84"
                        value={customMeasurements.waist}
                        onChange={(e) => setCustomMeasurements({ ...customMeasurements, waist: e.target.value })}
                        className="w-full px-2 py-1 bg-white border border-mande-ivoryDark text-xs font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-600 uppercase">Longueur (cm)</label>
                      <input
                        type="number"
                        placeholder="115"
                        value={customMeasurements.length}
                        onChange={(e) => setCustomMeasurements({ ...customMeasurements, length: e.target.value })}
                        className="w-full px-2 py-1 bg-white border border-mande-ivoryDark text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quantity Selector & Action CTA Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-4">
                {/* Quantity */}
                <div className="flex items-center border border-mande-ivoryDark bg-white h-12">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-full flex items-center justify-center hover:bg-mande-sand/20 transition-colors"
                    aria-label="Diminuer la quantité"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center font-mono font-bold text-sm">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(stockCount, quantity + 1))}
                    className="w-10 h-full flex items-center justify-center hover:bg-mande-sand/20 transition-colors"
                    aria-label="Augmenter la quantité"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add to Cart Button */}
                <Button
                  onClick={handleAddToCart}
                  disabled={stockCount === 0}
                  variant="gold"
                  size="lg"
                  className="flex-1 shadow-gold-md"
                  leftIcon={addedAnimation ? <Check className="w-5 h-5" /> : <ShoppingBag className="w-5 h-5" />}
                >
                  {addedAnimation ? 'Pièce Ajoutée au Panier' : stockCount === 0 ? 'En Rupture' : 'Acquérir cette Création'}
                </Button>
              </div>

              {/* Buy Now & WhatsApp Instant Order */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={handleBuyNow}
                  disabled={stockCount === 0}
                  variant="dark"
                  size="md"
                  className="w-full uppercase tracking-wider text-xs"
                >
                  Passer Commande Directe
                </Button>

                <a
                  href={`https://wa.me/22370000001?text=Bonjour%20Maison%20Mand%C3%A9%20H%C3%A9ritage,%20je%20souhaite%20commander%20la%20pi%C3%A8ce%20:%20${encodeURIComponent(product.name)}%20(Taille%20${selectedSize}).`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 py-2.5 px-3 bg-green-700 hover:bg-green-600 text-white font-semibold uppercase tracking-wider text-xs transition-colors shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Commander sur WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Live Country Delivery Calculator Box */}
            <div className="bg-white p-4 border border-mande-ivoryDark text-xs font-sans space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold uppercase text-mande-black tracking-wider">
                  <Globe className="w-4 h-4 text-mande-gold" />
                  <span>Estimation de Livraison en Direct</span>
                </div>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="bg-mande-ivoryLight border border-mande-ivoryDark text-mande-black px-2.5 py-1 text-xs focus:outline-none focus:border-mande-gold font-semibold"
                >
                  <option value="MALI">Mali (Bamako)</option>
                  <option value="SENEGAL">Sénégal (Dakar)</option>
                  <option value="COTE_DIVOIRE">Côte d’Ivoire (Abidjan)</option>
                  <option value="GUINEE">Guinée (Conakry)</option>
                  <option value="FRANCE">France (Paris & Régions)</option>
                  <option value="BELGIQUE">Belgique</option>
                  <option value="USA">États-Unis</option>
                  <option value="CANADA">Canada</option>
                  <option value="OTHER">Autre Pays</option>
                </select>
              </div>

              <div className="p-2.5 bg-mande-ivoryLight border border-mande-ivoryDark flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="font-semibold text-mande-black flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-mande-gold" />
                    <span>Délai garanti : {currentDelivery.days}</span>
                  </p>
                  <p className="text-gray-500 text-[11px]">Tarif expédition : {currentDelivery.cost}</p>
                </div>
                <span className="px-2 py-0.5 bg-mande-black text-mande-gold text-[10px] font-bold uppercase">
                  {currentDelivery.badge}
                </span>
              </div>
            </div>

            {/* Accordions: Storytelling, Materials, Care */}
            <div className="border-t border-mande-ivoryDark divide-y divide-mande-ivoryDark pt-2 font-sans text-xs">
              {/* Description & Storytelling */}
              <div className="py-3">
                <button
                  onClick={() => toggleAccordion('description')}
                  className="w-full flex items-center justify-between text-left font-serif font-bold uppercase tracking-wider text-mande-black py-1"
                >
                  <span>L’Héritage & La Coupe</span>
                  {activeAccordion === 'description' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {activeAccordion === 'description' && (
                  <p className="text-gray-600 font-light leading-relaxed pt-2">
                    {product.description}
                  </p>
                )}
              </div>

              {/* Materials */}
              <div className="py-3">
                <button
                  onClick={() => toggleAccordion('materials')}
                  className="w-full flex items-center justify-between text-left font-serif font-bold uppercase tracking-wider text-mande-black py-1"
                >
                  <span>Matières & Teintures Végétales</span>
                  {activeAccordion === 'materials' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {activeAccordion === 'materials' && (
                  <p className="text-gray-600 font-light leading-relaxed pt-2">
                    {product.materials || '100% Coton biologique peigné cultivé au Mali. Teinture artisanale à l’argile fermentée du fleuve Niger et décoctions de feuilles sauvages de n’galama.'}
                  </p>
                )}
              </div>

              {/* Care */}
              <div className="py-3">
                <button
                  onClick={() => toggleAccordion('care')}
                  className="w-full flex items-center justify-between text-left font-serif font-bold uppercase tracking-wider text-mande-black py-1"
                >
                  <span>Conseils d’Entretien de Prestige</span>
                  {activeAccordion === 'care' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {activeAccordion === 'care' && (
                  <p className="text-gray-600 font-light leading-relaxed pt-2">
                    {product.careInstructions || 'Nettoyage à sec spécialisé textile précieux recommandé. Repassage doux sur l’envers pour préserver les pigments naturels minéraux.'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 pt-16 border-t border-mande-ivoryDark">
            <div className="text-center mb-12">
              <span className="text-xs uppercase tracking-[0.25em] text-mande-gold font-sans font-semibold">
                Harmonie du Vestiaire
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold uppercase tracking-wider text-mande-black mt-1">
                Créations Assorties
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 4).map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
