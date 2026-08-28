import React from 'react';
import Image from 'next/image';
import { Instagram } from 'lucide-react';
import { BogolanDivider } from '../ui/BogolanPattern';

const INSTAGRAM_POSTS = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600',
    caption: 'La noblesse du Bôkôlan ocre et noir portée avec fierté.',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600',
    caption: 'Dans l’intimité de notre salon privé à Bamako.',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=600',
    caption: 'Lignes architecturales et géométrie mandingue sacrée.',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=600',
    caption: 'Chaque pièce est numérotée et tissée main.',
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=600',
    caption: 'Le sac Grand Siècle : l’alliance du cuir pleine fleur et du Bôkôlan.',
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=600',
    caption: 'Souliers sur-mesure confectionnés dans nos ateliers.',
  },
];

export function InstagramFeed() {
  return (
    <section className="py-20 bg-mande-ivoryLight border-t border-b border-mande-ivoryDark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-mande-gold font-sans font-semibold mb-2">
            <Instagram className="w-4 h-4" />
            <span>@mande.heritage</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold uppercase tracking-wider text-mande-black">
            Rejoignez le Cercle Mandé
          </h2>
          <BogolanDivider variant="gold" className="my-3" />
          <p className="text-xs text-gray-500 font-sans">
            Partagez vos tenues avec le hashtag <strong className="text-mande-earth">#MandeHeritage</strong> pour figurer dans notre galerie d’honneur.
          </p>
        </div>

        {/* 6 Grid items */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {INSTAGRAM_POSTS.map((post) => (
            <a
              key={post.id}
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="group relative aspect-square overflow-hidden bg-mande-sand/20 border border-mande-ivoryDark hover:border-mande-gold transition-all duration-300"
            >
              <Image
                src={post.image}
                alt={post.caption}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-3 text-center">
                <Instagram className="w-6 h-6 text-mande-gold" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
