import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Search, CalendarIcon, ChevronDown, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export interface FilterState {
  serviceArea: {
    businessLines: string[];
    regions: string[];
    districts: string[];
    branches: string[];
  };
  timePeriod: {
    type: string;
    monthlyValue?: string;
    relativeValue?: string;
    customRange: {
      from: Date | undefined;
      to: Date | undefined;
    };
  };
  categories: {
    mainCategories: string[];
    subCategories: string[];
  };
  transactionTypes: string[];
}

interface FilterCardsProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onResetFilters: () => void;
}

// Complete data from the specification
const businessLines = ["สายกิจ1", "สายกิจ2", "สายกิจ3", "สายกิจ4", "สายกิจ5", "สายกิจ6"];

const regions = Array.from({length: 18}, (_, i) => `ภาค${i+1}`);

const districts = [
  "บางเขน","ราชวัตร","สะพานใหม่","ห้วยขวาง","คลองจั่น","ถนนเพชรบุรี","บางรัก","พร้อมพงษ์","พระโขนง","มีนบุรี","บางคอแหลม","บางแค",
  "ราษฎร์บูรณะ","ศิริราช","ประจวบคีรีขันธ์","เพชรบุรี","ราชบุรี","สมุทรสาคร","กาญจนบุรี","นครปฐม","นนทบุรี 1","นนทบุรี 2","สุพรรณบุรี","นครสวรรค์",
  "พิจิตร","เพชรบูรณ์","ลพบุรี","อุทัยธานี","กำแพงเพชร","ตาก","พิษณุโลก 1","พิษณุโลก 2","สุโขทัย","อุตรดิตถ์","เชียงใหม่ 1","เชียงใหม่ 2",
  "เชียงใหม่ 3","ลำพูน","เชียงราย","น่าน","พะเยา","แพร่","ลำปาง","นครพนม","บึงกาฬ","เลย","สกลนคร","หนองคาย",
  "หนองบัวลำภู","อุดรธานี 1","อุดรธานี 2","กาฬสินธุ์","ขอนแก่น 1","ขอนแก่น 2","ชัยภูมิ","มหาสารคาม","มุกดาหาร","ร้อยเอ็ด","บุรีรัมย์","ยโสธร",
  "ศรีสะเกษ","สุรินทร์","อุบลราชธานี 1","อุบลราชธานี 2","นครราชสีมา 1","นครราชสีมา 2","นครราชสีมา 3","ปราจีนบุรี","สระแก้ว","ปทุมธานี 1","ปทุมธานี 2",
  "พระนครศรีอยุธยา 1","พระนครศรีอยุธยา 2","สระบุรี","อ่างทอง","จันทบุรี","ฉะเชิงเทรา","ชลบุรี 1","ชลบุรี 2","ชลบุรี 3","ชลบุรี 4","ระยอง","สมุทรปราการ 1","สมุทรปราการ 2",
  "ชุมพร 1","ชุมพร 2","พังงา","ภูเก็ต","สุราษฎร์ธานี 1","สุราษฎร์ธานี 2","กระบี่","ตรัง","นครศรีธรรมราช 1","นครศรีธรรมราช 2","พัทลุง","นราธิวาส","ปัตตานี","สงขลา 1","สงขลา 2"
];

