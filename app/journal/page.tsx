import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import prisma from '@/lib/prisma';
import { formatDate, safeJsonParse } from '@/lib/utils';
import { ArrowRight, BookOpen } from 'lucide-react';
import { BogolanBorder, BogolanDivider } from '@/components/ui/BogolanPattern';

export const metadata = {
  title: 'Le Journal Mandé | Culture, Histoire & Savoir-Faire',
  description: 'Chroniques éditoriales, immersion dans les ateliers de tissage, symbolique des motifs et actualités de la Maison Mandé Héritage.',
};

export default async function JournalPage() {
  const articles = await prisma.article.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: 'desc' },
  });

  const featuredArticle = articles[0];
  const remainingArticles = articles.slice(1);

  return (
    <div className="pt-24 min-h-screen bg-mande-ivory">
      {/* Header */}
      <div className="bg-mande-ivoryLight py-16 border-b border-mande-ivoryDark text-center px-4">
        <div className="max-w-3xl mx-auto">
          <span className="text-xs uppercase tracking-[0.25em] text-mande-gold font-sans font-semibold">
            Chroniques & Savoir-Faire
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold uppercase tracking-wider text-mande-black mt-2">
            Le Journal Mandé
          </h1>
          <BogolanDivider variant="gold" className="my-3" />
          <p className="text-xs sm:text-sm text-gray-600 font-sans font-light max-w-xl mx-auto">
            Plongez dans les coulisses de nos ateliers de San et Bamako, et explorez les récits qui forgent l’âme de nos étoffes.
          </p>
        </div>
      </div>

      <BogolanBorder className="opacity-30 text-mande-gold" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Featured Article */}
        {featuredArticle && (
          <div className="mb-16">
            <Link
              href={`/journal/${featuredArticle.slug}`}
              className="group grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 bg-white border border-mande-ivoryDark hover:border-mande-gold shadow-card p-6 sm:p-8 transition-all duration-500"
            >
              <div className="relative h-72 sm:h-96 w-full overflow-hidden border border-mande-ivoryDark">
                <Image
                  src={featuredArticle.coverImage}
                  alt={featuredArticle.title}
                  fill
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              <div className="flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-3 text-[11px] text-mande-gold uppercase tracking-widest font-sans mb-2 font-semibold">
                    <span>À la Une</span>
                    <span>&bull;</span>
                    <span className="text-gray-400 font-normal">{formatDate(featuredArticle.publishedAt || featuredArticle.createdAt)}</span>
                  </div>

                  <h2 className="font-serif text-2xl sm:text-3xl font-bold uppercase tracking-wider text-mande-black group-hover:text-mande-earth transition-colors leading-tight">
                    {featuredArticle.title}
                  </h2>

                  <p className="font-sans text-xs sm:text-sm text-gray-600 font-light mt-3 leading-relaxed">
                    {featuredArticle.summary}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-mande-ivoryDark text-xs font-sans">
                  <span className="text-gray-500">{featuredArticle.author}</span>
                  <span className="text-mande-gold font-semibold uppercase tracking-wider flex items-center gap-1 group-hover:underline">
                    Lire l’article complet →
                  </span>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Other Articles Grid */}
        {remainingArticles.length > 0 && (
          <div>
            <h3 className="font-serif text-xl font-bold uppercase tracking-wider text-mande-black mb-8 pb-3 border-b border-mande-ivoryDark">
              Dernières Publications
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {remainingArticles.map((art) => (
                <Link
                  key={art.id}
                  href={`/journal/${art.slug}`}
                  className="group bg-white border border-mande-ivoryDark hover:border-mande-gold shadow-sm p-5 flex flex-col justify-between transition-all duration-300"
                >
                  <div>
                    <div className="relative aspect-[16/10] w-full mb-4 overflow-hidden border border-mande-ivoryDark">
                      <Image
                        src={art.coverImage}
                        alt={art.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="text-[10px] text-gray-400 uppercase tracking-widest font-sans mb-1">
                      {formatDate(art.publishedAt || art.createdAt)} &bull; {art.author}
                    </div>
                    <h4 className="font-serif text-lg font-bold text-mande-black group-hover:text-mande-earth transition-colors line-clamp-2">
                      {art.title}
                    </h4>
                    <p className="text-xs text-gray-600 font-sans font-light mt-2 line-clamp-3 leading-relaxed">
                      {art.summary}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-mande-ivoryDark text-xs text-mande-gold font-semibold uppercase tracking-wider flex items-center gap-1 group-hover:underline">
                    <span>Découvrir</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
