
import React, { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app/AppSidebar";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { StatCard } from "@/components/dashboard/StatCard";
import { SelectionFilter, Option } from "@/components/dashboard/SelectionFilter";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { Users, DollarSign, TrendingUp, Globe } from "lucide-react";
import { 
  mockTransactions, 
  countriesList,
  mockProducts 
} from "@/data/mockData";
import { 
  calculateGlobalStats, 
  calculateProductStats,
  getDefaultDateRange, 
  formatCurrency, 
  getTierText 
} from "@/utils/dashboardUtils";

// Define store options
const storeOptions: Option[] = [
  { value: "netease", label: "NetEase" },
  { value: "flexion", label: "Flexion" },
  { value: "microsoft", label: "Microsoft" },
  { value: "apple_ios", label: "Apple iOS" },
  { value: "apple_macos", label: "Apple macOS" },
  { value: "google", label: "Google Play" },
  { value: "steam", label: "Steam" },
  { value: "steam_dlc", label: "Steam DLC" },
  { value: "nintendo", label: "Nintendo" },
];

// Define sample product options
const productOptions: Option[] = [
  { value: "prod1", label: "Minecraft" },
  { value: "prod2", label: "Fortnite V-Bucks" },
  { value: "prod3", label: "Call of Duty Pack" },
  { value: "prod4", label: "FIFA 24 Ultimate Team" },
  { value: "prod5", label: "Roblox Premium" },
  { value: "prod6", label: "GTA V" },
  { value: "prod7", label: "Among Us" },
  { value: "prod8", label: "Clash of Clans Gems" },
  { value: "prod9", label: "League of Legends RP" },
  { value: "prod10", label: "PUBG Mobile UC" },
];

// Convert the countries list to options format
const countryOptions: Option[] = countriesList.map(country => ({
  value: country.code,
  label: country.name
}));

const Dashboard = () => {
  const [dateRange, setDateRange] = useState<[Date, Date]>(getDefaultDateRange());
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedStores, setSelectedStores] = useState<string[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  // Calculate global stats
  const globalStats = calculateGlobalStats(
    mockTransactions,
    dateRange,
    selectedCountries,
    selectedStores
  );

  // Calculate product revenue data for chart
  const productRevenueData = calculateProductStats(
    mockTransactions,
    dateRange,
    selectedProducts.length > 0 ? selectedProducts : undefined,
    selectedCountries.length > 0 ? selectedCountries : undefined,
    selectedStores.length > 0 ? selectedStores : undefined
  );

  const handleDateChange = (range: { from: Date; to: Date }) => {
    setDateRange([range.from, range.to]);
  };

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
                startDate={dateRange[0]} 
                endDate={dateRange[1]} 
                onDateChange={handleDateChange} 
                className="mb-6"
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <StatCard
                  title="Total Transactions"
                  value={globalStats.totalTransactions.toLocaleString()}
                  icon={Users}
                  variant="primary"
                />
                <StatCard
                  title="Total Amount"
                  value={formatCurrency(globalStats.totalAmount)}
                  subtext={getTierText(globalStats.totalAmount)}
                  icon={DollarSign}
                  variant="success"
                />
                <StatCard
                  title="Average Transaction"
                  value={formatCurrency(globalStats.avgAmount)}
                  subtext={getTierText(globalStats.avgAmount)}
                  icon={TrendingUp}
                />
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                <h3 className="text-sm font-medium text-gray-500 mb-4">Filters</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <SelectionFilter
                    title="Countries"
                    options={countryOptions}
                    selected={selectedCountries}
                    onSelectionChange={setSelectedCountries}
                    className="countries-filter"
                  />
                  <SelectionFilter
                    title="Stores"
                    options={storeOptions}
                    selected={selectedStores}
                    onSelectionChange={setSelectedStores}
                  />
                  <SelectionFilter
                    title="Products"
                    options={productOptions}
                    selected={selectedProducts}
                    onSelectionChange={setSelectedProducts}
                  />
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                <RevenueChart 
                  data={productRevenueData} 
                  title="Revenue Over Time"
                />
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
