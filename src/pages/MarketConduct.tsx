import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/* UI (shadcn) */
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/* Dashboard shared components */
import { MiniRailSidebar } from "@/components/dashboard/MiniRailSidebar";
import { MenuItems } from "@/components/dashboard/MenuItems";
import FeedbackFlowModal from "@/components/dashboard/AgentFlowModal";

/* Icons */
import {
  Menu,
  X,
  LogOut,
  RotateCcw,
  Check,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  RefreshCw,
} from "lucide-react";

/* Charts */
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

/* ====================================================================== */
/*                         KPI small card (local)                         */
/* ====================================================================== */
interface KPICardProps {
  title: string;
  value: string;
  percentage: number;
  trend: "up" | "down";
  previousValue?: string;
  tone?: "blue" | "green" | "red" | "yellow"; // ✅ เพิ่ม
}

const SmallKPICard: React.FC<KPICardProps> = ({
  title,
  value,
  percentage,
  trend,
  previousValue,
  tone,
}) => {
  const TrendIcon = trend === "up" ? TrendingUp : TrendingDown;
  const tColor = trend === "up" ? "text-green-600" : "text-red-600";

  const toneBg: Record<NonNullable<KPICardProps["tone"]>, string> = {
    blue: "bg-blue-50 border-blue-100",
    green: "bg-green-50 border-green-100",
    red: "bg-rose-50 border-rose-100",
    yellow: "bg-amber-50 border-amber-100",
  };
  // ถ้าไม่กำหนด tone จะ fallback ตาม trend (ขึ้น=เขียว, ลง=ชมพู)
  const bgClass = tone ? toneBg[tone] : trend === "up" ? toneBg.green : toneBg.red;

  return (
    <div className={`rounded-2xl shadow-soft p-5 border ${bgClass}`}>
      <h3 className="text-sm font-medium text-muted-foreground mb-2 font-kanit">
        {title}
      </h3>
      <div className="flex items-end justify-between">
        <div>
          <p className="font-bold text-foreground font-kanit text-2xl">{value}</p>
          <div className={`flex items-center gap-1 mt-1 ${tColor}`}>
            <TrendIcon className="w-4 h-4" />
            <span className="text-sm font-medium">{Math.abs(percentage)}%</span>
            {previousValue && (
              <span className="text-xs text-muted-foreground ml-1">
                ({previousValue})
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


const KPISection: React.FC<{ }> = () => {
  const kpiData: KPICardProps[] = [
    {
      title: "ความคิดเห็นทั้งหมด",
      value: "1,247",
      percentage: 12.5,
      trend: "up",
      previousValue: "1,108",
      tone: "blue",    // ✅ ฟ้า (เหมือนภาพ)
    },
    {
      title: "ความคิดเห็นเชิงบวก",
      value: "856",
      percentage: 8.3,
      trend: "up",
      previousValue: "791",
      tone: "green",   // ✅ เขียวอ่อน
    },
    {
      title: "ความคิดเห็นเชิงลบ",
      value: "391",
      percentage: 5.2,
      trend: "down",
      previousValue: "317",
      tone: "red",     // ✅ ชมพูอ่อน (แดงอ่อน)
    },
    {
      title: "Top Issue",
      value: "การให้บริการ",
      percentage: 15.7,
      trend: "up",
      previousValue: "ความถูกต้อง",
      tone: "yellow",  // ✅ เหลืองครีม
    },
  ];

  return (
    <div className="grid grid-cols-12 gap-6">
      {kpiData.map((k, i) => (
        <div key={i} className="col-span-12 md:col-span-6 xl:col-span-4 2xl:col-span-3">
          <SmallKPICard {...k} />
        </div>
      ))}
    </div>
  );
};


/* ====================================================================== */
/*                            Opinion Pie Chart                            */
/* ====================================================================== */
const OpinionPieChart: React.FC = () => {
  const data = [
    { name: "ไม่หลอกลวง", value: 35, color: "#D8218C" },
    { name: "ไม่เอาเปรียบ", value: 28, color: "#DF7AB0" },
    { name: "ไม่บังคับ", value: 22, color: "#CE5997" },
    { name: "ไม่รบกวน", value: 15, color: "#D3D3D3" },
  ];
  const renderLabel = ({ name, percent }: any) =>
    `${name} ${(percent * 100).toFixed(0)}%`;

  return (
    <Card className="rounded-2xl border shadow-card bg-white overflow-hidden h-full">
      <div className="h-2 rounded-t-2xl" style={{ background: "var(--gradient-pink-strip)" }} />
      <CardHeader className="pb-4 pt-5">
        <CardTitle className="font-kanit text-lg font-semibold text-foreground">
          สัดส่วนความคิดเห็นตามหัวข้อ
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderLabel}
                outerRadius={90}
                dataKey="value"
              >
                {data.map((e, i) => (
                  <Cell key={i} fill={e.color} />
                ))}
              </Pie>
              <Legend
                wrapperStyle={{
                  fontSize: "14px",
                  fontFamily: "Kanit, sans-serif",
                  paddingTop: "20px",
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                  fontFamily: "Kanit",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

/* ====================================================================== */
/*                            Trend Line Chart                             */
/* ====================================================================== */
const TrendLineChart: React.FC = () => {
  const data = [
    { month: "ม.ค.", "ไม่หลอกลวง": 65, "ไม่เอาเปรียบ": 58, "ไม่บังคับ": 72, "ไม่รบกวน": 45 },
    { month: "ก.พ.", "ไม่หลอกลวง": 68, "ไม่เอาเปรียบ": 62, "ไม่บังคับ": 75, "ไม่รบกวน": 48 },
    { month: "มี.ค.", "ไม่หลอกลวง": 72, "ไม่เอาเปรียบ": 65, "ไม่บังคับ": 78, "ไม่รบกวน": 52 },
    { month: "เม.ย.", "ไม่หลอกลวง": 70, "ไม่เอาเปรียบ": 68, "ไม่บังคับ": 80, "ไม่รบกวน": 55 },
    { month: "พ.ค.", "ไม่หลอกลวง": 75, "ไม่เอาเปรียบ": 71, "ไม่บังคับ": 82, "ไม่รบกวน": 58 },
    { month: "มิ.ย.", "ไม่หลอกลวง": 78, "ไม่เอาเปรียบ": 74, "ไม่บังคับ": 85, "ไม่รบกวน": 61 },
  ];

  return (
    <Card className="rounded-2xl border shadow-card bg-white overflow-hidden h-full">
      <div className="h-2 rounded-t-2xl" style={{ background: "var(--gradient-pink-strip)" }} />
      <CardHeader className="pb-4 pt-5">
        <CardTitle className="font-kanit text-lg font-semibold text-foreground">
          แนวโน้มความคิดเห็นรายเดือน
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="month" tick={{ fontFamily: "Kanit" }} />
              <YAxis tick={{ fontFamily: "Kanit" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                  fontFamily: "Kanit",
                }}
              />
              <Legend wrapperStyle={{ fontFamily: "Kanit", fontSize: "14px" }} />
              <Line type="monotone" dataKey="ไม่หลอกลวง" stroke="#D8218C" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="ไม่เอาเปรียบ" stroke="#DF7AB0" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="ไม่บังคับ" stroke="#CE5997" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="ไม่รบกวน" stroke="#D3D3D3" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

/* ====================================================================== */
/*                         Region Bar Chart (SVG)                          */
/* ====================================================================== */
const RegionBarChart: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("เลือกทั้งหมด");
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const categories = ["เลือกทั้งหมด", "ไม่หลอกลวง", "ไม่เอาเปรียบ", "ไม่บังคับ", "ไม่รบกวน"];

  const regionData = [
    { region: "ภาค 1", gray: 4.75, pink: 2.75 },
    { region: "ภาค 2", gray: 3.25, pink: 4.75 },
    { region: "ภาค 3", gray: 4.0, pink: 4.5 },
    { region: "ภาค 4", gray: 3.5, pink: 3.0 },
    { region: "ภาค 5", gray: 4.5, pink: 4.75 },
    { region: "ภาค 6", gray: 4.75, pink: 4.5 },
    { region: "ภาค 7", gray: 2.75, pink: 2.75 },
    { region: "ภาค 8", gray: 3.25, pink: 2.75 },
    { region: "ภาค 9", gray: 3.25, pink: 4.75 },
    { region: "ภาค 10", gray: 4.75, pink: 3.25 },
    { region: "ภาค 11", gray: 3.5, pink: 3.5 },
    { region: "ภาค 12", gray: 4.5, pink: 4.25 },
    { region: "ภาค 13", gray: 4.0, pink: 3.75 },
    { region: "ภาค 14", gray: 4.75, pink: 4.75 },
    { region: "ภาค 15", gray: 3.0, pink: 2.75 },
    { region: "ภาค 16", gray: 3.5, pink: 3.25 },
    { region: "ภาค 17", gray: 3.25, pink: 3.0 },
    { region: "ภาค 18", gray: 4.75, pink: 4.25 },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setFocusedIndex(-1);
      }
    };
    const handleScroll = () => {
      setIsDropdownOpen(false);
      setFocusedIndex(-1);
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("scroll", handleScroll, true);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("scroll", handleScroll, true);
    };
  }, [isDropdownOpen]);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setIsDropdownOpen(false);
    setFocusedIndex(-1);
    buttonRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isDropdownOpen) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        setIsDropdownOpen(true);
        setFocusedIndex(0);
      }
      return;
    }
    switch (e.key) {
      case "Escape":
        e.preventDefault();
        setIsDropdownOpen(false);
        setFocusedIndex(-1);
        buttonRef.current?.focus();
        break;
      case "ArrowDown":
        e.preventDefault();
        setFocusedIndex((prev) => (prev + 1) % categories.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedIndex((prev) => (prev <= 0 ? categories.length - 1 : prev - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (focusedIndex >= 0) handleCategorySelect(categories[focusedIndex]);
        break;
    }
  };

  return (
    <Card className="rounded-2xl border shadow-card bg-white overflow-hidden">
      <div className="h-2 rounded-t-2xl" style={{ background: "var(--gradient-pink-strip)" }} />
      <CardHeader className="pb-4 pt-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="font-kanit text-lg font-semibold text-foreground">
            เปรียบเทียบคะแนนรายภาค
          </CardTitle>
          <div className="mt-4 sm:mt-0 relative inline-block text-left w-44" ref={dropdownRef}>
            <button
              ref={buttonRef}
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              onKeyDown={handleKeyDown}
              className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-normal text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-pink-500 font-kanit"
              aria-expanded={isDropdownOpen}
              aria-haspopup="listbox"
              aria-label="เลือกประเภทการแสดงข้อมูล"
            >
              {selectedCategory}
              <ChevronDown className="-mr-1 ml-2 h-5 w-5 text-gray-400" />
            </button>

            {isDropdownOpen && (
              <div
                className="absolute right-0 top-full z-50 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1"
                role="listbox"
                aria-label="ตัวเลือกประเภทข้อมูล"
              >
                {categories.map((category, index) => (
                  <button
                    key={category}
                    onClick={() => handleCategorySelect(category)}
                    onMouseEnter={() => setFocusedIndex(index)}
                    className={`flex items-center justify-between w-full h-10 px-3 text-sm text-left hover:bg-gray-50 font-kanit ${
                      focusedIndex === index ? "bg-gray-50" : ""
                    }`}
                    role="option"
                    aria-selected={selectedCategory === category}
                  >
                    <span>{category}</span>
                    {selectedCategory === category && <Check className="h-4 w-4 text-pink-600" aria-hidden="true" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <svg
            width="100%"
            height="240"
            viewBox="0 0 960 240"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="block"
          >
            <g>
              <line x1="40" y1="0" x2="40" y2="200" stroke="#E5E7EB" />
              <line x1="40" y1="40" x2="920" y2="40" stroke="#E5E7EB" strokeDasharray="4 4" />
              <line x1="40" y1="80" x2="920" y2="80" stroke="#E5E7EB" strokeDasharray="4 4" />
              <line x1="40" y1="120" x2="920" y2="120" stroke="#E5E7EB" strokeDasharray="4 4" />
              <line x1="40" y1="160" x2="920" y2="160" stroke="#E5E7EB" strokeDasharray="4 4" />
              <line x1="40" y1="200" x2="920" y2="200" stroke="#E5E7EB" strokeDasharray="4 4" />
              <text x="20" y="205" fill="#9CA3AF" fontSize="10" fontFamily="Kanit" textAnchor="middle">0</text>
              <text x="20" y="165" fill="#9CA3AF" fontSize="10" fontFamily="Kanit" textAnchor="middle">1</text>
              <text x="20" y="125" fill="#9CA3AF" fontSize="10" fontFamily="Kanit" textAnchor="middle">2</text>
              <text x="20" y="85"  fill="#9CA3AF" fontSize="10" fontFamily="Kanit" textAnchor="middle">3</text>
              <text x="20" y="45"  fill="#9CA3AF" fontSize="10" fontFamily="Kanit" textAnchor="middle">4</text>
              <text x="20" y="5"   fill="#9CA3AF" fontSize="10" fontFamily="Kanit" textAnchor="middle">5</text>
            </g>

            <g transform="translate(50, 200) scale(1, -1)">
              {regionData.map((region, index) => {
                const x = index * 45;
                const grayHeight = (region.gray / 5) * 200;
                const pinkHeight = (region.pink / 5) * 200;
                return (
                  <g key={region.region}>
                    <rect x={x} y="0" width="15" height={grayHeight} fill="#D1D5DB" rx="2" ry="2" />
                    <rect x={x + 20} y="0" width="15" height={pinkHeight} rx="2" ry="2" fill="url(#pinkGradient)" />
                  </g>
                );
              })}
            </g>

            <g transform="translate(50, 210)">
              {regionData.map((region, index) => {
                const x = index * 45 + 7;
                return (
                  <text
                    key={region.region}
                    x={x}
                    y="0"
                    fill="#6B7280"
                    fontSize="10"
                    fontFamily="Kanit"
                    transform={`rotate(30 ${x} 0)`}
                    textAnchor="start"
                  >
                    {region.region}
                  </text>
                );
              })}
            </g>

            <defs>
              <linearGradient id="pinkGradient" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
                <stop stopColor="#FF0080" />
                <stop offset="1" stopColor="#FF66B2" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </CardContent>
    </Card>
  );
};

/* ====================================================================== */
/*                           Customer Feedback                             */
/* ====================================================================== */
interface FeedbackItem {
  id: number;
  region: string;
  branch: string;
  date: string;
  time: string;
  content: string;
  sentiment: "positive" | "negative";
  tags: string[];
}

const CustomerFeedback: React.FC = () => {
  const [activeFilter, setActiveFilter] =
    useState<"all" | "positive" | "negative">("all");

  const feedbackData: FeedbackItem[] = [
    {
      id: 1,
      region: "ภาค 1",
      branch: "สาขาสีลม",
      date: "15 มิ.ย. 2567",
      time: "14:30",
      content:
        "พนักงานให้บริการดีมาก อธิบายรายละเอียดชัดเจน และช่วยเหลือด้วยความเอาใจใส่",
      sentiment: "positive",
      tags: ["ความเอาใจใส่ในการให้บริการลูกค้า", "ความถูกต้องในการให้บริการ"],
    },
    {
      id: 2,
      region: "ภาค 3",
      branch: "สาขาเซ็นทรัลเวิลด์",
      date: "14 มิ.ย. 2567",
      time: "10:15",
      content:
        "รอคิวนานมาก และไม่มีการแจ้งล่วงหน้าเรื่องระยะเวลารอคอย ทำให้รู้สึกไม่พอใจ",
      sentiment: "negative",
      tags: ["เวลาการให้บริการ", "การสื่อสารกับลูกค้า"],
    },
    {
      id: 3,
      region: "ภาค 5",
      branch: "สาขาเชียงใหม่",
      date: "13 มิ.ย. 2567",
      time: "16:45",
      content:
        "ระบบออนไลน์ใช้งานง่าย สะดวกสบาย และมีการอัปเดตข้อมูลแบบเรียลไทม์",
      sentiment: "positive",
      tags: ["เทคโนโลยีและนวัตกรรม", "ความสะดวกในการใช้บริการ"],
    },
    {
      id: 4,
      region: "ภาค 2",
      branch: "สาขาแจ้งวัฒนะ",
      date: "12 มิ.ย. 2567",
      time: "11:20",
      content:
        "พนักงานขาดความรู้เรื่องผลิตภัณฑ์ใหม่ ต้องถามผู้จัดการหลายครั้ง",
      sentiment: "negative",
      tags: ["ความรู้ของพนักงาน", "ประสิทธิภาพการให้บริการ"],
    },
    {
      id: 5,
      region: "ภาค 4",
      branch: "สาขาขอนแก่น",
      date: "11 มิ.ย. 2567",
      time: "09:30",
      content:
        "บรรยากาศในสาขาดี สะอาด และมีที่นั่งรอเพียงพอ รู้สึกสบายขณะรอรับบริการ",
      sentiment: "positive",
      tags: ["สภาพแวดล้อมของสาขา", "ความสะดวกสบาย"],
    },
  ];

  const filteredData = feedbackData.filter((item) => {
    if (activeFilter === "all") return true;
    return item.sentiment === activeFilter;
  });

  const btn = (key: typeof activeFilter) =>
    `px-4 py-2 rounded-lg font-medium font-kanit transition-all ${
      activeFilter === key
        ? "bg-pink-600 text-white shadow-md"
        : "bg-white border hover:bg-muted"
    }`;

  const sentBg = (s: "positive" | "negative") =>
    s === "positive" ? "bg-green-50 border-green-200" : "bg-rose-50 border-rose-200";
  const tagClass = (s: "positive" | "negative") =>
    s === "positive" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800";

  return (
    <Card className="rounded-2xl border shadow-card bg-white overflow-hidden">
      <div className="h-2 rounded-t-2xl" style={{ background: "var(--gradient-pink-strip)" }} />
      <CardHeader className="pb-4 pt-5">
        <CardTitle className="font-kanit text-lg font-semibold text-foreground">
          ความคิดเห็นลูกค้า
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <p className="text-sm text-muted-foreground font-kanit">
              พบความคิดเห็น {filteredData.length} รายการ
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setActiveFilter("all")} className={btn("all")}>
              ทั้งหมด
            </button>
            <button onClick={() => setActiveFilter("positive")} className={btn("positive")}>
              เชิงบวก
            </button>
            <button onClick={() => setActiveFilter("negative")} className={btn("negative")}>
              เชิงลบ
            </button>
          </div>
        </div>

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <div
                key={item.id}
                className={`${sentBg(item.sentiment)} rounded-xl p-4 border`}
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="text-sm text-muted-foreground font-kanit">
                    {item.region} • {item.branch}
                  </span>
                  <span className="text-sm text-muted-foreground font-kanit">
                    {item.date} {item.time}
                  </span>
                </div>
                <p className="text-foreground font-kanit mb-3 leading-relaxed">
                  {item.content}
                </p>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag, index) => (
                    <span
                      key={index}
                      className={`${tagClass(item.sentiment)} px-3 py-1 rounded-full text-xs font-medium font-kanit`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground font-kanit">
                ยังไม่มีความคิดเห็นในช่วงที่เลือก
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

/* ====================================================================== */
/*                        Market Conduct (Page)                            */
/* ====================================================================== */
const MarketConduct: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const handleLogout = () => navigate("/");
  const [flowOpen, setFlowOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Mini Rail Sidebar — เหมือน Dashboard */}
      <MiniRailSidebar onToggleMainSidebar={() => setIsOpen(!isOpen)} />

      {/* Top Bar — ใช้โครงเดียวกับ Dashboard (มี Drawer เดียว ครอบทั้ง mobile/desktop) */}
      <header className="topbar px-6">
        <div className="w-full">
          <div className="flex items-center justify-between relative z-10">

            {/* Drawer: ใช้ตัวเดียว */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              {/* Trigger โชว์เฉพาะมือถือ */}
              <div className="md:hidden">
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20 w-11 h-11 rounded-2xl"
                    aria-label="เปิดเมนู"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
              </div>

              <SheetContent side="left" className="w-80 md:ml-[72px]">
                <SheetHeader className="flex flex-row items-center justify-between">
                  <SheetTitle className="font-kanit">เมนูหลัก</SheetTitle>
                </SheetHeader>

                <div className="mt-6">
                  <MenuItems onItemClick={() => setIsOpen(false)} />
                </div>

                <div className="absolute bottom-4 left-4 right-4">
                  <div className="text-xs text-muted-foreground text-center font-kanit">
                    อัพเดตล่าสุด: 31/08/2025 · 09:49 น.
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Left (title/desc) */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white font-kanit mb-2">
                Dashboard ข้อเสนอแนะ ข้อร้องเรียน การใช้บริการสาขา
              </h1>
              <p className="text-white/80 font-kanit text-base">
                ระบบติดตามและวิเคราะห์ข้อร้องเรียนลูกค้าธนาคารออมสิน
              </p>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-white text-base font-kanit">
                  อัปเดตล่าสุด: 31/08/2025&nbsp; 09:49 น.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-pink-400/30 w-10 h-10 rounded-full border border-white/20"
                  aria-label="รีเฟรช"
                  onClick={() => setFlowOpen(true)}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="text-white hover:bg-pink-400/30 flex items-center gap-2 font-kanit px-4 py-2 rounded-full border border-white/20 transition-colors duration-200"
                >
                  <LogOut className="h-4 w-4" />
                  ออกจากระบบ
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content — โครงเดียวกับ Dashboard */}
      <main className="main-content transition-all duration-200 ease-out min-h-screen">
        <div className="container mx-auto p-6 space-y-8">
          {/* Page header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground font-kanit mb-2">
              Market Conduct
            </h2>
            <p className="text-muted-foreground font-kanit">
              หน้าติดตามและวิเคราะห์ด้าน Market Conduct ให้รูปแบบเดียวกับ Dashboard
            </p>
          </div>

          {/* KPI Block */}
          <Card className="rounded-2xl border shadow-card bg-white overflow-hidden">
            <div className="h-2 rounded-t-2xl" style={{ background: "var(--gradient-pink-strip)" }} />
            <CardHeader className="pb-4 pt-5">
              <CardTitle className="font-kanit text-xl font-bold text-foreground">
                สรุปภาพรวมหัวข้อ Market Conduct
              </CardTitle>
            </CardHeader>
            <CardContent>
              <KPISection />
            </CardContent>
          </Card>

          {/* Charts row */}
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-6">
              <OpinionPieChart />
            </div>
            <div className="col-span-12 lg:col-span-6">
              <TrendLineChart />
            </div>
          </div>

          {/* Region Chart (SVG) */}
          <RegionBarChart />

          {/* Customer Feedback */}
          <CustomerFeedback />
        </div>
      </main>

      {/* Footer — เหมือนหน้า Dashboard */}
      <footer style={{ backgroundColor: "#ECEFF1" }} className="border-t border-border py-3 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-col md:flex-row md:items-center gap-4 text-center md:text-left">
              <span className="text-sm text-muted-foreground font-kanit">© 2024 Customer Dashboard. สงวนลิขสิทธิ์.</span>
              <div className="flex flex-col sm:flex-row items-center gap-2 text-sm">
                <a
                  href="#"
                  className="text-muted-foreground font-kanit hover:text-primary hover:underline transition-colors duration-200"
                  aria-label="นโยบายความเป็นส่วนตัว"
                >
                  นโยบายความเป็นส่วนตัว
                </a>
                <span className="hidden sm:inline text-muted-foreground">|</span>
                <a
                  href="#"
                  className="text-muted-foreground font-kanit hover:text-primary hover:underline transition-colors duration-200"
                  aria-label="เงื่อนไขการใช้งาน"
                >
                  เงื่อนไขการใช้งาน
                </a>
                <span className="hidden sm:inline text-muted-foreground">|</span>
                <a
                  href="#"
                  className="text-muted-foreground font-kanit hover:text-primary hover:underline transition-colors duration-200"
                  aria-label="ติดต่อเรา"
                >
                  ติดต่อเรา
                </a>
              </div>
            </div>

            <div className="text-center md:text-right">
              <span className="text-sm text-muted-foreground font-kanit">เวอร์ชัน 2.1.0</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Footer — เหมือนหน้า Dashboard */}
      <div className="md:hidden px-6 py-4">
        <div className="bg-white rounded-2xl shadow-md border border-[#E5E7EB] overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-[#D8218C] via-[#DF7AB0] to-[#F9B5D3]"></div>

          <div className="p-4">
            <div className="grid grid-cols-1 xs:grid-cols-3 gap-3 mb-4">
              <a
                href="#"
                className="block bg-gradient-to-r from-[#D8218C] via-[#DF7AB0] to-[#F9B5D3] text-white font-kanit font-medium text-center py-3 px-2 rounded-xl hover:opacity-95 hover:shadow-lg transition-all duration-200"
                aria-label="นโยบายความเป็นส่วนตัว"
              >
                นโยบายความเป็นส่วนตัว
              </a>
              <a
                href="#"
                className="block bg-gradient-to-r from-[#D8218C] via-[#DF7AB0] to-[#F9B5D3] text-white font-kanit font-medium text-center py-3 px-2 rounded-xl hover:opacity-95 hover:shadow-lg transition-all duration-200"
                aria-label="เงื่อนไขการใช้งาน"
              >
                เงื่อนไขการใช้งาน
              </a>
              <a
                href="#"
                className="block bg-gradient-to-r from-[#D8218C] via-[#DF7AB0] to-[#F9B5D3] text-white font-kanit font-medium text-center py-3 px-2 rounded-xl hover:opacity-95 hover:shadow-lg transition-all duration-200"
                aria-label="ติดต่อเรา"
              >
                ติดต่อเรา
              </a>
            </div>

            <div className="text-center space-y-1">
              <div className="text-xs text-[#6B7280] font-kanit leading-relaxed">© 2024 Customer Dashboard. สงวนลิขสิทธิ์.</div>
              <div className="text-xs text-[#6B7280] font-kanit leading-relaxed">เวอร์ชัน 2.1.0</div>
            </div>
          </div>
        </div>
      </div>
      <FeedbackFlowModal
        open={flowOpen}
        onOpenChange={setFlowOpen}
        hideInternalTrigger
      />
    </div>
  );
};

export default MarketConduct;
