
import React from "react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TimeFilter as TimeFilterType } from "@/types/dashboard";

interface TimeFilterProps {
  value: TimeFilterType['value'];
  onChange: (value: TimeFilterType['value']) => void;
  className?: string;
}

const TimeFilter: React.FC<TimeFilterProps> = ({ value, onChange, className = "" }) => {
  const timeOptions: TimeFilterType[] = [
    { value: "1day", label: "1 วัน" },
    { value: "1week", label: "1 อาทิตย์" },
    { value: "1month", label: "1 เดือน" },
    { value: "3months", label: "3 เดือน" },
    { value: "6months", label: "6 เดือน" },
    { value: "1year", label: "1 ปี" }
  ];

  return (
    <div className={`w-40 ${className}`}>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="bg-card border-border">
          <SelectValue placeholder="เลือกช่วงเวลา" />
        </SelectTrigger>
        <SelectContent className="bg-card border-border">
          {timeOptions.map((option) => (
            <SelectItem 
              key={option.value} 
              value={option.value}
              className="hover:bg-accent cursor-pointer"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TimeFilter;
