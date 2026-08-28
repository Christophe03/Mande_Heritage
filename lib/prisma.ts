// In-memory / Static Data Mock for Prisma Client (100% Autonomous, No Database Connection Required)
import {
  STATIC_CATEGORIES,
  STATIC_COLLECTIONS,
  STATIC_PRODUCTS,
  STATIC_ARTICLES,
  STATIC_SHIPPING_ZONES,
  STATIC_PROMO_CODES,
  STATIC_USERS,
  STATIC_ORDERS,
  Product,
  Category,
  Collection,
  Article,
  ShippingZone,
  PromoCode,
  User,
  Order,
} from './staticData';

// Mutable in-memory state during runtime
const categories: Category[] = [...STATIC_CATEGORIES];
const collections: Collection[] = [...STATIC_COLLECTIONS];
const products: Product[] = [...STATIC_PRODUCTS];
const articles: Article[] = [...STATIC_ARTICLES];
const shippingZones: ShippingZone[] = [...STATIC_SHIPPING_ZONES];
const promoCodes: PromoCode[] = [...STATIC_PROMO_CODES];
const users: User[] = [...STATIC_USERS];
const orders: Order[] = [...STATIC_ORDERS];
const appointments: any[] = [];

// Helper to attach relations to product
function populateProduct(prod: Product): Product {
  const cat = categories.find((c) => c.id === prod.categoryId) || null;
  const col = prod.collectionId ? collections.find((c) => c.id === prod.collectionId) || null : null;
  return {
    ...prod,
    category: cat || undefined,
    collection: col || undefined,
  };
}

