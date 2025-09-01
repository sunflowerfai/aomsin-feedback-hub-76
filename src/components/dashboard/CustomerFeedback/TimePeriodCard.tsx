import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SingleSelect } from "./SingleSelect";
import { DateRangePicker } from "./DateRangePicker";

const timePeriodOptions = [
  "ทั้งหมด",
  "ข้อมูลประจำเดือน", 
  "ช่วงเวลาย้อนหลัง",
  "กำหนดช่วงเวลาเอง"
];

const monthYearOptions = [
  "ม.ค. 63", "ก.พ. 63", "มี.ค. 63", "เม.ย. 63", "พ.ค. 63", "มิ.ย. 63", "ก.ค. 63", "ส.ค. 63", "ก.ย. 63", "ต.ค. 63", "พ.ย. 63", "ธ.ค. 63",
  "ม.ค. 64", "ก.พ. 64", "มี.ค. 64", "เม.ย. 64", "พ.ค. 64", "มิ.ย. 64", "ก.ค. 64", "ส.ค. 64", "ก.ย. 64", "ต.ค. 64", "พ.ย. 64", "ธ.ค. 64",
  "ม.ค. 65", "ก.พ. 65", "มี.ค. 65", "เม.ย. 65", "พ.ค. 65", "มิ.ย. 65", "ก.ค. 65", "ส.ค. 65", "ก.ย. 65", "ต.ค. 65", "พ.ย. 65", "ธ.ค. 65",
  "ม.ค. 66", "ก.พ. 66", "มี.ค. 66", "เม.ย. 66", "พ.ค. 66", "มิ.ย. 66", "ก.ค. 66", "ส.ค. 66", "ก.ย. 66", "ต.ค. 66", "พ.ย. 66", "ธ.ค. 66",
  "ม.ค. 67", "ก.พ. 67", "มี.ค. 67", "เม.ย. 67", "พ.ค. 67", "มิ.ย. 67", "ก.ค. 67", "ส.ค. 67", "ก.ย. 67", "ต.ค. 67", "พ.ย. 67", "ธ.ค. 67",
  "ม.ค. 68", "ก.พ. 68", "มี.ค. 68", "เม.ย. 68", "พ.ค. 68", "มิ.ย. 68", "ก.ค. 68", "ส.ค. 68", "ก.ย. 68", "ต.ค. 68", "พ.ย. 68", "ธ.ค. 68"
];

const relativeTimeOptions = [
  "1 วัน",
  "7 วัน", 
  "14 วัน",
  "1 เดือน",
  "6 เดือน",
  "1 ปี"
];

export const TimePeriodCard = () => {
  const [selectedPeriodType, setSelectedPeriodType] = useState("ทั้งหมด");
  const [selectedMonthYear, setSelectedMonthYear] = useState("");
  const [selectedRelativeTime, setSelectedRelativeTime] = useState("");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });

  const handlePeriodTypeChange = (value: string) => {
    setSelectedPeriodType(value);
    // Reset sub-selections when changing main type
    setSelectedMonthYear("");
    setSelectedRelativeTime("");
    setDateRange({ from: "", to: "" });
  };

  const renderSubDropdown = () => {
    switch (selectedPeriodType) {
      case "ข้อมูลประจำเดือน":
        return (
          <SingleSelect
            label="เดือน/ปี"
            options={monthYearOptions}
            selectedItem={selectedMonthYear}
            onSelectionChange={setSelectedMonthYear}
          />
        );
      case "ช่วงเวลาย้อนหลัง":
        return (
          <SingleSelect
            label="ช่วงเวลา"
            options={relativeTimeOptions}
            selectedItem={selectedRelativeTime}
            onSelectionChange={setSelectedRelativeTime}
          />
        );
      case "กำหนดช่วงเวลาเอง":
        return <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} />;
      default:
        return null;
    }
  };

  const renderCustomRangeText = () => {
    if (selectedPeriodType === "กำหนดช่วงเวลาเอง" && dateRange.from && dateRange.to) {
      return (
        <p className="text-xs text-gray-500 font-kanit mt-2">
          กำหนดช่วงเวลาเอง: {dateRange.from} - {dateRange.to}
        </p>
      );
    }
    return null;
  };

  return (
    <Card className="bg-white rounded-2xl shadow-card border border-gray-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold font-kanit text-gray-800">
          ช่วงเวลา
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <SingleSelect
          label=""
          options={timePeriodOptions}
          selectedItem={selectedPeriodType}
          onSelectionChange={handlePeriodTypeChange}
        />
        
        {renderSubDropdown()}
        {renderCustomRangeText()}
      </CardContent>
    </Card>
  );
};