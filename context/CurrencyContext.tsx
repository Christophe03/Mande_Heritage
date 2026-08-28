'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Currency } from '@/lib/utils';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>('FCFA');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('mande_heritage_currency') as Currency;
      if (saved && (saved === 'FCFA' || saved === 'EUR' || saved === 'USD')) {
        setCurrencyState(saved);
      }
    } catch (e) {
      console.error('Failed to load currency:', e);
    }
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    try {
      localStorage.setItem('mande_heritage_currency', c);
    } catch (e) {
      console.error('Failed to save currency:', e);
    }
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