// Sample branches - full list would be very long, so showing representative ones
const branches = [
  "สำนักพหลโยธิน", "กรีนพลาซ่า (วังหิน)", "จตุจักร", "เซ็นทรัล ลาดพร้าว", "ตลาด อ.ต.ก.", "เตาปูน", "บางเขน", "ประชาชื่น", "ประชานิเวศน์ 1", "พงษ์เพชร",
  "มหาวิทยาลัยเกษตรศาสตร์", "มาร์เก็ต เพลส วงศ์สว่าง", "อเวนิว รัชโยธิน", "เอนเนอร์ยี่ คอมเพล็กซ์", "ถนนประดิพัทธ์", "ทำเนียบรัฐบาล", "นางเลิ้ง", "มหานาค",
  "แยกพิชัย", "ราชวัตร", "ศรีย่าน", "สวนจิตรลดา", "สุพรีม คอมเพล็กซ์ สามเสน", "กรมการกงสุล", "ดอนเมือง", "เดอะแจส รามอินทรา", "ตลาดยิ่งเจริญ", "ตลาดวงศกร",
  "ถนนสรงประภา", "บิ๊กซี แจ้งวัฒนะ", "วัชรพล", "ศูนย์ราชการเฉลิมพระเกียรติ แจ้งวัฒนะ (อาคาร A)", "ศูนย์ราชการเฉลิมพระเกียรติ แจ้งวัฒนะ (อาคาร B)", "สะพานใหม่",
  "อนุสรณ์สถานแห่งชาติ", "ไอที สแควร์", "กระทรวงการคลัง", "ชัยสมรภูมิ", "เซ็นทรัล พระราม 9", "ดินแดง", "บิ๊กซี ลาดพร้าว 2", "ยุติธรรม", "ลาดพร้าว", "ห้วยขวาง"
];

const mainCategories = [
  "Market Conduct", "กระบวนการให้บริการ", "ความประทับใจอื่นๆ", "เงื่อนไขผลิตภัณฑ์", 
  "พนักงานและบุคลากร", "ระบบธนาคารและเทคโนโลยี", "สภาพแวดล้อมและสิ่งอำนวยความสะดวก"
];

const subCategories = [
  "การบังคับ", "การรบกวน", "การหลอกลวง", "การเอาเปรียบ", "ขั้นตอนการให้บริการ", "ความพร้อมในการให้บริการ",
  "ภาระเอกสาร", "อื่นๆ", "เกณฑ์การอนุมัติ", "ความเรียบง่ายข้อมูล", "ระยะเวลาอนุมัติ", "รายละเอียดผลิตภัณฑ์",
  "การจัดการและแก้ไขปัญหาเฉพาะหน้า", "ความถูกต้องในการให้บริการ", "ความประทับใจในการให้บริการ",
  "ความรวดเร็วในการให้บริการ", "ความสามารถในการตอบคำถามหรือให้คำแนะนำ", "ความสุภาพและมารยาทของพนักงาน",
  "ความเอาใจใส่ในการให้บริการลูกค้า", "รปภ. แม่บ้าน ฯลฯ", "ATM ADM CDM", "เครื่องนับเงิน", "เครื่องปรับสมุด",
  "เครื่องออกบัตรคิว", "ระบบ Core ของธนาคาร", "ระบบยืนยันตัวตน", "แอปพลิเคชั่น MyMo", "ความสะอาด",
  "ทำเลพื้นที่และความคับคั่ง", "ที่จอดรถ", "ที่นั่งรอ", "ป้าย-สื่อประชาสัมพันธ์", "สิ่งอำนวยความสะดวกอื่นๆ",
  "เสียง", "แสงสว่าง", "ห้องน้ำ", "อุณหภูมิ"
];

const transactionTypes = [
  "ฝาก-ถอนเงิน/สลาก",
  "ชำระสินเชื่อ/ชำระค่าสินค้าและบริการ", 
  "สมัครใช้บริการ เงินฝาก/สินเชื่อ/MyMo/บัตร",
  "สอบถาม/ขอคำปรึกษา",
  "อื่น ๆ"
];

const timePeriodOptions = [
  { value: "all", label: "ทั้งหมด" },
  { value: "monthly", label: "ข้อมูลประจำเดือน" },
  { value: "relative", label: "ช่วงเวลาย้อนหลัง" },
  { value: "custom", label: "กำหนดช่วงเวลาเอง" }
];

const relativeTimeOptions = [
  { value: "1d", label: "1 วัน" },
  { value: "7d", label: "7 วัน" },
  { value: "14d", label: "14 วัน" },
  { value: "1m", label: "1 เดือน" },
  { value: "6m", label: "6 เดือน" },
  { value: "1y", label: "1 ปี" }
];

