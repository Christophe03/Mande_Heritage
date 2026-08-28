import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database update with authentic Bôkôlan imagery for Mandé Héritage...');

  // Clear products & categories & collections to refresh with authentic Bôkôlan catalog
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.review.deleteMany();
  await prisma.product.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.category.deleteMany();

  // 1. Create or ensure Users
  const passwordHash = await bcrypt.hash('AdminMande2026!', 10);
  const clientPasswordHash = await bcrypt.hash('ClientMande2026!', 10);

  await prisma.user.upsert({
    where: { email: 'admin@mandeheritage.com' },
    update: { passwordHash, role: 'ADMIN' },
    create: {
      name: 'Directeur Artistique Mandé',
      email: 'admin@mandeheritage.com',
      passwordHash,
      role: 'ADMIN',
      phone: '+223 70 00 00 01',
    },
  });

  await prisma.user.upsert({
    where: { email: 'client@mandeheritage.com' },
    update: { passwordHash: clientPasswordHash, role: 'CLIENT' },
    create: {
      name: 'Aïssata Coulibaly',
      email: 'client@mandeheritage.com',
      passwordHash: clientPasswordHash,
      role: 'CLIENT',
      phone: '+223 76 12 34 56',
    },
  });

  console.log('👤 Users ensured.');

  // 2. Categories with targeted Bôkôlan imagery
  const catVetements = await prisma.category.create({
    data: {
      name: 'Vêtements & Kimonos',
      slug: 'vetements',
      description: 'Pièces d’apparat, kimonos, vestes et robes confectionnées en Bôkôlan authentique et coton peigné.',
      image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000&auto=format&fit=crop',
    },
  });

  const catRobes = await prisma.category.create({
    data: {
      name: 'Robes & Caftans',
      slug: 'robes',
      description: 'Robes fourreaux, robes sculpturales et caftans royaux aux motifs ancestraux sacrés.',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop',
    },
  });

  const catSacs = await prisma.category.create({
    data: {
      name: 'Sacs & Maroquinerie',
      slug: 'sacs',
      description: 'Sacs weekend, cabas de voyage et pochettes de soirée alliant cuir pleine fleur et Bôkôlan d’art.',
      image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000&auto=format&fit=crop',
    },
  });

  const catChaussures = await prisma.category.create({
    data: {
      name: 'Chaussures & Souliers',
      slug: 'chaussures',
      description: 'Mocassins nomades, babouches impériales et mules raffinées montées à la main.',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1000&auto=format&fit=crop',
    },
  });

  const catAccessoires = await prisma.category.create({
    data: {
      name: 'Accessoires & Parures',
      slug: 'accessoires',
      description: 'Étoles en soie et Bôkôlan, chapeaux fédora, ceintures en cuir et parures mandingues.',
      image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=1000&auto=format&fit=crop',
    },
  });

  console.log('🏷️ 5 Categories created with Bôkôlan focus.');

  // 3. Collections
  const colHeritage = await prisma.collection.create({
    data: {
      name: 'Héritage Royal',
      slug: 'heritage-royal',
      description: 'Les motifs ancestraux sacrés du XIIIe siècle réinterprétés pour les cérémonies de prestige.',
      coverImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop',
      isFeatured: true,
    },
  });

  const colSignature = await prisma.collection.create({
    data: {
      name: 'Signature Mandé',
      slug: 'signature-mande',
      description: 'L’élégance intemporelle sublimant le Bôkôlan teinté à l’argile minérale du fleuve Niger.',
      coverImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop',
      isFeatured: true,
    },
  });

  const colModerne = await prisma.collection.create({
    data: {
      name: 'Moderne Sahel',
      slug: 'moderne-sahel',
      description: 'Coupes fluides et vestiaires cosmopolites alliant tradition et architecture contemporaine.',
      coverImage: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1200&auto=format&fit=crop',
      isFeatured: false,
    },
  });

  const colLimitee = await prisma.collection.create({
    data: {
      name: 'Éditions Limitées & Pièces d’Art',
      slug: 'editions-limitees',
      description: 'Pièces uniques numérotées, brodées au fil d’or 24 carats et teintes à la main.',
      coverImage: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1200&auto=format&fit=crop',
      isFeatured: true,
    },
  });

  console.log('✨ Collections created.');

  // 4. Products: Complete curated Bôkôlan Luxury Catalogue (Clothing, Dresses, Bags, Shoes, Accessories)
  const products = [
    // 1. Kimono & Veste Bôkôlan
    {
      name: 'Kimono Royal Soundiata en Bôkôlan Ocre & Noir',
      slug: 'kimono-royal-soundiata',
      shortDescription: 'Grand kimono structuré peint à la main avec les symboles sacrés du Mandé.',
      description: 'Le Kimono Royal Soundiata incarne la quintessence du luxe mandingue. Tissé à partir de coton biologique pur cultivé dans les terroirs de Ségou, chaque panneau est teinté à la main avec l’argile minérale fermentée du fleuve Niger et les décoctions sauvages de feuilles de n’galama. Une pièce magistrale qui allie stature impériale et fluidité absolue.',
      price: 185000,
      originalPrice: 220000,
      categoryId: catVetements.id,
      collectionId: colHeritage.id,
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
    },

    // 2. Robe Fourreau Bôkôlan
    {
      name: 'Robe Fourreau Reine Kassa en Bôkôlan Sculpté',
      slug: 'robe-fourreau-kassa',
      shortDescription: 'Robe du soir majestueuse avec motifs ancestraux Koumi Dio et finitions dorées.',
      description: 'Une ode à la souveraineté et à l’élégance féminine du Mandé. Taillée dans un Bôkôlan fin sélectionné parmi les plus belles pièces de nos ateliers, cette robe fourreau épouse la silhouette avec une grâce sculpturale. Les motifs Koumi Dio rendent hommage à la sagesse des reines mères.',
      price: 195000,
      originalPrice: 235000,
      categoryId: catRobes.id,
      collectionId: colSignature.id,
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
    },

    // 3. Robe Caftan Bôkôlan
    {
      name: 'Caftan Royal d’Apparat en Bôkôlan & Soie Sauvage',
      slug: 'caftan-royal-apparat-bokolan',
      shortDescription: 'Caftan fluide grand apparat avec broderies royales aux manches et col.',
      description: 'Inspiré des tenues solennelles des cours impériales d’Afrique de l’Ouest. Sa coupe ample et aérienne offre une prestance incomparable pour les grands galas et cérémonies traditionnelles.',
      price: 220000,
      originalPrice: null,
      categoryId: catRobes.id,
      collectionId: colHeritage.id,
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
    },

    // 4. Veste Tailleur Bôkôlan Homme
    {
      name: 'Veste Tailleur Mandé en Bôkôlan Noir Ébène',
      slug: 'veste-tailleur-mande',
      shortDescription: 'Blazer contemporain structuré aux empiècements géométriques Tiranké.',
      description: 'L’alliance parfaite entre la rigueur de la coupe sartoriale moderne et la force symbolique du Bôkôlan malien. Parfait pour les réceptions diplomatiques, dîners de prestige et événements exclusifs.',
      price: 165000,
      originalPrice: 190000,
      categoryId: catVetements.id,
      collectionId: colModerne.id,
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
    },

    // 5. Pantalon Drapé Mansa
    {
      name: 'Pantalon Drapé Mansa en Cotonnade Bôkôlan',
      slug: 'pantalon-drape-mansa',
      shortDescription: 'Pantalon fuseau à plis avec bandes latérales aux motifs ancestraux Sigui.',
      description: 'Confort noble et tombé impeccable. Se marie avec la veste tailleur ou le grand kimono pour une silhouette complète impériale.',
      price: 95000,
      originalPrice: null,
      categoryId: catVetements.id,
      collectionId: colSignature.id,
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
    },

    // 6. Sac de Voyage & Cabas Bôkôlan
    {
      name: 'Sac Weekend Bôkôlan & Cuir Pleine Fleur',
      slug: 'sac-weekend-bokolan-cuir',
      shortDescription: 'Grand sac de voyage de luxe associant cuir havane tanné végétal et Bôkôlan.',
      description: 'Conçu pour les esthètes nomades et les voyageurs cosmopolites. Ce sac weekend spacieux réunit la robustesse d’un cuir pleine fleur nourri aux cires naturelles et la noblesse d’une toile de Bôkôlan peinte à la main à Ségou.',
      price: 145000,
      originalPrice: 175000,
      categoryId: catSacs.id,
      collectionId: colSignature.id,
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
    },

    // 7. Sac Pochette Royale Mandé
    {
      name: 'Sac Pochette du Soir Bôkôlan & Bronze Doré',
      slug: 'sac-pochette-royale-mande',
      shortDescription: 'Pochette de gala rigide ornée d’un fermoir sculpté par nos maîtres bronziers.',
      description: 'L’accessoire de distinction par excellence. Son fermoir en bronze coulé à la cire perdue reproduit le célèbre sceptre mandingue, illuminant un panneau de Bôkôlan aux motifs sacrés.',
      price: 95000,
      originalPrice: null,
      categoryId: catSacs.id,
      collectionId: colHeritage.id,
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
    },

    // 8. Mocassins Nomades Bôkôlan
    {
      name: 'Mocassins Nomades en Bôkôlan & Veau Velours',
      slug: 'mocassins-nomades-bokolan-veau-velours',
      shortDescription: 'Souliers de luxe montés main, semelle cousue Blake et empeigne Bôkôlan.',
      description: 'Un confort exceptionnel allié au raffinement suprême. Chaque paire est montée à la main avec une semelle en cuir véritable et un plastron en Bôkôlan teinté selon les secrets de la corporation des cordonniers d’apparat.',
      price: 145000,
      originalPrice: 170000,
      categoryId: catChaussures.id,
      collectionId: colModerne.id,
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
    },

    // 9. Mules d’Apparat en Cuir & Bôkôlan
    {
      name: 'Mules d’Apparat en Cuir Tressé & Bôkôlan',
      slug: 'mules-apparat-cuir-tresse-bokolan',
      shortDescription: 'Mules plates d’une élégance intemporelle avec lanière de Bôkôlan.',
      description: 'L’essence du chic malien pour les journées ensoleillées et les soirées décontractées. Une semelle ergonomique en cuir patiné surmontée d’une lanière de Bôkôlan teinté à l’argile.',
      price: 85000,
      originalPrice: null,
      categoryId: catChaussures.id,
      collectionId: colSignature.id,
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
    },

    // 10. Étole d'Or Bôkôlan & Soie
    {
      name: 'Étole d’Or N’Galama en Soie Sauvage & Bôkôlan',
      slug: 'etole-dor-ngalama',
      shortDescription: 'Grande étole précieuse (200x80cm) ultra-douce, motif peint à la main.',
      description: 'Une caresse de soie et de cotonnade fine. Teinte avec les feuilles sauvages de n’galama pour obtenir cette nuance jaune impériale si caractéristique de la cour de Soundiata Keïta.',
      price: 55000,
      originalPrice: 70000,
      categoryId: catAccessoires.id,
      collectionId: colHeritage.id,
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
    },

    // 11. Manteau d'Apparat Mansa Musa (Édition Limitée)
    {
      name: 'Manteau d’Apparat Mansa Moussa — Pièce d’Exception',
      slug: 'manteau-apparat-mansa-moussa',
      shortDescription: 'Chef-d’œuvre d’art textile numéroté, 140 heures de travail d’artisanat.',
      description: 'Inspiré par la grandeur historique du pèlerinage de Mansa Moussa. Confectionné dans un coton d’exception brodé de filés d’or pur 24 carats et teinté selon les rites des maîtres teinturiers de San.',
      price: 320000,
      originalPrice: 380000,
      categoryId: catVetements.id,
      collectionId: colLimitee.id,
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
    },

    // 12. Chapeau Fédora Liseré Bôkôlan
    {
      name: 'Chapeau Fédora Liseré Bôkôlan & Plume Bronze',
      slug: 'chapeau-fedora-lisere-bokolan-bronze',
      shortDescription: 'Feutre de laine mérinos haut de gamme avec galon Bôkôlan ciselé.',
      description: 'Une silhouette audacieuse et aristocratique qui rehausse immédiatement n’importe quelle tenue.',
      price: 55000,
      originalPrice: null,
      categoryId: catAccessoires.id,
      collectionId: colModerne.id,
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
    },
  ];

  for (const prod of products) {
    await prisma.product.create({
      data: prod,
    });
  }

  console.log(`👗 ${products.length} Bôkôlan Products successfully seeded!`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
