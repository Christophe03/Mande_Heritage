// Static Data Engine for Mandé Héritage (No DB / No Prisma dependency for zero-config Vercel build)

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
  products: Product[];
  _count: { products: number };
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  coverImage: string | null;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
  products: Product[];
  _count: { products: number };
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  description: string;
  price: number;
  originalPrice: number | null;
  categoryId: string;
  category?: Category;
  collectionId: string | null;
  collection?: Collection | null;
  gender: string;
  sizes: string;
  colors: string;
  images: string;
  stock: number;
  materials: string | null;
  careInstructions: string | null;
  isNew: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
  reviews?: any[];
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImage: string;
  author: string;
  tags: string;
  isPublished: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ShippingZone {
  id: string;
  country: string;
  countryCode: string;
  cost: number;
  estimatedDays: string;
  carrier: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  zoneName: string;
  price: number;
  countries: string;
  estimatedDelivery: string;
}

export interface PromoCode {
  id: string;
  code: string;
  discountPercent: number;
  discountAmount: number | null;
  minOrderAmount: number | null;
  maxUses: number | null;
  usedCount: number;
  expiresAt: Date | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  discountType: string;
  value: number;
  endDate: Date | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: string;
  phone: string | null;
  createdAt: Date;
  updatedAt: Date;
  addresses: any[];
  orders: any[];
  _count: {
    orders: number;
    wishlist: number;
  };
}

export interface OrderItem {
  id: string;
  productId: string;
  product?: Product;
  quantity: number;
  size?: string | null;
  color?: string | null;
  price: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string | null;
  user?: User | null;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  shippingAddress: string;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  items: OrderItem[];
}

// 1. Initial Categories
export const STATIC_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    name: 'Vêtements & Kimonos',
    slug: 'vetements',
    description: 'Pièces d’apparat, kimonos, vestes et tuniques confectionnées en Bôkôlan authentique et coton peigné.',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000&auto=format&fit=crop',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
    products: [],
    _count: { products: 4 },
  },
  {
    id: 'cat-2',
    name: 'Robes & Caftans',
    slug: 'robes',
    description: 'Robes fourreaux, robes sculpturales et caftans royaux aux motifs ancestraux sacrés.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
    products: [],
    _count: { products: 2 },
  },
  {
    id: 'cat-3',
    name: 'Sacs & Maroquinerie',
    slug: 'sacs',
    description: 'Sacs weekend, cabas de voyage et pochettes de soirée alliant cuir pleine fleur et Bôkôlan d’art.',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000&auto=format&fit=crop',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
    products: [],
    _count: { products: 2 },
  },
  {
    id: 'cat-4',
    name: 'Chaussures & Souliers',
    slug: 'chaussures',
    description: 'Mocassins nomades, babouches impériales et mules raffinées montées à la main.',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1000&auto=format&fit=crop',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
    products: [],
    _count: { products: 2 },
  },
  {
    id: 'cat-5',
    name: 'Accessoires & Parures',
    slug: 'accessoires',
    description: 'Étoles en soie et Bôkôlan, chapeaux fédora, ceintures en cuir et parures mandingues.',
    image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=1000&auto=format&fit=crop',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
    products: [],
    _count: { products: 2 },
  },
];

// 2. Initial Collections
export const STATIC_COLLECTIONS: Collection[] = [
  {
    id: 'col-1',
    name: 'Héritage Royal',
    slug: 'heritage-royal',
    description: 'Les motifs ancestraux sacrés du XIIIe siècle réinterprétés pour les cérémonies de prestige.',
    coverImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop',
    isFeatured: true,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
    products: [],
    _count: { products: 4 },
  },
  {
    id: 'col-2',
    name: 'Signature Mandé',
    slug: 'signature-mande',
    description: 'L’élégance intemporelle sublimant le Bôkôlan teinté à l’argile minérale du fleuve Niger.',
    coverImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop',
    isFeatured: true,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
    products: [],
    _count: { products: 4 },
  },
  {
    id: 'col-3',
    name: 'Moderne Sahel',
    slug: 'moderne-sahel',
    description: 'Coupes fluides et vestiaires cosmopolites alliant tradition et architecture contemporaine.',
    coverImage: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1200&auto=format&fit=crop',
    isFeatured: false,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
    products: [],
    _count: { products: 3 },
  },
  {
    id: 'col-4',
    name: 'Éditions Limitées & Pièces d’Art',
    slug: 'editions-limitees',
    description: 'Pièces uniques numérotées, brodées au fil d’or 24 carats et teintes à la main.',
    coverImage: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1200&auto=format&fit=crop',
    isFeatured: true,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
    products: [],
    _count: { products: 1 },
  },
];

