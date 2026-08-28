import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { formatDate, safeJsonParse } from '@/lib/utils';
import { ArrowLeft, ArrowRight, Share2, BookOpen } from 'lucide-react';
import { BogolanBorder, BogolanDivider } from '@/components/ui/BogolanPattern';
import { Metadata } from 'next';

interface ArticlePageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const art = await prisma.article.findUnique({
    where: { slug: params.slug },
  });
  if (!art) return { title: 'Article | Mandé Héritage' };

  return {
    title: `${art.title} | Le Journal Mandé`,
    description: art.summary,
    openGraph: {
      title: art.title,
      description: art.summary,
      images: [{ url: art.coverImage }],
    },
  };
}

export default async function SingleArticlePage({ params }: ArticlePageProps) {
  const article = await prisma.article.findUnique({
    where: { slug: params.slug },
  });

  if (!article) {
    notFound();
  }

  const tags = safeJsonParse<string[]>(article.tags, []);

  // Fetch other articles
  const otherArticles = await prisma.article.findMany({
    where: { id: { not: article.id }, isPublished: true },
    take: 2,
    orderBy: { publishedAt: 'desc' },
  });

  return (
    <div className="pt-24 min-h-screen bg-mande-ivory">
      {/* Top Back Link */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 pb-4">
        <Link
          href="/journal"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gray-500 hover:text-mande-black font-sans transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-mande-gold" />
          <span>Retour au Journal Mandé</span>
        </Link>
      </div>

      {/* Article Header */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 pb-20">
        <div className="text-center space-y-4 mb-8">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 text-[10px] uppercase tracking-wider bg-mande-gold/15 text-mande-gold border border-mande-gold/30 font-sans"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-wider text-mande-black leading-tight">
            {article.title}
          </h1>

          <div className="flex items-center justify-center gap-3 text-xs text-gray-500 font-sans">
            <span>Par <strong className="text-mande-black">{article.author}</strong></span>
            <span>&bull;</span>
            <span>{formatDate(article.publishedAt)}</span>
          </div>

          <BogolanDivider variant="gold" className="my-4" />
        </div>

        {/* Cover Photo */}
        <div className="relative aspect-[16/9] w-full mb-12 border border-mande-ivoryDark shadow-card overflow-hidden">
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* Lead summary */}
        <div className="p-6 bg-white border-l-4 border-mande-gold mb-10 text-sm sm:text-base text-gray-800 font-serif italic leading-relaxed">
          &ldquo;{article.summary}&rdquo;
        </div>

        {/* Article Body Content */}
        <div className="prose prose-lg max-w-none text-gray-700 font-sans text-sm sm:text-base leading-relaxed space-y-6">
          {article.content.split('\n\n').map((para, idx) => {
            if (para.startsWith('### ')) {
              return (
                <h3
                  key={idx}
                  className="font-serif text-xl sm:text-2xl font-bold uppercase tracking-wider text-mande-black pt-6"
                >
                  {para.replace('### ', '')}
                </h3>
              );
            }
            return (
              <p key={idx} className="font-light">
                {para}
              </p>
            );
          })}
        </div>

        {/* Author Box */}
        <div className="mt-16 p-8 bg-white border border-mande-ivoryDark shadow-sm flex flex-col sm:flex-row items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-mande-black text-mande-gold border-2 border-mande-gold flex items-center justify-center font-serif font-bold text-xl flex-shrink-0">
            MH
          </div>
          <div className="text-center sm:text-left space-y-1">
            <h4 className="font-serif text-base font-bold text-mande-black">{article.author}</h4>
            <p className="text-xs text-gray-500 font-sans font-light">
              Rédacteur & Spécialiste du Patrimoine Culturel pour la Maison Mandé Héritage.
            </p>
          </div>
        </div>

        {/* Other articles preview */}
        {otherArticles.length > 0 && (
          <div className="mt-16 pt-12 border-t border-mande-ivoryDark">
            <h3 className="font-serif text-xl font-bold uppercase tracking-wider text-mande-black mb-6">
              Poursuivre la Lecture
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {otherArticles.map((art) => (
                <Link
                  key={art.id}
                  href={`/journal/${art.slug}`}
                  className="group bg-white p-5 border border-mande-ivoryDark hover:border-mande-gold shadow-sm flex gap-4 items-center"
                >
                  <div className="relative w-20 h-20 bg-mande-sand/10 border border-mande-ivoryDark flex-shrink-0 overflow-hidden">
                    <Image src={art.coverImage} alt={art.title} fill className="object-cover" />
                  </div>
                  <div>
                    <h4 className="font-serif text-sm font-bold text-mande-black group-hover:text-mande-earth transition-colors line-clamp-2">
                      {art.title}
                    </h4>
                    <span className="text-[10px] text-mande-gold uppercase tracking-wider font-semibold mt-1 inline-block">
                      Lire l’article →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
