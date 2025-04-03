
import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type Option = {
  label: string;
  value: string;
};

interface MultiSelectProps {
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
  icon?: React.ReactNode;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select items",
  className,
  icon,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  // Ensure options is always an array
  const safeOptions = Array.isArray(options) ? options : [];
  
  // Ensure selected is always an array of strings
  const safeSelected = Array.isArray(selected) ? selected : [];

  const handleUnselect = (item: string) => {
    onChange(safeSelected.filter((i) => i !== item));
  };

  const handleSelect = (value: string) => {
    if (safeSelected.includes(value)) {
      onChange(safeSelected.filter((item) => item !== value));
    } else {
      onChange([...safeSelected, value]);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("min-h-10 h-auto flex flex-wrap justify-between", className)}
        >
          <div className="flex items-center">
            {icon && <span className="mr-2">{icon}</span>}
            <div className="flex flex-wrap gap-1">
              {safeSelected.length === 0 ? (
                <span className="text-muted-foreground">{placeholder}</span>
              ) : (
                safeSelected.map((item) => {
                  const selectedOption = safeOptions.find((option) => option.value === item);
                  return (
                    <Badge
                      key={item}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {selectedOption?.label || item}
                      <button
                        className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onClick={() => handleUnselect(item)}
                      >
                        <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                      </button>
                    </Badge>
                  );
                })
              )}
            </div>
          </div>
          {safeSelected.length > 0 && (
            <Badge variant="outline" className="ml-2 mr-1">
              {safeSelected.length}
            </Badge>
          )}
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 ml-auto" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[250px] z-[9999]" align="start">
        <Command>
          <CommandInput placeholder={`Search ${placeholder.toLowerCase()}...`} />
          <CommandList className="max-h-[300px]">
            <CommandEmpty>No item found.</CommandEmpty>
            <CommandGroup key={`group-${safeOptions.length}`}>
              {safeOptions.length > 0 ? (
                safeOptions.map((option) => (
                  <CommandItem
                    key={option.value}
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
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