// 3. Initial Products
export const STATIC_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Kimono Royal Soundiata en Bôkôlan Ocre & Noir',
    slug: 'kimono-royal-soundiata',
    shortDescription: 'Grand kimono structuré peint à la main avec les symboles sacrés du Mandé.',
    description: 'Le Kimono Royal Soundiata incarne la quintessence du luxe mandingue. Tissé à partir de coton biologique pur cultivé dans les terroirs de Ségou, chaque panneau est teinté à la main avec l’argile minérale fermentée du fleuve Niger et les décoctions sauvages de feuilles de n’galama. Une pièce magistrale qui allie stature impériale et fluidité absolue.',
    price: 185000,
    originalPrice: 220000,
    categoryId: 'cat-1',
    collectionId: 'col-1',
    gender: 'UNISEX',
    sizes: JSON.stringify(['S', 'M', 'L', 'XL', 'Sur-Mesure']),
    colors: JSON.stringify(['Noir Ébène & Terre Ocre', 'Ivoire Sacré & Brun Bôkôlan']),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop',
    ]),
    stock: 6,
    materials: '100% Coton biologique peigné malien, teinture naturelle à la boue fermentée du Niger.',
    careInstructions: 'Nettoyage à sec spécialisé textile d’art recommandé.',
    isNew: true,
    isFeatured: true,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  },
  {
    id: 'prod-2',
    name: 'Robe Fourreau Reine Kassa en Bôkôlan Sculpté',
    slug: 'robe-fourreau-kassa',
    shortDescription: 'Robe du soir majestueuse avec motifs ancestraux Koumi Dio et finitions dorées.',
    description: 'Une ode à la souveraineté et à l’élégance féminine du Mandé. Taillée dans un Bôkôlan fin sélectionné parmi les plus belles pièces de nos ateliers, cette robe fourreau épouse la silhouette avec une grâce sculpturale. Les motifs Koumi Dio rendent hommage à la sagesse des reines mères.',
    price: 195000,
    originalPrice: 235000,
    categoryId: 'cat-2',
    collectionId: 'col-2',
    gender: 'FEMME',
    sizes: JSON.stringify(['36', '38', '40', '42', 'Sur-Mesure']),
    colors: JSON.stringify(['Ivoire & Noir Géométrique', 'Ocre Solaire & Ébène']),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1000&auto=format&fit=crop',
    ]),
    stock: 8,
    materials: 'Cotonnade Bôkôlan d’apparat et doublure en soie douce respirante.',
    careInstructions: 'Nettoyage à sec délicat exclusivement.',
    isNew: true,
    isFeatured: true,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  },
  {
    id: 'prod-3',
    name: 'Caftan Royal d’Apparat en Bôkôlan & Soie Sauvage',
    slug: 'caftan-royal-apparat-bokolan',
    shortDescription: 'Caftan fluide grand apparat avec broderies royales aux manches et col.',
    description: 'Inspiré des tenues solennelles des cours impériales d’Afrique de l’Ouest. Sa coupe ample et aérienne offre une prestance incomparable pour les grands galas et cérémonies traditionnelles.',
    price: 220000,
    originalPrice: null,
    categoryId: 'cat-2',
    collectionId: 'col-1',
    gender: 'FEMME',
    sizes: JSON.stringify(['Taille Unique Fluide', 'Sur-Mesure']),
    colors: JSON.stringify(['Terre Ocre & Or', 'Noir Nuit & Ivoire']),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop',
    ]),
    stock: 5,
    materials: 'Mélange soie sauvage et bandes de Bôkôlan teintes à San.',
    careInstructions: 'Nettoyage à sec spécialisé pressing haute couture.',
    isNew: false,
    isFeatured: true,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  },
  {
    id: 'prod-4',
    name: 'Veste Tailleur Mandé en Bôkôlan Noir Ébène',
    slug: 'veste-tailleur-mande',
    shortDescription: 'Blazer contemporain structuré aux empiècements géométriques Tiranké.',
    description: 'L’alliance parfaite entre la rigueur de la coupe sartoriale moderne et la force symbolique du Bôkôlan malien. Parfait pour les réceptions diplomatiques, dîners de prestige et événements exclusifs.',
    price: 165000,
    originalPrice: 190000,
    categoryId: 'cat-1',
    collectionId: 'col-3',
    gender: 'HOMME',
    sizes: JSON.stringify(['48', '50', '52', '54', '56']),
    colors: JSON.stringify(['Noir Ébène & Bandes Ocre', 'Gris Terre & Noir']),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1000&auto=format&fit=crop',
    ]),
    stock: 7,
    materials: 'Coton lourd 420g/m² tissé main, boutons en corne naturelle sculptée.',
    careInstructions: 'Nettoyage à sec.',
    isNew: true,
    isFeatured: true,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  },
  {
    id: 'prod-5',
    name: 'Pantalon Drapé Mansa en Cotonnade Bôkôlan',
    slug: 'pantalon-drape-mansa',
    shortDescription: 'Pantalon fuseau à plis avec bandes latérales aux motifs ancestraux Sigui.',
    description: 'Confort noble et tombé impeccable. Se marie avec la veste tailleur ou le grand kimono pour une silhouette complète impériale.',
    price: 95000,
    originalPrice: null,
    categoryId: 'cat-1',
    collectionId: 'col-2',
    gender: 'UNISEX',
    sizes: JSON.stringify(['38', '40', '42', '44', '46']),
    colors: JSON.stringify(['Noir Profond', 'Ocre Terre']),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop',
    ]),
    stock: 14,
    materials: 'Coton biologique filé à Bamako.',
    careInstructions: 'Repassage doux sur l’envers.',
    isNew: false,
    isFeatured: false,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  },
  {
    id: 'prod-6',
    name: 'Sac Weekend Bôkôlan & Cuir Pleine Fleur',
    slug: 'sac-weekend-bokolan-cuir',
    shortDescription: 'Grand sac de voyage de luxe associant cuir havane tanné végétal et Bôkôlan.',
    description: 'Conçu pour les esthètes nomades et les voyageurs cosmopolites. Ce sac weekend spacieux réunit la robustesse d’un cuir pleine fleur nourri aux cires naturelles et la noblesse d’une toile de Bôkôlan peinte à la main à Ségou.',
    price: 145000,
    originalPrice: 175000,
    categoryId: 'cat-3',
    collectionId: 'col-2',
    gender: 'UNISEX',
    sizes: JSON.stringify(['52 x 32 x 24 cm']),
    colors: JSON.stringify(['Cuir Havane & Bôkôlan Noir', 'Cuir Ébène & Bôkôlan Ocre']),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=1000&auto=format&fit=crop',
    ]),
    stock: 10,
    materials: 'Cuir de vachette pleine fleur du Mali, toile Bôkôlan 100% coton, bouclerie laiton patiné.',
    careInstructions: 'Nourrir le cuir à la cire d’abeille naturelle.',
    isNew: true,
    isFeatured: true,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  },
  {
    id: 'prod-7',
    name: 'Sac Pochette du Soir Bôkôlan & Bronze Doré',
    slug: 'sac-pochette-royale-mande',
    shortDescription: 'Pochette de gala rigide ornée d’un fermoir sculpté par nos maîtres bronziers.',
    description: 'L’accessoire de distinction par excellence. Son fermoir en bronze coulé à la cire perdue reproduit le célèbre sceptre mandingue, illuminant un panneau de Bôkôlan aux motifs sacrés.',
    price: 95000,
    originalPrice: null,
    categoryId: 'cat-3',
    collectionId: 'col-1',
    gender: 'FEMME',
    sizes: JSON.stringify(['28 x 16 cm']),
    colors: JSON.stringify(['Noir Nuit & Or', 'Ocre Sacré & Bronze']),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000&auto=format&fit=crop',
    ]),
    stock: 12,
    materials: 'Bôkôlan brodé, fermoir bronze massif, intérieur suédine douce.',
    careInstructions: 'Ranger dans son pochon de protection.',
    isNew: false,
    isFeatured: true,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  },
  {
    id: 'prod-8',
    name: 'Mocassins Nomades en Bôkôlan & Veau Velours',
    slug: 'mocassins-nomades-bokolan-veau-velours',
    shortDescription: 'Souliers de luxe montés main, semelle cousue Blake et empeigne Bôkôlan.',
    description: 'Un confort exceptionnel allié au raffinement suprême. Chaque paire est montée à la main avec une semelle en cuir véritable et un plastron en Bôkôlan teinté selon les secrets de la corporation des cordonniers d’apparat.',
    price: 145000,
    originalPrice: 170000,
    categoryId: 'cat-4',
    collectionId: 'col-3',
    gender: 'HOMME',
    sizes: JSON.stringify(['40', '41', '42', '43', '44', '45']),
    colors: JSON.stringify(['Veau Velours Havane & Bôkôlan', 'Cuir Noir Ébène & Bôkôlan Ocre']),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1614252369475-531eba835eb1?q=80&w=1000&auto=format&fit=crop',
    ]),
    stock: 9,
    materials: 'Veau velours premium, empeigne Bôkôlan véritable, semelle cuir pleine fleur.',
    careInstructions: 'Brosser à sec avec une brosse en crin naturel.',
    isNew: true,
    isFeatured: true,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  },
  {
    id: 'prod-9',
    name: 'Mules d’Apparat en Cuir Tressé & Bôkôlan',
    slug: 'mules-apparat-cuir-tresse-bokolan',
    shortDescription: 'Mules plates d’une élégance intemporelle avec lanière de Bôkôlan.',
    description: 'L’essence du chic malien pour les journées ensoleillées et les soirées décontractées. Une semelle ergonomique en cuir patiné surmontée d’une lanière de Bôkôlan teinté à l’argile.',
    price: 85000,
    originalPrice: null,
    categoryId: 'cat-4',
    collectionId: 'col-2',
    gender: 'FEMME',
    sizes: JSON.stringify(['36', '37', '38', '39', '40', '41']),
    colors: JSON.stringify(['Cuir Naturel & Bôkôlan Ocre', 'Noir Intense & Bôkôlan Ivoire']),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1000&auto=format&fit=crop',
    ]),
    stock: 15,
    materials: 'Cuir d’agneau doux et toile Bôkôlan souple.',
    careInstructions: 'Protéger de l’eau.',
    isNew: false,
    isFeatured: false,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  },
  {
    id: 'prod-10',
    name: 'Étole d’Or N’Galama en Soie Sauvage & Bôkôlan',
    slug: 'etole-dor-ngalama',
    shortDescription: 'Grande étole précieuse (200x80cm) ultra-douce, motif peint à la main.',
    description: 'Une caresse de soie et de cotonnade fine. Teinte avec les feuilles sauvages de n’galama pour obtenir cette nuance jaune impériale si caractéristique de la cour de Soundiata Keïta.',
    price: 55000,
    originalPrice: 70000,
    categoryId: 'cat-5',
    collectionId: 'col-1',
    gender: 'UNISEX',
    sizes: JSON.stringify(['200 cm x 80 cm']),
    colors: JSON.stringify(['Jaune N’Galama & Bôkôlan Noir', 'Ivoire Pur & Ocre']),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=1000&auto=format&fit=crop',
    ]),
    stock: 22,
    materials: '50% Soie sauvage naturelle, 50% Coton biologique du Mali.',
    careInstructions: 'Lavage doux à la main à froid.',
    isNew: true,
    isFeatured: true,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  },
  {
    id: 'prod-11',
    name: 'Manteau d’Apparat Mansa Moussa — Pièce d’Exception',
    slug: 'manteau-apparat-mansa-moussa',
    shortDescription: 'Chef-d’œuvre d’art textile numéroté, 140 heures de travail d’artisanat.',
    description: 'Inspiré par la grandeur historique du pèlerinage de Mansa Moussa. Confectionné dans un coton d’exception brodé de filés d’or pur 24 carats et teinté selon les rites des maîtres teinturiers de San.',
    price: 320000,
    originalPrice: 380000,
    categoryId: 'cat-1',
    collectionId: 'col-4',
    gender: 'UNISEX',
    sizes: JSON.stringify(['Sur-Mesure']),
    colors: JSON.stringify(['Noir Nuit & Or Impérial']),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1000&auto=format&fit=crop',
    ]),
    stock: 3,
    materials: 'Cotonnade royale, broderies au fil d’or, doublure soie.',
    careInstructions: 'Conservation sous housse naturelle incluse.',
    isNew: true,
    isFeatured: true,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  },
  {
    id: 'prod-12',
    name: 'Chapeau Fédora Liseré Bôkôlan & Plume Bronze',
    slug: 'chapeau-fedora-lisere-bokolan-bronze',
    shortDescription: 'Feutre de laine mérinos haut de gamme avec galon Bôkôlan ciselé.',
    description: 'Une silhouette audacieuse et aristocratique qui rehausse immédiatement n’importe quelle tenue.',
    price: 55000,
    originalPrice: null,
    categoryId: 'cat-5',
    collectionId: 'col-3',
    gender: 'UNISEX',
    sizes: JSON.stringify(['56 cm (S)', '58 cm (M)', '60 cm (L)']),
    colors: JSON.stringify(['Noir Intense', 'Sable Ocre']),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=1000&auto=format&fit=crop',
    ]),
    stock: 18,
    materials: '100% Feutre de laine mérinos et galon Bôkôlan.',
    careInstructions: 'Brosser délicatement.',
    isNew: false,
    isFeatured: false,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  },
];

