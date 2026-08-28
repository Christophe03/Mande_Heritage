'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string; // unique combo: productId-size-color
  productId: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
  maxStock: number;
}

export interface AppliedPromo {
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  value: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  totalItems: number;
  subtotal: number;
  discountAmount: number;
  total: number;
  appliedPromo: AppliedPromo | null;
  applyPromoCode: (code: string) => Promise<{ success: boolean; message: string }>;
  removePromoCode: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState<AppliedPromo | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('mande_heritage_cart');
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
      const savedPromo = localStorage.getItem('mande_heritage_promo');
      if (savedPromo) {
        setAppliedPromo(JSON.parse(savedPromo));
      }
    } catch (e) {
      console.error('Failed to load cart from localStorage:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('mande_heritage_cart', JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage:', e);
    }
  }, [items, isLoaded]);

  // Save promo to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      if (appliedPromo) {
        localStorage.setItem('mande_heritage_promo', JSON.stringify(appliedPromo));
      } else {
        localStorage.removeItem('mande_heritage_promo');
      }
    } catch (e) {
      console.error('Failed to save promo to localStorage:', e);
    }
  }, [appliedPromo, isLoaded]);

  const addItem = (newItem: Omit<CartItem, 'id'>) => {
    const id = `${newItem.productId}-${newItem.size || 'default'}-${newItem.color || 'default'}`;
    
    setItems((prevItems) => {
      const existing = prevItems.find((item) => item.id === id);
      if (existing) {
        const updatedQty = Math.min(existing.quantity + newItem.quantity, newItem.maxStock || 99);
        return prevItems.map((item) =>
          item.id === id ? { ...item, quantity: updatedQty } : item
        );
      }
      return [...prevItems, { ...newItem, id }];
    });

    setIsCartOpen(true);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const validQty = Math.min(quantity, item.maxStock || 99);
          return { ...item, quantity: validQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedPromo(null);
    localStorage.removeItem('mande_heritage_cart');
    localStorage.removeItem('mande_heritage_promo');
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  let discountAmount = 0;
  if (appliedPromo) {
    if (appliedPromo.discountType === 'PERCENTAGE') {
      discountAmount = (subtotal * appliedPromo.value) / 100;
    } else {
      discountAmount = Math.min(appliedPromo.value, subtotal);
    }
  }

  const total = Math.max(0, subtotal - discountAmount);

  const applyPromoCode = async (code: string): Promise<{ success: boolean; message: string }> => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) {
      return { success: false, message: 'Veuillez saisir un code promotionnel.' };
    }

    try {
      const res = await fetch(`/api/promo?code=${encodeURIComponent(trimmed)}`);
      const data = await res.json();

      if (data.valid) {
        if (data.promo.minOrderAmount && subtotal < data.promo.minOrderAmount) {
          return {
            success: false,
            message: `Ce code nécessite un panier minimum de ${data.promo.minOrderAmount.toLocaleString()} FCFA.`,
          };
        }
        setAppliedPromo({
          code: data.promo.code,
          discountType: data.promo.discountType,
          value: data.promo.value,
        });
        return { success: true, message: `Code ${data.promo.code} appliqué avec succès !` };
      } else {
        return { success: false, message: data.message || 'Code promotionnel invalide ou expiré.' };
      }
    } catch (e) {
      // Fallback local promo validation
      if (trimmed === 'MANDE10') {
        setAppliedPromo({ code: 'MANDE10', discountType: 'PERCENTAGE', value: 10 });
        return { success: true, message: 'Code MANDE10 appliqué (-10%) !' };
      } else if (trimmed === 'ROYAL20') {
        setAppliedPromo({ code: 'ROYAL20', discountType: 'PERCENTAGE', value: 20 });
        return { success: true, message: 'Code ROYAL20 appliqué (-20%) !' };
      }
      return { success: false, message: 'Code promotionnel invalide.' };
    }
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        totalItems,
        subtotal,
        discountAmount,
        total,
        appliedPromo,
        applyPromoCode,
        removePromoCode,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
