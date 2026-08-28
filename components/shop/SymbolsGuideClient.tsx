'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Sparkles, 
  ShieldCheck, 
  Search, 
  ArrowRight, 
  BookOpen, 
  Layers, 
  Eye, 
  Flame,
  Heart,
  Crown,
  Compass
} from 'lucide-react';
import { BogolanBorder, BogolanDivider } from '../ui/BogolanPattern';
import { Button } from '../ui/Button';

interface BogolanSymbol {
  id: string;
  bambaraName: string;
  frenchTitle: string;
  theme: 'NOBLESSE' | 'BRAVOURE' | 'HARMONIE' | 'SAGESSE';
  svgPath: string; // Symbolic visual geometry
  meaning: string;
  storytelling: string;
  originTradition: string;
  associatedProducts: {
    name: string;
    slug: string;
    price: string;
    image: string;
  }[];
}

const SYMBOLS_DATA: BogolanSymbol[] = [
  {
    id: 'tiranke',
    bambaraName: 'Tiranké',
    frenchTitle: 'Le Courage du Guerrier & La Détermination',
    theme: 'BRAVOURE',
    svgPath: 'M20 20 L80 80 M80 20 L20 80 M50 10 L50 90 M10 50 L90 50',
    meaning: 'Symbole de bravoure, de ténacité face aux épreuves et de protection spirituelle lors des grands défis.',
    storytelling: 'Dans l’Empire du Mandé, les chasseurs et guerriers d’élite portaient des tuniques teintes à l’argile frappées du motif Tiranké. Ce tracé géométrique croisé était réputé absorber les forces telluriques pour dévier le mauvais sort et infuser une force inébranlable.',
    originTradition: 'Région de Ségou & San &bull; Confrérie des Chasseurs Donso',
    associatedProducts: [
      {
        name: 'Kimono Royal Soundiata',
        slug: 'kimono-royal-soundiata',
        price: '185 000 FCFA',
        image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=400',
      },
      {
        name: 'Veste Tailleur Mandé',
        slug: 'veste-tailleur-mande',
        price: '165 000 FCFA',
        image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=400',
      },
    ],
  },
  {
    id: 'koumi-dio',
    bambaraName: 'Koumi Dio',
    frenchTitle: 'La Sagesse Féminine & L’Harmonie du Foyer',
    theme: 'SAGESSE',
    svgPath: 'M30 20 H70 V40 H30 Z M20 50 H80 V70 H20 Z M40 80 H60 V90 H40 Z',
    meaning: 'Célèbre l’équilibre familial, l’intelligence intuitive des mères et la prospérité transmise de génération en génération.',
    storytelling: 'Ce motif était traditionnellement dessiné par les maîtres teinturières lors des célébrations de mariages et des naissances princières. Ses rectangles entrelacés représentent les fondations solides de la maison et la mémoire des aïeules qui veille sur la descendance.',
    originTradition: 'Terroir de Bélédougou &bull; Transmission Matrilinéaire',
    associatedProducts: [
      {
        name: 'Robe Fourreau Kassa',
        slug: 'robe-fourreau-kassa',
        price: '195 000 FCFA',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400',
      },
      {
        name: 'Étole d’Or N’Galama',
        slug: 'etole-dor-ngalama',
        price: '55 000 FCFA',
        image: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?q=80&w=400',
      },
    ],
  },
  {
    id: 'gana-dio',
    bambaraName: 'Gana Dio',
    frenchTitle: 'La Réconciliation & Le Fleuve Niger',
    theme: 'HARMONIE',
    svgPath: 'M10 50 Q30 20, 50 50 T90 50 M10 70 Q30 40, 50 70 T90 70 M10 30 Q30 0, 50 30 T90 30',
    meaning: 'Les méandres de l’eau nourricière du Djoliba (fleuve Niger), symbole de diplomatie, de fluidité et de paix souveraine.',
    storytelling: 'L’ondulation du Gana Dio évoque la sève vitale qui irrigue les terres arables du Mali. Dans la cosmogonie mandingue, porter le Gana Dio favorise la concorde lors des négociations délicates et purifie l’esprit.',
    originTradition: 'Rives du Fleuve Djoliba &bull; Mopti & Djenné',
    associatedProducts: [
      {
        name: 'Chemise en Soie & Bôkôlan Djoliba',
        slug: 'chemise-soie-bokolan-djoliba',
        price: '125 000 FCFA',
        image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=400',
      },
    ],
  },
  {
    id: 'sceau-royal-mansa',
    bambaraName: 'Mansa Kourou',
    frenchTitle: 'Le Sceau de la Couronne Impériale',
    theme: 'NOBLESSE',
    svgPath: 'M50 15 L85 50 L50 85 L15 50 Z M50 30 L70 50 L50 70 L30 50 Z M50 45 L55 50 L50 55 L45 50 Z',
    meaning: 'L’autorité bienveillante, la grandeur morale et le rayonnement des Mansa (empereurs du Mandé).',
    storytelling: 'Réservé jadis à la cour impériale de Soundiata Keïta, ce losange concentrique orné d’argile noire et d’extraits d’écorce de n’galama jaune impérial symbolise le centre du monde et l’élévation spirituelle de celui qui gouverne avec justice.',
    originTradition: 'Niani & Kangaba &bull; Vestiaire des Empereurs',
    associatedProducts: [
      {
        name: 'Manteau d’Apparat Mansa Moussa',
        slug: 'manteau-apparat-mansa-moussa',
        price: '320 000 FCFA',
        image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=400',
      },
      {
        name: 'Sac Weekend Bôkôlan & Cuir',
        slug: 'sac-weekend-bokolan-cuir',
        price: '145 000 FCFA',
        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=400',
      },
    ],
  },
  {
    id: 'sigui',
    bambaraName: 'Sigui Sên',
    frenchTitle: 'L’Enracinement & La Stabilité des Grands Arbres',
    theme: 'HARMONIE',
    svgPath: 'M25 80 L50 20 L75 80 Z M35 80 L50 45 L65 80 Z',
    meaning: 'La solidité des racines, la fidélité aux ancêtres et la sérénité face aux vents du monde moderne.',
    storytelling: 'Inspiré des vénérables baobabs et des termitières sacrées, le Sigui enseigne la patience. Chaque trait au pinceau de roseau rappelle que l’élévation suprême repose sur des fondations culturelles inaltérables.',
    originTradition: 'Pays Mandingue Méridional &bull; Falaise de Bandiagara',
    associatedProducts: [
      {
        name: 'Pantalon Drapé Mansa',
        slug: 'pantalon-drape-mansa',
        price: '95 000 FCFA',
        image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=400',
      },
    ],
  },
];