// 4. Initial Articles
export const STATIC_ARTICLES: Article[] = [
  {
    id: 'art-1',
    title: 'L’Épopée de Soundiata Keïta et les Origines Textiles du Mandé',
    slug: 'soundiata-keita-origines-textiles',
    summary: 'Comment les corporations d’artisans et teinturiers ont façonné l’identité vestimentaire de l’empire le plus riche du Moyen Âge.',
    content: `Au XIIIe siècle, lors de la fondation de l'Empire du Mandé et de la proclamation de la Charte de Kouroukan Fouga en 1236, chaque corporation reçut un rôle sacré dans la préservation des savoirs ancestraux.\n\nParmi elles, les corporations de tisserands (*Numukè*) et de teinturiers dépositaires des secrets des plantes et de l'argile furent chargées de vêtir la cour impériale, les dignitaires et les chasseurs (*Donso*).\n\nChez Mandé Héritage, nous perpétuons cette tradition séculaire en associant chaque trame de coton biologique cultivé au Mali aux motifs protecteurs d'antan.`,
    coverImage: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1200',
    author: 'Maison Mandé Héritage',
    tags: '["Histoire", "Bôkôlan", "Culture Mandé"]',
    isPublished: true,
    publishedAt: new Date('2026-01-15'),
    createdAt: new Date('2026-01-15'),
    updatedAt: new Date('2026-01-15'),
  },
  {
    id: 'art-2',
    title: 'La Science Sacrée de la Teinture Bôkôlan : Du Fleuve Niger aux Défilés',
    slug: 'science-sacree-teinture-bokolan',
    summary: 'Décryptage de la réaction chimique naturelle entre les tanins de n’galama et le fer de la boue fermentée.',
    content: `Le terme *Bôkôlan* (ou *Bògòlanfini*) dérive du bambara *bògò* (la terre/la boue) et *fini* (le tissu).\n\nLe processus commence par la décoction de feuilles de *n'galama* (*Anogeissus leiocarpus*), riches en tanins. Le tissu y est trempé jusqu'à obtenir une teinte ocre dorée.\n\nEnsuite, l'artisan applique à la spatule ou au roseau une boue fermentée puisée dans le lit du fleuve Niger. Le fer de la boue réagit avec les tanins végétaux pour créer un noir d'ébène indélébile et 100% écologique.`,
    coverImage: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1200',
    author: 'Kadiatou Traoré, Maître Artisane',
    tags: '["Artisanat", "Bôkôlan", "Écologie", "Savoir-Faire"]',
    isPublished: true,
    publishedAt: new Date('2026-02-01'),
    createdAt: new Date('2026-02-01'),
    updatedAt: new Date('2026-02-01'),
  },
  {
    id: 'art-3',
    title: 'Le Renouveau de la Haute Couture Africaine sur la Scène Internationale',
    slug: 'renouveau-haute-couture-africaine',
    summary: 'De Bamako à Paris, New York et Milan, l’artisanat d’art africain s’impose comme le nouveau sommet du luxe mondial.',
    content: `La mode contemporaine assiste à un retour aux sources où le véritable luxe réside dans l'authenticité, le geste artisanal et l'histoire que raconte chaque vêtement.\n\nMandé Héritage propose une vision audacieuse : des coupes intemporelles et cosmopolites qui respectent les protocoles traditionnels tout en répondant aux exigences sartoriales des plus grands événements mondiaux.`,
    coverImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200',
    author: 'Direction Artistique Mandé',
    tags: '["Haute Couture", "Luxe", "Afrique", "Style"]',
    isPublished: true,
    publishedAt: new Date('2026-02-10'),
    createdAt: new Date('2026-02-10'),
    updatedAt: new Date('2026-02-10'),
  },
];

