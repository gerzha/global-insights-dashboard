
import { format, subDays } from 'date-fns';

// Types
export interface Transaction {
  id: string;
  amount: number;
  date: string;
  countryCode: string;
  countryName: string;
  storeId: string;
  storeName: string;
  productId: string;
  productName: string;
}

export interface Country {
  code: string;
  name: string;
}

export interface Store {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
}

// Helper function to generate random transactions
const generateTransactions = (count: number): Transaction[] => {
  const countries: Country[] = [
    { code: 'US', name: 'United States' },
    { code: 'CA', name: 'Canada' },
    { code: 'UK', name: 'United Kingdom' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'JP', name: 'Japan' },
    { code: 'AU', name: 'Australia' },
  ];

  const stores: Store[] = [
    { id: 'store-1', name: 'Online Store' },
    { id: 'store-2', name: 'Mobile App' },
    { id: 'store-3', name: 'Retail Location A' },
    { id: 'store-4', name: 'Retail Location B' },
    { id: 'store-5', name: 'Marketplace' },
  ];

  const products: Product[] = [
    { id: 'product-1', name: 'Premium Subscription' },
    { id: 'product-2', name: 'Basic Subscription' },
    { id: 'product-3', name: 'Digital Download' },
    { id: 'product-4', name: 'Physical Product A' },
    { id: 'product-5', name: 'Physical Product B' },
    { id: 'product-6', name: 'Service Package' },
  ];

  const transactions: Transaction[] = [];

  for (let i = 0; i < count; i++) {
    const country = countries[Math.floor(Math.random() * countries.length)];
    const store = stores[Math.floor(Math.random() * stores.length)];
    const product = products[Math.floor(Math.random() * products.length)];
    
    // Random amount between 10 and 500
    const amount = Math.floor(Math.random() * 490) + 10;
    
    // Random date within the last 30 days
    const daysAgo = Math.floor(Math.random() * 30);
    const date = format(subDays(new Date(), daysAgo), 'yyyy-MM-dd');

    transactions.push({
      id: `trans-${i}`,
      amount,
      date,
      countryCode: country.code,
      countryName: country.name,
      storeId: store.id,
      storeName: store.name,
      productId: product.id,
      productName: product.name,
    });
  }

  return transactions;
};

// Generate 1000 random transactions
export const mockTransactions = generateTransactions(1000);

// Extract unique countries, stores, and products from transactions
export const mockCountries: Country[] = Array.from(
  new Map(
    mockTransactions.map(transaction => [
      transaction.countryCode,
      { code: transaction.countryCode, name: transaction.countryName }
    ])
  ).values()
);

export const mockStores: Store[] = Array.from(
  new Map(
    mockTransactions.map(transaction => [
      transaction.storeId,
      { id: transaction.storeId, name: transaction.storeName }
    ])
  ).values()
);

export const mockProducts: Product[] = Array.from(
  new Map(
    mockTransactions.map(transaction => [
      transaction.productId,
      { id: transaction.productId, name: transaction.productName }
    ])
  ).values()
);