export const prisma = {
  category: {
    findMany: async (args?: any): Promise<Category[]> => {
      let res = [...categories];
      if (args?.include?.products) {
        res = res.map((cat) => ({
          ...cat,
          products: products.filter((p) => p.categoryId === cat.id).map(populateProduct),
        })) as any;
      }
      return res;
    },
    findUnique: async (args: any): Promise<Category | null> => {
      const cat = categories.find(
        (c) => (args.where.id && c.id === args.where.id) || (args.where.slug && c.slug === args.where.slug)
      );
      if (!cat) return null;
      if (args?.include?.products) {
        return {
          ...cat,
          products: products.filter((p) => p.categoryId === cat.id).map(populateProduct),
        } as any;
      }
      return cat;
    },
    create: async (args: any): Promise<Category> => {
      const newCat: Category = {
        id: `cat-${Date.now()}`,
        name: args.data.name,
        slug: args.data.slug,
        description: args.data.description || null,
        image: args.data.image || null,
        createdAt: new Date(),
        updatedAt: new Date(),
        products: [],
        _count: { products: 0 },
      };
      categories.push(newCat);
      return newCat;
    },
    update: async (args: any): Promise<Category | null> => {
      const idx = categories.findIndex((c) => c.id === args.where.id);
      if (idx !== -1) {
        categories[idx] = { ...categories[idx], ...args.data, updatedAt: new Date() };
        return categories[idx];
      }
      return null;
    },
    delete: async (args: any): Promise<Category | null> => {
      const idx = categories.findIndex((c) => c.id === args.where.id);
      if (idx !== -1) {
        return categories.splice(idx, 1)[0];
      }
      return null;
    },
  },

  collection: {
    findMany: async (args?: any): Promise<Collection[]> => {
      let res = [...collections];
      if (args?.where?.isFeatured !== undefined) {
        res = res.filter((c) => c.isFeatured === args.where.isFeatured);
      }
      if (args?.include?.products) {
        res = res.map((col) => ({
          ...col,
          products: products.filter((p) => p.collectionId === col.id).map(populateProduct),
        })) as any;
      }
      return res;
    },
    findUnique: async (args: any): Promise<Collection | null> => {
      const col = collections.find(
        (c) => (args.where.id && c.id === args.where.id) || (args.where.slug && c.slug === args.where.slug)
      );
      if (!col) return null;
      if (args?.include?.products) {
        return {
          ...col,
          products: products.filter((p) => p.collectionId === col.id).map(populateProduct),
        } as any;
      }
      return col;
    },
    create: async (args: any): Promise<Collection> => {
      const newCol: Collection = {
        id: `col-${Date.now()}`,
        name: args.data.name,
        slug: args.data.slug,
        description: args.data.description || null,
        coverImage: args.data.coverImage || null,
        isFeatured: args.data.isFeatured || false,
        createdAt: new Date(),
        updatedAt: new Date(),
        products: [],
        _count: { products: 0 },
      };
      collections.push(newCol);
      return newCol;
    },
    update: async (args: any): Promise<Collection | null> => {
      const idx = collections.findIndex((c) => c.id === args.where.id);
      if (idx !== -1) {
        collections[idx] = { ...collections[idx], ...args.data, updatedAt: new Date() };
        return collections[idx];
      }
      return null;
    },
    delete: async (args: any): Promise<Collection | null> => {
      const idx = collections.findIndex((c) => c.id === args.where.id);
      if (idx !== -1) {
        return collections.splice(idx, 1)[0];
      }
      return null;
    },
  },

  product: {
    findMany: async (args?: any): Promise<Product[]> => {
      let res = products.map(populateProduct);

      if (args?.where) {
        const w = args.where;
        if (w.isFeatured !== undefined) res = res.filter((p) => p.isFeatured === w.isFeatured);
        if (w.isNew !== undefined) res = res.filter((p) => p.isNew === w.isNew);
        if (w.categoryId) res = res.filter((p) => p.categoryId === w.categoryId);
        if (w.collectionId) res = res.filter((p) => p.collectionId === w.collectionId);
        if (w.gender) res = res.filter((p) => p.gender === w.gender || p.gender === 'UNISEX');
        if (w.slug?.not) res = res.filter((p) => p.slug !== w.slug.not);
        if (w.id?.not) res = res.filter((p) => p.id !== w.id.not);
        if (w.id?.in) res = res.filter((p) => w.id.in.includes(p.id));
        if (w.stock?.lte !== undefined) res = res.filter((p) => p.stock <= w.stock.lte);
      }

      if (args?.orderBy) {
        if (args.orderBy.createdAt === 'desc') {
          res.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        } else if (args.orderBy.price === 'asc') {
          res.sort((a, b) => a.price - b.price);
        } else if (args.orderBy.price === 'desc') {
          res.sort((a, b) => b.price - a.price);
        }
      }

      if (args?.take) {
        res = res.slice(0, args.take);
      }

      return res;
    },
    findUnique: async (args: any): Promise<Product | null> => {
      const prod = products.find(
        (p) => (args.where.id && p.id === args.where.id) || (args.where.slug && p.slug === args.where.slug)
      );
      if (!prod) return null;
      return populateProduct(prod);
    },
    count: async (args?: any): Promise<number> => {
      let res = products;
      if (args?.where?.stock && args.where.stock.lte !== undefined) {
        res = res.filter((p) => p.stock <= args.where.stock.lte);
      }
      return res.length;
    },
    create: async (args: any): Promise<Product> => {
      const newProd: Product = {
        id: `prod-${Date.now()}`,
        name: args.data.name,
        slug: args.data.slug,
        shortDescription: args.data.shortDescription || null,
        description: args.data.description,
        price: Number(args.data.price),
        originalPrice: args.data.originalPrice ? Number(args.data.originalPrice) : null,
        categoryId: args.data.categoryId,
        collectionId: args.data.collectionId || null,
        gender: args.data.gender || 'UNISEX',
        sizes: typeof args.data.sizes === 'string' ? args.data.sizes : JSON.stringify(args.data.sizes || []),
        colors: typeof args.data.colors === 'string' ? args.data.colors : JSON.stringify(args.data.colors || []),
        images: typeof args.data.images === 'string' ? args.data.images : JSON.stringify(args.data.images || []),
        stock: Number(args.data.stock ?? 10),
        materials: args.data.materials || null,
        careInstructions: args.data.careInstructions || null,
        isNew: Boolean(args.data.isNew),
        isFeatured: Boolean(args.data.isFeatured),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      products.push(newProd);
      return populateProduct(newProd);
    },
    update: async (args: any): Promise<Product | null> => {
      const idx = products.findIndex((p) => p.id === args.where.id);
      if (idx !== -1) {
        products[idx] = {
          ...products[idx],
          ...args.data,
          price: args.data.price !== undefined ? Number(args.data.price) : products[idx].price,
          stock: args.data.stock !== undefined ? Number(args.data.stock) : products[idx].stock,
          updatedAt: new Date(),
        };
        return populateProduct(products[idx]);
      }
      return null;
    },
    delete: async (args: any): Promise<Product | null> => {
      const idx = products.findIndex((p) => p.id === args.where.id);
      if (idx !== -1) {
        return products.splice(idx, 1)[0];
      }
      return null;
    },
  },

  article: {
    findMany: async (args?: any): Promise<Article[]> => {
      let res = [...articles];
      if (args?.where?.isPublished !== undefined) {
        res = res.filter((a) => a.isPublished === args.where.isPublished);
      }
      if (args?.orderBy?.createdAt === 'desc') {
        res.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      }
      if (args?.take) res = res.slice(0, args.take);
      return res;
    },
    findUnique: async (args: any): Promise<Article | null> => {
      return (
        articles.find(
          (a) => (args.where.id && a.id === args.where.id) || (args.where.slug && a.slug === args.where.slug)
        ) || null
      );
    },
    create: async (args: any): Promise<Article> => {
      const newArt: Article = {
        id: `art-${Date.now()}`,
        title: args.data.title,
        slug: args.data.slug,
        summary: args.data.summary || '',
        content: args.data.content,
        coverImage: args.data.coverImage,
        author: args.data.author || 'Maison Mandé Héritage',
        tags: typeof args.data.tags === 'string' ? args.data.tags : JSON.stringify(args.data.tags || []),
        isPublished: args.data.isPublished ?? true,
        publishedAt: args.data.isPublished ? new Date() : null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      articles.push(newArt);
      return newArt;
    },
    update: async (args: any): Promise<Article | null> => {
      const idx = articles.findIndex((a) => a.id === args.where.id);
      if (idx !== -1) {
        articles[idx] = { ...articles[idx], ...args.data, updatedAt: new Date() };
        return articles[idx];
      }
      return null;
    },
    delete: async (args: any): Promise<Article | null> => {
      const idx = articles.findIndex((a) => a.id === args.where.id);
      if (idx !== -1) {
        return articles.splice(idx, 1)[0];
      }
      return null;
    },
  },

  shippingZone: {
    findMany: async (args?: any): Promise<ShippingZone[]> => {
      let res = [...shippingZones];
      if (args?.where?.isActive !== undefined) {
        res = res.filter((s) => s.isActive === args.where.isActive);
      }
      return res;
    },
    findUnique: async (args: any): Promise<ShippingZone | null> => {
      return shippingZones.find((s) => s.id === args.where.id) || null;
    },
    create: async (args: any): Promise<ShippingZone> => {
      const newZone: ShippingZone = {
        id: `ship-${Date.now()}`,
        country: args.data.country,
        countryCode: args.data.countryCode || 'XX',
        cost: Number(args.data.cost),
        estimatedDays: args.data.estimatedDays || '2-5 jours',
        carrier: args.data.carrier || 'DHL Express',
        isActive: args.data.isActive ?? true,
        zoneName: args.data.country,
        price: Number(args.data.cost),
        countries: args.data.country,
        estimatedDelivery: args.data.estimatedDays || '2-5 jours',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      shippingZones.push(newZone);
      return newZone;
    },
    update: async (args: any): Promise<ShippingZone | null> => {
      const idx = shippingZones.findIndex((s) => s.id === args.where.id);
      if (idx !== -1) {
        shippingZones[idx] = { ...shippingZones[idx], ...args.data, updatedAt: new Date() };
        return shippingZones[idx];
      }
      return null;
    },
    delete: async (args: any): Promise<ShippingZone | null> => {
      const idx = shippingZones.findIndex((s) => s.id === args.where.id);
      if (idx !== -1) return shippingZones.splice(idx, 1)[0];
      return null;
    },
  },

  promoCode: {
    findMany: async (args?: any): Promise<PromoCode[]> => {
      let res = [...promoCodes];
      if (args?.where?.isActive !== undefined) {
        res = res.filter((p) => p.isActive === args.where.isActive);
      }
      return res;
    },
    findUnique: async (args: any): Promise<PromoCode | null> => {
      return (
        promoCodes.find(
          (p) =>
            (args.where.id && p.id === args.where.id) ||
            (args.where.code && p.code.toUpperCase() === args.where.code.toUpperCase())
        ) || null
      );
    },
    create: async (args: any): Promise<PromoCode> => {
      const newCode: PromoCode = {
        id: `promo-${Date.now()}`,
        code: args.data.code.toUpperCase(),
        discountPercent: Number(args.data.discountPercent),
        discountAmount: args.data.discountAmount ? Number(args.data.discountAmount) : null,
        minOrderAmount: args.data.minOrderAmount ? Number(args.data.minOrderAmount) : null,
        maxUses: args.data.maxUses ? Number(args.data.maxUses) : null,
        usedCount: 0,
        expiresAt: args.data.expiresAt ? new Date(args.data.expiresAt) : null,
        isActive: args.data.isActive ?? true,
        discountType: 'PERCENTAGE',
        value: Number(args.data.discountPercent),
        endDate: args.data.expiresAt ? new Date(args.data.expiresAt) : null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      promoCodes.push(newCode);
      return newCode;
    },
    update: async (args: any): Promise<PromoCode | null> => {
      const idx = promoCodes.findIndex((p) => p.id === args.where.id);
      if (idx !== -1) {
        promoCodes[idx] = { ...promoCodes[idx], ...args.data, updatedAt: new Date() };
        return promoCodes[idx];
      }
      return null;
    },
    updateMany: async (args: any): Promise<{ count: number }> => {
      let count = 0;
      promoCodes.forEach((p, idx) => {
        if (!args.where?.code || p.code.toUpperCase() === args.where.code.toUpperCase()) {
          promoCodes[idx] = { ...promoCodes[idx], ...args.data, updatedAt: new Date() };
          count++;
        }
      });
      return { count };
    },
    delete: async (args: any): Promise<PromoCode | null> => {
      const idx = promoCodes.findIndex((p) => p.id === args.where.id);
      if (idx !== -1) return promoCodes.splice(idx, 1)[0];
      return null;
    },
  },

  user: {
    findMany: async (args?: any): Promise<User[]> => {
      let res = [...users];
      if (args?.include) {
        res = res.map((u) => ({
          ...u,
          orders: orders.filter((o) => o.userId === u.id),
          _count: {
            orders: orders.filter((o) => o.userId === u.id).length,
            wishlist: 0,
          },
        }));
      }
      return res;
    },
    findUnique: async (args: any): Promise<User | null> => {
      const u = users.find(
        (user) =>
          (args.where.id && user.id === args.where.id) ||
          (args.where.email && user.email.toLowerCase() === args.where.email.toLowerCase())
      );
      if (!u) return null;
      if (args?.include) {
        return {
          ...u,
          orders: orders.filter((o) => o.userId === u.id),
          _count: {
            orders: orders.filter((o) => o.userId === u.id).length,
            wishlist: 0,
          },
        };
      }
      return u;
    },
    count: async (args?: any): Promise<number> => {
      let res = users;
      if (args?.where?.role) {
        res = res.filter((u) => u.role === args.where.role);
      }
      return res.length;
    },
    create: async (args: any): Promise<User> => {
      const newUser: User = {
        id: `usr-${Date.now()}`,
        name: args.data.name,
        email: args.data.email.toLowerCase(),
        passwordHash: args.data.passwordHash,
        role: args.data.role || 'CLIENT',
        phone: args.data.phone || null,
        createdAt: new Date(),
        updatedAt: new Date(),
        addresses: [],
        orders: [],
        _count: { orders: 0, wishlist: 0 },
      };
      users.push(newUser);
      return newUser;
    },
    update: async (args: any): Promise<User | null> => {
      const idx = users.findIndex((u) => u.id === args.where.id);
      if (idx !== -1) {
        users[idx] = { ...users[idx], ...args.data, updatedAt: new Date() };
        return users[idx];
      }
      return null;
    },
  },

  order: {
    findMany: async (args?: any): Promise<Order[]> => {
      let res = [...orders];
      if (args?.where?.userId) {
        res = res.filter((o) => o.userId === args.where.userId);
      }
      if (args?.orderBy?.createdAt === 'desc') {
        res.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      }
      if (args?.take) res = res.slice(0, args.take);
      return res;
    },
    findUnique: async (args: any): Promise<Order | null> => {
      const ord = orders.find(
        (o) =>
          (args.where.id && o.id === args.where.id) ||
          (args.where.orderNumber && o.orderNumber === args.where.orderNumber)
      );
      return ord || null;
    },
    count: async (args?: any): Promise<number> => {
      let res = orders;
      if (args?.where?.status) {
        res = res.filter((o) => o.status === args.where.status);
      }
      return res.length;
    },
    aggregate: async (args?: any): Promise<{ _sum: { total: number } }> => {
      const total = orders.reduce((sum, o) => sum + (o.paymentStatus === 'PAYE' ? o.total : 0), 0);
      return {
        _sum: {
          total,
        },
      };
    },
    create: async (args: any): Promise<Order> => {
      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        orderNumber: args.data.orderNumber || `MND-${Date.now().toString().slice(-6)}`,
        userId: args.data.userId || null,
        status: args.data.status || 'EN_ATTENTE',
        paymentStatus: args.data.paymentStatus || 'EN_ATTENTE',
        paymentMethod: args.data.paymentMethod || 'ORANGE_MONEY',
        subtotal: Number(args.data.subtotal),
        shippingCost: Number(args.data.shippingCost || 0),
        discount: Number(args.data.discount || 0),
        total: Number(args.data.total),
        shippingAddress: typeof args.data.shippingAddress === 'string' ? args.data.shippingAddress : JSON.stringify(args.data.shippingAddress),
        notes: args.data.notes || null,
        createdAt: new Date(),
        updatedAt: new Date(),
        items: args.data.items?.create ? args.data.items.create.map((it: any, i: number) => ({ id: `item-${Date.now()}-${i}`, ...it, unitPrice: it.price || it.unitPrice || 0 })) : [],
      };
      orders.unshift(newOrder);
      return newOrder;
    },
    update: async (args: any): Promise<Order | null> => {
      const idx = orders.findIndex((o) => o.id === args.where.id);
      if (idx !== -1) {
        orders[idx] = { ...orders[idx], ...args.data, updatedAt: new Date() };
        return orders[idx];
      }
      return null;
    },
  },

  appointment: {
    findMany: async (): Promise<any[]> => appointments,
    create: async (args: any): Promise<any> => {
      const newApp = {
        id: `app-${Date.now()}`,
        ...args.data,
        createdAt: new Date(),
      };
      appointments.push(newApp);
      return newApp;
    },
  },

  review: {
    findMany: async (): Promise<any[]> => [],
    create: async (args: any): Promise<any> => ({ id: `rev-${Date.now()}`, ...args.data, createdAt: new Date() }),
  },

  wishlist: {
    findMany: async (): Promise<any[]> => [],
    create: async (args: any): Promise<any> => ({ id: `wish-${Date.now()}`, ...args.data }),
    deleteMany: async (): Promise<{ count: number }> => ({ count: 0 }),
  },

  cartItem: {
    findMany: async (): Promise<any[]> => [],
    create: async (args: any): Promise<any> => ({ id: `cart-${Date.now()}`, ...args.data }),
    deleteMany: async (): Promise<{ count: number }> => ({ count: 0 }),
  },

  address: {
    findMany: async (): Promise<any[]> => [],
    create: async (args: any): Promise<any> => ({ id: `addr-${Date.now()}`, ...args.data }),
  },
};

export default prisma;