// 5. Initial Shipping Zones
export const STATIC_SHIPPING_ZONES: ShippingZone[] = [
  {
    id: 'ship-1',
    country: 'Mali (Bamako & Régions)',
    countryCode: 'ML',
    cost: 2500,
    estimatedDays: '24h à 48h',
    carrier: 'Coursier Privé Mandé Express',
    isActive: true,
    zoneName: 'Mali (Bamako & Régions)',
    price: 2500,
    countries: 'Mali',
    estimatedDelivery: '24h à 48h',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  },
  {
    id: 'ship-2',
    country: 'Zone UEMOA (Sénégal, Côte d’Ivoire, Burkina, etc.)',
    countryCode: 'UEMOA',
    cost: 15000,
    estimatedDays: '2 à 4 jours ouvrés',
    carrier: 'DHL Express Afrique',
    isActive: true,
    zoneName: 'Zone UEMOA (Sénégal, Côte d’Ivoire, Burkina, etc.)',
    price: 15000,
    countries: 'Sénégal, Côte d’Ivoire, Burkina Faso, Togo, Bénin, Guinée, Niger',
    estimatedDelivery: '2 à 4 jours ouvrés',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  },
  {
    id: 'ship-3',
    country: 'France & Europe',
    countryCode: 'FR',
    cost: 25000,
    estimatedDays: '3 à 5 jours ouvrés',
    carrier: 'DHL Express International',
    isActive: true,
    zoneName: 'France & Europe',
    price: 25000,
    countries: 'France, Belgique, Suisse, Allemagne, Royaume-Uni, Italie, Espagne',
    estimatedDelivery: '3 à 5 jours ouvrés',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  },
  {
    id: 'ship-4',
    country: 'États-Unis & Canada',
    countryCode: 'US',
    cost: 35000,
    estimatedDays: '4 à 7 jours ouvrés',
    carrier: 'FedEx / DHL Priority',
    isActive: true,
    zoneName: 'États-Unis & Canada',
    price: 35000,
    countries: 'États-Unis, Canada',
    estimatedDelivery: '4 à 7 jours ouvrés',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  },
  {
    id: 'ship-5',
    country: 'Reste du Monde',
    countryCode: 'WORLD',
    cost: 45000,
    estimatedDays: '5 à 8 jours ouvrés',
    carrier: 'DHL Express Worldwide',
    isActive: true,
    zoneName: 'Reste du Monde',
    price: 45000,
    countries: 'Asie, Moyen-Orient, Amérique Latine, Océanie',
    estimatedDelivery: '5 à 8 jours ouvrés',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  },
];

