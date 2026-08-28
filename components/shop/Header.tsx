'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  ShoppingBag, 
  Search, 
  User, 
  Menu, 
  X, 
  Heart, 
  ChevronDown,
  Globe
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCurrency } from '@/context/CurrencyContext';
import { useSession, signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { CartDrawer } from './CartDrawer';
import { SearchModal } from './SearchModal';

const NAV_LINKS = [
  { name: 'Accueil', href: '/' },
  { name: 'Boutique', href: '/boutique' },
  { name: 'Collections', href: '/collections' },
  { name: 'L’Art du Bôkôlan', href: '/bokolan' },
  { name: 'Symboles', href: '/symboles' },
  { name: 'Rendez-vous VIP', href: '/rendez-vous' },
  { name: 'Le Journal', href: '/journal' },
];

export function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);

  const { totalItems, setIsCartOpen } = useCart();
  const { totalWishlist } = useWishlist();
  const { currency, setCurrency } = useCurrency();
  const { data: session } = useSession();

  const isHomePage = pathname === '/';
  const isAdminPage = pathname.startsWith('/admin');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    setCurrencyDropdownOpen(false);
  }, [pathname]);

  // If we are on admin page, render nothing
  if (isAdminPage) return null;

  const headerBgClass = isHomePage
    ? isScrolled
      ? 'bg-mande-ivory/95 backdrop-blur-md text-mande-black shadow-md border-b border-mande-gold/20'
      : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent text-white'
    : 'bg-mande-ivory text-mande-black shadow-sm border-b border-mande-ivoryDark';

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
          headerBgClass
        )}
      >
        {/* Top Announcement Bar */}
        <div className="bg-mande-black text-mande-ivory text-[11px] py-2 px-4 border-b border-mande-gold/20 font-sans tracking-widest uppercase">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="hidden sm:flex items-center gap-2 text-mande-gold">
              <span className="inline-block w-1.5 h-1.5 bg-mande-gold rounded-full animate-ping" />
              <span>Maison de Haute Couture Mandingue</span>
            </div>
            <span className="mx-auto sm:mx-0 text-center font-medium">
              Livraison offerte au Mali dès 100 000 FCFA &bull; Expédition mondiale
            </span>
            <div className="hidden md:flex items-center gap-3">
              <Link href="/livraison" className="hover:text-mande-gold transition-colors">
                Délais & Tarifs
              </Link>
            </div>
          </div>
        </div>

        {/* Main Navigation Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Mobile Hamburger Button */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 -ml-2 text-current hover:text-mande-gold transition-colors focus:outline-none"
                aria-label="Ouvrir le menu de navigation"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="group flex items-center gap-3 text-left">
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0">
                  <Image
                    src="/images/logo/logo.png"
                    alt="Mandé Héritage Logo"
                    fill
                    priority
                    className="object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-serif text-base sm:text-lg lg:text-xl font-bold tracking-[0.16em] uppercase group-hover:text-mande-gold transition-colors duration-300">
                    MANDÉ HÉRITAGE
                  </span>
                  <span className="text-[8px] sm:text-[9px] tracking-[0.25em] uppercase text-mande-gold -mt-0.5 font-sans font-semibold">
                    Élégance en Bôkôlan
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-7">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={cn(
                      'text-xs tracking-[0.16em] uppercase font-sans transition-all duration-200 relative py-1 hover:text-mande-gold',
                      isActive ? 'text-mande-gold font-semibold' : 'text-current opacity-90'
                    )}
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-mande-gold" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Icons */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              {/* Currency Selector Dropdown */}
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                  className="flex items-center gap-1 text-xs tracking-wider font-mono py-1 px-2 border border-current/20 hover:border-mande-gold transition-colors"
                  aria-label="Sélectionner la devise"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>{currency}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>

                {currencyDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-28 bg-mande-dark border border-mande-gold/30 shadow-2xl py-1 z-50 text-xs font-sans text-mande-ivory">
                    {(['FCFA', 'EUR', 'USD'] as const).map((curr) => (
                      <button
                        key={curr}
                        onClick={() => {
                          setCurrency(curr);
                          setCurrencyDropdownOpen(false);
                        }}
                        className={cn(
                          'w-full text-left px-3 py-1.5 hover:bg-mande-gold/20 transition-colors flex items-center justify-between',
                          currency === curr ? 'text-mande-gold font-bold bg-mande-gold/10' : ''
                        )}
                      >
                        <span>{curr}</span>
                        {currency === curr && <span>✓</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Search Modal Trigger */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 hover:text-mande-gold transition-colors"
                aria-label="Recherche sur le site"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist Link */}
              <Link
                href="/favoris"
                className="p-2 hover:text-mande-gold transition-colors relative flex items-center"
                aria-label="Vos favoris"
              >
                <Heart className={`w-5 h-5 ${totalWishlist > 0 ? 'text-red-500 fill-red-500' : ''}`} />
                {totalWishlist > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-mande-gold text-mande-black text-[10px] font-extrabold flex items-center justify-center rounded-full shadow-sm">
                    {totalWishlist}
                  </span>
                )}
              </Link>

              {/* Account / User Menu */}
              <div className="relative">
                {session ? (
                  <div>
                    <button
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="p-2 hover:text-mande-gold transition-colors flex items-center gap-1"
                      aria-label="Menu du compte"
                    >
                      <User className="w-5 h-5" />
                      <span className="hidden md:inline text-xs font-sans font-medium max-w-[90px] truncate">
                        {session.user?.name?.split(' ')[0]}
                      </span>
                    </button>

                    {userDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-mande-dark border border-mande-gold/30 shadow-2xl py-2 z-50 text-xs font-sans text-mande-ivory">
                        <div className="px-4 py-2 border-b border-mande-surface text-gray-300">
                          <p className="font-semibold text-mande-ivory">{session.user?.name}</p>
                          <p className="text-[10px] text-mande-gold font-mono">{session.user?.email}</p>
                        </div>
                        {(session.user as any)?.role === 'ADMIN' && (
                          <Link
                            href="/admin"
                            className="block px-4 py-2 hover:bg-mande-gold/20 text-mande-gold font-bold"
                          >
                            Tableau de Bord Admin
                          </Link>
                        )}
                        <Link
                          href="/compte"
                          className="block px-4 py-2 hover:bg-mande-gold/20 text-mande-ivory"
                        >
                          Mon Espace Client
                        </Link>
                        <Link
                          href="/compte/commandes"
                          className="block px-4 py-2 hover:bg-mande-gold/20 text-mande-ivory"
                        >
                          Mes Commandes
                        </Link>
                        <button
                          onClick={() => signOut({ callbackUrl: '/' })}
                          className="w-full text-left px-4 py-2 hover:bg-red-500/20 text-red-400 mt-1 border-t border-mande-surface"
                        >
                          Déconnexion
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href="/connexion"
                    className="p-2 hover:text-mande-gold transition-colors"
                    aria-label="Se connecter"
                  >
                    <User className="w-5 h-5" />
                  </Link>
                )}
              </div>

              {/* Cart Drawer Trigger */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="p-2 hover:text-mande-gold transition-colors relative flex items-center"
                aria-label="Panier d’achat"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-gradient-to-r from-mande-gold to-mande-goldDark text-mande-black text-[10px] font-extrabold flex items-center justify-center rounded-full shadow-sm">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-mande-black text-mande-ivory border-b border-mande-gold/30 px-6 py-8 shadow-2xl animate-fadeIn">
            {/* Mobile Drawer Brand Logo */}
            <div className="flex items-center justify-center mb-6 pb-4 border-b border-mande-surface">
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3">
                <div className="relative w-12 h-12">
                  <Image
                    src="/images/logo/logo.png"
                    alt="Mandé Héritage"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-serif text-lg font-bold tracking-[0.16em] uppercase text-mande-ivory">
                    MANDÉ HÉRITAGE
                  </span>
                  <span className="text-[8px] tracking-[0.25em] uppercase text-mande-gold -mt-0.5 font-sans font-semibold">
                    Élégance en Bôkôlan
                  </span>
                </div>
              </Link>
            </div>

            <nav className="flex flex-col space-y-5">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-base tracking-[0.18em] uppercase font-serif hover:text-mande-gold transition-colors pb-2 border-b border-mande-surface flex items-center justify-between"
                >
                  <span>{link.name}</span>
                  <span className="text-mande-gold text-xs">→</span>
                </Link>
              ))}

              <div className="pt-4 flex items-center justify-between text-xs text-mande-sand">
                <span>Devise d’affichage :</span>
                <div className="flex gap-2">
                  {(['FCFA', 'EUR', 'USD'] as const).map((curr) => (
                    <button
                      key={curr}
                      onClick={() => setCurrency(curr)}
                      className={cn(
                        'px-2.5 py-1 text-xs border',
                        currency === curr
                          ? 'border-mande-gold text-mande-gold font-bold bg-mande-gold/10'
                          : 'border-mande-surface text-gray-400'
                      )}
                    >
                      {curr}
                    </button>
                  ))}
                </div>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Cart Drawer & Search Modal */}
      <CartDrawer />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
