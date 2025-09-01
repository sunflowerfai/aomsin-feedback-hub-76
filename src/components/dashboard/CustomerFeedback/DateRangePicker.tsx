import { useState } from "react";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DateRangePickerProps {
  dateRange: { from: string; to: string };
  onDateRangeChange: (range: { from: string; to: string }) => void;
}

export const DateRangePicker = ({ dateRange, onDateRangeChange }: DateRangePickerProps) => {
  const handleFromDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedDate = formatDateThai(e.target.value);
    onDateRangeChange({ ...dateRange, from: formattedDate });
  };

  const handleToDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedDate = formatDateThai(e.target.value);
    onDateRangeChange({ ...dateRange, to: formattedDate });
  };

  const formatDateThai = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-kanit text-gray-600 mb-1 block">วันเริ่มต้น</label>
          <div className="relative">
            <Input
              type="date"
              max={getCurrentDate()}
              onChange={handleFromDateChange}
              className="pr-8 text-sm"
            />
            <Calendar className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
        
        <div>
          <label className="text-xs font-kanit text-gray-600 mb-1 block">วันสิ้นสุด</label>
          <div className="relative">
            <Input
              type="date"
              max={getCurrentDate()}
              onChange={handleToDateChange}
              className="pr-8 text-sm"
            />
            <Calendar className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
};