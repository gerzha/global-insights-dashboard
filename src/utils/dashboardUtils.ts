
import { Transaction, Country, Store, Product } from "@/data/mockData";
import { format, parseISO, isAfter, isBefore, subDays } from "date-fns";

export function calculateGlobalStats(
  transactions: Transaction[],
  dateRange: [Date, Date],
  selectedCountries: string[] = [],
  selectedStores: string[] = []
) {
  // Filter transactions by date range
  let filteredTransactions = transactions.filter((transaction) => {
    const transactionDate = parseISO(transaction.date);
    return (
      isAfter(transactionDate, dateRange[0]) &&
      isBefore(transactionDate, dateRange[1])
    );
  });

  // Filter by selected countries if any
  if (selectedCountries.length > 0) {
    filteredTransactions = filteredTransactions.filter((transaction) =>
      selectedCountries.includes(transaction.countryCode)
    );
  }

  // Filter by selected stores if any
  if (selectedStores.length > 0) {
    filteredTransactions = filteredTransactions.filter((transaction) =>
      selectedStores.includes(transaction.storeId)
    );
  }

  // Calculate total metrics
  const totalTransactions = filteredTransactions.length;
  const totalAmount = filteredTransactions.reduce(
    (sum, transaction) => sum + transaction.amount,
    0
  );
  const avgAmount = totalTransactions > 0 ? totalAmount / totalTransactions : 0;

  // Calculate top countries by amount
  const countryTotals = filteredTransactions.reduce((acc, transaction) => {
    acc[transaction.countryCode] = (acc[transaction.countryCode] || 0) + transaction.amount;
    return acc;
  }, {} as Record<string, number>);

  const topCountriesByAmount = Object.entries(countryTotals)
    .map(([code, amount]) => {
      const country = transactions.find(t => t.countryCode === code);
      return {
        code,
        name: country?.countryName || code,
        amount
      };
    })
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 3);

  // Calculate top countries by transaction count
  const countryTransactionCounts = filteredTransactions.reduce((acc, transaction) => {
    acc[transaction.countryCode] = (acc[transaction.countryCode] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topCountriesByTransactions = Object.entries(countryTransactionCounts)
    .map(([code, count]) => {
      const country = transactions.find(t => t.countryCode === code);
      return {
        code,
        name: country?.countryName || code,
        count
      };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  return {
    totalTransactions,
    totalAmount,
    avgAmount,
    topCountriesByAmount,
    topCountriesByTransactions
  };
}

export function calculateProductStats(
  transactions: Transaction[],
  dateRange: [Date, Date],
  selectedProductIds: string[] = [],
  selectedCountries: string[] = [],
  selectedStores: string[] = []
) {
  // Filter transactions by date range
  let filteredTransactions = transactions.filter((transaction) => {
    const transactionDate = parseISO(transaction.date);
    return (
      isAfter(transactionDate, dateRange[0]) &&
      isBefore(transactionDate, dateRange[1])
    );
  });

  // Filter by selected products
  if (selectedProductIds.length > 0) {
    filteredTransactions = filteredTransactions.filter((transaction) =>
      selectedProductIds.includes(transaction.productId)
    );
  }

  // Filter by selected countries if any
  if (selectedCountries.length > 0) {
    filteredTransactions = filteredTransactions.filter((transaction) =>
      selectedCountries.includes(transaction.countryCode)
    );
  }

  // Filter by selected stores if any
  if (selectedStores.length > 0) {
    filteredTransactions = filteredTransactions.filter((transaction) =>
      selectedStores.includes(transaction.storeId)
    );
  }

  // Get unique dates in the range
  const dateMap = new Map<string, number>();
  
  // Initialize all dates in range with 0
  const startDate = new Date(dateRange[0]);
  const endDate = new Date(dateRange[1]);
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    dateMap.set(format(currentDate, 'yyyy-MM-dd'), 0);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  // Sum amounts by date
  filteredTransactions.forEach(transaction => {
    const currentAmount = dateMap.get(transaction.date) || 0;
    dateMap.set(transaction.date, currentAmount + transaction.amount);
  });
  
  // Convert to array for chart
  const revenueByDay = Array.from(dateMap.entries())
    .map(([date, amount]) => ({
      date,
      revenue: amount
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
  
  return revenueByDay;
}

export function getDefaultDateRange(): [Date, Date] {
  const endDate = new Date();
  const startDate = subDays(endDate, 30);
  
  return [startDate, endDate];
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

export function getTierText(amount: number): string {
  if (amount >= 1000000) return 'Enterprise';
  if (amount >= 100000) return 'High Value';
  if (amount >= 10000) return 'Medium Value';
  return 'Standard';
}
