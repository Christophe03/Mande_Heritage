import React from 'react';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { ProductDetailClient } from '@/components/shop/ProductDetailClient';
import { safeJsonParse } from '@/lib/utils';
import { Metadata } from 'next';

interface ProductPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { category: true },
  });

  if (!product) {
    return {
      title: 'Création introuvable | Mandé Héritage',
    };
  }

  const images = safeJsonParse<string[]>(product.images, []);
  const mainImage = images[0] || 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200';

  return {
    title: `${product.name} | Mandé Héritage`,
    description: product.shortDescription || product.description.slice(0, 160),
    openGraph: {
      title: `${product.name} | Mandé Héritage`,
      description: product.shortDescription || product.description.slice(0, 160),
      images: [{ url: mainImage, alt: product.name }],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: {
      category: true,
      collection: true,
    },
  });

  if (!product) {
    notFound();
  }

  // Fetch related products (same category or collection)
  const relatedProducts = await prisma.product.findMany({
    where: {
      id: { not: product.id },
      OR: [
        { categoryId: product.categoryId },
        { collectionId: product.collectionId },
      ],
    },
    include: {
      category: true,
      collection: true,
    },
    take: 4,
  });

  // Schema.org Structured Data (JSON-LD)
  const images = safeJsonParse<string[]>(product.images, []);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: images,
    description: product.description,
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: 'Mandé Héritage',
    },
    offers: {
      '@type': 'Offer',
      url: `https://mandeheritage.com/produit/${product.slug}`,
      priceCurrency: 'XOF',
      price: product.price,
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
  };

  return (
    <div className="pt-24 min-h-screen bg-mande-ivory">
      {/* Inject Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailClient product={product} relatedProducts={relatedProducts} />
    </div>
  );
}
