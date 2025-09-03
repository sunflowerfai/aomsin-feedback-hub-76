import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Menu, X, LogOut, RotateCcw, RefreshCw } from "lucide-react";
import { MenuItems } from "@/components/dashboard/MenuItems";
import { MiniRailSidebar } from "@/components/dashboard/MiniRailSidebar";
import { SatisfactionBlock, RegionalComparisonCard } from "@/components/dashboard/SatisfactionBlock";
import { FormSubmissionBlock } from "@/components/dashboard/FormSubmissionBlock";
import { FeedbackBlock } from "@/components/dashboard/FeedbackBlock";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import CustomerFeedback from "@/pages/CustomerFeedback";
import FeedbackFlowModal from "@/components/dashboard/AgentFlowModal";

/** ------------------------------ Component ------------------------------ */
const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [flowOpen, setFlowOpen] = useState(false);
  const navigate = useNavigate();
  const { hash } = useLocation();

  // กำหนด section จาก hash (#feedback, #complaints, #ai, #docs)
  const section = (hash || "").replace("#", "");
  const titleMap: Record<string, string> = {
    feedback: "ข้อคิดเห็นของลูกค้า",
    complaints: "ข้อร้องเรียนรุนแรง",
    ai: "AI Chat ช่วยวิเคราะห์",
    docs: "เอกสารอ้างอิง",
  };
  const pageTitle = titleMap[section] ?? "สรุปภาพรวมประจำเดือน";
  const isOverview = !section; // แสดงฟิลเตอร์เฉพาะหน้า overview

  // Year/Month filters
  const currentYear = new Date().getFullYear() + 543;
  const currentMonth = new Date().getMonth() + 1;
  const [selectedYear, setSelectedYear] = useState(
    currentYear >= 2567 && currentYear <= 2568 ? currentYear.toString() : "2568"
  );
  const [selectedMonth, setSelectedMonth] = useState(currentMonth.toString());

  const thaiMonths = [
    { value: "1", label: "มกราคม" },
    { value: "2", label: "กุมภาพันธ์" },
    { value: "3", label: "มีนาคม" },
    { value: "4", label: "เมษายน" },
    { value: "5", label: "พฤษภาคม" },
    { value: "6", label: "มิถุนายน" },
    { value: "7", label: "กรกฎาคม" },
    { value: "8", label: "สิงหาคม" },
    { value: "9", label: "กันยายน" },
    { value: "10", label: "ตุลาคม" },
    { value: "11", label: "พฤศจิกายน" },
    { value: "12", label: "ธันวาคม" },
  ];

  const handleLogout = () => navigate("/");

  // เปลี่ยนคอนเทนต์ตาม section
  const renderContent = () => {
    switch (section) {
      case "feedback":
        return <CustomerFeedback />;
      case "complaints":
      case "ai":
      case "docs":
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-semibold text-muted-foreground">{pageTitle}</h2>
              <p className="text-muted-foreground">เนื้อหาของส่วนนี้จะพัฒนาในเร็วๆ นี้</p>
            </div>
          </div>
        );
      default:
        // overview
        return (
          <div className="space-y-8">
            <div className="space-y-8">
              <FormSubmissionBlock />
              <SatisfactionBlock />
              <RegionalComparisonCard />
              
                          </div>

            <div className="mt-12">
              <Tabs defaultValue="overview" className="w-full">
                <TabsContent value="overview" className="space-y-6"></TabsContent>

                <TabsContent value="regional" className="space-y-6">
                  <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                    <div className="h-2 bg-gradient-to-r from-[#DF7AB0] to-[#F9B5D3] rounded-t-xl -mt-6 -mx-6 mb-6"></div>
                    <h3 className="text-xl font-bold font-kanit text-foreground mb-4">เปรียบเทียบข้อมูลรายภาค</h3>
                    <p className="text-muted-foreground font-kanit mb-6">
                      เปรียบเทียบความพึงพอใจและข้อร้องเรียนระหว่างภาคต่างๆ
                    </p>
                    <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                      <p className="text-gray-500 font-kanit">กราฟเปรียบเทียบรายภาคจะแสดงที่นี่</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="analysis" className="space-y-6">
                  <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                    <div className="h-2 bg-gradient-to-r from-[#DF7AB0] to-[#F9B5D3] rounded-t-xl -mt-6 -mx-6 mb-6"></div>
                    <h3 className="text-xl font-bold font-kanit text-foreground mb-4">การวิเคราะห์เชิงลึก</h3>
                    <p className="text-muted-foreground font-kanit mb-6">การวิเคราะห์แนวโน้ม รูปแบบ และข้อเสนอแนะเชิงลึก</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="h-48 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                        <p className="text-gray-500 font-kanit">แผนภูมิวิเคราะห์แนวโน้ม</p>
                      </div>
                      <div className="h-48 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                        <p className="text-gray-500 font-kanit">การจัดกลุ่มข้อร้องเรียน</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="trends" className="space-y-6">
                  <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                    <div className="h-2 bg-gradient-to-r from-[#DF7AB0] to-[#F9B5D3] rounded-t-xl -mt-6 -mx-6 mb-6"></div>
                    <h3 className="text-xl font-bold font-kanit text-foreground mb-4">แนวโน้มและคาดการณ์</h3>
                    <p className="text-muted-foreground font-kanit mb-6">การคาดการณ์แนวโน้มในอนาคตและข้อเสนอแนะเชิงกลยุทธ์</p>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <div className="flex-1">
                          <div className="font-medium text-purple-700 font-kanit">คาดการณ์ความพึงพอใจเดือนหน้า</div>
                          <div className="text-sm text-purple-600 font-kanit">แนวโน้มเพิ่มขึ้น 2.3%</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-lg">
                        <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                        <div className="flex-1">
                          <div className="font-medium text-indigo-700 font-kanit">พื้นที่ที่ต้องปรับปรุง</div>
                          <div className="text-sm text-indigo-600 font-kanit">ระยะเวลาการตอบสนอง</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mini Rail Sidebar - Desktop Only */}
      <MiniRailSidebar onToggleMainSidebar={() => setIsOpen(!isOpen)} />

      {/* Top Bar */}
      <header className="topbar px-6">
        <div className="w-full">
          <div className="flex items-center justify-between relative z-10">

            {/* Drawer: ใช้ตัวเดียว ครอบทั้ง mobile/desktop */}
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
                  {/* มี MenuItems แค่ครั้งเดียวพอ */}
                  <MenuItems onItemClick={() => setIsOpen(false)} />
                </div>

                <div className="absolute bottom-4 left-4 right-4">
                  <div className="text-xs text-muted-foreground text-center font-kanit">
                    อัพเดตล่าสุด: 27/08/2025 · 12:25 น.
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Left Content */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white font-kanit mb-2">
                Dashboard ข้อเสนอแนะ ข้อร้องเรียน การใช้บริการสาขา
              </h1>
              <p className="text-white/80 font-kanit text-base">
                ระบบติดตามและวิเคราะห์ข้อร้องเรียนลูกค้าธนาคารออมสิน
              </p>
            </div>

            {/* Right Content */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-white text-base font-kanit">
                  อัปเดตล่าสุด: 31/08/2025&nbsp; 09:49 น.
                </p>
              </div>
              <div className="flex items-center gap-2">
                {/* ปุ่มรีเฟรช → เปิดโมดัล */}
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


      {/* Main Content */}
      <main className="main-content transition-all duration-200 ease-out min-h-screen">
        <div className="container mx-auto p-6">
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-foreground font-kanit mb-2">{pageTitle}</h2>
              <p className="text-muted-foreground font-kanit">ภาพรวมข้อมูลการให้บริการและข้อร้องเรียนของลูกค้าในเดือนปัจจุบัน</p>
            </div>

            {isOverview && (
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-kanit text-muted-foreground">ปี</label>
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger className="w-28 bg-white border border-border rounded-2xl shadow-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-border rounded-xl shadow-lg">
                      <SelectItem value="2567" className="font-kanit hover:bg-muted/50 focus:bg-muted/50">
                        2567
                      </SelectItem>
                      <SelectItem value="2568" className="font-kanit hover:bg-muted/50 focus:bg-muted/50">
                        2568
                      </SelectItem>
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
                        <SelectItem
                          key={m.value}
                          value={m.value}
                          className="font-kanit hover:bg-muted/50 focus:bg-muted/50"
                        >
                          {m.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>

          {renderContent()}
        </div>
      </main>

      {/* Footer */}
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

      {/* Mobile Footer */}
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
    
      {/* FeedbackFlow Modal (controlled) */}
      <FeedbackFlowModal
        open={flowOpen}
        onOpenChange={setFlowOpen}
        hideInternalTrigger
      />
    </div>
  );
};
export default Dashboard;