// Generate month-year options
const months = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
const monthYearOptions: { value: string; label: string; }[] = [];
for (let y = 63; y <= 68; y++) {
  for (let m = 0; m < 12; m++) {
    monthYearOptions.push({
      value: `${months[m]} ${y}`,
      label: `${months[m]} ${y}`
    });
  }
}

export const FilterCards = ({ filters, onFiltersChange, onResetFilters }: FilterCardsProps) => {
  const [searchTerms, setSearchTerms] = useState({
    businessLines: "",
    regions: "",
    districts: "",
    branches: "",
    categories: "",
    subCategories: ""
  });

  const updateFilters = (section: keyof FilterState, updates: any) => {
    onFiltersChange({
      ...filters,
      [section]: { ...filters[section], ...updates }
    });
  };

  const handleMultiSelect = (items: string[], value: string, currentSelection: string[]) => {
    if (value === "เลือกทั้งหมด") {
      return items.slice(1); // Select all except "เลือกทั้งหมด"
    }
    
    if (currentSelection.includes(value)) {
      return currentSelection.filter(item => item !== value);
    } else {
      return [...currentSelection, value];
    }
  };

  const renderMultiSelectPopover = (
    title: string,
    items: string[],
    selectedItems: string[],
    onSelectionChange: (selection: string[]) => void,
    searchTerm: string,
    onSearchChange: (term: string) => void
  ) => {
    const filteredItems = items.filter(item => 
      item.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <PopoverContent className="w-80 p-0 border-[#e5e7eb] rounded-xl" align="start">
        <div className="p-3 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="ค้นหา..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <div className="max-h-60 overflow-y-auto">
          {filteredItems.map((item) => (
            <div key={item} className="flex items-center space-x-2 p-2 hover:bg-accent">
              <Checkbox
                id={`${title}-${item}`}
                checked={item === "เลือกทั้งหมด" ? selectedItems.length === items.length - 1 : selectedItems.includes(item)}
                onCheckedChange={() => {
                  const newSelection = handleMultiSelect(items, item, selectedItems);
                  onSelectionChange(newSelection);
                }}
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
      {/* Card 1: Service Area */}
      <Card className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm p-5">
        <CardHeader className="pb-2 p-0">
          <CardTitle className="text-[14px] font-semibold leading-[20px] mb-3 font-kanit text-foreground">พื้นที่ดูแล</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Business Lines */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-between text-sm h-8">
                <span className="font-kanit truncate">
                  {filters.serviceArea.businessLines.length > 0 
                    ? `เลือกแล้ว ${filters.serviceArea.businessLines.length} สายกิจ`
                    : "สายกิจ"
                  }
                </span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </PopoverTrigger>
            {renderMultiSelectPopover(
              "สายกิจ",
              businessLines,
              filters.serviceArea.businessLines,
              (selection) => updateFilters('serviceArea', { businessLines: selection }),
              searchTerms.businessLines,
              (term) => setSearchTerms(prev => ({ ...prev, businessLines: term }))
            )}
          </Popover>

          {/* Regions */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-between text-sm h-8">
                <span className="font-kanit truncate">
                  {filters.serviceArea.regions.length > 0 
                    ? `เลือกแล้ว ${filters.serviceArea.regions.length} ภาค`
                    : "ภาค"
                  }
                </span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </PopoverTrigger>
            {renderMultiSelectPopover(
              "ภาค",
              regions,
              filters.serviceArea.regions,
              (selection) => updateFilters('serviceArea', { regions: selection }),
              searchTerms.regions,
              (term) => setSearchTerms(prev => ({ ...prev, regions: term }))
            )}
          </Popover>

          {/* Districts */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-between text-sm h-8">
                <span className="font-kanit truncate">
                  {filters.serviceArea.districts.length > 0 
                    ? `เลือกแล้ว ${filters.serviceArea.districts.length} เขต`
                    : "เขต"
                  }
                </span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </PopoverTrigger>
            {renderMultiSelectPopover(
              "เขต",
              districts,
              filters.serviceArea.districts,
              (selection) => updateFilters('serviceArea', { districts: selection }),
              searchTerms.districts,
              (term) => setSearchTerms(prev => ({ ...prev, districts: term }))
            )}
          </Popover>

          {/* Branches */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-between text-sm h-8">
                <span className="font-kanit truncate">
                  {filters.serviceArea.branches.length > 0 
                    ? `เลือกแล้ว ${filters.serviceArea.branches.length} สาขา`
                    : "สาขา"
                  }
                </span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </PopoverTrigger>
            {renderMultiSelectPopover(
              "สาขา",
              branches,
              filters.serviceArea.branches,
              (selection) => updateFilters('serviceArea', { branches: selection }),
              searchTerms.branches,
              (term) => setSearchTerms(prev => ({ ...prev, branches: term }))
            )}
          </Popover>

          {/* Summary */}
          <p className="text-[10px] text-[#6b6b6b] font-kanit">
            เลือกแล้ว: {filters.serviceArea.businessLines.length} สายกิจ, {filters.serviceArea.regions.length} ภาค, {filters.serviceArea.districts.length} เขต, {filters.serviceArea.branches.length} สาขา
          </p>
        </CardContent>
      </Card>

      {/* Card 2: Time Period */}
      <Card className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm p-5">
        <CardHeader className="pb-2 p-0">
          <CardTitle className="text-[14px] font-semibold leading-[20px] mb-3 font-kanit text-foreground">ช่วงเวลา</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Select 
            value={filters.timePeriod.type} 
            onValueChange={(value) => updateFilters('timePeriod', { type: value })}
          >
            <SelectTrigger className="w-full text-sm h-8">
              <SelectValue className="font-kanit" />
            </SelectTrigger>
            <SelectContent>
              {timePeriodOptions.map((option) => (
                <SelectItem key={option.value} value={option.value} className="font-kanit">
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Monthly selector */}
          {filters.timePeriod.type === "monthly" && (
            <Select 
              value={filters.timePeriod.monthlyValue || ""} 
              onValueChange={(value) => updateFilters('timePeriod', { monthlyValue: value })}
            >
              <SelectTrigger className="w-full text-sm h-8">
                <SelectValue placeholder="เลือกเดือน/ปี" className="font-kanit" />
              </SelectTrigger>
              <SelectContent>
                {monthYearOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="font-kanit">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Relative time selector */}
          {filters.timePeriod.type === "relative" && (
            <Select 
              value={filters.timePeriod.relativeValue || ""} 
              onValueChange={(value) => updateFilters('timePeriod', { relativeValue: value })}
            >
              <SelectTrigger className="w-full text-sm h-8">
                <SelectValue placeholder="เลือกช่วงเวลา" className="font-kanit" />
              </SelectTrigger>
              <SelectContent>
                {relativeTimeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="font-kanit">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Custom date range */}
          {filters.timePeriod.type === "custom" && (
            <div className="space-y-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-sm h-8">
                    <CalendarIcon className="mr-2 h-3 w-3" />
                    <span className="font-kanit">
                      {filters.timePeriod.customRange.from ? format(filters.timePeriod.customRange.from, "dd/MM/yyyy") : "เลือกวันที่เริ่มต้น"}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.timePeriod.customRange.from}
                    onSelect={(date) => updateFilters('timePeriod', { 
                      customRange: { ...filters.timePeriod.customRange, from: date }
                    })}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-sm h-8">
                    <CalendarIcon className="mr-2 h-3 w-3" />
                    <span className="font-kanit">
                      {filters.timePeriod.customRange.to ? format(filters.timePeriod.customRange.to, "dd/MM/yyyy") : "เลือกวันที่สิ้นสุด"}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.timePeriod.customRange.to}
                    onSelect={(date) => updateFilters('timePeriod', { 
                      customRange: { ...filters.timePeriod.customRange, to: date }
                    })}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}

          {/* Time period summary */}
          <p className="text-[10px] text-[#6b6b6b] font-kanit">
            {filters.timePeriod.type === "all" && "ทั้งหมด"}
            {filters.timePeriod.type === "monthly" && filters.timePeriod.monthlyValue && `ข้อมูลประจำเดือน: ${filters.timePeriod.monthlyValue}`}
            {filters.timePeriod.type === "relative" && filters.timePeriod.relativeValue && `ช่วงเวลาย้อนหลัง: ${relativeTimeOptions.find(o => o.value === filters.timePeriod.relativeValue)?.label}`}
            {filters.timePeriod.type === "custom" && filters.timePeriod.customRange.from && filters.timePeriod.customRange.to && 
              `กำหนดช่วงเวลาเอง: ${format(filters.timePeriod.customRange.from, "dd/MM/yyyy")} - ${format(filters.timePeriod.customRange.to, "dd/MM/yyyy")}`}
          </p>
        </CardContent>
      </Card>

      {/* Card 3: Feedback Categories */}
      <Card className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm p-5">
        <CardHeader className="pb-2 p-0">
          <CardTitle className="text-[14px] font-semibold leading-[20px] mb-3 font-kanit text-foreground">ความคิดเห็น</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Main Categories */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-between text-sm h-8">
                <span className="font-kanit truncate">
                  {filters.categories.mainCategories.length > 0 
                    ? `เลือกแล้ว ${filters.categories.mainCategories.length} หมวด`
                    : "หมวดหมู่"
                  }
                </span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </PopoverTrigger>
            {renderMultiSelectPopover(
              "หมวดหมู่",
              mainCategories,
              filters.categories.mainCategories,
              (selection) => updateFilters('categories', { mainCategories: selection }),
              searchTerms.categories,
              (term) => setSearchTerms(prev => ({ ...prev, categories: term }))
            )}
          </Popover>

          {/* Sub Categories */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-between text-sm h-8">
                <span className="font-kanit truncate">
                  {filters.categories.subCategories.length > 0 
                    ? `เลือกแล้ว ${filters.categories.subCategories.length} หมวดย่อย`
                    : "หมวดย่อย"
                  }
                </span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </PopoverTrigger>
            {renderMultiSelectPopover(
              "หมวดย่อย",
              subCategories,
              filters.categories.subCategories,
              (selection) => updateFilters('categories', { subCategories: selection }),
              searchTerms.subCategories,
              (term) => setSearchTerms(prev => ({ ...prev, subCategories: term }))
            )}
          </Popover>

          <p className="text-[10px] text-[#6b6b6b] font-kanit">
            เลือกแล้ว: {filters.categories.mainCategories.length} หมวดหมู่, {filters.categories.subCategories.length} หมวดย่อย
          </p>
        </CardContent>
      </Card>

      {/* Card 4: Transaction Types */}
      <Card className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm p-5">
        <CardHeader className="pb-2 p-0">
          <CardTitle className="text-[14px] font-semibold leading-[20px] mb-3 font-kanit text-foreground">ประเภทธุกรรม</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-between text-sm h-8">
                <span className="font-kanit truncate">
                  {filters.transactionTypes.length > 0 
                    ? `เลือกแล้ว ${filters.transactionTypes.length} ประเภท`
                    : "เลือกประเภทธุกรรม"
                  }
                </span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 border-[#e5e7eb] rounded-xl" align="start">
              <div className="max-h-60 overflow-y-auto">
                {transactionTypes.map((type) => (
                  <div key={type} className="flex items-center space-x-2 p-2 hover:bg-accent">
                    <Checkbox
                      id={`transaction-${type}`}
                      checked={filters.transactionTypes.includes(type)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          updateFilters('transactionTypes', [...filters.transactionTypes, type]);
                        } else {
                          updateFilters('transactionTypes', filters.transactionTypes.filter(t => t !== type));
                        }
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

          <p className="text-[10px] text-[#6b6b6b] font-kanit">
            {filters.transactionTypes.length > 0 ? `เลือกแล้ว: ${filters.transactionTypes.length} ประเภท` : "ทั้งหมด"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};