
import React, { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app/AppSidebar";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { StatCard } from "@/components/dashboard/StatCard";
import { SelectionFilter, Option } from "@/components/dashboard/SelectionFilter";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { TopItemsList } from "@/components/dashboard/TopItemsList";
import { FilteredStats } from "@/components/dashboard/FilteredStats";
import { ComparisonChart } from "@/components/dashboard/ComparisonChart";
import { Users, DollarSign, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { 
  mockTransactions, 
  countriesList,
  mockProducts,
  mockStores 
} from "@/data/mockData";
import { 
  calculateGlobalStats, 
  calculateProductStats,
  calculateCountryStats,
  calculateStoreStats,
  calculateComparisonStats,
  formatCurrency, 
  getTierText 
} from "@/utils/dashboardUtils";

// Define store options based on mockStores data for consistency
const storeOptions: Option[] = mockStores ? mockStores.map(store => ({
  value: store.id,
  label: store.name
})) : [];

// Define product options based on mockProducts data for consistency
const productOptions: Option[] = mockProducts ? mockProducts.map(product => ({
  value: product.id,
  label: product.name
})) : [];

// Convert the countries list to options format
const countryOptions: Option[] = countriesList ? countriesList.map(country => ({
  value: country.code,
  label: country.name
})) : [];

const Dashboard = () => {
  // Date range state
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date;
  });
  const [endDate, setEndDate] = useState(new Date());

  // Filter states
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedStores, setSelectedStores] = useState<string[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [comparisonType, setComparisonType] = useState<"products" | "countries" | "stores">("products");

  // Data states
  const [globalStats, setGlobalStats] = useState<any>(null);
  const [countriesStats, setCountriesStats] = useState<any>(null);
  const [storesStats, setStoresStats] = useState<any>(null);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [comparisonData, setComparisonData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Format dates for API calls
  const formatDateForApi = (date: Date) => format(date, "yyyy-MM-dd");

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Update global stats when date range changes
  useEffect(() => {
    const formattedStartDate = formatDateForApi(startDate);
    const formattedEndDate = formatDateForApi(endDate);
    
    // Calculate global stats from mock data
    const stats = calculateGlobalStats(
      mockTransactions || [],
      [startDate, endDate],
      selectedCountries,
      selectedStores
    );
    setGlobalStats(stats);
  }, [startDate, endDate, selectedCountries, selectedStores]);

  // Update country stats when selected countries or date range changes
  useEffect(() => {
    const countryStats = calculateCountryStats(
      mockTransactions || [],
      [startDate, endDate],
      selectedCountries
    );
    setCountriesStats(countryStats);
  }, [selectedCountries, startDate, endDate]);

  // Update store stats when selected stores or date range changes
  useEffect(() => {
    const storeStats = calculateStoreStats(
      mockTransactions || [],
      [startDate, endDate],
      selectedStores
    );
    setStoresStats(storeStats);
  }, [selectedStores, startDate, endDate]);

  // Update revenue data when selected products, countries, stores, or date range changes
  useEffect(() => {
    const data = calculateProductStats(
      mockTransactions || [],
      [startDate, endDate],
      selectedProducts.length > 0 ? selectedProducts : undefined,
      selectedCountries.length > 0 ? selectedCountries : undefined,
      selectedStores.length > 0 ? selectedStores : undefined
    );
    
    setRevenueData(data);
  }, [selectedProducts, selectedCountries, selectedStores, startDate, endDate]);

  // Update comparison data based on comparison type and filters
  useEffect(() => {
    // For products comparison, use selected products if any, otherwise show all
    // For countries comparison, use selected countries if any, otherwise show all
    // For stores comparison, use selected stores if any, otherwise show all
    let productsFilter = selectedProducts.length > 0 ? selectedProducts : undefined;
    let countriesFilter = selectedCountries.length > 0 ? selectedCountries : undefined;
    let storesFilter = selectedStores.length > 0 ? selectedStores : undefined;
    
    const comparisonData = calculateComparisonStats(
      mockTransactions || [],
      [startDate, endDate],
      comparisonType,
      productsFilter,
      countriesFilter,
      storesFilter
    );
    
    setComparisonData(comparisonData);
  }, [comparisonType, selectedProducts, selectedCountries, selectedStores, startDate, endDate]);

  const handleDateChange = (range: { from: Date; to: Date }) => {
    setStartDate(range.from);
    setEndDate(range.to);
  };

  const handleComparisonTypeChange = (type: "products" | "countries" | "stores") => {
    setComparisonType(type);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700">Loading dashboard data...</h2>
          <p className="text-gray-500 mt-2">Please wait while we prepare your insights</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white shadow-sm border-b border-gray-200 h-14 flex items-center px-4 sticky top-0 z-10">
            <SidebarTrigger />
            <div className="ml-4">
              <h1 className="text-xl font-semibold text-jira-gray-dark">Insights Dashboard</h1>
            </div>
          </header>
          
          <main className="flex-1 overflow-auto p-4 lg:p-6">
            <div className="container max-w-7xl mx-auto">
              <FilterBar 
                startDate={startDate} 
                endDate={endDate} 
                onDateChange={handleDateChange}
                comparisonType={comparisonType}
                onComparisonTypeChange={handleComparisonTypeChange}
                className="mb-6"
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <StatCard
                  title="Total Transactions"
                  value={globalStats?.totalTransactions.toLocaleString() || "0"}
                  icon={Users}
                  variant="primary"
                />
                <StatCard
                  title="Total Amount"
                  value={formatCurrency(globalStats?.totalAmount || 0)}
                  subtext={getTierText(globalStats?.totalAmount || 0)}
                  icon={DollarSign}
                  variant="success"
                />
                <StatCard
                  title="Average Transaction"
                  value={formatCurrency(globalStats?.avgAmount || 0)}
                  subtext={`${getTierText(globalStats?.avgAmount || 0)} (in USD)`}
                  icon={TrendingUp}
                />
              </div>
              
              {/* Top Countries Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {globalStats?.topCountriesByAmount && (
                  <TopItemsList
                    title="Top 3 Countries by Total Amount"
                    items={globalStats.topCountriesByAmount.map(country => ({
                      name: country.name,
                      code: country.code,
                      value: formatCurrency(country.amount)
                    }))}
                    className="h-full"
                  />
                )}
                
                {globalStats?.topCountriesByTransactions && (
                  <TopItemsList
                    title="Top 3 Countries by Transactions"
                    items={globalStats.topCountriesByTransactions.map(country => ({
                      name: country.name,
                      code: country.code,
                      value: country.count.toLocaleString()
                    }))}
                    className="h-full"
                  />
                )}
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                <h3 className="text-sm font-medium text-gray-500 mb-4">Filters</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {countryOptions && countryOptions.length > 0 && (
                    <SelectionFilter
                      title="Countries"
                      options={countryOptions}
                      selected={selectedCountries}
                      onSelectionChange={setSelectedCountries}
                      className="countries-filter"
                    />
                  )}
                  {storeOptions && storeOptions.length > 0 && (
                    <SelectionFilter
                      title="Stores"
                      options={storeOptions}
                      selected={selectedStores}
                      onSelectionChange={setSelectedStores}
                    />
                  )}
                  {productOptions && productOptions.length > 0 && (
                    <SelectionFilter
                      title="Products"
                      options={productOptions}
                      selected={selectedProducts}
                      onSelectionChange={setSelectedProducts}
                    />
                  )}
                </div>
              </div>
              
              {/* Country-specific Stats Section */}
              <FilteredStats
                title="Global Stats for Selected Countries"
                stats={countriesStats}
                className="mb-6"
              />
              
              {/* Store-specific Stats Section */}
              <FilteredStats
                title="Global Stats for Selected Stores"
                stats={storesStats}
                className="mb-6"
              />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <RevenueChart 
                    data={revenueData} 
                    title="Revenue Over Time"
                  />
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <ComparisonChart
                    data={comparisonData}
                    title={`${comparisonType.charAt(0).toUpperCase() + comparisonType.slice(1)} Revenue Comparison`}
                    comparisonType={comparisonType}
                  />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