// 6. Initial Promo Codes
export const STATIC_PROMO_CODES: PromoCode[] = [
  {
    id: 'promo-1',
    code: 'MANDE10',
    discountPercent: 10,
    discountAmount: null,
    minOrderAmount: 50000,
    maxUses: 1000,
    usedCount: 42,
    expiresAt: new Date('2026-12-31'),
    isActive: true,
    discountType: 'PERCENTAGE',
    value: 10,
    endDate: new Date('2026-12-31'),
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  },
  {
    id: 'promo-2',
    code: 'HERITAGE15',
    discountPercent: 15,
    discountAmount: null,
    minOrderAmount: 100000,
    maxUses: 500,
    usedCount: 18,
    expiresAt: new Date('2026-12-31'),
    isActive: true,
    discountType: 'PERCENTAGE',
    value: 15,
    endDate: new Date('2026-12-31'),
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  },
  {
    id: 'promo-3',
    code: 'VIPROYAL',
    discountPercent: 20,
    discountAmount: null,
    minOrderAmount: 200000,
    maxUses: 100,
    usedCount: 7,
    expiresAt: new Date('2026-12-31'),
    isActive: true,
    discountType: 'PERCENTAGE',
    value: 20,
    endDate: new Date('2026-12-31'),
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  },
];