export function SymbolsGuideClient() {
  const [selectedTheme, setSelectedTheme] = useState<string>('ALL');
  const [activeSymbol, setActiveSymbol] = useState<BogolanSymbol>(SYMBOLS_DATA[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSymbols = SYMBOLS_DATA.filter((sym) => {
    if (selectedTheme !== 'ALL' && sym.theme !== selectedTheme) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchBambara = sym.bambaraName.toLowerCase().includes(q);
      const matchTitle = sym.frenchTitle.toLowerCase().includes(q);
      const matchMeaning = sym.meaning.toLowerCase().includes(q);
      if (!matchBambara && !matchTitle && !matchMeaning) return false;
    }
    return true;
  });

  return (
    <div className="pt-24 min-h-screen bg-mande-ivory">
      {/* Header Banner */}
      <div className="bg-mande-black text-mande-ivory py-16 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-mande-gold/5 pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10 space-y-4">
          <span className="text-xs uppercase tracking-[0.3em] text-mande-gold font-sans font-semibold flex items-center justify-center gap-2">
            <BookOpen className="w-4 h-4 text-mande-gold" />
            <span>Langage Sacré & Mythologie Mandingue</span>
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold uppercase tracking-wider text-mande-ivory">
            Le Livre des Symboles Bôkôlan
          </h1>
          <BogolanDivider variant="gold" className="my-3" />
          <p className="text-xs sm:text-sm text-gray-300 font-sans font-light max-w-2xl mx-auto leading-relaxed">
            Chaque trait géométrique peint sur nos pièces n’est pas un simple ornement : c’est une écriture millénaire, un testament de courage, d’amour et de noblesse légué par les maîtres teinturiers du Mali.
          </p>
        </div>
      </div>

      <BogolanBorder className="opacity-40 text-mande-gold" />

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pb-8 border-b border-mande-ivoryDark">
          {/* Theme Filters */}
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'ALL', label: 'Tous les Symboles' },
              { key: 'NOBLESSE', label: 'Noblesse & Royauté', icon: Crown },
              { key: 'BRAVOURE', label: 'Bravoure & Protection', icon: Flame },
              { key: 'SAGESSE', label: 'Sagesse & Foyer', icon: Heart },
              { key: 'HARMONIE', label: 'Harmonie & Paix', icon: Compass },
            ].map((th) => (
              <button
                key={th.key}
                onClick={() => setSelectedTheme(th.key)}
                className={`px-3.5 py-2 text-xs uppercase font-sans tracking-wider font-semibold transition-all border ${
                  selectedTheme === th.key
                    ? 'bg-mande-black text-mande-gold border-mande-black shadow-sm'
                    : 'bg-white text-gray-700 border-mande-ivoryDark hover:border-mande-gold'
                }`}
              >
                {th.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Chercher un symbole, une vertu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-mande-ivoryDark text-xs text-mande-black focus:outline-none focus:border-mande-gold font-sans"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>

        {/* Interactive Master Grid: Symbols List (Left) & Deep Dive Showcase (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-10">
          {/* Left: Glyphs Carousel / Selector (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="font-serif text-sm font-bold uppercase tracking-widest text-mande-black pb-2 border-b border-mande-ivoryDark">
              Les Motifs Révélés ({filteredSymbols.length})
            </h3>

            <div className="space-y-3">
              {filteredSymbols.map((sym) => {
                const isSelected = activeSymbol.id === sym.id;
                return (
                  <button
                    key={sym.id}
                    onClick={() => setActiveSymbol(sym)}
                    className={`w-full text-left p-4 border transition-all flex items-center gap-4 ${
                      isSelected
                        ? 'bg-white border-mande-gold ring-2 ring-mande-gold/30 shadow-card'
                        : 'bg-white/80 border-mande-ivoryDark hover:border-mande-gold/60'
                    }`}
                  >
                    {/* SVG Glyph Box */}
                    <div className="w-14 h-14 bg-mande-black text-mande-gold flex-shrink-0 flex items-center justify-center p-2 border border-mande-gold/40">
                      <svg viewBox="0 0 100 100" className="w-full h-full stroke-current stroke-[6] fill-none stroke-linecap-round stroke-linejoin-round">
                        <path d={sym.svgPath} />
                      </svg>
                    </div>

                    <div className="text-xs font-sans flex-1">
                      <span className="text-[10px] text-mande-gold uppercase font-bold tracking-widest">
                        {sym.theme}
                      </span>
                      <h4 className="font-serif font-bold text-base text-mande-black">
                        {sym.bambaraName}
                      </h4>
                      <p className="text-gray-500 line-clamp-1 mt-0.5">
                        {sym.frenchTitle}
                      </p>
                    </div>

                    <ArrowRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-mande-gold translate-x-1' : 'text-gray-300'}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Immersive Symbol Deep Dive (7 Cols) */}
          <div className="lg:col-span-7 bg-white border border-mande-ivoryDark p-8 sm:p-10 shadow-card space-y-8 relative overflow-hidden">
            {/* Background Glyph Watermark */}
            <div className="absolute right-4 bottom-4 w-64 h-64 text-mande-sand/10 pointer-events-none">
              <svg viewBox="0 0 100 100" className="w-full h-full stroke-current stroke-[4] fill-none">
                <path d={activeSymbol.svgPath} />
              </svg>
            </div>

            {/* Symbol Title & Geometric Showcase */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-6 border-b border-mande-ivoryDark">
              <div className="w-24 h-24 bg-mande-black text-mande-gold p-4 flex items-center justify-center border-2 border-mande-gold shadow-gold-md flex-shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full stroke-current stroke-[6] fill-none stroke-linecap-round stroke-linejoin-round">
                  <path d={activeSymbol.svgPath} />
                </svg>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-mande-gold font-sans font-bold">
                  Symbole Sacré &bull; {activeSymbol.originTradition}
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold uppercase tracking-wider text-mande-black">
                  {activeSymbol.bambaraName}
                </h2>
                <p className="font-serif italic text-sm text-mande-earth">
                  {activeSymbol.frenchTitle}
                </p>
              </div>
            </div>

            {/* Narrative Storytelling */}
            <div className="space-y-4 font-sans text-xs sm:text-sm">
              <div>
                <h3 className="font-serif text-xs uppercase tracking-widest font-bold text-mande-gold mb-1">
                  Signification Secrète
                </h3>
                <p className="text-gray-800 font-semibold leading-relaxed">
                  {activeSymbol.meaning}
                </p>
              </div>

              <div>
                <h3 className="font-serif text-xs uppercase tracking-widest font-bold text-mande-gold mb-1">
                  Mémoire & Histoire du Mandé
                </h3>
                <p className="text-gray-600 font-light leading-relaxed">
                  {activeSymbol.storytelling}
                </p>
              </div>
            </div>

            {/* Creations Carrying this Sacred Symbol */}
            {activeSymbol.associatedProducts.length > 0 && (
              <div className="pt-6 border-t border-mande-ivoryDark space-y-4">
                <h3 className="font-serif text-xs uppercase tracking-widest font-bold text-mande-black flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-mande-gold" />
                  <span>Créations Portant le Motif {activeSymbol.bambaraName}</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {activeSymbol.associatedProducts.map((prod, idx) => (
                    <Link
                      key={idx}
                      href={`/produit/${prod.slug}`}
                      className="group p-3 bg-mande-ivoryLight border border-mande-ivoryDark hover:border-mande-gold transition-all flex items-center gap-3"
                    >
                      <div className="relative w-14 h-16 bg-mande-sand/10 flex-shrink-0 overflow-hidden">
                        <Image src={prod.image} alt={prod.name} fill className="object-cover group-hover:scale-105 transition-transform" />
                      </div>
                      <div className="text-xs font-sans">
                        <p className="font-serif font-bold text-mande-black group-hover:text-mande-earth transition-colors">
                          {prod.name}
                        </p>
                        <p className="text-mande-earth font-mono font-semibold mt-1">
                          {prod.price}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
