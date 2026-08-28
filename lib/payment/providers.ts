import { PaymentProvider, PaymentInitiateRequest, PaymentInitiateResponse, PaymentVerificationResult } from './types';

export class OrangeMoneyProvider implements PaymentProvider {
  id = 'ORANGE_MONEY' as const;
  name = 'Orange Money';
  description = 'Payez instantanément avec votre compte Orange Money (Mali, Sénégal, Côte d’Ivoire, etc.)';
  iconName = 'Smartphone';

  isAvailable(country?: string): boolean {
    const supportedCountries = ['Mali', 'Sénégal', 'Senegal', 'Côte d’Ivoire', 'Cote d’Ivoire', 'Burkina Faso', 'Guinée'];
    if (!country) return true;
    return supportedCountries.some(c => country.toLowerCase().includes(c.toLowerCase()));
  }

  async initiatePayment(request: PaymentInitiateRequest): Promise<PaymentInitiateResponse> {
    // In production, invoke Orange Money Web Payment API / OM Mali API
    const txId = `OM-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    
    return {
      success: true,
      transactionId: txId,
      instructions: `Composez le #144# ou validez le paiement depuis votre application Orange Money pour le numéro ${request.customerPhone || 'associé'}.`,
      message: `Paiement Orange Money initié pour un montant de ${request.amount} ${request.currency}.`,
    };
  }

  async verifyPayment(transactionId: string): Promise<PaymentVerificationResult> {
    return {
      isSuccessful: true,
      transactionId,
      orderId: '',
      amountPaid: 0,
      currency: 'FCFA',
      providerReference: `OM-REF-${Date.now()}`,
    };
  }
}

export class WaveProvider implements PaymentProvider {
  id = 'WAVE' as const;
  name = 'Wave';
  description = 'Paiement sans frais via l’application Wave avec scan QR Code ou lien direct';
  iconName = 'QrCode';

  isAvailable(country?: string): boolean {
    const supportedCountries = ['Mali', 'Sénégal', 'Senegal', 'Côte d’Ivoire', 'Cote d’Ivoire', 'Burkina Faso'];
    if (!country) return true;
    return supportedCountries.some(c => country.toLowerCase().includes(c.toLowerCase()));
  }

  async initiatePayment(request: PaymentInitiateRequest): Promise<PaymentInitiateResponse> {
    const txId = `WAVE-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    return {
      success: true,
      transactionId: txId,
      instructions: 'Ouvrez votre application Wave pour scanner le code ou autoriser le débit direct sans frais.',
      message: `Paiement Wave initié pour la commande ${request.orderNumber}.`,
    };
  }

  async verifyPayment(transactionId: string): Promise<PaymentVerificationResult> {
    return {
      isSuccessful: true,
      transactionId,
      orderId: '',
      amountPaid: 0,
      currency: 'FCFA',
      providerReference: `WAVE-REF-${Date.now()}`,
    };
  }
}

export class CardPaymentProvider implements PaymentProvider {
  id = 'CARD' as const;
  name = 'Carte Bancaire / Visa & Mastercard';
  description = 'Paiement sécurisé par carte bancaire internationale (Visa, Mastercard, American Express)';
  iconName = 'CreditCard';

  isAvailable(): boolean {
    return true; // Available worldwide
  }

  async initiatePayment(request: PaymentInitiateRequest): Promise<PaymentInitiateResponse> {
    const txId = `CARD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    return {
      success: true,
      transactionId: txId,
      instructions: 'Transaction sécurisée par protocole 3D-Secure 256 bits.',
      message: `Paiement CB accepté pour ${request.amount} ${request.currency}.`,
    };
  }

  async verifyPayment(transactionId: string): Promise<PaymentVerificationResult> {
    return {
      isSuccessful: true,
      transactionId,
      orderId: '',
      amountPaid: 0,
      currency: 'FCFA',
      providerReference: `STRIPE-PAY-${Date.now()}`,
    };
  }
}

export class CashOnDeliveryProvider implements PaymentProvider {
  id = 'CASH_ON_DELIVERY' as const;
  name = 'Paiement à la Livraison';
  description = 'Réglez en espèces ou par Mobile Money directement auprès du coursier à la réception (Bamako)';
  iconName = 'Banknote';

  isAvailable(country?: string): boolean {
    if (!country) return true;
    return country.toLowerCase().includes('mali') || country.toLowerCase().includes('bamako');
  }

  async initiatePayment(request: PaymentInitiateRequest): Promise<PaymentInitiateResponse> {
    const txId = `COD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    return {
      success: true,
      transactionId: txId,
      instructions: 'Préparez l’appoint en espèces ou votre téléphone lors du passage du coursier Mandé Héritage.',
      message: `Votre commande ${request.orderNumber} sera réglée à la livraison.`,
    };
  }

  async verifyPayment(transactionId: string): Promise<PaymentVerificationResult> {
    return {
      isSuccessful: true,
      transactionId,
      orderId: '',
      amountPaid: 0,
      currency: 'FCFA',
    };
  }
}