// 7. Initial Users
export const STATIC_USERS: User[] = [
  {
    id: 'usr-admin',
    name: 'Directeur Artistique Mandé',
    email: 'admin@mandeheritage.com',
    passwordHash: '$2a$10$e74j40984920489',
    role: 'ADMIN',
    phone: '+223 70 00 00 01',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
    _count: { orders: 0, wishlist: 0 },
    addresses: [
      {
        id: 'addr-1',
        fullName: 'Maison Mandé Héritage',
        address: 'Boulevard du 22 Octobre, ACI 2000',
        city: 'Bamako',
        postalCode: 'BP 1234',
        country: 'Mali',
        phone: '+223 70 00 00 01',
        isDefault: true,
      },
    ],
    orders: [],
  },
  {
    id: 'usr-client',
    name: 'Aïssata Coulibaly',
    email: 'client@mandeheritage.com',
    passwordHash: '$2a$10$e74j40984920489',
    role: 'CLIENT',
    phone: '+223 76 12 34 56',
    createdAt: new Date('2026-01-10'),
    updatedAt: new Date('2026-01-10'),
    _count: { orders: 2, wishlist: 0 },
    addresses: [
      {
        id: 'addr-2',
        fullName: 'Aïssata Coulibaly',
        address: 'Quartier du Fleuve, Rue 312',
        city: 'Bamako',
        postalCode: 'BP 5432',
        country: 'Mali',
        phone: '+223 76 12 34 56',
        isDefault: true,
      },
    ],
    orders: [],
  },
];

