
import * as React from "react";
import { Globe, Store, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { MultiSelect, Option } from "@/components/ui/multi-select";

interface SelectionFilterProps {
  title: string;
  options: Option[];
  selected: string[];
  onSelectionChange: (selected: string[]) => void;
  className?: string;
}

export { type Option } from "@/components/ui/multi-select";

export function SelectionFilter({
  title,
  options = [],
  selected = [],
  onSelectionChange,
  className,
}: SelectionFilterProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  // Simulate a brief loading state for the component
  React.useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Determine appropriate icon based on filter type
  const getFilterIcon = () => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle === "countries") return <Globe className="h-4 w-4 text-muted-foreground" />;
    if (lowerTitle === "stores") return <Store className="h-4 w-4 text-muted-foreground" />;
    if (lowerTitle === "products") return <ShoppingBag className="h-4 w-4 text-muted-foreground" />;
    return undefined;
  };

  if (isLoading) {
    return (
      <div className={cn("flex flex-col", className)}>
        <div className="h-10 bg-gray-100 animate-pulse rounded-md"></div>
      </div>
    );
  }

  // Make sure options is never undefined or null
  const safeOptions = Array.isArray(options) ? options : [];

  return (
    <div className={cn("flex flex-col", className)}>
      <MultiSelect
        options={safeOptions}
        selected={selected}
        onChange={onSelectionChange}
        placeholder={title}
        className="w-full"
        icon={getFilterIcon()}
      />
    </div>
  );
}
