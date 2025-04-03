
import * as React from "react";
import { Globe } from "lucide-react";
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

  // Determine if this is a country filter by title
  const isCountryFilter = title.toLowerCase() === "countries";

  if (isLoading) {
    return (
      <div className={cn("flex flex-col", className)}>
        <div className="h-10 bg-gray-100 animate-pulse rounded-md"></div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col", className)}>
      <MultiSelect
        options={options}
        selected={selected}
        onChange={onSelectionChange}
        placeholder={title}
        className="w-full"
        icon={isCountryFilter ? <Globe className="h-4 w-4 text-muted-foreground" /> : undefined}
      />
    </div>
  );
}