// 8. Initial Orders for Admin & Customer Demo
export const STATIC_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'MND-2026-001',
    userId: 'usr-client',
    user: STATIC_USERS[1],
    status: 'LIVRE',
    paymentStatus: 'PAYE',
    paymentMethod: 'ORANGE_MONEY',
    subtotal: 185000,
    shippingCost: 0,
    discount: 0,
    total: 185000,
    shippingAddress: JSON.stringify({
      fullName: 'Aïssata Coulibaly',
      address: 'Quartier du Fleuve, Rue 312',
      city: 'Bamako',
      postalCode: 'BP 5432',
      country: 'Mali',
      phone: '+223 76 12 34 56',
    }),
    notes: 'Emballage cadeau de prestige scellé à la cire',
    createdAt: new Date('2026-02-14'),
    updatedAt: new Date('2026-02-15'),
    items: [
      {
        id: 'item-1',
        productId: 'prod-1',
        product: STATIC_PRODUCTS[0],
        quantity: 1,
        size: 'M',
        color: 'Noir Ébène & Terre Ocre',
        price: 185000,
        unitPrice: 185000,
      },
    ],
  },
  {
    id: 'ord-1002',
    orderNumber: 'MND-2026-002',
    userId: 'usr-client',
    user: STATIC_USERS[1],
    status: 'EN_COURS',
    paymentStatus: 'PAYE',
    paymentMethod: 'CARTE_BANCAIRE',
    subtotal: 340000,
    shippingCost: 0,
    discount: 34000,
    total: 306000,
    shippingAddress: JSON.stringify({
      fullName: 'Aïssata Coulibaly',
      address: 'Quartier du Fleuve, Rue 312',
      city: 'Bamako',
      postalCode: 'BP 5432',
      country: 'Mali',
      phone: '+223 76 12 34 56',
    }),
    notes: 'Confection sur-mesure (Longueur 145cm)',
    createdAt: new Date('2026-02-22'),
    updatedAt: new Date('2026-02-23'),
    items: [
      {
        id: 'item-2',
        productId: 'prod-2',
        product: STATIC_PRODUCTS[1],
        quantity: 1,
        size: 'Sur-Mesure',
        color: 'Ivoire & Noir Géométrique',
        price: 195000,
        unitPrice: 195000,
      },
      {
        id: 'item-3',
        productId: 'prod-6',
        product: STATIC_PRODUCTS[5],
        quantity: 1,
        size: '52 x 32 x 24 cm',
        color: 'Cuir Havane & Bôkôlan Noir',
        price: 145000,
        unitPrice: 145000,
      },
    ],
  },
];
