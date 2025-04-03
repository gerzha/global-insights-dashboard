
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

// List of 20 random countries for the country filter
export const countriesList: Country[] = [
  { code: 'US', name: 'United States' },
  { code: 'JP', name: 'Japan' },
  { code: 'BR', name: 'Brazil' },
  { code: 'IN', name: 'India' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'MX', name: 'Mexico' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'CA', name: 'Canada' },
  { code: 'IT', name: 'Italy' },
  { code: 'AR', name: 'Argentina' },
  { code: 'KR', name: 'South Korea' },
  { code: 'RU', name: 'Russia' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'TH', name: 'Thailand' },
  { code: 'EG', name: 'Egypt' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'SE', name: 'Sweden' },
  { code: 'SG', name: 'Singapore' }
];

// Helper function to generate random transactions
const generateTransactions = (count: number): Transaction[] => {
  // Use the countries from our countriesList for consistency
  const countries = countriesList;

  // Updated store list with the requested stores
  const stores: Store[] = [
    { id: 'steam', name: 'Steam' },
    { id: 'flexion', name: 'Flexion' },
    { id: 'apple_ios', name: 'Apple iOS' },
    { id: 'apple_macos', name: 'Apple macOS' },
    { id: 'google', name: 'Google' },
    { id: 'nintendo', name: 'Nintendo' },
  ];

  // Updated products with random IDs
  const products: Product[] = [
    { id: 'prod_1a2b3c4d5e', name: 'Premium Subscription' },
    { id: 'prod_2e3f4g5h6i', name: 'Basic Subscription' },
    { id: 'prod_3i4j5k6l7m', name: 'Digital Download' },
    { id: 'prod_4m5n6o7p8q', name: 'Physical Product A' },
    { id: 'prod_5q6r7s8t9u', name: 'Physical Product B' },
    { id: 'prod_6u7v8w9x0y', name: 'Service Package' },
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
