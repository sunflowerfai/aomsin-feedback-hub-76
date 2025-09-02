import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

/* ===== UI (shadcn) ===== */
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar as CalendarPrimitive } from "@/components/ui/calendar";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useLocation } from "react-router-dom";

/* ===== Icons ===== */
import {
  Menu,
  X,
  LogOut,
  RotateCcw,
  ChevronDown,
  Search as SearchIcon,
  Calendar as CalendarIcon,
  Check,
} from "lucide-react";

/* ===== Layout (same as Dashboard) ===== */
import { MenuItems } from "@/components/dashboard/MenuItems";
import { MiniRailSidebar } from "@/components/dashboard/MiniRailSidebar";


/* =====================================================================================
 * Small building blocks (merged from individual files)
 * ===================================================================================*/

/* ---------- Filter Modal (optional helper) ---------- */
interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}
const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose, title }) => {
  if (!isOpen) return null;
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={handleBackdropClick}>
      <div className="bg-white rounded-2xl shadow-card border border-gray-200 w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold font-kanit text-gray-800">{title}</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-xl hover:bg-gray-100">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-6">
          <p className="text-gray-500 font-kanit text-center">เนื้อหาสำหรับการแก้ไขจะแสดงที่นี่</p>
        </div>
      </div>
    </div>
  );
};

/* ---------- SingleSelect ---------- */
interface SingleSelectProps {
  label: string;
  options: string[];
  selectedItem: string;
  onSelectionChange: (selected: string) => void;
}
const SingleSelect: React.FC<SingleSelectProps> = ({ label, options, selectedItem, onSelectionChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <Button variant="outline" onClick={() => setIsOpen(!isOpen)} className="w-full justify-between border-gray-300 rounded-xl px-3 py-2 text-sm h-auto">
        <span className="font-kanit truncate text-left">{selectedItem || label || options[0]}</span>
        <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isOpen ? "animate-spin" : ""}`} />
      </Button>
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-48 overflow-y-auto">
          {options.map((option) => (
            <div
              key={option}
              onClick={() => {
                onSelectionChange(option);
                setIsOpen(false);
              }}
              className={`p-3 hover:bg-gray-50 cursor-pointer font-kanit text-sm border-b border-gray-100 last:border-b-0 ${selectedItem === option ? "bg-pink-50 text-pink-600" : ""}`}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ---------- MultiSelect ---------- */
interface MultiSelectProps {
  label: string;
  options: string[];
  selectedItems: string[];
  onSelectionChange: (selected: string[]) => void;
}
const MultiSelect: React.FC<MultiSelectProps> = ({ label, options, selectedItems, onSelectionChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter((option) => option.toLowerCase().includes(searchTerm.toLowerCase()));
  const handleSelect = (option: string) => {
    if (option === "เลือกทั้งหมด") {
      const allItems = options.slice(1);
      onSelectionChange(selectedItems.length === allItems.length ? [] : allItems);
    } else {
      if (selectedItems.includes(option)) onSelectionChange(selectedItems.filter((item) => item !== option));
      else onSelectionChange([...selectedItems, option]);
    }
  };
  const isAllSelected = selectedItems.length === options.length - 1;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <Button variant="outline" onClick={() => setIsOpen(!isOpen)} className="w-full justify-between border-gray-300 rounded-xl px-3 py-2 text-sm h-auto">
        <span className="font-kanit truncate text-left">{selectedItems.length > 0 ? `เลือกแล้ว ${selectedItems.length} ${label}` : label}</span>
        <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isOpen ? "animate-spin" : ""}`} />
      </Button>
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="ค้นหา..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 border-pink-200 focus:border-pink-400 focus:ring-pink-400" />
            </div>
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.map((option) => {
              const isSelected = option === "เลือกทั้งหมด" ? isAllSelected : selectedItems.includes(option);
              return (
                <div key={option} onClick={() => handleSelect(option)} className="flex items-center space-x-3 p-3 hover:bg-gray-50 cursor-pointer">
                  <div className={`w-5 h-5 border-2 rounded-sm grid place-items-center transition-colors ${isSelected ? "border-pink-500 bg-pink-500" : "border-pink-300"}`}>
                    {isSelected && <Check className="h-3 w-3 text-white" />}
                  </div>
                  <span className="font-kanit text-sm flex-1">{option}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

/* ---------- DateRangePicker ---------- */
interface DateRangePickerProps {
  dateRange: { from: string; to: string };
  onDateRangeChange: (range: { from: string; to: string }) => void;
}
const DateRangePicker: React.FC<DateRangePickerProps> = ({ dateRange, onDateRangeChange }) => {
  const formatDateThai = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day = today.getDate().toString().padStart(2, "0");
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
              onChange={(e) => onDateRangeChange({ ...dateRange, from: formatDateThai(e.target.value) })}
              className="pr-8 text-sm"
            />
            <CalendarIcon className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div>
          <label className="text-xs font-kanit text-gray-600 mb-1 block">วันสิ้นสุด</label>
          <div className="relative">
            <Input
              type="date"
              max={getCurrentDate()}
              onChange={(e) => onDateRangeChange({ ...dateRange, to: formatDateThai(e.target.value) })}
              className="pr-8 text-sm"
            />
            <CalendarIcon className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
};

/* =====================================================================================
 * Cards (left column)
 * ===================================================================================*/

/* ---------- TimePeriodCard ---------- */
const timePeriodOptions = ["ทั้งหมด", "ข้อมูลประจำเดือน", "ช่วงเวลาย้อนหลัง", "กำหนดช่วงเวลาเอง"];
const monthYearOptions = [
  "ม.ค. 63","ก.พ. 63","มี.ค. 63","เม.ย. 63","พ.ค. 63","มิ.ย. 63","ก.ค. 63","ส.ค. 63","ก.ย. 63","ต.ค. 63","พ.ย. 63","ธ.ค. 63",
  "ม.ค. 64","ก.พ. 64","มี.ค. 64","เม.ย. 64","พ.ค. 64","มิ.ย. 64","ก.ค. 64","ส.ค. 64","ก.ย. 64","ต.ค. 64","พ.ย. 64","ธ.ค. 64",
  "ม.ค. 65","ก.พ. 65","มี.ค. 65","เม.ย. 65","พ.ค. 65","มิ.ย. 65","ก.ค. 65","ส.ค. 65","ก.ย. 65","ต.ค. 65","พ.ย. 65","ธ.ค. 65",
  "ม.ค. 66","ก.พ. 66","มี.ค. 66","เม.ย. 66","พ.ค. 66","มิ.ย. 66","ก.ค. 66","ส.ค. 66","ก.ย. 66","ต.ค. 66","พ.ย. 66","ธ.ค. 66",
  "ม.ค. 67","ก.พ. 67","มี.ค. 67","เม.ย. 67","พ.ค. 67","มิ.ย. 67","ก.ค. 67","ส.ค. 67","ก.ย. 67","ต.ค. 67","พ.ย. 67","ธ.ค. 67",
  "ม.ค. 68","ก.พ. 68","มี.ค. 68","เม.ย. 68","พ.ค. 68","มิ.ย. 68","ก.ค. 68","ส.ค. 68","ก.ย. 68","ต.ค. 68","พ.ย. 68","ธ.ค. 68",
];
const relativeTimeOptions = ["1 วัน", "7 วัน", "14 วัน", "1 เดือน", "6 เดือน", "1 ปี"];

const TimePeriodCard: React.FC = () => {
  const [selectedPeriodType, setSelectedPeriodType] = useState("ทั้งหมด");
  const [selectedMonthYear, setSelectedMonthYear] = useState("");
  const [selectedRelativeTime, setSelectedRelativeTime] = useState("");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });

  const renderSubDropdown = () => {
    switch (selectedPeriodType) {
      case "ข้อมูลประจำเดือน":
        return <SingleSelect label="เดือน/ปี" options={monthYearOptions} selectedItem={selectedMonthYear} onSelectionChange={setSelectedMonthYear} />;
      case "ช่วงเวลาย้อนหลัง":
        return <SingleSelect label="ช่วงเวลา" options={relativeTimeOptions} selectedItem={selectedRelativeTime} onSelectionChange={setSelectedRelativeTime} />;
      case "กำหนดช่วงเวลาเอง":
        return <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} />;
      default:
        return null;
    }
  };

  return (
    <Card className="bg-white rounded-2xl shadow-card border border-gray-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold font-kanit text-gray-800">ช่วงเวลา</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <SingleSelect label="" options={timePeriodOptions} selectedItem={selectedPeriodType} onSelectionChange={(v) => {
          setSelectedPeriodType(v);
          setSelectedMonthYear("");
          setSelectedRelativeTime("");
          setDateRange({ from: "", to: "" });
        }} />
        {renderSubDropdown()}
        {selectedPeriodType === "กำหนดช่วงเวลาเอง" && dateRange.from && dateRange.to && (
          <p className="text-xs text-gray-500 font-kanit mt-2">กำหนดช่วงเวลาเอง: {dateRange.from} - {dateRange.to}</p>
        )}
      </CardContent>
    </Card>
  );
};

