
import React from "react";
import {
  Line,
  LineChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { format, parseISO } from "date-fns";
import { formatCurrency } from "@/utils/dashboardUtils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ComparisonData {
  date: string;
  id: string;
  name: string;
  value: number;
}

interface GroupedData {
  [key: string]: {
    id: string;
    name: string;
    data: { date: string; value: number }[];
  };
}

interface ComparisonChartProps {
  data: ComparisonData[];
  title: string;
  comparisonType: "products" | "countries" | "stores";
  className?: string;
}

export function ComparisonChart({ 
  data, 
  title, 
  comparisonType,
  className 
}: ComparisonChartProps) {
  const [selectedTab, setSelectedTab] = React.useState<string>(comparisonType);

  const formatXAxis = (tickItem: string) => {
    return format(parseISO(tickItem), "MMM d");
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-md border border-gray-200 rounded-md">
          <p className="font-semibold">{format(parseISO(label), "MMM d, yyyy")}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Group data by entity (product, country, or store)
  const groupedData: GroupedData = data.reduce((acc: GroupedData, item) => {
    if (!acc[item.id]) {
      acc[item.id] = {
        id: item.id,
        name: item.name,
        data: []
      };
    }
    
    acc[item.id].data.push({
      date: item.date,
      value: item.value
    });
    
    return acc;
  }, {});

  // Get unique dates
  const allDates = Array.from(new Set(data.map(item => item.date))).sort();
  
  // Prepare data for chart - ensure all dates exist for each entity
  const chartData = allDates.map(date => {
    const dateData: any = { date };
    
    Object.values(groupedData).forEach(entity => {
      const dataPoint = entity.data.find(d => d.date === date);
      dateData[entity.name] = dataPoint ? dataPoint.value : 0;
    });
    
    return dateData;
  });

  // Generate colors for the lines
  const colors = ["#0052CC", "#00875A", "#FF5630", "#6554C0", "#FFAB00", "#1D7AFC"];
  
  return (
    <div className={`bg-white p-4 shadow-sm border border-gray-200 rounded-lg ${className}`}>
      <Tabs defaultValue={selectedTab} onValueChange={setSelectedTab}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <TabsList>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="countries">Countries</TabsTrigger>
            <TabsTrigger value="stores">Stores</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value={selectedTab} className="mt-0">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="opacity-30" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatXAxis} 
                  tick={{ fontSize: 12 }}
                  tickMargin={10}
                />
                <YAxis 
                  tickFormatter={(value) => formatCurrency(value)}
                  width={80}
                  tick={{ fontSize: 12 }}
                  tickMargin={10}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                
                {Object.values(groupedData).map((entity, index) => (
                  <Line
                    key={entity.id}
                    type="monotone"
                    dataKey={entity.name}
                    stroke={colors[index % colors.length]}
                    strokeWidth={2}
                    dot={{ strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
