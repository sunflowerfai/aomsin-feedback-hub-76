import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HelpCircle, Bell, Settings, SlidersHorizontal, RefreshCcw } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from "recharts";

// Mock data for charts
const barData = Array.from({ length: 18 }, (_, i) => ({
  name: `ภาค ${i + 1}`,
  pos: Math.floor(Math.random() * 70) + 90, // 90-160
  neg: Math.floor(Math.random() * 20) + 30, // 30-50
}));

const categories = [
  "Market Conduct",
  "กระบวนการให้บริการ", 
  "ความประทับใจอื่นๆ",
  "เงื่อนไขผลิตภัณฑ์",
  "พนักงานและบุคลากร",
  "ระบบธนาคารและเทคโนโลยี",
  "สภาพแวดล้อมและสิ่งอำนวยความสะดวก"
];

const lineColors = ["#ef4444", "#f97316", "#f59e0b", "#22c55e", "#3b82f6", "#a855f7", "#ec4899"];

const lineData = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย."].map(month => {
  const data: any = { month };
  categories.forEach((category, index) => {
    const posValue = Math.floor(Math.random() * 60) + 20; // 20-80
    data[category] = posValue;
    data[`${category}_neg`] = -posValue;
  });
  return data;
});

const tableData = [
  { topic: "การบังคับ", group: "Market Conduct", pos: 14, neg: 8 },
  { topic: "ความโปร่งใส", group: "Market Conduct", pos: 22, neg: 5 },
  { topic: "การให้ข้อมูล", group: "กระบวนการให้บริการ", pos: 31, neg: 12 },
  { topic: "ความรวดเร็ว", group: "กระบวนการให้บริการ", pos: 28, neg: 7 },
  { topic: "ความสะดวก", group: "ความประทับใจอื่นๆ", pos: 19, neg: 4 },
  { topic: "เงื่อนไขสินเชื่อ", group: "เงื่อนไขผลิตภัณฑ์", pos: 25, neg: 9 },
  { topic: "ทัศนคติบริการ", group: "พนักงานและบุคลากร", pos: 33, neg: 6 },
  { topic: "ความรู้", group: "พนักงานและบุคลากร", pos: 27, neg: 8 },
];

