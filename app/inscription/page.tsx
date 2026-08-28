'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { User, Lock, Mail, Phone, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { BogolanBorder, BogolanDivider } from '@/components/ui/BogolanPattern';

export default function InscriptionPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    if (password !== confirmPassword) {
      setErrorMessage('Les mots de passe ne correspondent pas.');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Le mot de passe doit contenir au moins 6 caractères.');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Erreur lors de la création du compte.');
      }

      // Automatically sign in user
      const loginRes = await signIn('credentials', {
        redirect: false,
        email: email.toLowerCase().trim(),
        password,
      });

      if (loginRes?.ok) {
        router.push('/compte');
        router.refresh();
      } else {
        router.push('/connexion');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Une erreur est survenue.');
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-28 pb-24 min-h-[85vh] flex items-center justify-center bg-mande-ivory px-4">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 border border-mande-ivoryDark shadow-card relative">
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
            Adhésion Maison
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold uppercase tracking-wider text-mande-black mt-1">
            Créer un Compte
          </h1>
          <BogolanDivider variant="gold" className="my-3" />
          <p className="text-xs text-gray-500 font-sans font-light">
            Rejoignez notre clientèle privilégiée et suivez vos acquisitions sur-mesure.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-3 bg-red-50 border border-red-300 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs uppercase tracking-wider font-semibold text-gray-700 font-sans">
              Nom complet *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="Ex: Aïssata Coulibaly"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-mande-ivoryLight border border-mande-sandDark text-xs text-mande-black focus:outline-none focus:border-mande-gold font-sans"
              />
              <User className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs uppercase tracking-wider font-semibold text-gray-700 font-sans">
              Adresse Email *
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
            <label className="text-xs uppercase tracking-wider font-semibold text-gray-700 font-sans">
              Téléphone (facultatif)
            </label>
            <div className="relative">
              <input
                type="tel"
                placeholder="+223 ..."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-mande-ivoryLight border border-mande-sandDark text-xs text-mande-black focus:outline-none focus:border-mande-gold font-sans font-mono"
              />
              <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs uppercase tracking-wider font-semibold text-gray-700 font-sans">
              Mot de passe (min 6 caractères) *
            </label>
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

          <div className="space-y-1">
            <label className="text-xs uppercase tracking-wider font-semibold text-gray-700 font-sans">
              Confirmer le mot de passe *
            </label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              Créer Mon Compte Privé
            </Button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-mande-ivoryDark text-center text-xs text-gray-600 font-sans">
          <span>Vous possédez déjà un compte ? </span>
          <Link href="/connexion" className="text-mande-gold font-bold hover:underline">
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
}
