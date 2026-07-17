export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: 'INR' | 'USD';
  badge?: string;
  image: string;
  specs?: string[];
  type: 'bot' | 'hotspot' | 'bundle';
}

export interface VMConfig {
  ram: number; // in GB
  cpu: number; // vCPUs
  storage: number; // in GB
  region: string;
  preInstalled: boolean;
}

export interface PaymentSubmission {
  id: string;
  planId: string;
  planName: string;
  amountPaid: number;
  currency: 'INR' | 'USD';
  paymentMethod: 'UPI' | 'Card' | 'Web3';
  utrNo: string; // transaction hash / UTR
  email: string;
  telegramUsername: string;
  deliveryAddress?: string;
  status: 'pending_verification' | 'active' | 'completed';
  createdAt: string;
  hasVM: boolean;
  vmDetails?: VMConfig;
}

export interface AlertNotification {
  id: string;
  type: 'telegram' | 'whatsapp' | 'signal';
  pair: string;
  signalType: 'BUY' | 'SELL';
  price: string;
  indicator: string;
  timestamp: string;
}