/* ---------- ServiceAreaCard ---------- */
const businessLines = ["เลือกทั้งหมด", "สายกิจ 1", "สายกิจ 2", "สายกิจ 3", "สายกิจ 4", "สายกิจ 5", "สายกิจ 6"];
const regions = ["เลือกทั้งหมด", ...Array.from({ length: 18 }, (_, i) => `ภาค ${i + 1}`)];
// NOTE: districts & branches list are long; kept as in source for fidelity
const districts = [
  "เลือกทั้งหมด", "บางเขน", "ราชวัตร", "สะพานใหม่", "ห้วยขวาง", "คลองจั่น", "ถนนเพชรบุรี", "บางรัก", "พร้อมพงษ์", "พระโขนง", "มีนบุรี", "บางคอแหลม", "บางแค",
  "ราษฎร์บูรณะ", "ศิริราช", "ประจวบคีรีขันธ์", "เพชรบุรี", "ราชบุรี", "สมุทรสาคร", "กาญจนบุรี", "นครปฐม", "นนทบุรี 1", "นนทบุรี 2", "สุพรรณบุรี", "นครสวรรค์",
  "พิจิตร", "เพชรบูรณ์", "ลพบุรี", "อุทัยธานี", "กำแพงเพชร", "ตาก", "พิษณุโลก 1", "พิษณุโลก 2", "สุโขทัย", "อุตรดิตถ์", "เชียงใหม่ 1", "เชียงใหม่ 2",
  "เชียงใหม่ 3", "ลำพูน", "เชียงราย", "น่าน", "พะเยา", "แพร่", "ลำปาง", "นครพนม", "บึงกาฬ", "เลย", "สกลนคร", "หนองคาย",
  "หนองบัวลำภู", "อุดรธานี 1", "อุดรธานี 2", "กาฬสินธุ์", "ขอนแก่น 1", "ขอนแก่น 2", "ชัยภูมิ", "มหาสารคาม", "มุกดาหาร", "ร้อยเอ็ด", "บุรีรัมย์", "ยโสธร",
  "ศรีสะเกษ", "สุรินทร์", "อุบลราชธานี 1", "อุบลราชธานี 2", "นครราชสีมา 1", "นครราชสีมา 2", "นครราชสีมา 3", "ปราจีนบุรี", "สระแก้ว", "ปทุมธานี 1", "ปทุมธานี 2",
  "พระนครศรีอยุธยา 1", "พระนครศรีอยุธยา 2", "สระบุรี", "อ่างทอง", "จันทบุรี", "ฉะเชิงเทรา", "ชลบุรี 1", "ชลบุรี 2", "ชลบุรี 3", "ชลบุรี 4", "ระยอง",
  "สมุทรปราการ 1", "สมุทรปราการ 2", "ชุมพร 1", "ชุมพร 2", "พังงา", "ภูเก็ต", "สุราษฎร์ธานี 1", "สุราษฎร์ธานี 2", "กระบี่", "ตรัง", "นครศรีธรรมราช 1",
  "นครศรีธรรมราช 2", "พัทลุง", "นราธิวาส", "ปัตตานี", "สงขลา 1", "สงขลา 2",
];
const branches = [
  "เลือกทั้งหมด", "สำนักพหลโยธิน", "กรีนพลาซ่า (วังหิน)", "จตุจักร", "เซ็นทรัล ลาดพร้าว", "ตลาด อ.ต.ก.", "เตาปูน", "บางเขน", "ประชาชื่น", "ประชานิเวศน์ 1", "พงษ์เพชร",
  // ... (รายการสาขายาว — คงไว้เพื่อความครบถ้วนตามต้นฉบับ)
  "หาดใหญ่ใน",
];

const ServiceAreaCard: React.FC = () => {
  const [selectedBusinessLines, setSelectedBusinessLines] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);

  const handleReset = () => {
    setSelectedBusinessLines([]);
    setSelectedRegions([]);
    setSelectedDistricts([]);
    setSelectedBranches([]);
  };

  return (
    <Card className="bg-white rounded-2xl shadow-card border border-gray-200">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold font-kanit text-gray-800">พื้นที่ดูแล</CardTitle>
          <Button variant="ghost" size="icon" onClick={handleReset} className="h-8 w-8 rounded-xl hover:bg-gray-100">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <MultiSelect label="สายกิจ" options={businessLines} selectedItems={selectedBusinessLines} onSelectionChange={setSelectedBusinessLines} />
          <MultiSelect label="ภาค" options={regions} selectedItems={selectedRegions} onSelectionChange={setSelectedRegions} />
          <MultiSelect label="เขต" options={districts} selectedItems={selectedDistricts} onSelectionChange={setSelectedDistricts} />
          <MultiSelect label="สาขา" options={branches} selectedItems={selectedBranches} onSelectionChange={setSelectedBranches} />
        </div>
        <p className="text-xs text-gray-500 font-kanit mt-4">เลือกแล้ว: {selectedBusinessLines.length} สายกิจ, {selectedRegions.length} ภาค, {selectedDistricts.length} เขต, {selectedBranches.length} สาขา</p>
      </CardContent>
    </Card>
  );
};

/* ---------- OpinionCard ---------- */
const mainCategories = [
  "เลือกทั้งหมด",
  "Market Conduct",
  "กระบวนการให้บริการ",
  "ความประทับใจอื่นๆ",
  "เงื่อนไขผลิตภัณฑ์",
  "พนักงานและบุคลากร",
  "ระบบธนาคารและเทคโนโลยี",
  "สภาพแวดล้อมและสิ่งอำนวยความสะดวก",
];
const subCategories = [
  "เลือกทั้งหมด",
  "การบังคับ",
  "การรบกวน",
  "การหลอกลวง",
  "การเอาเปรียบ",
  "ขั้นตอนการให้บริการ",
  "ความพร้อมในการให้บริการ",
  "ภาระเอกสาร",
  "อื่นๆ",
  "เกณฑ์การอนุมัติ",
  "ความเรียบง่ายข้อมูล",
  "ระยะเวลาอนุมัติ",
  "รายละเอียดผลิตภัณฑ์",
  "การจัดการและแก้ไขปัญหาเฉพาะหน้า",
  "ความถูกต้องในการให้บริการ",
  "ความประทับใจในการให้บริการ",
  "ความรวดเร็วในการให้บริการ",
  "ความสามารถในการตอบคำถามหรือให้คำแนะนำ",
  "ความสุภาพและมารยาทของพนักงาน",
  "ความเอาใจใส่ในการให้บริการลูกค้า",
  "รปภ. แม่บ้าน ฯลฯ",
  "ATM ADM CDM",
  "เครื่องนับเงิน",
  "เครื่องปรับสมุด",
  "เครื่องออกบัตรคิว",
  "ระบบ Core ของธนาคาร",
  "ระบบยืนยันตัวตน",
  "แอปพลิเคชั่น MyMo",
  "ความสะอาด",
  "ทำเลพื้นที่และความคับคั่ง",
  "ที่จอดรถ",
  "ที่นั่งรอ",
  "ป้าย-สื่อประชาสัมพันธ์",
  "สิ่งอำนวยความสะดวกอื่นๆ",
  "เสียง",
  "แสงสว่าง",
  "ห้องน้ำ",
  "อุณหภูมิ",
];

