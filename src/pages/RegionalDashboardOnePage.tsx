import { useMemo, useState, useEffect, Fragment } from "react";
import { useNavigate } from "react-router-dom";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

import { Menu, X, LogOut, RotateCcw, SlidersHorizontal } from "lucide-react";
import { MiniRailSidebar } from "@/components/dashboard/MiniRailSidebar";
import { MenuItems } from "@/components/dashboard/MenuItems";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

function FiltersPanel() {
  const lineOptions = [
    { value: "line1", label: "สายกิจ 1" },
    { value: "line2", label: "สายกิจ 2" },
    { value: "line3", label: "สายกิจ 3" },
    { value: "line4", label: "สายกิจ 4" },
    { value: "line5", label: "สายกิจ 5" },
    { value: "line6", label: "สายกิจ 6" },
  ];
  const regionOptions = [
    { value: "region1", label: "ภาค 1" },
    { value: "region2", label: "ภาค 2" },
    { value: "region3", label: "ภาค 3" },
  ];
  const districtOptions = [
    { value: "district1", label: "ธนบดีเพรซ" },
    { value: "district2", label: "เขต 2" },
    { value: "district3", label: "เขต 3" },
  ];
  const branchOptions = [
    { value: "branch1", label: "เจริญกรุง" },
    { value: "branch2", label: "สาขา 2" },
    { value: "branch3", label: "สาขา 3" },
  ];

  // ช่วงเวลา (ถูกย้ายมา "คอลัมน์ซ้าย")
  const periodOptions = [
    { value: "all", label: "ทั้งหมด" },
    { value: "ytd", label: "ปีนี้ถึงปัจจุบัน" },
    { value: "quarter", label: "ไตรมาสล่าสุด" },
    { value: "month", label: "เดือนล่าสุด" },
  ];

  // หมวดหมู่หลัก (ใหม่) + หมวดย่อย (อยู่ "คอลัมน์ขวา" คู่กัน)
  const maincatOptions = [
    { value: "all", label: "ทั้งหมด" },
    { value: "market", label: "Market Conduct" },
    { value: "service", label: "กระบวนการให้บริการ" },
    { value: "product", label: "เงื่อนไขผลิตภัณฑ์" },
    { value: "digital", label: "ช่องทางดิจิทัล/MyMo" },
    { value: "place", label: "สถานที่และความสะดวก" },
    { value: "info", label: "ข้อมูลข่าวสาร/การสื่อสาร" },
    { value: "other", label: "อื่น ๆ" },
  ] as const;

  const subcatMap: Record<string, { value: string; label: string }[]> = {
    market: [
      { value: "fee", label: "ค่าธรรมเนียม/การเปิดเผยข้อมูล" },
      { value: "mislead", label: "ข้อความ/การสื่อสารทำให้เข้าใจผิด" },
      { value: "privacy", label: "ข้อมูลส่วนบุคคล" },
    ],
    service: [
      { value: "speed", label: "ความรวดเร็วในการให้บริการ" },
      { value: "waiting", label: "ระยะเวลารอคอย" },
      { value: "staff", label: "มารยาท/ความสุภาพของพนักงาน" },
    ],
    product: [
      { value: "condition", label: "เงื่อนไข/คุณสมบัติผลิตภัณฑ์" },
      { value: "interest", label: "อัตราดอกเบี้ย/ผลตอบแทน" },
    ],
    digital: [
      { value: "mymo", label: "แอป MyMo" },
      { value: "otp", label: "OTP/ความปลอดภัย" },
      { value: "onlinepay", label: "การชำระเงินออนไลน์" },
    ],
    place: [
      { value: "parking", label: "ที่จอดรถ" },
      { value: "queue", label: "ระบบคิวหน้าสาขา" },
      { value: "facility", label: "สิ่งอำนวยความสะดวก" },
    ],
    info: [
      { value: "announce", label: "ประกาศ/ประชาสัมพันธ์" },
      { value: "accuracy", label: "ความถูกต้องของข้อมูล" },
    ],
    other: [{ value: "othermisc", label: "อื่น ๆ (ระบุ)" }],
  };

  /** ---------- States ---------- */
  const [area, setArea] = useState({ line: "line1", region: "region2", district: "district1", branch: "branch1" });
  const [services, setServices] = useState({ deposit: true, loanpay: true, apply: true, other: false });

  // ช่วงเวลา (ซ้าย)
  const [period, setPeriod] = useState("quarter");

  // หมวดหมู่/หมวดย่อย (ขวา)
  const [maincat, setMaincat] = useState<(typeof maincatOptions)[number]["value"]>("all");
  const subcatOptions = useMemo(
    () => [{ value: "all", label: "ทั้งหมด" }, ...(subcatMap[maincat] ?? [])],
    [maincat]
  );
  const [subcat, setSubcat] = useState("all");
  useEffect(() => {
    // ถ้าเปลี่ยนหมวดแล้วย่อยเดิมไม่อยู่ในตัวเลือกใหม่ → reset เป็น "ทั้งหมด"
    if (!subcatOptions.some((o) => o.value === subcat)) setSubcat("all");
  }, [subcatOptions, subcat]);

  // helpers
  const labelOf = (opts: { value: string; label: string }[], v: string) =>
    opts.find((o) => o.value === v)?.label ?? "";
  const allSelected = services.deposit && services.loanpay && services.apply && services.other;
  const selectedServiceCount =
    (services.deposit ? 1 : 0) + (services.loanpay ? 1 : 0) + (services.apply ? 1 : 0) + (services.other ? 1 : 0);
  const toggleService = (k: "deposit" | "loanpay" | "apply" | "other") => setServices((s) => ({ ...s, [k]: !s[k] }));
  const toggleAllServices = () =>
    setServices({ deposit: !allSelected, loanpay: !allSelected, apply: !allSelected, other: !allSelected });

  // apply summary
  const [appliedSummary, setAppliedSummary] = useState<string | null>(null);
  const applyFilters = () => {
    const sv: string[] = [];
    if (services.deposit) sv.push("ฝาก-ถอน/สลาก");
    if (services.loanpay) sv.push("ชำระสินเชื่อ/ค่าสินค้า");
    if (services.apply) sv.push("สมัครใช้บริการ");
    if (services.other) sv.push("อื่น ๆ");

    const txt =
      `พื้นที่: ${labelOf(lineOptions, area.line)}, ${labelOf(regionOptions, area.region)}, ` +
      `เขต ${labelOf(districtOptions, area.district)}, สาขา ${labelOf(branchOptions, area.branch)} • ` +
      `บริการ: ${sv.length ? sv.join(", ") : "—"} • ` +
      `ช่วงเวลา: ${labelOf(periodOptions, period)} • ` +
      `หมวด: ${labelOf(maincatOptions as any, maincat)} / ย่อย: ${labelOf(subcatOptions, subcat)}`;
    setAppliedSummary(txt);
    console.log("[APPLY FILTERS]", { area, services, period, maincat, subcat });
  };

  const Check = ({ checked }: { checked: boolean }) => (
    <div
      className={
        "w-4 h-4 rounded border-2 flex items-center justify-center " +
        (checked ? "border-pink-400 bg-pink-400" : "border-gray-300 bg-white")
      }
    >
      {checked ? (
        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      ) : null}
    </div>
  );

  /** ---------- UI ---------- */
  return (
    <Card className="border-none shadow-sm">
      <CardContent className="p-0">
        <div className="rounded-2xl border bg-white p-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* ================== Left: Area + Period (ย้ายช่วงเวลามาฝั่งซ้าย) ================== */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-kanit text-xl font-bold text-foreground">พื้นที่ดูแล</h3>

                <div className="space-y-3">
                  {/* สายกิจ */}
                  <div className="flex items-center gap-3">
                    <label className="w-16 text-sm font-kanit font-medium text-dashboard-muted">สายกิจ:</label>
                    <Select value={area.line} onValueChange={(v) => setArea((a) => ({ ...a, line: v }))}>
                      <SelectTrigger className="flex-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {lineOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* ภาค */}
                  <div className="flex items-center gap-3">
                    <label className="w-16 text-sm font-kanit font-medium text-dashboard-muted">ภาค:</label>
                    <Select value={area.region} onValueChange={(v) => setArea((a) => ({ ...a, region: v }))}>
                      <SelectTrigger className="flex-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {regionOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* เขต */}
                  <div className="flex items-center gap-3">
                    <label className="w-16 text-sm font-kanit font-medium text-dashboard-muted">เขต:</label>
                    <Select value={area.district} onValueChange={(v) => setArea((a) => ({ ...a, district: v }))}>
                      <SelectTrigger className="flex-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {districtOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* สาขา */}
                  <div className="flex items-center gap-3">
                    <label className="w-16 text-sm font-kanit font-medium text-dashboard-muted">สาขา:</label>
                    <Select value={area.branch} onValueChange={(v) => setArea((a) => ({ ...a, branch: v }))}>
                      <SelectTrigger className="flex-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {branchOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <p className="text-sm font-kanit text-dashboard-muted">
                  เลือกแล้ว: {labelOf(lineOptions, area.line)}, {labelOf(regionOptions, area.region)},{" "}
                  เขต {labelOf(districtOptions, area.district)}, สาขา {labelOf(branchOptions, area.branch)}
                </p>
              </div>

              {/* ช่วงเวลา (ย้ายมาฝั่งซ้าย) */}
              <div>
                <h3 className="font-kanit text-xl font-bold text-foreground">ช่วงเวลา</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Select value={period} onValueChange={setPeriod}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {periodOptions.map((p) => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* ================== Right: Services + Category/Subcategory ================== */}
            <div className="space-y-6">
              {/* Services */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-kanit text-xl font-bold text-foreground">ประเภทการใช้บริการ</h3>
                  <Button variant="ghost" size="sm" className="text-dashboard-muted">≡</Button>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer" onClick={toggleAllServices}>
                    <Check checked={allSelected} />
                    <span className={"text-sm font-kanit " + (allSelected ? "text-dashboard-text" : "text-dashboard-muted")}>เลือกทั้งหมด</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer" onClick={() => toggleService("deposit")}>
                    <Check checked={services.deposit} />
                    <span className={"text-sm font-kanit " + (services.deposit ? "text-dashboard-text" : "text-dashboard-muted")}>ฝาก-ถอนเงิน/สลาก</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer" onClick={() => toggleService("loanpay")}>
                    <Check checked={services.loanpay} />
                    <span className={"text-sm font-kanit " + (services.loanpay ? "text-dashboard-text" : "text-dashboard-muted")}>ชำระสินเชื่อ/ชำระค่าสินค้าผ่านการบริการ</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer" onClick={() => toggleService("apply")}>
                    <Check checked={services.apply} />
                    <span className={"text-sm font-kanit " + (services.apply ? "text-dashboard-text" : "text-dashboard-muted")}>สมัครใช้บริการ เช่นฟาก/สินเชื่อ/MyMo/บัตร</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer" onClick={() => toggleService("other")}>
                    <Check checked={services.other} />
                    <span className={"text-sm font-kanit " + (services.other ? "text-dashboard-text" : "text-dashboard-muted")}>อื่น ๆ</span>
                  </label>
                </div>

                <p className="text-sm font-kanit text-dashboard-muted mt-3">เลือกแล้ว: {selectedServiceCount} บริการ</p>
              </div>

              {/* Category + Subcategory (วางคู่กัน) */}
              <div>
                <h3 className="font-kanit text-xl font-bold text-foreground">หมวดหมู่</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-kanit text-dashboard-muted mb-1 block">หมวดหมู่:</label>
                    <Select value={maincat} onValueChange={(v) => setMaincat(v as any)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {maincatOptions.map((m) => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-kanit text-dashboard-muted mb-1 block">หมวดย่อย:</label>
                    <Select value={subcat} onValueChange={setSubcat}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {subcatOptions.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <p className="text-sm font-kanit text-dashboard-muted mt-2">
                  เลือกแล้ว: {maincat === "all" && subcat === "all"
                    ? "7 หมวดหมู่, 37 หมวดย่อย (mock)"
                    : `หมวด: ${labelOf(maincatOptions as any, maincat)} / ย่อย: ${labelOf(subcatOptions, subcat)}`}
                </p>
              </div>

              {/* Footer actions */}
              <div className="flex items-center justify-between">
                <div className="text-xs font-kanit text-dashboard-muted">
                  {appliedSummary ? `ใช้ตัวกรองแล้ว: ${appliedSummary}` : "ยังไม่ได้ใช้ตัวกรอง"}
                </div>
                <Button variant="outline" className="gap-2" onClick={applyFilters}>
                  <SlidersHorizontal className="h-4 w-4" />
                  ปรับตัวกรอง
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


const categories = [
  { name: "Market Conduct", nameEng: "Market Conduct", color: "#ef4444" },
  { name: "กระบวนการให้บริการ", nameEng: "Service Process", color: "#f97316" },
  { name: "ความประทับใจอื่นๆ", nameEng: "Other Impressions", color: "#f59e0b" },
  { name: "เงื่อนไขผลิตภัณฑ์", nameEng: "Product Terms", color: "#22c55e" },
  { name: "พนักงานและบุคลากร", nameEng: "Staff & Personnel", color: "#3b82f6" },
  { name: "ระบบธนาคารและเทคโนโลยี", nameEng: "Banking Systems", color: "#a855f7" },
  { name: "สภาพแวดล้อมและสิ่งอำนวยความสะดวก", nameEng: "Environment & Facilities", color: "#ec4899" }
];

const generateBarData = () =>
  Array.from({ length: 18 }, (_, i) => ({
    name: `ภาค ${i + 1}`,
    pos: Math.floor(Math.random() * 70) + 90,
    neg: Math.floor(Math.random() * 20) + 30,
  }));

const generateLineData = () => {
  const months = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย."];
  return months.map(month => {
    const data: any = { month };
    categories.forEach((_, index) => {
      const v = Math.floor(Math.random() * 60) + 20;
      data[`cat${index}`] = v;
      data[`cat${index}_neg`] = -v;
    });
    return data;
  });
};

const tableData = [
  { topic: "การบังคับ", group: "Market Conduct", pos: 14, neg: 8 },
  { topic: "ค่าธรรมเนียม", group: "เงื่อนไขผลิตภัณฑ์", pos: 23, neg: 12 },
  { topic: "การสื่อสาร", group: "พนักงานและบุคลากร", pos: 18, neg: 15 },
  { topic: "ระบบออนไลน์", group: "ระบบธนาคารและเทคโนโลยี", pos: 31, neg: 7 },
  { topic: "สภาพแวดล้อม", group: "สภาพแวดล้อมและสิ่งอำนวยความสะดวก", pos: 25, neg: 9 },
  { topic: "ความรวดเร็ว", group: "กระบวนการให้บริการ", pos: 29, neg: 11 },
  { topic: "ความพึงพอใจ", group: "ความประทับใจอื่นๆ", pos: 22, neg: 6 },
];

/* ------------------------------- Page Component ------------------------------ */

const RegionalDashboardOnePage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const handleLogout = () => navigate("/");

  // Chart legend visibility
  const [visible, setVisible] = useState<boolean[]>(() => categories.map(() => true));

  const barData = generateBarData();
  const lineData = [
  { month: "ม.ค.", cat0: 57, cat0_neg: 44, cat1: 54, cat1_neg: 26, cat2: 48, cat2_neg: 25, cat3: 63, cat3_neg: 54, cat4: 42, cat4_neg: 17, cat5: 24, cat5_neg: 47, cat6: 36, cat6_neg: 20 },
  { month: "ก.พ.", cat0: 38, cat0_neg: 33, cat1: 61, cat1_neg: 21, cat2: 52, cat2_neg: 24, cat3: 58, cat3_neg: 49, cat4: 39, cat4_neg: 15, cat5: 33, cat5_neg: 41, cat6: 34, cat6_neg: 18 },
  { month: "เม.ย.", cat0: 29, cat0_neg: 30, cat1: 70, cat1_neg: 18, cat2: 60, cat2_neg: 22, cat3: 40, cat3_neg: 35, cat4: 46, cat4_neg: 14, cat5: 32, cat5_neg: 39, cat6: 31, cat6_neg: 19 },
  { month: "พ.ค.", cat0: 22, cat0_neg: 29, cat1: 55, cat1_neg: 20, cat2: 58, cat2_neg: 23, cat3: 37, cat3_neg: 34, cat4: 52, cat4_neg: 16, cat5: 28, cat5_neg: 35, cat6: 28, cat6_neg: 21 },
  { month: "มิ.ย.", cat0: 41, cat0_neg: 28, cat1: 49, cat1_neg: 22, cat2: 45, cat2_neg: 24, cat3: 31, cat3_neg: 33, cat4: 60, cat4_neg: 18, cat5: 36, cat5_neg: 32, cat6: 27, cat6_neg: 23 },
];
  // หลัง const lineData = [...] ของคุณ
  const lineDataFixed = lineData.map((row) => {
    const out: any = { ...row };
    categories.forEach((_, i) => {
      out[`cat${i}`] = Number(out[`cat${i}`] ?? 0);          // บวก
      out[`cat${i}_neg`] = -Math.abs(Number(out[`cat${i}_neg`] ?? 0)); // ลบ
    });
    return out;
  });
  const toggleCategory = (idx: number) =>
    setVisible((v) => {
      const nv = [...v];
      nv[idx] = !nv[idx];
      return nv;
  });
const renderTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="rounded-xl border border-gray-200 bg-white px-3 py-2 shadow-md">
      <div className="mb-1 font-kanit text-sm text-gray-700">{label}</div>
      <div className="space-y-1">
        {categories.map((c, i) => {
          if (!visible[i]) return null;
          const pos = payload.find((p: any) => p.dataKey === `cat${i}`)?.value;
          const neg = payload.find((p: any) => p.dataKey === `cat${i}_neg`)?.value;
          if (pos == null && neg == null) return null;
          return (
            <div key={i} className="flex items-start gap-2 text-xs font-kanit">
              <div className="mt-1 h-2 w-2 rounded-sm" style={{ backgroundColor: c.color }} />
              <div className="text-gray-700">
                <span className="font-medium">{c.name}</span>{" "}
                <span className="text-gray-500">— </span>
                <span className="text-emerald-700">เชิงบวก: {pos ?? 0}</span>
                <span className="text-gray-400"> • </span>
                <span className="text-rose-700">เชิงลบ: {neg ?? 0}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
  
  return (
    <div className="min-h-screen bg-background text-dashboard-text">
      {/* Sidebar (mini rail) */}
      <MiniRailSidebar onToggleMainSidebar={() => setIsOpen(!isOpen)} />

      {/* Top Bar */}
      <header className="topbar px-6">
        <div className="w-full">
          <div className="flex items-center justify-between relative z-10">

            {/* Desktop Drawer */}
            <div className="hidden md:block">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetContent side="left" className="w-80 ml-[72px]">
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
            </div>

            {/* Left text in topbar */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white font-kanit mb-2">Dashboard ข้อเสนอแนะ ข้อร้องเรียน การใช้บริการสาขา</h1>
              <p className="text-white/80 font-kanit text-base">ระบบติดตามและวิเคราะห์ข้อร้องเรียนลูกค้าธนาคารออมสิน</p>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-white text-base font-kanit">อัปเดตล่าสุด: 31/08/2025&nbsp; 09:49 น.</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-pink-400/30 w-10 h-10 rounded-full border border-white/20"
                  aria-label="รีเฟรช"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="text-white hover:bg-pink-400/30 flex items-center gap-2 font-kanit px-4 py-2 rounded-full border border-white/20"
                >
                  <LogOut className="h-4 w-4" />
                  ออกจากระบบ
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="main-content transition-all duration-200 ease-out min-h-screen">
        <div className="container mx-auto p-6 space-y-8">

          {/* หัวแบบ Dashboard (ชิดซ้าย) */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground font-kanit mb-2">
              ผลการดำเนินงานรายพื้นที่
            </h2>
            <p className="text-muted-foreground font-kanit">
              รวบรวมและวิเคราะห์ความคิดเห็นและข้อเสนอแนะจากลูกค้า
            </p>
          </div>

          {/* Section 1: Filters */}
          <FiltersPanel />

          {/* Section 2: Bar Chart */}
          <Card className="border-none shadow-sm">
            <CardContent className="p-0">
              <div className="rounded-2xl border bg-white p-5">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 rounded-sm" style={{ background: "var(--gradient-pink-emerald)" }} />
                  <h2 className="font-kanit text-xl font-bold text-foreground">ทัศนคติรายพื้นที่</h2>
                </div>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData} margin={{ top: 10, right: 16, left: 8, bottom: 0 }} barCategoryGap={20}>
                      <XAxis dataKey="name" tickMargin={10} angle={-35} textAnchor="end" height={60} fontSize={12} />
                      <YAxis domain={[0, 160]} ticks={[0, 40, 80, 120, 160]} fontSize={12} />
                      <Tooltip />
                      <Bar dataKey="pos" fill="#2ecc71" radius={[4, 4, 0, 0]} barSize={40} />
                      <Bar dataKey="neg" fill="#e74c3c" radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 3: Line Chart */}
          <Card className="border-none shadow-sm">
            <CardContent className="p-0">
              <div className="rounded-2xl border bg-white p-5">
                <div className="mb-6 flex items-center gap-2">
                  <div className="h-3 w-3 rounded-sm" style={{ background: "var(--gradient-pink-sky)" }} />
                  <h2 className="font-kanit text-xl font-bold text-foreground">แนวโน้มทัศนคติ</h2>
                </div>

                {/* Legend */}
                <div className="mb-6 flex flex-wrap gap-4">
                  {categories.map((category, index) => (
                    <label key={index} className="flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={visible[index]}
                        onChange={() => toggleCategory(index)}
                        className="h-4 w-4 rounded"
                      />
                      <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: category.color }} />
                      <span className="font-kanit text-sm text-dashboard-text">{category.name}</span>
                    </label>
                  ))}
                </div>

                {/* Chart */}
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={lineDataFixed} margin={{ top: 10, right: 16, left: 8, bottom: 0 }}>
                      <XAxis dataKey="month" fontSize={12} />
                      <YAxis domain={[-70, 70]} ticks={[-70, -35, 0, 35, 70]} fontSize={12} />
                      <Tooltip content={renderTooltip} />
                      <ReferenceLine y={0} stroke="#111827" strokeWidth={1} />
                      {categories.map((cat, i) =>
                        visible[i] ? (
                          <Fragment key={i}>
                            <Line
                              type="monotone"
                              dataKey={`cat${i}`}
                              stroke={cat.color}
                              strokeWidth={2}
                              dot={{ r: 3 }}
                              isAnimationActive={false}
                            />
                            <Line
                              type="monotone"
                              dataKey={`cat${i}_neg`}
                              stroke={cat.color}
                              strokeWidth={2}
                              dot={{ r: 3 }}
                              isAnimationActive={false}
                            />
                          </Fragment>
                        ) : null
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 4: Table */}
          <Card className="border-none shadow-sm">
            <CardContent className="p-0">
              <div className="rounded-2xl border bg-white p-5">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 rounded-sm" style={{ background: "var(--gradient-pink-indigo)" }} />
                  <h2 className="font-kanit text-xl font-bold text-foreground">หมวดหมู่ที่ถูกกล่าวถึง</h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-neutral-50 text-dashboard-muted">
                      <tr>
                        <th className="text-left p-3 font-kanit font-medium">ประเด็นที่กล่าวถึง</th>
                        <th className="text-left p-3 font-kanit font-medium">หัวข้อ</th>
                        <th className="text-center p-3 font-kanit font-medium">เชิงบวก</th>
                        <th className="text-center p-3 font-kanit font-medium">เชิงลบ</th>
                        <th className="text-center p-3 font-kanit font-medium">รวม</th>
                        <th className="text-center p-3 font-kanit font-medium">ดูข้อความเชิงบวก</th>
                        <th className="text-center p-3 font-kanit font-medium">ดูข้อความเชิงลบ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.map((row, index) => (
                        <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-neutral-50/40"}>
                          <td className="p-3 border-t">{row.topic}</td>
                          <td className="p-3 border-t">{row.group}</td>
                          <td className="p-3 border-t text-center">
                            <span className="text-chart-emerald font-medium">{row.pos}</span>
                          </td>
                          <td className="p-3 border-t text-center">
                            <span className="text-chart-rose font-medium">{row.neg}</span>
                          </td>
                          <td className="p-3 border-t text-center font-medium">{row.pos + row.neg}</td>
                          <td className="p-3 border-t text-center">
                            <Button size="sm" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-full px-3 py-1 text-xs">
                              ดูข้อความ
                            </Button>
                          </td>
                          <td className="p-3 border-t text-center">
                            <Button size="sm" className="bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-full px-3 py-1 text-xs">
                              ดูข้อความ
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer — เหมือนหน้า Dashboard */}
      <footer style={{ backgroundColor: "#ECEFF1" }} className="border-t border-border py-3 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-col md:flex-row md:items-center gap-4 text-center md:text-left">
              <span className="text-sm text-muted-foreground font-kanit">
                © 2024 Customer Dashboard. สงวนลิขสิทธิ์.
              </span>
              <div className="flex flex-col sm:flex-row items-center gap-2 text-sm">
                <a href="#" className="text-muted-foreground font-kanit hover:text-primary hover:underline transition-colors duration-200">
                  นโยบายความเป็นส่วนตัว
                </a>
                <span className="hidden sm:inline text-muted-foreground">|</span>
                <a href="#" className="text-muted-foreground font-kanit hover:text-primary hover:underline transition-colors duration-200">
                  เงื่อนไขการใช้งาน
                </a>
                <span className="hidden sm:inline text-muted-foreground">|</span>
                <a href="#" className="text-muted-foreground font-kanit hover:text-primary hover:underline transition-colors duration-200">
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
              >
                นโยบายความเป็นส่วนตัว
              </a>
              <a
                href="#"
                className="block bg-gradient-to-r from-[#D8218C] via-[#DF7AB0] to-[#F9B5D3] text-white font-kanit font-medium text-center py-3 px-2 rounded-xl hover:opacity-95 hover:shadow-lg transition-all duration-200"
              >
                เงื่อนไขการใช้งาน
              </a>
              <a
                href="#"
                className="block bg-gradient-to-r from-[#D8218C] via-[#DF7AB0] to-[#F9B5D3] text-white font-kanit font-medium text-center py-3 px-2 rounded-xl hover:opacity-95 hover:shadow-lg transition-all duration-200"
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
    </div>
  );
};

export default RegionalDashboardOnePage;
