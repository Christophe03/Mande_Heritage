import { PaymentMethod, PaymentProvider } from './types';
import { OrangeMoneyProvider, WaveProvider, CardPaymentProvider, CashOnDeliveryProvider } from './providers';

class PaymentRegistry {
  private providers: Map<PaymentMethod, PaymentProvider> = new Map();

  constructor() {
    this.register(new OrangeMoneyProvider());
    this.register(new WaveProvider());
    this.register(new CardPaymentProvider());
    this.register(new CashOnDeliveryProvider());
  }

  register(provider: PaymentProvider) {
    this.providers.set(provider.id, provider);
  }

  get(id: PaymentMethod): PaymentProvider | undefined {
    return this.providers.get(id);
  }

  getAll(): PaymentProvider[] {
    return Array.from(this.providers.values());
  }

  getAvailableForCountry(country?: string): PaymentProvider[] {
    return this.getAll().filter((p) => p.isAvailable(country));
  }
}

export const paymentRegistry = new PaymentRegistry();
export * from './types';
export * from './providers';
