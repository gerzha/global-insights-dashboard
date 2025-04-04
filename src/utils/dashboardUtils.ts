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

export function calculateCountryStats(
  transactions: Transaction[],
  dateRange: [Date, Date],
  selectedCountries: string[] = []
) {
  if (!selectedCountries.length) return null;

  // Filter transactions by date range
  let filteredTransactions = transactions.filter((transaction) => {
    const transactionDate = parseISO(transaction.date);
    return (
      isAfter(transactionDate, dateRange[0]) &&
      isBefore(transactionDate, dateRange[1])
    );
  });

  // Filter by selected countries
  filteredTransactions = filteredTransactions.filter((transaction) =>
    selectedCountries.includes(transaction.countryCode)
  );

  // Calculate total metrics
  const totalTransactions = filteredTransactions.length;
  const totalAmount = filteredTransactions.reduce(
    (sum, transaction) => sum + transaction.amount,
    0
  );
  const avgAmount = totalTransactions > 0 ? totalAmount / totalTransactions : 0;

  return {
    totalTransactions,
    totalAmount,
    avgAmount
  };
}

export function calculateStoreStats(
  transactions: Transaction[],
  dateRange: [Date, Date],
  selectedStores: string[] = []
) {
  if (!selectedStores.length) return null;

  // Filter transactions by date range
  let filteredTransactions = transactions.filter((transaction) => {
    const transactionDate = parseISO(transaction.date);
    return (
      isAfter(transactionDate, dateRange[0]) &&
      isBefore(transactionDate, dateRange[1])
    );
  });

  // Filter by selected stores
  filteredTransactions = filteredTransactions.filter((transaction) =>
    selectedStores.includes(transaction.storeId)
  );

  // Calculate total metrics
  const totalTransactions = filteredTransactions.length;
  const totalAmount = filteredTransactions.reduce(
    (sum, transaction) => sum + transaction.amount,
    0
  );
  const avgAmount = totalTransactions > 0 ? totalAmount / totalTransactions : 0;

  return {
    totalTransactions,
    totalAmount,
    avgAmount
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

export function calculateComparisonStats(
  transactions: Transaction[],
  dateRange: [Date, Date],
  comparisonType: "products" | "countries" | "stores",
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

  // Apply filters based on selections
  if (selectedProductIds.length > 0) {
    filteredTransactions = filteredTransactions.filter((transaction) =>
      selectedProductIds.includes(transaction.productId)
    );
  }

  if (selectedCountries.length > 0) {
    filteredTransactions = filteredTransactions.filter((transaction) =>
      selectedCountries.includes(transaction.countryCode)
    );
  }

  if (selectedStores.length > 0) {
    filteredTransactions = filteredTransactions.filter((transaction) =>
      selectedStores.includes(transaction.storeId)
    );
  }

  // Get unique dates in the range
  const startDate = new Date(dateRange[0]);
  const endDate = new Date(dateRange[1]);
  const currentDate = new Date(startDate);
  const allDates: string[] = [];
  
  while (currentDate <= endDate) {
    allDates.push(format(currentDate, 'yyyy-MM-dd'));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Determine which entities to track based on comparison type
  let comparisonData: any[] = [];

  if (comparisonType === "products") {
    // Group transactions by product
    const productTransactions = new Map<string, Map<string, number>>();
    
    filteredTransactions.forEach(transaction => {
      if (!productTransactions.has(transaction.productId)) {
        productTransactions.set(transaction.productId, new Map<string, number>());
      }
      
      const productMap = productTransactions.get(transaction.productId)!;
      const currentAmount = productMap.get(transaction.date) || 0;
      productMap.set(transaction.date, currentAmount + transaction.amount);
    });
    
    // Create data points for each product and date
    productTransactions.forEach((dateMap, productId) => {
      const product = transactions.find(t => t.productId === productId);
      const productName = product?.productName || productId;
      
      allDates.forEach(date => {
        comparisonData.push({
          date,
          id: productId,
          name: productName,
          value: dateMap.get(date) || 0
        });
      });
    });
  } 
  else if (comparisonType === "countries") {
    // Group transactions by country
    const countryTransactions = new Map<string, Map<string, number>>();
    
    filteredTransactions.forEach(transaction => {
      if (!countryTransactions.has(transaction.countryCode)) {
        countryTransactions.set(transaction.countryCode, new Map<string, number>());
      }
      
      const countryMap = countryTransactions.get(transaction.countryCode)!;
      const currentAmount = countryMap.get(transaction.date) || 0;
      countryMap.set(transaction.date, currentAmount + transaction.amount);
    });
    
    // Create data points for each country and date
    countryTransactions.forEach((dateMap, countryCode) => {
      const country = transactions.find(t => t.countryCode === countryCode);
      const countryName = country?.countryName || countryCode;
      
      allDates.forEach(date => {
        comparisonData.push({
          date,
          id: countryCode,
          name: countryName,
          value: dateMap.get(date) || 0
        });
      });
    });
  } 
  else if (comparisonType === "stores") {
    // Group transactions by store
    const storeTransactions = new Map<string, Map<string, number>>();
    
    filteredTransactions.forEach(transaction => {
      if (!storeTransactions.has(transaction.storeId)) {
        storeTransactions.set(transaction.storeId, new Map<string, number>());
      }
      
      const storeMap = storeTransactions.get(transaction.storeId)!;
      const currentAmount = storeMap.get(transaction.date) || 0;
      storeMap.set(transaction.date, currentAmount + transaction.amount);
    });
    
    // Create data points for each store and date
    storeTransactions.forEach((dateMap, storeId) => {
      const store = transactions.find(t => t.storeId === storeId);
      const storeName = store?.storeName || storeId;
      
      allDates.forEach(date => {
        comparisonData.push({
          date,
          id: storeId,
          name: storeName,
          value: dateMap.get(date) || 0
        });
      });
    });
  }
  
  return comparisonData;
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
