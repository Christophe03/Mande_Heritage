export type PaymentMethod = 
  | 'ORANGE_MONEY' 
  | 'WAVE' 
  | 'MOOV_MONEY' 
  | 'CARD' 
  | 'CASH_ON_DELIVERY';

export interface PaymentInitiateRequest {
  orderId: string;
  orderNumber: string;
  amount: number;
  currency: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  returnUrl: string;
  cancelUrl: string;
}

export interface PaymentInitiateResponse {
  success: boolean;
  transactionId: string;
  paymentUrl?: string; // Redirect URL for hosted payment pages (Wave, Stripe, Orange Money Web)
  qrCodeUrl?: string;
  instructions?: string;
  message?: string;
}

export interface PaymentVerificationResult {
  isSuccessful: boolean;
  transactionId: string;
  orderId: string;
  amountPaid: number;
  currency: string;
  providerReference?: string;
  errorMessage?: string;
}

export interface PaymentProvider {
  id: PaymentMethod;
  name: string;
  description: string;
  iconName: string;
  isAvailable: (country?: string) => boolean;
  initiatePayment: (request: PaymentInitiateRequest) => Promise<PaymentInitiateResponse>;
  verifyPayment: (transactionId: string, payload?: any) => Promise<PaymentVerificationResult>;
}
