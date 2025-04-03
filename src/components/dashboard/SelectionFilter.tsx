
import * as React from "react";
import { Check, ChevronsUpDown, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

export interface Option {
  value: string;
  label: string;
}

interface SelectionFilterProps {
  title: string;
  options: Option[];
  selected: string[];
  onSelectionChange: (selected: string[]) => void;
  className?: string;
}

export function SelectionFilter({
  title,
  options = [],  // Ensure options is never undefined
  selected = [], // Ensure selected is never undefined
  onSelectionChange,
  className,
}: SelectionFilterProps) {
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  // Ensure options is always a valid array of Option objects
  const safeOptions = React.useMemo(() => {
    if (!Array.isArray(options)) return [];
    
    return options.filter(opt => 
      opt && 
      typeof opt === 'object' && 
      'value' in opt && 
      typeof opt.value === 'string' &&
      'label' in opt &&
      typeof opt.label === 'string'
    );
  }, [options]);
  
  // Ensure selected is always a valid array of strings
  const safeSelected = React.useMemo(() => {
    if (!Array.isArray(selected)) return [];
    return selected.filter(value => typeof value === 'string');
  }, [selected]);

  const handleSelect = (value: string) => {
    if (safeSelected.includes(value)) {
      onSelectionChange(safeSelected.filter((item) => item !== value));
    } else {
      onSelectionChange([...safeSelected, value]);
    }
  };

  const handleRemove = (value: string) => {
    onSelectionChange(safeSelected.filter((item) => item !== value));
  };

  const getSelectedLabels = () => {
    if (!Array.isArray(safeSelected) || !Array.isArray(safeOptions)) {
      return [];
    }
    
    return safeSelected.map((value) => {
      const option = safeOptions.find((opt) => opt && opt.value === value);
      return option ? option.label : value;
    });
  };

  // Simulate a brief loading state for the component
  React.useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Fallback for empty options to prevent cmdk issues
  if (!Array.isArray(safeOptions) || safeOptions.length === 0) {
    return (
      <div className={cn("flex flex-col", className)}>
        <Button
          variant="outline"
          className="justify-between min-h-10"
          disabled
        >
          <span className="mr-2 truncate">{title}</span>
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
        <div className="text-sm text-muted-foreground mt-2">No options available</div>
      </div>
    );
  }

  // Determine if this is a country filter by title
  const isCountryFilter = title.toLowerCase() === "countries";

  return (
    <div className={cn("flex flex-col", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between min-h-10"
          >
            <div className="flex items-center">
              {isCountryFilter && <Globe className="mr-2 h-4 w-4 text-muted-foreground" />}
              <span className="mr-2 truncate">{title}</span>
            </div>
            {safeSelected && safeSelected.length > 0 && (
              <Badge variant="outline" className="mr-2">
                {safeSelected.length}
              </Badge>
            )}
            <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-[250px] z-[9999]" align="start">
          {isLoading ? (
            <div className="p-4 text-center">
              <span className="text-sm text-muted-foreground">Loading...</span>
            </div>
          ) : (
            <Command>
              <CommandInput placeholder={`Search ${title.toLowerCase()}...`} />
              <CommandEmpty>No {title.toLowerCase()} found.</CommandEmpty>
              {/* Use a key to force re-mount when options change */}
              <CommandGroup key={`group-${safeOptions.length}`} className="max-h-64 overflow-auto">
                {safeOptions.length > 0 ? (
                  safeOptions.map((option, index) => (
                    <CommandItem
                      key={`${option.value || index}`}
                      value={option.value}
                      onSelect={() => handleSelect(option.value)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          safeSelected.includes(option.value)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  ))
                ) : (
                  <div className="py-6 text-center text-sm">No items available</div>
                )}
              </CommandGroup>
            </Command>
          )}
        </PopoverContent>
      </Popover>

      {safeSelected && safeSelected.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {getSelectedLabels().map((label, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="cursor-pointer"
              onClick={() => handleRemove(safeSelected[index])}
            >
              {label}
              <span className="ml-1 text-xs">&times;</span>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
