
import React from "react";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";

interface FilterBarProps {
  startDate: Date;
  endDate: Date;
  onDateChange: (range: { from: Date; to: Date }) => void;
  className?: string;
}

export function FilterBar({
  startDate,
  endDate,
  onDateChange,
  className,
}: FilterBarProps) {
  const [date, setDate] = React.useState<{
    from: Date;
    to: Date;
  }>({
    from: startDate,
    to: endDate,
  });

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;

    const newDate = {
      from: date?.from || selectedDate,
      to: date?.from && !date.to ? selectedDate : date?.to || selectedDate,
    };

    if (date?.from && date.to) {
      newDate.from = selectedDate;
      newDate.to = selectedDate;
    }

    if (newDate.from > newDate.to) {
      newDate.to = newDate.from;
    }

    setDate(newDate);
  };

  const handleDateRangeApply = () => {
    if (date.from && date.to) {
      onDateChange(date);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row gap-4 items-start sm:items-end justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-200",
        className
      )}
    >
      <div className="flex flex-col gap-1.5">
        <Label className="text-sm">Date Range</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal w-64",
                !date && "text-muted-foreground"
              )}
            >
              <Calendar className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "MMM d, yyyy")} -{" "}
                    {format(date.to, "MMM d, yyyy")}
                  </>
                ) : (
                  format(date.from, "MMM d, yyyy")
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="range"
              defaultMonth={date?.from}
              selected={{
                from: date?.from,
                to: date?.to,
              }}
              onSelect={(selectedDate) => {
                if (selectedDate?.from) {
                  handleDateSelect(selectedDate.from);
                }
                if (selectedDate?.to) {
                  handleDateSelect(selectedDate.to);
                }
              }}
              numberOfMonths={2}
            />
            <div className="p-3 border-t border-border">
              <Button
                size="sm"
                className="w-full"
                onClick={handleDateRangeApply}
              >
                Apply
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      <Button className="bg-jira-blue hover:bg-jira-blue-darker">
        Apply Filters
      </Button>
    </div>
  );
}
