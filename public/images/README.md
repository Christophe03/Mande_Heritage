# Dossier des Ressources Visuelles — Mandé Héritage

Ce dossier `public/images/` est organisé par typologie de médias pour la boutique et le back-office.

---

## 📁 Structure des Dossiers

```
public/images/
├── logo/               # Identité visuelle de la Maison
│   ├── logo-gold.svg   # Logo officiel Or Mandé (sur fond sombre / Hero)
│   ├── logo-dark.svg   # Logo officiel Noir Mandé (sur fond clair / ivoire)
│   ├── emblem-gold.svg # Monogramme / Sceau royal "MH"
│   └── favicon.svg     # Favicon pour le navigateur
│
├── hero/               # Bannières plein écran de la page d'accueil (Recommandé: 1920x1080px WebP/JPG)
│
├── categories/         # Photos d'univers (Prêt-à-porter, Maroquinerie, Chaussures, Accessoires)
│
├── collections/        # Couvertures des collections phares (Sovereign Mandé, Bôkôlan Couture...)
│
├── products/           # Photos shooting des créations (Recommandé: Format portrait 3:4 ou 4:5, 1200x1500px)
│
├── bokolan/            # Reportages photos d'artisanat, argile du Niger, filage et séchage
│
├── blog/               # Visuels d'articles du Journal Mandé
│
└── patterns/           # Textures vectorielles et motifs géométriques traditionnels
```

---

## 📸 Bonnes Pratiques Photographiques

1. **Format recommandé** : `.webp` ou `.jpg` optimisé pour un chargement instantané.
2. **Ratio Produits** : Portrait **4:5** ou **3:4** avec fond neutre ou mise en scène luxueuse.
3. **Résolution** : 1200 × 1500 px pour permettre un zoom net sans ralentir l'affichage mobile.
4. **Nommage** : Utilisez des tirets sans accents ni espaces (ex: `boubou-kankou-moussa-face.webp`, `sac-cabas-bogolan.webp`).

---

## 🔗 Utilisation dans l'Application

Dans vos composants React / Next.js :
```tsx
import Image from 'next/image';

<Image 
  src="/images/logo/logo-gold.svg" 
  alt="Mandé Héritage" 
  width={200} 
  height={50} 
/>
```
