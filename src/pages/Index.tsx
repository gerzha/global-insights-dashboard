
import React, { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app/AppSidebar";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { StatCard } from "@/components/dashboard/StatCard";
import { TopItemsList } from "@/components/dashboard/TopItemsList";
import { SelectionFilter } from "@/components/dashboard/SelectionFilter";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { BarChart2, Users, DollarSign, TrendingUp } from "lucide-react";
import { 
  mockTransactions, 
  mockCountries, 
  mockStores, 
  mockProducts 
} from "@/data/mockData";
import { 
  calculateGlobalStats, 
  calculateProductStats,
  getDefaultDateRange, 
  formatCurrency, 
  getTierText 
} from "@/utils/dashboardUtils";

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

  // Format the options for selection filters
  const countryOptions = mockCountries.map(country => ({
    value: country.code,
    label: country.name
  }));

  const storeOptions = mockStores.map(store => ({
    value: store.id,
    label: store.name
  }));

  const productOptions = mockProducts.map(product => ({
    value: product.id,
    label: product.name
  }));

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
              <h1 className="text-xl font-semibold text-jira-gray-dark">Global Insights Dashboard</h1>
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
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
                <StatCard
                  title="Active Products"
                  value={mockProducts.length}
                  icon={BarChart2}
                />
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-4">Filters</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <SelectionFilter
                        title="Countries"
                        options={countryOptions}
                        selected={selectedCountries}
                        onSelectionChange={setSelectedCountries}
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
                  
                  <RevenueChart 
                    data={productRevenueData} 
                    title="Revenue Over Time"
                  />
                </div>
                
                <div className="space-y-6">
                  <TopItemsList
                    title="Top Countries by Revenue"
                    items={globalStats.topCountriesByAmount.map(country => ({
                      name: country.name,
                      code: country.code,
                      value: formatCurrency(country.amount)
                    }))}
                  />
                  
                  <TopItemsList
                    title="Top Countries by Transactions"
                    items={globalStats.topCountriesByTransactions.map(country => ({
                      name: country.name,
                      code: country.code,
                      value: country.count.toLocaleString()
                    }))}
                    valueSuffix=" txns"
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