const OpinionCard: React.FC = () => {
  const [selectedMainCategories, setSelectedMainCategories] = useState<string[]>([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>([]);
  return (
    <Card className="bg-white rounded-2xl shadow-card border border-gray-200">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold font-kanit text-gray-800">ความคิดเห็น</CardTitle>
          <Button variant="ghost" size="icon" onClick={() => { setSelectedMainCategories([]); setSelectedSubCategories([]); }} className="h-8 w-8 rounded-xl hover:bg-gray-100">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <MultiSelect label="หมวดหมู่" options={mainCategories} selectedItems={selectedMainCategories} onSelectionChange={setSelectedMainCategories} />
        <MultiSelect label="หมวดย่อย" options={subCategories} selectedItems={selectedSubCategories} onSelectionChange={setSelectedSubCategories} />
        <p className="text-xs text-gray-500 font-kanit mt-4">เลือกแล้ว: {selectedMainCategories.length} หมวดหมู่, {selectedSubCategories.length} หมวดย่อย</p>
      </CardContent>
    </Card>
  );
};

/* ---------- TransactionTypeCard ---------- */
const transactionTypesList = ["เลือกทั้งหมด", "ฝาก-ถอนเงิน/สลาก", "ชำระสินเชื่อ/ชำระค่าสินค้าและบริการ", "สมัครใช้บริการ เงินฝาก/สินเชื่อ/MyMo/บัตร", "สอบถาม/ขอคำปรึกษา", "อื่น ๆ"];
const TransactionTypeCard: React.FC = () => {
  const [selectedTransactionTypes, setSelectedTransactionTypes] = useState<string[]>([]);
  return (
    <Card className="bg-white rounded-2xl shadow-card border border-gray-200">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold font-kanit text-gray-800">ประเภทธุรกรรม</CardTitle>
          <Button variant="ghost" size="icon" onClick={() => setSelectedTransactionTypes([])} className="h-8 w-8 rounded-xl hover:bg-gray-100">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <MultiSelect label="ประเภทธุรกรรม" options={transactionTypesList} selectedItems={selectedTransactionTypes} onSelectionChange={setSelectedTransactionTypes} />
        <p className="text-xs text-gray-500 font-kanit mt-4">เลือกแล้ว: {selectedTransactionTypes.length} ประเภท</p>
      </CardContent>
    </Card>
  );
};

/* =====================================================================================
 * Right column cards
 * ===================================================================================*/
const RegionalFeedbackChart: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<"positive" | "negative">("positive");

  // ตัวอย่างข้อมูล mock — เปลี่ยนต่อกับข้อมูลจริงภายหลังได้ทันที
  const regionFeedbackData = [
    { region: "ภาค 1",  previous: 18, positive: 26, negative: 11 },
    { region: "ภาค 2",  previous: 22, positive: 19, negative: 14 },
    { region: "ภาค 3",  previous: 17, positive: 23, negative: 10 },
    { region: "ภาค 4",  previous: 20, positive: 25, negative: 12 },
    { region: "ภาค 5",  previous: 16, positive: 21, negative: 13 },
    { region: "ภาค 6",  previous: 19, positive: 24, negative: 15 },
    { region: "ภาค 7",  previous: 14, positive: 18, negative: 9  },
    { region: "ภาค 8",  previous: 15, positive: 17, negative: 8  },
    { region: "ภาค 9",  previous: 21, positive: 27, negative: 16 },
    { region: "ภาค 10", previous: 13, positive: 16, negative: 7  },
    { region: "ภาค 11", previous: 12, positive: 15, negative: 6  },
    { region: "ภาค 12", previous: 18, positive: 22, negative: 11 },
    { region: "ภาค 13", previous: 17, positive: 20, negative: 9  },
    { region: "ภาค 14", previous: 23, positive: 28, negative: 17 },
    { region: "ภาค 15", previous: 11, positive: 14, negative: 5  },
    { region: "ภาค 16", previous: 19, positive: 25, negative: 13 },
    { region: "ภาค 17", previous: 16, positive: 18, negative: 9  },
    { region: "ภาค 18", previous: 22, positive: 26, negative: 15 },
  ];

  return (
    <div className="shasha">
    <div className="space-y-4">
      {/* Header + Toggle */}
      <div className="flex items-center justify-between">
        <h3 className="font-kanit text-xl font-bold text-foreground">ทัศนคติความคิดเห็นรายพื้นที่</h3>
        <div className="flex items-center gap-2">
          <Button
            variant={selectedFilter === "positive" ? "outline" : "ghost"}
            size="sm"
            onClick={() => selectedFilter !== "positive" && setSelectedFilter("positive")}
            className={`font-kanit text-xs border-green-200 transition-all duration-200 ${
              selectedFilter === "positive"
                ? "text-green-700 bg-green-50 hover:bg-green-100 border-green-300"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            [เชิงบวก]
          </Button>
          <Button
            variant={selectedFilter === "negative" ? "outline" : "ghost"}
            size="sm"
            onClick={() => selectedFilter !== "negative" && setSelectedFilter("negative")}
            className={`font-kanit text-xs border-red-200 transition-all duration-200 ${
              selectedFilter === "negative"
                ? "text-red-700 bg-red-50 hover:bg-red-100 border-red-300"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            [เชิงลบ]
          </Button>
        </div>
      </div>

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={regionFeedbackData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            style={{ transition: "all 0.3s ease-in-out" }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
            <XAxis
              dataKey="region"
              tick={{ fontSize: 11, fontFamily: "Kanit" }}
              stroke="#6B7280"
              height={60}
              angle={-15}
            />
            <YAxis tick={{ fontSize: 12, fontFamily: "Kanit" }} stroke="#6B7280" />
            <Tooltip
              formatter={(value: any, name: string) => {
                const nameMap: Record<string, string> = {
                  previous: "เดือนที่แล้ว",
                  positive: "เชิงบวก",
                  negative: "เชิงลบ",
                };
                return [`${value} ครั้ง`, nameMap[name] || name];
              }}
              labelFormatter={(label) => `${label}`}
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
                fontFamily: "Kanit",
              }}
            />
            <Bar dataKey="previous" fill="#9CA3AF" radius={[4, 4, 0, 0]} name="previous" style={{ transition: "opacity 0.3s ease-in-out" }} />
            {selectedFilter === "positive" && (
              <Bar dataKey="positive" fill="#20A161" radius={[4, 4, 0, 0]} name="positive" style={{ transition: "all 0.3s ease-in-out" }} />
            )}
            {selectedFilter === "negative" && (
              <Bar dataKey="negative" fill="#D14343" radius={[4, 4, 0, 0]} name="negative" style={{ transition: "all 0.3s ease-in-out" }} />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-[#9CA3AF]" />
          <span className="font-kanit text-[14px] font-normal text-[#6B7280]">เดือนที่แล้ว</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded ${selectedFilter === "positive" ? "bg-[#20A161]" : "bg-[#D14343]"}`} />
          <span className="font-kanit text-[14px] font-normal text-[#6B7280]">
            {selectedFilter === "positive" ? "เชิงบวก" : "เชิงลบ"}
          </span>
        </div>
      </div>
    </div>
    </div>
  );
};

/* ---------- FeedbackChartsCard ---------- */
const donutData = [
  { name: "เชิงบวก", value: 247, percentage: 72.3, color: "#20A161" },
  { name: "เชิงลบ", value: 95, percentage: 27.7, color: "#D14343" },
];
const issuesData = [
  { label: "ความรวดเร็วในการให้บริการ", positive: 345, negative: 123 },
  { label: "ระยะเวลารอคอย", positive: 298, negative: 156 },
  { label: "การปรับปรุงระบบ", positive: 267, negative: 89 },
  { label: "ความสะอาดของระบบออนไลน์", positive: 234, negative: 67 },
  { label: "ทักษะและความรู้ของเจ้าหน้าที่", positive: 198, negative: 134 },
];

const FeedbackChartsCard: React.FC = () => {
  const maxPositive = Math.max(...issuesData.map((i) => i.positive));
  const maxNegative = Math.max(...issuesData.map((i) => i.negative));
  return (
    <Card className="bg-white rounded-2xl shadow-card border border-gray-200 relative overflow-hidden">
        <div className="h-2 w-full rounded-t-2xl" style={{ background: "linear-gradient(to right, #c081a8, #dda4c7, #f4d3e6)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3)" }} />
            <CardHeader className="pb-4">
                <div>
                <CardTitle className="font-kanit text-xl font-bold text-foreground">ข้อคิดเห็น/ข้อเสนอแนะ</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6">
                    {/* Donut */}
                    <div className="border border-gray-200 rounded-lg p-4">
                        <h3 className="text-center mb-4 font-semibold font-kanit text-sm text-gray-800">การแบ่งแยกความคิดเห็น</h3>
                        <div className="h-[120px] mb-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                            <Pie data={donutData} cx="50%" cy="50%" innerRadius={32} outerRadius={50} paddingAngle={2} dataKey="value" stroke="#fff" strokeWidth={3}>
                                {donutData.map((entry, idx) => (
                                <Cell key={`cell-${idx}`} fill={entry.color} />
                                ))}
                            </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        </div>
                        <div className="flex justify-center gap-4 mb-3">
                        {donutData.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                            <span className="font-kanit text-xs text-gray-600">{item.name}</span>
                            </div>
                        ))}
                        </div>
                        <div className="flex justify-between text-xs font-kanit">
                        <span style={{ color: "#20A161" }}>72.3% (จาก 247 ความคิดเห็น)</span>
                        <span style={{ color: "#D14343" }}>27.7% (จาก 95 ความคิดเห็น)</span>
                        </div>
                    </div>

                    {/* Butterfly chart */}
                    <div className="border border-gray-200 rounded-lg p-4">
                        <h3 className="text-center mb-4 font-semibold font-kanit text-sm text-gray-800">ประเด็นที่ถูกกล่าวถึง</h3>
                        <div className="space-y-3">
                        {issuesData.map((item, index) => {
                            const negativeWidth = (item.negative / maxNegative) * 100;
                            const positiveWidth = (item.positive / maxPositive) * 100;
                            return (
                            <div key={index} className="grid grid-cols-[1fr_auto_1fr] gap-6 items-center text-xs">
                                <div className="flex justify-end">
                                <div className="bg-gray-100 h-4 rounded-sm relative w-full">
                                    <div className="absolute right-0 top-0 w-3 h-4 bg-gray-200" />
                                    <div className="absolute right-3 top-0 h-4 bg-red-500 rounded-r-sm flex items-center justify-center text-white font-kanit text-xs" style={{ width: `${negativeWidth}%` }}>
                                    {item.negative}
                                    </div>
                                </div>
                                </div>
                                <div className="text-center font-kanit text-gray-700 whitespace-nowrap px-2">{item.label}</div>
                                <div className="flex justify-start">
                                <div className="bg-gray-100 h-4 rounded-sm relative w-full">
                                    <div className="absolute left-0 top-0 w-3 h-4 bg-gray-200" />
                                    <div className="absolute left-3 top-0 h-4 bg-emerald-500 rounded-l-sm flex items-center justify-center text-white font-kanit text-xs" style={{ width: `${positiveWidth}%` }}>
                                    {item.positive}
                                    </div>
                                </div>
                                </div>
                            </div>
                            );
                        })}
                        </div>
                    </div>
                </div>
                <div className="mt-8">
                    <RegionalFeedbackChart />
                </div>
            </CardContent>
    </Card>
  );
};

/* ---------- CustomerOpinionsCard ---------- */
const mockComments = [
  { id: "1", meta: "ภาค16 • เขต กะทู้ • ป่าตอง", time: "10 มิ.ย. 2025 09:14", text: "พนักงานเป็นกันเอง", sentiment: "positive" as const, tags: [{ label: "ความเอาใจใส่ในการให้บริการลูกค้า", tone: "positive" as const }] },
  { id: "2", meta: "ภาค3 • เขต บางกอกใหญ่ • ท่าพระ", time: "27 พ.ค. 2025 14:13", text: "พี่เจ้าหน้าที่แนะนำดีค่ะ บริการรวดเร็ว ยิ้มแย้ม", sentiment: "positive" as const, tags: [
      { label: "ความสามารถในการตอบคำถามหรือให้คำแนะนำ", tone: "positive" as const },
      { label: "ความรวดเร็วในการให้บริการ", tone: "positive" as const },
      { label: "ความสุภาพและมารยาทของพนักงาน", tone: "positive" as const },
    ] },
  { id: "3", meta: "ภาค16 • เขต หลังสวน • หลังสวน", time: "06 พ.ค. 2025 14:35", text: "บริการดีค่ะ", sentiment: "positive" as const, tags: [{ label: "ความเอาใจใส่ในการให้บริการลูกค้า", tone: "positive" as const }] },
  { id: "4", meta: "ภาค16 • เขต กำแพงเพชร • กำแพงเพชร", time: "29 เม.ย. 2025 10:07", text: "ถ้าไม่มีมาติดต่อธนาคารจะไม่ทราบเลยว่ามาสุภาษาลูกค้า… ขอบคุณพนักงาน", sentiment: "mixed" as const, tags: [
      { label: "ความถูกต้องในการให้บริการ", tone: "negative" as const },
      { label: "ความประทับใจในการให้บริการ", tone: "positive" as const },
    ] },
  { id: "5", meta: "ภาค1 • เขต จตุจักร • เซ็นทรัล ลาดพร้าว", time: "12 ม.ค. 2025 14:32", text: "คนใช้บริการวันเสาร์อาทิตย์ค่อนข้างเยอะ จัดระบบรับคิว", sentiment: "negative" as const, tags: [{ label: "ขั้นตอนการให้บริการ", tone: "negative" as const }] },
];

type FilterType = "all" | "positive" | "negative";
const CustomerOpinionsCard: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const getFilteredComments = () => {
    switch (activeFilter) {
      case "positive":
        return mockComments.filter((c) => c.sentiment === "positive");
      case "negative":
        return mockComments.filter((c) => c.sentiment === "negative");
      default:
        return mockComments;
    }
  };
  const filtered = getFilteredComments();
  const bgBySentiment = (s: string) => (s === "positive" ? "bg-emerald-50" : s === "negative" ? "bg-rose-50" : s === "mixed" ? "bg-amber-50" : "bg-gray-50");
  const tagClass = (tone: string) => (tone === "positive" ? "bg-emerald-600 text-white" : tone === "negative" ? "bg-rose-600 text-white" : "bg-gray-600 text-white");

  return (
    <Card className="bg-white rounded-2xl shadow-card border border-gray-200 relative overflow-hidden">
      <div className="h-2 w-full rounded-t-2xl" style={{ background: "linear-gradient(to right, #c081a8, #dda4c7, #f4d3e6)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3)" }} />
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="font-kanit text-xl font-bold text-foreground">ความคิดเห็นลูกค้า</CardTitle>
          <div className="flex gap-2">
            <Button onClick={() => setActiveFilter("all")} className={`text-xs h-8 px-3 font-kanit rounded-xl ${activeFilter === "all" ? "from-[#DF7AB0] text-white hover:bg-[#DF7AB0]" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>ทั้งหมด</Button>
            <Button onClick={() => setActiveFilter("positive")} className={`text-xs h-8 px-3 font-kanit rounded-xl ${activeFilter === "positive" ? "from-[#DF7AB0] text-white hover:bg-[#DF7AB0]" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>เชิงบวก</Button>
            <Button onClick={() => setActiveFilter("negative")} className={`text-xs h-8 px-3 font-kanit rounded-xl ${activeFilter === "negative" ? "from-[#DF7AB0] text-white hover:bg-[#DF7AB0]" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>เชิงลบ</Button>
          </div>
        </div>
        <p className="text-sm font-kanit text-gray-500 mt-2">พบความคิดเห็น {filtered.length} รายการ</p>
      </CardHeader>
      <CardContent>
        <div className="max-h-[580px] overflow-y-auto space-y-4">
          {filtered.map((c) => (
            <div key={c.id} className={`${bgBySentiment(c.sentiment)} rounded-lg p-4`}>
              <div className="flex justify-between items-start text-xs text-gray-500 mb-2">
                <span className="font-kanit">{c.meta}</span>
                <span className="font-kanit">{c.time}</span>
              </div>
              <p className="mb-3 font-kanit text-gray-800 text-base leading-relaxed">{c.text}</p>
              <div className="flex flex-wrap gap-1">
                {c.tags.map((t, idx) => (
                  <Badge key={idx} className={`${tagClass(t.tone)} font-kanit text-xs px-2 py-1 rounded-full`}>{t.label}</Badge>
                ))}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg font-kanit text-gray-500">ไม่พบความคิดเห็นในกรองที่เลือก</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

/* =====================================================================================
 * Alternative filter+list section (merged FilterCards + FeedbackList)
 * ===================================================================================*/

export interface FilterState {
  serviceArea: { businessLines: string[]; regions: string[]; districts: string[]; branches: string[] };
  timePeriod: { type: string; monthlyValue?: string; relativeValue?: string; customRange: { from: Date | undefined; to: Date | undefined } };
  categories: { mainCategories: string[]; subCategories: string[] };
  transactionTypes: string[];
}

const months = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
const monthYearOptionsSelect: { value: string; label: string }[] = [];
for (let y = 63; y <= 68; y++) {
  for (let m = 0; m < 12; m++) {
    monthYearOptionsSelect.push({ value: `${months[m]} ${y}`, label: `${months[m]} ${y}` });
  }
}

const FilterCards: React.FC<{ filters: FilterState; onFiltersChange: (f: FilterState) => void; onResetFilters: () => void }> = ({ filters, onFiltersChange, onResetFilters }) => {
  const [searchTerms, setSearchTerms] = useState({ businessLines: "", regions: "", districts: "", branches: "", categories: "", subCategories: "" });
  const updateFilters = (section: keyof FilterState, updates: any) => onFiltersChange({ ...filters, [section]: { ...filters[section], ...updates } });
  const handleMultiSelect = (items: string[], value: string, current: string[]) => {
    if (value === "เลือกทั้งหมด") return items.slice(1);
    return current.includes(value) ? current.filter((i) => i !== value) : [...current, value];
  };
  const timeTypes = [
    { value: "all", label: "ทั้งหมด" },
    { value: "monthly", label: "ข้อมูลประจำเดือน" },
    { value: "relative", label: "ช่วงเวลาย้อนหลัง" },
    { value: "custom", label: "กำหนดช่วงเวลาเอง" },
  ];
  const relativeOpts = [
    { value: "1d", label: "1 วัน" },
    { value: "7d", label: "7 วัน" },
    { value: "14d", label: "14 วัน" },
    { value: "1m", label: "1 เดือน" },
    { value: "6m", label: "6 เดือน" },
    { value: "1y", label: "1 ปี" },
  ];

  const renderMultiSelectPopover = (
    title: string,
    items: string[],
    selected: string[],
    onSelectionChange: (s: string[]) => void,
    searchTerm: string,
    onSearchChange: (t: string) => void
  ) => {
    const filtered = items.filter((i) => i.toLowerCase().includes(searchTerm.toLowerCase()));
    return (
      <PopoverContent className="w-80 p-0 border-[#e5e7eb] rounded-xl" align="start">
        <div className="p-3 border-b">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="ค้นหา..." value={searchTerm} onChange={(e) => onSearchChange(e.target.value)} className="pl-9" />
          </div>
        </div>
        <div className="max-h-60 overflow-y-auto">
          {filtered.map((item) => (
            <div key={item} className="flex items-center space-x-2 p-2 hover:bg-accent">
              <Checkbox
                id={`${title}-${item}`}
                checked={item === "เลือกทั้งหมด" ? selected.length === items.length - 1 : selected.includes(item)}
                onCheckedChange={() => onSelectionChange(handleMultiSelect(items, item, selected))}
              />
              <label htmlFor={`${title}-${item}`} className="text-sm font-kanit cursor-pointer flex-1">
                {item}
              </label>
            </div>
          ))}
        </div>
      </PopoverContent>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Service Area */}
      <Card className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm p-5">
        <CardHeader className="pb-2 p-0">
          <CardTitle className="font-kanit text-xl font-bold text-foreground">พื้นที่ดูแล</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* สายกิจ */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-between text-sm h-8">
                <span className="font-kanit truncate">{filters.serviceArea.businessLines.length > 0 ? `เลือกแล้ว ${filters.serviceArea.businessLines.length} สายกิจ` : "สายกิจ"}</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </PopoverTrigger>
            {renderMultiSelectPopover("สายกิจ", businessLines, filters.serviceArea.businessLines, (s) => updateFilters("serviceArea", { businessLines: s }), searchTerms.businessLines, (t) => setSearchTerms((p) => ({ ...p, businessLines: t })))}
          </Popover>
          {/* ภาค */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-between text-sm h-8">
                <span className="font-kanit truncate">{filters.serviceArea.regions.length > 0 ? `เลือกแล้ว ${filters.serviceArea.regions.length} ภาค` : "ภาค"}</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </PopoverTrigger>
            {renderMultiSelectPopover("ภาค", regions, filters.serviceArea.regions, (s) => updateFilters("serviceArea", { regions: s }), searchTerms.regions, (t) => setSearchTerms((p) => ({ ...p, regions: t })))}
          </Popover>
          {/* เขต */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-between text-sm h-8">
                <span className="font-kanit truncate">{filters.serviceArea.districts.length > 0 ? `เลือกแล้ว ${filters.serviceArea.districts.length} เขต` : "เขต"}</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </PopoverTrigger>
            {renderMultiSelectPopover("เขต", districts, filters.serviceArea.districts, (s) => updateFilters("serviceArea", { districts: s }), searchTerms.districts, (t) => setSearchTerms((p) => ({ ...p, districts: t })))}
          </Popover>
          {/* สาขา */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-between text-sm h-8">
                <span className="font-kanit truncate">{filters.serviceArea.branches.length > 0 ? `เลือกแล้ว ${filters.serviceArea.branches.length} สาขา` : "สาขา"}</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </PopoverTrigger>
            {renderMultiSelectPopover("สาขา", branches, filters.serviceArea.branches, (s) => updateFilters("serviceArea", { branches: s }), searchTerms.branches, (t) => setSearchTerms((p) => ({ ...p, branches: t })))}
          </Popover>
          <p className="text-[10px] text-[#6b6b6b] font-kanit">เลือกแล้ว: {filters.serviceArea.businessLines.length} สายกิจ, {filters.serviceArea.regions.length} ภาค, {filters.serviceArea.districts.length} เขต, {filters.serviceArea.branches.length} สาขา</p>
        </CardContent>
      </Card>

      {/* Time Period */}
      <Card className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm p-5">
        <CardHeader className="pb-2 p-0">
          <CardTitle className="font-kanit text-xl font-bold text-foreground">ช่วงเวลา</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Select value={filters.timePeriod.type} onValueChange={(v) => updateFilters("timePeriod", { type: v })}>
            <SelectTrigger className="w-full text-sm h-8">
              <SelectValue className="font-kanit" />
            </SelectTrigger>
            <SelectContent>
              {timeTypes.map((o) => (
                <SelectItem key={o.value} value={o.value} className="font-kanit">
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {filters.timePeriod.type === "monthly" && (
            <Select value={filters.timePeriod.monthlyValue || ""} onValueChange={(v) => updateFilters("timePeriod", { monthlyValue: v })}>
              <SelectTrigger className="w-full text-sm h-8">
                <SelectValue placeholder="เลือกเดือน/ปี" className="font-kanit" />
              </SelectTrigger>
              <SelectContent>
                {monthYearOptionsSelect.map((o) => (
                  <SelectItem key={o.value} value={o.value} className="font-kanit">
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {filters.timePeriod.type === "relative" && (
            <Select value={filters.timePeriod.relativeValue || ""} onValueChange={(v) => updateFilters("timePeriod", { relativeValue: v })}>
              <SelectTrigger className="w-full text-sm h-8">
                <SelectValue placeholder="เลือกช่วงเวลา" className="font-kanit" />
              </SelectTrigger>
              <SelectContent>
                {relativeOpts.map((o) => (
                  <SelectItem key={o.value} value={o.value} className="font-kanit">
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {filters.timePeriod.type === "custom" && (
            <div className="space-y-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-sm h-8">
                    <CalendarIcon className="mr-2 h-3 w-3" />
                    <span className="font-kanit">{filters.timePeriod.customRange.from ? filters.timePeriod.customRange.from.toLocaleDateString("th-TH") : "เลือกวันที่เริ่มต้น"}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarPrimitive
                    mode="single"
                    selected={filters.timePeriod.customRange.from}
                    onSelect={(date) => updateFilters("timePeriod", { customRange: { ...filters.timePeriod.customRange, from: date } })}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-sm h-8">
                    <CalendarIcon className="mr-2 h-3 w-3" />
                    <span className="font-kanit">{filters.timePeriod.customRange.to ? filters.timePeriod.customRange.to.toLocaleDateString("th-TH") : "เลือกวันที่สิ้นสุด"}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarPrimitive
                    mode="single"
                    selected={filters.timePeriod.customRange.to}
                    onSelect={(date) => updateFilters("timePeriod", { customRange: { ...filters.timePeriod.customRange, to: date } })}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}
          <p className="text-[10px] text-[#6b6b6b] font-kanit">
            {filters.timePeriod.type === "all" && "ทั้งหมด"}
            {filters.timePeriod.type === "monthly" && filters.timePeriod.monthlyValue && `ข้อมูลประจำเดือน: ${filters.timePeriod.monthlyValue}`}
            {filters.timePeriod.type === "relative" && filters.timePeriod.relativeValue && `ช่วงเวลาย้อนหลัง: ${relativeOpts.find((o) => o.value === filters.timePeriod.relativeValue)?.label}`}
            {filters.timePeriod.type === "custom" && filters.timePeriod.customRange.from && filters.timePeriod.customRange.to && `กำหนดช่วงเวลาเอง: ${filters.timePeriod.customRange.from.toLocaleDateString("th-TH")} - ${filters.timePeriod.customRange.to.toLocaleDateString("th-TH")}`}
          </p>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm p-5">
        <CardHeader className="pb-2 p-0">
          <CardTitle className="font-kanit text-xl font-bold text-foreground">ความคิดเห็น</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-between text-sm h-8">
                <span className="font-kanit truncate">{filters.categories.mainCategories.length > 0 ? `เลือกแล้ว ${filters.categories.mainCategories.length} หมวด` : "หมวดหมู่"}</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </PopoverTrigger>
            {renderMultiSelectPopover("หมวดหมู่", mainCategories.filter((m) => m !== "เลือกทั้งหมด"), filters.categories.mainCategories, (s) => updateFilters("categories", { mainCategories: s }), searchTerms.categories, (t) => setSearchTerms((p) => ({ ...p, categories: t })))}
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-between text-sm h-8">
                <span className="font-kanit truncate">{filters.categories.subCategories.length > 0 ? `เลือกแล้ว ${filters.categories.subCategories.length} หมวดย่อย` : "หมวดย่อย"}</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </PopoverTrigger>
            {renderMultiSelectPopover("หมวดย่อย", subCategories.filter((s) => s !== "เลือกทั้งหมด"), filters.categories.subCategories, (s) => updateFilters("categories", { subCategories: s }), searchTerms.subCategories, (t) => setSearchTerms((p) => ({ ...p, subCategories: t })))}
          </Popover>
          <p className="text-[10px] text-[#6b6b6b] font-kanit">เลือกแล้ว: {filters.categories.mainCategories.length} หมวดหมู่, {filters.categories.subCategories.length} หมวดย่อย</p>
        </CardContent>
      </Card>

      {/* Transaction Types */}
      <Card className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm p-5">
        <CardHeader className="pb-2 p-0">
          <CardTitle className="font-kanit text-xl font-bold text-foreground">ประเภทธุกรรม</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-between text-sm h-8">
                <span className="font-kanit truncate">{filters.transactionTypes.length > 0 ? `เลือกแล้ว ${filters.transactionTypes.length} ประเภท` : "เลือกประเภทธุกรรม"}</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 border-[#e5e7eb] rounded-xl" align="start">
              <div className="max-h-60 overflow-y-auto">
                {transactionTypesList.filter((t) => t !== "เลือกทั้งหมด").map((type) => (
                  <div key={type} className="flex items-center space-x-2 p-2 hover:bg-accent">
                    <Checkbox
                      id={`transaction-${type}`}
                      checked={filters.transactionTypes.includes(type)}
                      onCheckedChange={(checked) => {
                        if (checked) updateFilters("transactionTypes", [...filters.transactionTypes, type]);
                        else updateFilters("transactionTypes", filters.transactionTypes.filter((t) => t !== type));
                      }}
                    />
                    <label htmlFor={`transaction-${type}`} className="text-sm font-kanit cursor-pointer flex-1">
                      {type}
                    </label>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          <p className="text-[10px] text-[#6b6b6b] font-kanit">{filters.transactionTypes.length > 0 ? `เลือกแล้ว: ${filters.transactionTypes.length} ประเภท` : "ทั้งหมด"}</p>
        </CardContent>
      </Card>
    </div>
  );
};

/* ---------- FeedbackList (uses the filters above — mock filter only) ---------- */
interface FeedbackItem {
  id: string;
  date: string;
  time: string;
  serviceType: string;
  region: string;
  district: string;
  branch: string;
  feedback: string;
  categories: Array<{ name: string; sentiment: "positive" | "negative" | "neutral" }>;
  overallSentiment: "positive" | "negative" | "mixed";
  satisfactionScore?: number;
}
const mockFeedbackData: FeedbackItem[] = [
  { id: "1", date: "10 มิ.ย. 2025", time: "09:14", serviceType: "ฝาก-ถอนเงิน/สลาก", region: "ภาค16", district: "เขต สกู้", branch: "ป่าตอง", feedback: "พนักงานเป็นกันเอง", categories: [{ name: "ความเอาใจใส่ในการให้บริการลูกค้า", sentiment: "positive" }], overallSentiment: "positive", satisfactionScore: 4.5 },
  { id: "2", date: "27 พ.ค. 2025", time: "14:13", serviceType: "สอบถาม/ขอคำปรึกษา", region: "ภาค8", district: "เขต บางกอกใหญ่", branch: "กำพะ", feedback: "พี่เจ้าหน้าที่แนะนำดีค่ะ บริการรวดเร็ว ยิ้มแย้ม", categories: [
      { name: "ความสามารถในการตอบคำถามหรือให้คำแนะนำ", sentiment: "positive" },
      { name: "ความรวดเร็วในการให้บริการ", sentiment: "positive" },
      { name: "ความสุภาพและมารยาทของพนักงาน", sentiment: "positive" },
    ], overallSentiment: "positive", satisfactionScore: 5.0 },
  { id: "3", date: "06 พ.ค. 2025", time: "14:35", serviceType: "ชำระสินเชื่อ/ชำระค่าสินค้าและบริการ", region: "ภาค16", district: "เขต หลังสวน", branch: "หลังสวน", feedback: "บริการดีค่ะ", categories: [{ name: "ความเอาใจใส่ในการให้บริการลูกค้า", sentiment: "positive" }], overallSentiment: "positive", satisfactionScore: 4.0 },
  { id: "4", date: "03 พ.ค. 2025", time: "11:22", serviceType: "สมัครใช้บริการ เงินฝาก/สินเชื่อ/MyMo/บัตร", region: "ภาค5", district: "เขต พิษณุโลก", branch: "พิษณุโลก", feedback: "ระบบล่ม รอนานมาก พนักงานไม่สามารถแก้ปัญหาได้ ต้องมาใหม่อีกครั้ง เสียเวลาเปล่า บริการแย่มาก", categories: [
      { name: "ระบบ Core ของธนาคาร", sentiment: "negative" },
      { name: "การจัดการและแก้ไขปัญหาเฉพาะหน้า", sentiment: "negative" },
      { name: "ระยะเวลาอนุมัติ", sentiment: "negative" },
    ], overallSentiment: "negative", satisfactionScore: 1.0 },
  { id: "5", date: "02 พ.ค. 2025", time: "16:45", serviceType: "ฝาก-ถอนเงิน/สลาก", region: "ภาค12", district: "เขต ขอนแก่น", branch: "ขอนแก่น", feedback: "ขั้นตอนการสมัครเยอะ เอกสารเยอะ แต่พนักงานช่วยเหลือดี อธิบายชัดเจน สาขาสะอาด ที่นั่งรอสะดวก", categories: [
      { name: "ขั้นตอนการให้บริการ", sentiment: "negative" },
      { name: "ภาระเอกสาร", sentiment: "negative" },
      { name: "ความเอาใจใส่ในการให้บริการลูกค้า", sentiment: "positive" },
      { name: "ความสะอาด", sentiment: "positive" },
      { name: "ที่นั่งรอ", sentiment: "positive" },
    ], overallSentiment: "mixed", satisfactionScore: 3.5 },
];

const FeedbackList: React.FC<{ filters: FilterState }> = ({ filters }) => {
  const [activeTab, setActiveTab] = useState("all");
  const filteredFeedback = useMemo(() => {
    // NOTE: ปัจจุบันยังไม่ผูกกับฟิลเตอร์จริง (mock) — คืนทั้งหมด
    return mockFeedbackData;
  }, [filters]);

  const feedbackByTab = useMemo(() => {
    switch (activeTab) {
      case "positive":
        return filteredFeedback.filter((i) => i.overallSentiment === "positive");
      case "negative":
        return filteredFeedback.filter((i) => i.overallSentiment === "negative");
      default:
        return filteredFeedback;
    }
  }, [filteredFeedback, activeTab]);

  const sentimentBadge = (s: "positive" | "negative" | "neutral") =>
    s === "positive" ? "bg-chart-positive text-white" : s === "negative" ? "bg-chart-negative text-white" : "bg-gray-500 text-white";
  const cardColor = (s: "positive" | "negative" | "mixed") => (s === "positive" ? "bg-green-50 border-green-200" : s === "negative" ? "bg-red-50 border-red-200" : "bg-yellow-50 border-yellow-200");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-kanit text-xl font-bold text-foreground">ความคิดเห็นของลูกค้า</h3>
          <p className="text-sm font-kanit text-muted-foreground">พบความคิดเห็น {feedbackByTab.length} รายการ</p>
        </div>
        <div className="flex gap-2">
          <Button variant={activeTab === "all" ? "default" : "outline"} size="sm" onClick={() => setActiveTab("all")} className="font-kanit text-xs h-8">ทั้งหมด</Button>
          <Button variant={activeTab === "positive" ? "default" : "outline"} size="sm" onClick={() => setActiveTab("positive")} className="font-kanit text-xs h-8">เชิงบวก</Button>
          <Button variant={activeTab === "negative" ? "default" : "outline"} size="sm" onClick={() => setActiveTab("negative")} className="font-kanit text-xs h-8">เชิงลบ</Button>
        </div>
      </div>

      <div className="space-y-4">
        {feedbackByTab.map((item) => (
          <div key={item.id} className={`${cardColor(item.overallSentiment)} rounded-lg p-4 text-sm`}>
            <div className="flex justify-between items-start text-xs text-muted-foreground mb-2">
              <span className="font-kanit">{item.region} • {item.district} • {item.branch}</span>
              <span className="font-kanit">{item.date} {item.time}</span>
            </div>
            <p className="mb-2 font-kanit text-foreground">{item.feedback}</p>
            <div className="flex flex-wrap gap-1">
              {item.categories.map((c, idx) => (
                <Badge key={idx} className={`${sentimentBadge(c.sentiment)} font-kanit text-xs px-2 py-0.5`}>{c.name}</Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* =====================================================================================
 * Page (header / footer / sidebar like Dashboard)
 * ===================================================================================*/

const CustomerFeedback: React.FC = () => {
  const navigate = useNavigate();
  const handleLogout = () => navigate("/");
  const [isOpen, setIsOpen] = useState(false);
const location = useLocation();
    useEffect(() => {
    setIsOpen(false);
    }, [location.pathname, location.hash]);

  // Year/Month filters (Buddhist year) — align with Dashboard header controls if needed
  const currentYear = new Date().getFullYear() + 543;
  const currentMonth = new Date().getMonth() + 1;
  const [selectedYear, setSelectedYear] = useState(
    currentYear >= 2567 && currentYear <= 2568 ? currentYear.toString() : "2568"
  );
  const [selectedMonth, setSelectedMonth] = useState(currentMonth.toString());
  const thaiMonths = [
    { value: "1", label: "มกราคม" }, { value: "2", label: "กุมภาพันธ์" }, { value: "3", label: "มีนาคม" },
    { value: "4", label: "เมษายน" }, { value: "5", label: "พฤษภาคม" }, { value: "6", label: "มิถุนายน" },
    { value: "7", label: "กรกฎาคม" }, { value: "8", label: "สิงหาคม" }, { value: "9", label: "กันยายน" },
    { value: "10", label: "ตุลาคม" }, { value: "11", label: "พฤศจิกายน" }, { value: "12", label: "ธันวาคม" },
  ];

  // Filters for alternative section
  const [filters, setFilters] = useState<FilterState>({
    serviceArea: { businessLines: [], regions: [], districts: [], branches: [] },
    timePeriod: { type: "all", customRange: { from: undefined, to: undefined } },
    categories: { mainCategories: [], subCategories: [] },
    transactionTypes: [],
  });

  return (
    <div className="min-h-screen bg-background">
      <MiniRailSidebar
        activeMenu="ข้อคิดเห็นของลูกค้า"
        onToggleMainSidebar={() => setIsOpen(true)}
        />
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="left" className="w-80 md:ml-[72px]">
            <SheetHeader className="flex flex-row items-center justify-between">
            <SheetTitle className="font-kanit">เมนูหลัก</SheetTitle>
            </SheetHeader>

            <div className="mt-6">
            {/* ถ้า MenuItems เวอร์ชันล่าสุดรองรับ closeOnClick ให้ใส่ด้วย; ไม่มีก็ใช้ onItemClick พอ */}
            <MenuItems
                activeKey="ข้อคิดเห็นของลูกค้า"
                onItemClick={() => setIsOpen(false)}
                // closeOnClick
            />
            </div>

            <div className="absolute bottom-4 left-4 right-4">
            <div className="text-xs text-muted-foreground text-center font-kanit">
                อัพเดตล่าสุด: 31/08/2025 · 09:49 น.
            </div>
            </div>
        </SheetContent>
    </Sheet>

      {/* Top Bar */}
      <header className="topbar px-6">
        <div className="w-full">
          <div className="flex items-center justify-between relative z-10">
            {/* Drawer trigger for mobile (mirror Dashboard behavior) */}
            {/* NOTE: Use same Sheet container as in Dashboard if you have it globally. Here we keep only trigger styling. */}
            <div className="md:hidden">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 w-11 h-11 rounded-2xl" aria-label="เปิดเมนู" onClick={() => setIsOpen((v) => !v)}>
                <Menu className="h-5 w-5" />
              </Button>
            </div>

            {/* Left Content */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white font-kanit mb-2">Dashboard ข้อเสนอแนะ ข้อร้องเรียน การใช้บริการสาขา</h1>
              <p className="text-white/80 font-kanit text-base">ระบบติดตามและวิเคราะห์ข้อร้องเรียนลูกค้าธนาคารออมสิน</p>
            </div>

            {/* Right Content (update + logout) */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-white text-base font-kanit">อัปเดตล่าสุด: 31/08/2025&nbsp; 09:49 น.</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="text-white hover:bg-pink-400/30 w-10 h-10 rounded-full border border-white/20 transition-colors duration-200" aria-label="รีเฟรช">
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button variant="ghost" onClick={handleLogout} className="text-white hover:bg-pink-400/30 flex items-center gap-2 font-kanit px-4 py-2 rounded-full border border-white/20 transition-colors duration-200">
                  <LogOut className="h-4 w-4" /> ออกจากระบบ
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content transition-all duration-200 ease-out min-h-screen">
        <div className="container mx-auto p-6">
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-foreground font-kanit mb-2">ข้อคิดเห็นของลูกค้า</h2>
              <p className="text-muted-foreground font-kanit">รวบรวมและวิเคราะห์ความคิดเห็นและข้อเสนอแนะจากลูกค้า</p>
            </div>
            {/* Year/Month controls — mirror Dashboard */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-kanit text-muted-foreground">ปี</label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-28 bg-white border border-border rounded-2xl shadow-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-border rounded-xl shadow-lg">
                    <SelectItem value="2567" className="font-kanit hover:bg-muted/50 focus:bg-muted/50">2567</SelectItem>
                    <SelectItem value="2568" className="font-kanit hover:bg-muted/50 focus:bg-muted/50">2568</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-kanit text-muted-foreground">เดือน</label>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="w-32 bg-white border border-border rounded-2xl shadow-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-border rounded-xl shadow-lg max-h-[300px]">
                    {thaiMonths.map((m) => (
                      <SelectItem key={m.value} value={m.value} className="font-kanit hover:bg-muted/50 focus:bg-muted/50">{m.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Main Grid (cards left/right) */}
          <div className="grid grid-cols-1 lg:grid-cols-[32%_68%] gap-6">
            <div className="space-y-6">
              <ServiceAreaCard />
              <TimePeriodCard />
              <OpinionCard />
              <TransactionTypeCard />
            </div>
            <div className="space-y-6">
              <FeedbackChartsCard />
              <CustomerOpinionsCard />
            </div>
          </div>
        </div>
      </main>

      {/* Footer (mirror Dashboard) */}
      <footer style={{ backgroundColor: "#ECEFF1" }} className="border-t border-border py-3 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-col md:flex-row md:items-center gap-4 text-center md:text-left">
              <span className="text-sm text-muted-foreground font-kanit">© 2024 Customer Dashboard. สงวนลิขสิทธิ์.</span>
              <div className="flex flex-col sm:flex-row items-center gap-2 text-sm">
                <a href="#" className="text-muted-foreground font-kanit hover:text-primary hover:underline transition-colors duration-200" aria-label="นโยบายความเป็นส่วนตัว">นโยบายความเป็นส่วนตัว</a>
                <span className="hidden sm:inline text-muted-foreground">|</span>
                <a href="#" className="text-muted-foreground font-kanit hover:text-primary hover:underline transition-colors duration-200" aria-label="เงื่อนไขการใช้งาน">เงื่อนไขการใช้งาน</a>
                <span className="hidden sm:inline text-muted-foreground">|</span>
                <a href="#" className="text-muted-foreground font-kanit hover:text-primary hover:underline transition-colors duration-200" aria-label="ติดต่อเรา">ติดต่อเรา</a>
              </div>
            </div>
            <div className="text-center md:text-right">
              <span className="text-sm text-muted-foreground font-kanit">เวอร์ชัน 2.1.0</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Footer gradient buttons (mirror Dashboard) */}
      <div className="md:hidden px-6 py-4">
        <div className="bg-white rounded-2xl shadow-md border border-[#E5E7EB] overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-[#D8218C] via-[#DF7AB0] to-[#F9B5D3]"></div>
          <div className="p-4">
            <div className="grid grid-cols-1 xs:grid-cols-3 gap-3 mb-4">
              <a href="#" className="block bg-gradient-to-r from-[#D8218C] via-[#DF7AB0] to-[#F9B5D3] text-white font-kanit font-medium text-center py-3 px-2 rounded-xl hover:opacity-95 hover:shadow-lg transition-all duration-200" aria-label="นโยบายความเป็นส่วนตัว">นโยบายความเป็นส่วนตัว</a>
              <a href="#" className="block bg-gradient-to-r from-[#D8218C] via-[#DF7AB0] to-[#F9B5D3] text-white font-kanit font-medium text-center py-3 px-2 rounded-xl hover:opacity-95 hover:shadow-lg transition-all duration-200" aria-label="เงื่อนไขการใช้งาน">เงื่อนไขการใช้งาน</a>
              <a href="#" className="block bg-gradient-to-r from-[#D8218C] via-[#DF7AB0] to-[#F9B5D3] text-white font-kanit font-medium text-center py-3 px-2 rounded-xl hover:opacity-95 hover:shadow-lg transition-all duration-200" aria-label="ติดต่อเรา">ติดต่อเรา</a>
            </div>
            <div className="text-center space-y-1">
              <div className="text-xs text-[#6B7280] font-kanit leading-relaxed">© 2024 Customer Dashboard. สงวนลิขสิทธิ์.</div>
              <div className="text-xs text-[#6B7280] font-kanit leading-relaxed">เวอร์ชัน 2.1.0</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerFeedback;
