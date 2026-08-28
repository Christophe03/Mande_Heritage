'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  Crown, 
  Sparkles, 
  X, 
  CheckCircle,
  Eye,
  Layers,
  Tag
} from 'lucide-react';
import { Button } from '../ui/Button';
import { formatDate } from '@/lib/utils';

interface ContentManagementProps {
  initialArticles: any[];
  initialCollections: any[];
}

export function ContentManagement({ initialArticles, initialCollections }: ContentManagementProps) {
  const router = useRouter();
  const [articles, setArticles] = useState<any[]>(initialArticles);
  const [collections, setCollections] = useState<any[]>(initialCollections);

  // Article Modal State
  const [articleModalOpen, setArticleModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<any | null>(null);
  const [articleForm, setArticleForm] = useState({
    title: '',
    summary: '',
    content: '',
    coverImage: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1200',
    author: 'Maison Mandé Héritage',
    tags: 'Bôkôlan, Haute Couture, Patrimoine',
    isPublished: true,
  });

  // Collection Modal State
  const [collectionModalOpen, setCollectionModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<any | null>(null);
  const [collectionForm, setCollectionForm] = useState({
    name: '',
    description: '',
    coverImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200',
    isFeatured: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Open Article Modal
  const handleOpenArticleModal = (art?: any) => {
    if (art) {
      setEditingArticle(art);
      setArticleForm({
        title: art.title,
        summary: art.summary || '',
        content: art.content || '',
        coverImage: art.coverImage,
        author: art.author || 'Maison Mandé Héritage',
        tags: Array.isArray(art.tags) ? art.tags.join(', ') : (art.tags || ''),
        isPublished: art.isPublished,
      });
    } else {
      setEditingArticle(null);
      setArticleForm({
        title: '',
        summary: '',
        content: '',
        coverImage: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1200',
        author: 'Maison Mandé Héritage',
        tags: 'Bôkôlan, Haute Couture, Patrimoine',
        isPublished: true,
      });
    }
    setArticleModalOpen(true);
  };

  // Submit Article
  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        ...articleForm,
        tags: articleForm.tags.split(',').map((t) => t.trim()).filter(Boolean),
      };

      if (editingArticle) {
        const res = await fetch('/api/admin/articles', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingArticle.id, ...payload }),
        });
        const data = await res.json();
        if (data.success) {
          setArticles(articles.map((a) => (a.id === editingArticle.id ? data.article : a)));
          setArticleModalOpen(false);
          router.refresh();
        }
      } else {
        const res = await fetch('/api/admin/articles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          setArticles([data.article, ...articles]);
          setArticleModalOpen(false);
          router.refresh();
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Article
  const handleDeleteArticle = async (id: string) => {
    if (!confirm('Supprimer cet article ?')) return;
    try {
      const res = await fetch(`/api/admin/articles?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setArticles(articles.filter((a) => a.id !== id));
        router.refresh();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Open Collection Modal
  const handleOpenCollectionModal = (col?: any) => {
    if (col) {
      setEditingCollection(col);
      setCollectionForm({
        name: col.name,
        description: col.description || '',
        coverImage: col.coverImage,
        isFeatured: col.isFeatured,
      });
    } else {
      setEditingCollection(null);
      setCollectionForm({
        name: '',
        description: '',
        coverImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200',
        isFeatured: true,
      });
    }
    setCollectionModalOpen(true);
  };

  // Submit Collection
  const handleSaveCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingCollection) {
        const res = await fetch('/api/admin/collections', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingCollection.id, ...collectionForm }),
        });
        const data = await res.json();
        if (data.success) {
          setCollections(collections.map((c) => (c.id === editingCollection.id ? { ...data.collection, _count: editingCollection._count } : c)));
          setCollectionModalOpen(false);
          router.refresh();
        }
      } else {
        const res = await fetch('/api/admin/collections', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(collectionForm),
        });
        const data = await res.json();
        if (data.success) {
          setCollections([...collections, { ...data.collection, _count: { products: 0 } }]);
          setCollectionModalOpen(false);
          router.refresh();
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-12">
      {/* 1. Articles Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-mande-gold font-sans font-semibold">
              Presse, Savoir-Faire & Culture
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold uppercase tracking-wider text-mande-ivory mt-1">
              Le Journal Mandé ({articles.length})
            </h1>
          </div>

          <Button
            onClick={() => handleOpenArticleModal()}
            variant="gold"
            size="md"
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Rédiger un Nouvel Article
          </Button>
        </div>

        {/* Articles Table */}
        <div className="bg-mande-dark border border-mande-surface/80 overflow-x-auto shadow-sm">
          <table className="w-full text-xs text-left font-sans">
            <thead className="text-gray-400 uppercase tracking-wider border-b border-mande-surface bg-mande-surface/30">
              <tr>
                <th className="p-3.5">Couverture</th>
                <th className="p-3.5">Titre & Slug</th>
                <th className="p-3.5">Auteur</th>
                <th className="p-3.5">Date de Publication</th>
                <th className="p-3.5">Statut</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mande-surface">
              {articles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-gray-500 font-sans">
                    Aucun article publié pour l’instant.
                  </td>
                </tr>
              ) : (
                articles.map((art) => (
                  <tr key={art.id} className="hover:bg-mande-surface/30 transition-colors">
                    <td className="p-3.5">
                      <div className="relative w-16 h-12 bg-mande-surface overflow-hidden border border-mande-surface">
                        <Image src={art.coverImage} alt={art.title} fill className="object-cover" />
                      </div>
                    </td>
                    <td className="p-3.5 max-w-sm">
                      <p className="font-serif font-bold text-mande-ivory text-sm">{art.title}</p>
                      <span className="font-sans text-[10px] text-gray-500 font-mono">
                        /journal/{art.slug}
                      </span>
                    </td>
                    <td className="p-3.5 text-gray-300">{art.author}</td>
                    <td className="p-3.5 text-gray-400">{formatDate(art.publishedAt || art.createdAt)}</td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 font-bold uppercase text-[10px] border ${
                          art.isPublished
                            ? 'bg-green-500/20 text-green-400 border-green-500/30'
                            : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                        }`}
                      >
                        {art.isPublished ? 'En Ligne' : 'Brouillon'}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => handleOpenArticleModal(art)}
                        className="p-1.5 bg-mande-surface hover:bg-mande-gold hover:text-mande-black text-gray-300 transition-colors"
                        title="Modifier"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteArticle(art.id)}
                        className="p-1.5 bg-mande-surface hover:bg-red-600 text-gray-300 hover:text-white transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Collections Section */}
      <div className="space-y-6 pt-6 border-t border-mande-surface">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-mande-gold font-sans font-semibold">
              Lignes & Thèmes Artistiques
            </span>
            <h2 className="font-serif text-2xl font-bold uppercase tracking-wider text-mande-ivory mt-1">
              Collections de la Maison ({collections.length})
            </h2>
          </div>

          <Button
            onClick={() => handleOpenCollectionModal()}
            variant="outline"
            size="md"
            leftIcon={<Plus className="w-4 h-4" />}
            className="text-mande-sand border-mande-surface hover:border-mande-gold hover:text-mande-gold"
          >
            Nouvelle Collection
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {collections.map((col) => (
            <div
              key={col.id}
              className="bg-mande-dark p-4 border border-mande-surface/80 space-y-3 relative group"
            >
              <div className="relative h-40 w-full overflow-hidden border border-mande-surface">
                <Image
                  src={col.coverImage || 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=400'}
                  alt={col.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {col.isFeatured && (
                  <span className="absolute top-2 right-2 px-2 py-0.5 bg-mande-gold text-mande-black text-[9px] uppercase font-bold tracking-wider">
                    À la Une
                  </span>
                )}
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-mande-ivory text-base">{col.name}</h3>
                  <button
                    onClick={() => handleOpenCollectionModal(col)}
                    className="text-gray-400 hover:text-mande-gold p-1"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[11px] text-gray-400 font-sans line-clamp-2 mt-1">
                  {col.description || 'Collection exclusive Mandé Héritage.'}
                </p>
                <p className="text-[11px] text-mande-gold font-mono font-semibold mt-2">
                  {col._count?.products || 0} pièce(s) liée(s)
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Article Modal */}
      {articleModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm p-4 flex items-center justify-center">
          <div className="bg-mande-dark border border-mande-gold/40 max-w-2xl w-full p-6 text-mande-ivory shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-mande-surface">
              <h3 className="font-serif text-lg font-bold uppercase tracking-wider text-mande-gold">
                {editingArticle ? 'Modifier l’Article' : 'Rédiger un Article pour le Journal'}
              </h3>
              <button onClick={() => setArticleModalOpen(false)}>
                <X className="w-5 h-5 text-gray-400 hover:text-white" />
              </button>
            </div>

            <form onSubmit={handleSaveArticle} className="space-y-4 text-xs font-sans">
              <div className="space-y-1">
                <label className="text-gray-300 uppercase font-semibold">Titre de l’Article *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: L’Alchimie Secrète du Bôkôlan Millénaire"
                  value={articleForm.title}
                  onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })}
                  className="w-full px-3 py-2 bg-mande-surface border border-mande-surface text-mande-ivory focus:outline-none focus:border-mande-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-300 uppercase font-semibold">Auteur</label>
                  <input
                    type="text"
                    value={articleForm.author}
                    onChange={(e) => setArticleForm({ ...articleForm, author: e.target.value })}
                    className="w-full px-3 py-2 bg-mande-surface border border-mande-surface text-mande-ivory focus:outline-none focus:border-mande-gold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-300 uppercase font-semibold">Tags (séparés par virgule)</label>
                  <input
                    type="text"
                    placeholder="Bôkôlan, Mali, Soie"
                    value={articleForm.tags}
                    onChange={(e) => setArticleForm({ ...articleForm, tags: e.target.value })}
                    className="w-full px-3 py-2 bg-mande-surface border border-mande-surface text-mande-ivory focus:outline-none focus:border-mande-gold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 uppercase font-semibold">Image de Couverture (URL)</label>
                <input
                  type="url"
                  value={articleForm.coverImage}
                  onChange={(e) => setArticleForm({ ...articleForm, coverImage: e.target.value })}
                  className="w-full px-3 py-2 bg-mande-surface border border-mande-surface text-mande-ivory focus:outline-none focus:border-mande-gold font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 uppercase font-semibold">Résumé / Accroche</label>
                <textarea
                  rows={2}
                  placeholder="Bref résumé introductif..."
                  value={articleForm.summary}
                  onChange={(e) => setArticleForm({ ...articleForm, summary: e.target.value })}
                  className="w-full p-2.5 bg-mande-surface border border-mande-surface text-mande-ivory focus:outline-none focus:border-mande-gold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 uppercase font-semibold">Corps de l’Article (Texte ou HTML) *</label>
                <textarea
                  rows={6}
                  required
                  placeholder="Racontez l'histoire, la tradition et la confection..."
                  value={articleForm.content}
                  onChange={(e) => setArticleForm({ ...articleForm, content: e.target.value })}
                  className="w-full p-2.5 bg-mande-surface border border-mande-surface text-mande-ivory focus:outline-none focus:border-mande-gold font-sans leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="artPub"
                  checked={articleForm.isPublished}
                  onChange={(e) => setArticleForm({ ...articleForm, isPublished: e.target.checked })}
                  className="w-4 h-4 accent-mande-gold"
                />
                <label htmlFor="artPub" className="text-gray-300 font-semibold cursor-pointer">
                  Publier immédiatement dans Le Journal public
                </label>
              </div>

              <div className="pt-3 border-t border-mande-surface flex justify-end gap-2">
                <Button type="button" onClick={() => setArticleModalOpen(false)} variant="ghost" size="sm">
                  Annuler
                </Button>
                <Button type="submit" disabled={isSubmitting} variant="gold" size="sm">
                  {isSubmitting ? 'Enregistrement...' : 'Enregistrer l’Article'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Collection Modal */}
      {collectionModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm p-4 flex items-center justify-center">
          <div className="bg-mande-dark border border-mande-gold/40 max-w-md w-full p-6 text-mande-ivory shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-mande-surface">
              <h3 className="font-serif text-lg font-bold uppercase tracking-wider text-mande-gold">
                {editingCollection ? 'Modifier la Collection' : 'Nouvelle Collection'}
              </h3>
              <button onClick={() => setCollectionModalOpen(false)}>
                <X className="w-5 h-5 text-gray-400 hover:text-white" />
              </button>
            </div>

            <form onSubmit={handleSaveCollection} className="space-y-4 text-xs font-sans">
              <div className="space-y-1">
                <label className="text-gray-300 uppercase font-semibold">Nom de la Collection *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Mandé Royal 2026"
                  value={collectionForm.name}
                  onChange={(e) => setCollectionForm({ ...collectionForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-mande-surface border border-mande-surface text-mande-ivory focus:outline-none focus:border-mande-gold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 uppercase font-semibold">Image de Couverture (URL)</label>
                <input
                  type="url"
                  value={collectionForm.coverImage}
                  onChange={(e) => setCollectionForm({ ...collectionForm, coverImage: e.target.value })}
                  className="w-full px-3 py-2 bg-mande-surface border border-mande-surface text-mande-ivory focus:outline-none focus:border-mande-gold font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 uppercase font-semibold">Description</label>
                <textarea
                  rows={3}
                  placeholder="L'essence et la vision de cette collection..."
                  value={collectionForm.description}
                  onChange={(e) => setCollectionForm({ ...collectionForm, description: e.target.value })}
                  className="w-full p-2.5 bg-mande-surface border border-mande-surface text-mande-ivory focus:outline-none focus:border-mande-gold"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="colFeat"
                  checked={collectionForm.isFeatured}
                  onChange={(e) => setCollectionForm({ ...collectionForm, isFeatured: e.target.checked })}
                  className="w-4 h-4 accent-mande-gold"
                />
                <label htmlFor="colFeat" className="text-gray-300 font-semibold cursor-pointer">
                  Mettre en avant sur la page d’accueil
                </label>
              </div>

              <div className="pt-3 border-t border-mande-surface flex justify-end gap-2">
                <Button type="button" onClick={() => setCollectionModalOpen(false)} variant="ghost" size="sm">
                  Annuler
                </Button>
                <Button type="submit" disabled={isSubmitting} variant="gold" size="sm">
                  {isSubmitting ? 'Enregistrement...' : 'Enregistrer la Collection'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