const RegionalDashboardOnePage = () => {
  // Filter states
  const [businessLine, setBusinessLine] = useState("ทั้งหมด");
  const [region, setRegion] = useState("ทั้งหมด");
  const [zone, setZone] = useState("ทั้งหมด");
  const [branch, setBranch] = useState("ทั้งหมด");
  const [timePeriod1, setTimePeriod1] = useState("ทั้งหมด");
  const [timePeriod2, setTimePeriod2] = useState("ทั้งหมด");
  const [categoryFilter, setCategoryFilter] = useState("Market Conduct");
  const [subCategoryFilter, setSubCategoryFilter] = useState("ทั้งหมด");
  
  const [selectedServices, setSelectedServices] = useState<string[]>([
    "ฝาก–ถอนเงิน/สลาก",
    "ชำระค่าสินเชื่อ/ชำระค่าสินค้าและบริการ",
    "สมัครใช้บริการ เงินฝาก/สินเชื่อ/MyMo/บัตร",
    "สอบถาม/ขอคำปรึกษา",
    "อื่น ๆ"
  ]);
  
  const [visibleLines, setVisibleLines] = useState<Record<string, boolean>>(
    categories.reduce((acc, cat) => ({ ...acc, [cat]: true }), {})
  );

  const services = [
    "ฝาก–ถอนเงิน/สลาก",
    "ชำระค่าสินเชื่อ/ชำระค่าสินค้าและบริการ", 
    "สมัครใช้บริการ เงินฝาก/สินเชื่อ/MyMo/บัตร",
    "สอบถาม/ขอคำปรึกษา",
    "อื่น ๆ"
  ];

  const toggleService = (service: string) => {
    if (service === "เลือกทั้งหมด") {
      if (selectedServices.length === services.length) {
        setSelectedServices([]);
      } else {
        setSelectedServices([...services]);
      }
    } else {
      setSelectedServices(prev => 
        prev.includes(service) 
          ? prev.filter(s => s !== service)
          : [...prev, service]
      );
    }
  };

  const toggleLineVisibility = (category: string) => {
    setVisibleLines(prev => ({ ...prev, [category]: !prev[category] }));
  };

  const resetAllFilters = () => {
    setBusinessLine("ทั้งหมด");
    setRegion("ทั้งหมด");
    setZone("ทั้งหมด");
    setBranch("ทั้งหมด");
    setTimePeriod1("ทั้งหมด");
    setTimePeriod2("ทั้งหมด");
    setCategoryFilter("Market Conduct");
    setSubCategoryFilter("ทั้งหมด");
    setSelectedServices([
      "ฝาก–ถอนเงิน/สลาก",
      "ชำระค่าสินเชื่อ/ชำระค่าสินค้าและบริการ",
      "สมัครใช้บริการ เงินฝาก/สินเชื่อ/MyMo/บัตร",
      "สอบถาม/ขอคำปรึกษา",
      "อื่น ๆ"
    ]);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFB] text-neutral-800 font-sans">
      {/* App Bar */}
      <header className="sticky top-0 z-30 w-full shadow-sm bg-gradient-to-r from-[#ff86bb] via-[#ff6fc7] to-[#ff7eb3]">
        <div className="w-full max-w-[1440px] xl:max-w-[1600px] 2xl:max-w-[1760px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-white/95 text-[20px] md:text-[22px] font-semibold tracking-[-0.2px]">
                Dashboard ข้อเสนอแนะ · ข้อร้องเรียน · การใช้บริการสาขา
              </h1>
              <p className="text-white/85 text-sm">
                ระบบติดตามและวิเคราะห์ข้อร้องเรียนลูกค้าบุ๊กกิ้งาสาขา
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" className="text-white/90 hover:bg-white/10">
                <HelpCircle className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white/90 hover:bg-white/10">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white/90 hover:bg-white/10">
                <Settings className="h-5 w-5" />
              </Button>
              <Button variant="secondary" className="bg-white/90 hover:bg-white text-neutral-800">
                ออกจากระบบ
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="w-full max-w-[1440px] xl:max-w-[1600px] 2xl:max-w-[1760px] mx-auto px-6 py-8 space-y-8">
        
        {/* Section 1: Filters */}
        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* พื้นที่ดูแล */}
              <div className="rounded-2xl border bg-white p-5 h-full relative">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-neutral-800">พื้นที่ดูแล</h3>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={resetAllFilters}
                    className="h-6 w-6 p-0 hover:bg-neutral-100"
                    title="ล้างตัวกรองทั้งหมด"
                  >
                    <RefreshCcw className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <label className="w-16 text-sm font-medium text-neutral-700">สายกิจ:</label>
                    <Select value={businessLine} onValueChange={setBusinessLine}>
                      <SelectTrigger className="h-10 flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="min-w-[420px] md:min-w-[520px] max-w-[90vw] max-h-[72vh] overflow-y-auto whitespace-normal break-words text-wrap px-1">
                        <SelectItem value="ทั้งหมด" className="whitespace-normal break-words text-wrap py-2">ทั้งหมด</SelectItem>
                        <SelectItem value="สายกิจ 1" className="whitespace-normal break-words text-wrap py-2">สายกิจ 1</SelectItem>
                        <SelectItem value="สายกิจ 2" className="whitespace-normal break-words text-wrap py-2">สายกิจ 2</SelectItem>
                        <SelectItem value="สายกิจ 3" className="whitespace-normal break-words text-wrap py-2">สายกิจ 3</SelectItem>
                        <SelectItem value="สายกิจ 4" className="whitespace-normal break-words text-wrap py-2">สายกิจ 4</SelectItem>
                        <SelectItem value="สายกิจ 5" className="whitespace-normal break-words text-wrap py-2">สายกิจ 5</SelectItem>
                        <SelectItem value="สายกิจ 6" className="whitespace-normal break-words text-wrap py-2">สายกิจ 6</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center">
                    <label className="w-16 text-sm font-medium text-neutral-700">ภาค:</label>
                    <Select value={region} onValueChange={setRegion}>
                      <SelectTrigger className="h-10 flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="min-w-[420px] md:min-w-[520px] max-w-[90vw] max-h-[72vh] overflow-y-auto whitespace-normal break-words text-wrap px-1">
                        <SelectItem value="ทั้งหมด" className="whitespace-normal break-words text-wrap py-2">ทั้งหมด</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center">
                    <label className="w-16 text-sm font-medium text-neutral-700">เขต:</label>
                    <Select value={zone} onValueChange={setZone}>
                      <SelectTrigger className="h-10 flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="min-w-[420px] md:min-w-[520px] max-w-[90vw] max-h-[72vh] overflow-y-auto whitespace-normal break-words text-wrap px-1">
                        <SelectItem value="ทั้งหมด" className="whitespace-normal break-words text-wrap py-2">ทั้งหมด</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center">
                    <label className="w-16 text-sm font-medium text-neutral-700">สาขา:</label>
                    <Select value={branch} onValueChange={setBranch}>
                      <SelectTrigger className="h-10 flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="min-w-[420px] md:min-w-[520px] max-w-[90vw] max-h-[72vh] overflow-y-auto whitespace-normal break-words text-wrap px-1">
                        <SelectItem value="ทั้งหมด" className="whitespace-normal break-words text-wrap py-2">ทั้งหมด</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <p className="text-neutral-500 text-sm mt-4">เลือกแล้ว: เลือกทั้งหมด</p>
              </div>

              {/* ประเภทการใช้บริการ */}
              <div className="rounded-2xl border bg-white p-5 h-full min-h-[260px]">
                <h3 className="font-semibold text-neutral-800 mb-4">ประเภทการใช้บริการ</h3>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={selectedServices.length === services.length}
                      onChange={() => toggleService("เลือกทั้งหมด")}
                      className="w-4 h-4 text-pink-600 rounded"
                    />
                    <span className="text-sm font-medium">เลือกทั้งหมด</span>
                  </label>
                  {services.map((service) => (
                    <label key={service} className="flex items-center space-x-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={selectedServices.includes(service)}
                        onChange={() => toggleService(service)}
                        className="w-4 h-4 text-pink-600 rounded"
                      />
                      <span className="text-sm">{service}</span>
                    </label>
                  ))}
                </div>
                <p className="text-neutral-500 text-sm mt-4">
                  เลือกแล้ว: {selectedServices.length} บริการ
                </p>
              </div>

              {/* ช่วงเวลา */}
              <div className="rounded-2xl border bg-white p-5 h-full">
                <h3 className="font-semibold text-neutral-800 mb-4">ช่วงเวลา</h3>
                <div className="space-y-3">
                  <Select value={timePeriod1} onValueChange={setTimePeriod1}>
                    <SelectTrigger className="h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="min-w-[420px] md:min-w-[520px] max-w-[90vw] max-h-[72vh] overflow-y-auto whitespace-normal break-words text-wrap px-1">
                      <SelectItem value="ทั้งหมด" className="whitespace-normal break-words text-wrap py-2">ทั้งหมด</SelectItem>
                      <SelectItem value="ปีนี้ถึงปัจจุบัน" className="whitespace-normal break-words text-wrap py-2">ปีนี้ถึงปัจจุบัน</SelectItem>
                      <SelectItem value="ไตรมาสล่าสุด" className="whitespace-normal break-words text-wrap py-2">ไตรมาสล่าสุด</SelectItem>
                      <SelectItem value="เดือนล่าสุด" className="whitespace-normal break-words text-wrap py-2">เดือนล่าสุด</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={timePeriod2} onValueChange={setTimePeriod2}>
                    <SelectTrigger className="h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="min-w-[420px] md:min-w-[520px] max-w-[90vw] max-h-[72vh] overflow-y-auto whitespace-normal break-words text-wrap px-1">
                      <SelectItem value="ทั้งหมด" className="whitespace-normal break-words text-wrap py-2">ทั้งหมด</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* ความคิดเห็น */}
              <div className="rounded-2xl border bg-white p-5 h-full relative">
                <SlidersHorizontal className="absolute right-4 top-4 h-4 w-4 opacity-70" />
                <h3 className="font-semibold text-neutral-800 mb-4">ความคิดเห็น</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="min-w-[420px] md:min-w-[520px] max-w-[90vw] max-h-[72vh] overflow-y-auto whitespace-normal break-words text-wrap px-1">
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat} className="whitespace-normal break-words text-wrap py-2">{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-neutral-500 text-xs">เลือกแล้ว: 7 หมวดหมู่, 37 หมวดย่อย</p>
                  </div>
                  <div>
                    <Select value={subCategoryFilter} onValueChange={setSubCategoryFilter}>
                      <SelectTrigger className="h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="min-w-[420px] md:min-w-[520px] max-w-[90vw] max-h-[72vh] overflow-y-auto whitespace-normal break-words text-wrap px-1">
                        <SelectItem value="ทั้งหมด" className="whitespace-normal break-words text-wrap py-2">ทั้งหมด</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button variant="outline" className="w-full h-10">
                      <SlidersHorizontal className="w-4 h-4 mr-2" />
                      ปรับตัวกรอง
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Bar Chart */}
        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-3 h-3 rounded bg-gradient-to-tr from-pink-400 to-emerald-400"></div>
              <h2 className="text-lg font-semibold text-neutral-800">ทัศนคติรายพื้นที่</h2>
            </div>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 10, right: 16, left: 8, bottom: 0 }} barCategoryGap={20}>
                  <XAxis 
                    dataKey="name" 
                    tickMargin={10} 
                    angle={-35} 
                    textAnchor="end" 
                    height={60}
                  />
                  <YAxis domain={[0, 160]} ticks={[0, 40, 80, 120, 160]} />
                  <Tooltip />
                  <Bar 
                    dataKey="pos" 
                    fill="#2ecc71" 
                    radius={[4, 4, 0, 0]} 
                    barSize={40}
                  />
                  <Bar 
                    dataKey="neg" 
                    fill="#e74c3c" 
                    radius={[4, 4, 0, 0]} 
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Line Chart */}
        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-3 h-3 rounded bg-gradient-to-tr from-pink-400 to-sky-400"></div>
              <h2 className="text-lg font-semibold text-neutral-800">แนวโน้มทัศนคติ</h2>
            </div>
            
            {/* Legend */}
            <div className="flex flex-wrap gap-4 mb-6">
              {categories.map((category, index) => (
                <label key={category} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={visibleLines[category]}
                    onChange={() => toggleLineVisibility(category)}
                    className="w-4 h-4"
                  />
                  <div 
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: lineColors[index] }}
                  ></div>
                  <span className="text-sm">{category}</span>
                </label>
              ))}
            </div>

            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData} margin={{ top: 10, right: 16, left: 8, bottom: 0 }}>
                  <XAxis dataKey="month" />
                  <YAxis domain={[-70, 70]} ticks={[-70, -35, 0, 35, 70]} />
                  <Tooltip />
                  <ReferenceLine y={0} stroke="#111827" strokeWidth={1} />
                  {categories.map((category, index) => (
                    visibleLines[category] && (
                      <g key={category}>
                        <Line
                          type="monotone"
                          dataKey={category}
                          stroke={lineColors[index]}
                          strokeWidth={2}
                          dot={{ r: 4 }}
                        />
                        <Line
                          type="monotone"
                          dataKey={`${category}_neg`}
                          stroke={lineColors[index]}
                          strokeWidth={2}
                          dot={{ r: 4 }}
                        />
                      </g>
                    )
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Section 4: Table */}
        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-3 h-3 rounded bg-gradient-to-tr from-pink-400 to-indigo-400"></div>
              <h2 className="text-lg font-semibold text-neutral-800">หมวดหมู่ที่ถูกกล่าวถึง</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-neutral-50 text-neutral-600">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">ประเด็นที่กล่าวถึง</th>
                    <th className="px-4 py-3 text-left font-medium">หัวข้อ</th>
                    <th className="px-4 py-3 text-center font-medium">เชิงบวก</th>
                    <th className="px-4 py-3 text-center font-medium">เชิงลบ</th>
                    <th className="px-4 py-3 text-center font-medium">รวม</th>
                    <th className="px-4 py-3 text-center font-medium">ดูข้อความเชิงบวก</th>
                    <th className="px-4 py-3 text-center font-medium">ดูข้อความเชิงลบ</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row, index) => (
                    <tr 
                      key={index} 
                      className={index % 2 === 0 ? "bg-white" : "bg-neutral-50/40"}
                    >
                      <td className="px-4 py-3 border-t border-neutral-100">{row.topic}</td>
                      <td className="px-4 py-3 border-t border-neutral-100">{row.group}</td>
                      <td className="px-4 py-3 text-center border-t border-neutral-100">
                        <span className="text-emerald-600 font-medium">{row.pos}</span>
                      </td>
                      <td className="px-4 py-3 text-center border-t border-neutral-100">
                        <span className="text-rose-600 font-medium">{row.neg}</span>
                      </td>
                      <td className="px-4 py-3 text-center border-t border-neutral-100 font-medium">
                        {row.pos + row.neg}
                      </td>
                      <td className="px-4 py-3 text-center border-t border-neutral-100">
                        <Button 
                          variant="ghost"
                          size="sm" 
                          className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-full px-3 py-1 text-xs border-none"
                        >
                          ดูข้อความ
                        </Button>
                      </td>
                      <td className="px-4 py-3 text-center border-t border-neutral-100">
                        <Button 
                          variant="ghost"
                          size="sm" 
                          className="bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-full px-3 py-1 text-xs border-none"
                        >
                          ดูข้อความ
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegionalDashboardOnePage;