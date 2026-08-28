'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Lock, Mail, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { BogolanBorder, BogolanDivider } from '@/components/ui/BogolanPattern';

function ConnexionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/compte';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email: email.toLowerCase().trim(),
        password,
      });

      if (res?.error) {
        setErrorMessage('Email ou mot de passe incorrect.');
        setIsLoading(false);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      setErrorMessage('Une erreur est survenue lors de la connexion.');
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-white p-8 sm:p-10 border border-mande-ivoryDark shadow-card relative">
      {/* Header */}
      <div className="text-center mb-8 flex flex-col items-center">
        <Link href="/" className="mb-4">
          <div className="relative w-20 h-20">
            <Image
              src="/images/logo/logo.png"
              alt="Mandé Héritage"
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>
        <span className="text-[10px] uppercase tracking-[0.25em] text-mande-gold font-sans font-bold">
          Espace Privé
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold uppercase tracking-wider text-mande-black mt-1">
          Se Connecter
        </h1>
        <BogolanDivider variant="gold" className="my-3" />
        <p className="text-xs text-gray-500 font-sans font-light">
          Accédez à vos commandes, vos créations favorites et vos privilèges de maison.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-3 bg-red-50 border border-red-300 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Demo Accounts Quick Login Alert */}
      <div className="mb-6 p-3 bg-mande-ivoryLight border border-mande-gold/30 text-[11px] text-gray-600 font-sans space-y-1">
        <p className="font-bold text-mande-black">Comptes de Démonstration :</p>
        <p>&bull; <strong>Admin :</strong> admin@mandeheritage.com / AdminMande2026!</p>
        <p>&bull; <strong>Client :</strong> client@mandeheritage.com / ClientMande2026!</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs uppercase tracking-wider font-semibold text-gray-700 font-sans">
            Email
          </label>
          <div className="relative">
            <input
              type="email"
              required
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-mande-ivoryLight border border-mande-sandDark text-xs text-mande-black focus:outline-none focus:border-mande-gold font-sans"
            />
            <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label className="text-xs uppercase tracking-wider font-semibold text-gray-700 font-sans">
              Mot de Passe
            </label>
          </div>
          <div className="relative">
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-mande-ivoryLight border border-mande-sandDark text-xs text-mande-black focus:outline-none focus:border-mande-gold font-sans"
            />
            <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
          </div>
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            variant="gold"
            size="lg"
            isLoading={isLoading}
            className="w-full shadow-gold-sm"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Accéder à Mon Compte
          </Button>
        </div>
      </form>

      <div className="mt-8 pt-6 border-t border-mande-ivoryDark text-center text-xs text-gray-600 font-sans">
        <span>Vous n’avez pas encore de compte ? </span>
        <Link href="/inscription" className="text-mande-gold font-bold hover:underline">
          Créer un compte client
        </Link>
      </div>
    </div>
  );
}

export default function ConnexionPage() {
  return (
    <div className="pt-28 pb-24 min-h-[85vh] flex items-center justify-center bg-mande-ivory px-4">
      <Suspense fallback={<div className="p-8 text-center text-xs text-gray-500">Chargement...</div>}>
        <ConnexionForm />
      </Suspense>
    </div>
  );
}
