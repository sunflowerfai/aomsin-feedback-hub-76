import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ChevronUp, MessageSquare, MapPin, Clock, Star } from "lucide-react";
import { FilterState } from "./FilterCards";

export interface FeedbackItem {
  id: string;
  date: string;
  time: string;
  serviceType: string;
  region: string;
  district: string;
  branch: string;
  feedback: string;
  categories: Array<{
    name: string;
    sentiment: 'positive' | 'negative' | 'neutral';
  }>;
  overallSentiment: 'positive' | 'negative' | 'mixed';
  satisfactionScore?: number;
}

// Enhanced feedback data to match the HTML design
const mockFeedbackData: FeedbackItem[] = [
  {
    id: "1",
    date: "10 มิ.ย. 2025",
    time: "09:14",
    serviceType: "ฝาก-ถอนเงิน/สลาก",
    region: "ภาค16",
    district: "เขต สกู้",
    branch: "ป่าตอง",
    feedback: "พนักงานเป็นกันเอง",
    categories: [
      { name: "ความเอาใจใส่ในการให้บริการลูกค้า", sentiment: "positive" }
    ],
    overallSentiment: "positive",
    satisfactionScore: 4.5
  },
  {
    id: "2", 
    date: "27 พ.ค. 2025",
    time: "14:13",
    serviceType: "สอบถาม/ขอคำปรึกษา",
    region: "ภาค8",
    district: "เขต บางกอกใหญ่",
    branch: "กำพะ",
    feedback: "พี่เจ้าหน้าที่แนะนำดีค่ะ บริการรวดเร็ว ยิ้มแย้ม",
    categories: [
      { name: "ความสามารถในการตอบคำถามหรือให้คำแนะนำ", sentiment: "positive" },
      { name: "ความรวดเร็วในการให้บริการ", sentiment: "positive" },
      { name: "ความสุภาพและมารยาทของพนักงาน", sentiment: "positive" }
    ],
    overallSentiment: "positive",
    satisfactionScore: 5.0
  },
  {
    id: "3",
    date: "06 พ.ค. 2025", 
    time: "14:35",
    serviceType: "ชำระสินเชื่อ/ชำระค่าสินค้าและบริการ",
    region: "ภาค16",
    district: "เขต หลังสวน", 
    branch: "หลังสวน",
    feedback: "บริการดีค่ะ",
    categories: [
      { name: "ความเอาใจใส่ในการให้บริการลูกค้า", sentiment: "positive" }
    ],
    overallSentiment: "positive",
    satisfactionScore: 4.0
  },
  {
    id: "4",
    date: "03 พ.ค. 2025",
    time: "11:22", 
    serviceType: "สมัครใช้บริการ เงินฝาก/สินเชื่อ/MyMo/บัตร",
    region: "ภาค5",
    district: "เขต พิษณุโลก",
    branch: "พิษณุโลก",
    feedback: "ระบบล่ม รอนานมาก พนักงานไม่สามารถแก้ปัญหาได้ ต้องมาใหม่อีกครั้ง เสียเวลาเปล่า บริการแย่มาก",
    categories: [
      { name: "ระบบ Core ของธนาคาร", sentiment: "negative" },
      { name: "การจัดการและแก้ไขปัญหาเฉพาะหน้า", sentiment: "negative" },
      { name: "ระยะเวลาอนุมัติ", sentiment: "negative" }
    ],
    overallSentiment: "negative",
    satisfactionScore: 1.0
  },
  {
    id: "5",
    date: "02 พ.ค. 2025",
    time: "16:45", 
    serviceType: "ฝาก-ถอนเงิน/สลาก",
    region: "ภาค12",
    district: "เขต ขอนแก่น",
    branch: "ขอนแก่น",
    feedback: "ขั้นตอนการสมัครเยอะ เอกสารเยอะ แต่พนักงานช่วยเหลือดี อธิบายชัดเจน สาขาสะอาด ที่นั่งรอสะดวก",
    categories: [
      { name: "ขั้นตอนการให้บริการ", sentiment: "negative" },
      { name: "ภาระเอกสาร", sentiment: "negative" },
      { name: "ความเอาใจใส่ในการให้บริการลูกค้า", sentiment: "positive" },
      { name: "ความสะอาด", sentiment: "positive" },
      { name: "ที่นั่งรอ", sentiment: "positive" }
    ],
    overallSentiment: "mixed",
    satisfactionScore: 3.5
  }
];

interface FeedbackListProps {
  filters: FilterState;
}

export const FeedbackList = ({ filters }: FeedbackListProps) => {
  const [activeTab, setActiveTab] = useState("all");
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Filter feedback data based on filters
  const filteredFeedback = useMemo(() => {
    return mockFeedbackData.filter(item => {
      // Apply filters here
      // For now, return all items as this is mock data
      return true;
    });
  }, [filters]);

  // Filter by sentiment tab
  const feedbackByTab = useMemo(() => {
    switch (activeTab) {
      case "positive":
        return filteredFeedback.filter(item => item.overallSentiment === "positive");
      case "negative": 
        return filteredFeedback.filter(item => item.overallSentiment === "negative");
      default:
        return filteredFeedback;
    }
  }, [filteredFeedback, activeTab]);

  const getSentimentColor = (sentiment: 'positive' | 'negative' | 'neutral') => {
    switch (sentiment) {
      case 'positive': return 'bg-chart-positive text-white';
      case 'negative': return 'bg-chart-negative text-white'; 
      default: return 'bg-gray-500 text-white';
    }
  };

  const getCardColor = (sentiment: 'positive' | 'negative' | 'mixed') => {
    switch (sentiment) {
      case 'positive': return 'bg-green-50 border-green-200';
      case 'negative': return 'bg-red-50 border-red-200';
      case 'mixed': return 'bg-yellow-50 border-yellow-200';
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6">
      {/* Header with tabs */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold font-kanit text-foreground mb-1">ความคิดเห็นของลูกค้า</h3>
          <p className="text-sm font-kanit text-muted-foreground">พบความคิดเห็น {feedbackByTab.length} รายการ</p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant={activeTab === "all" ? "default" : "outline"}
            size="sm" 
            onClick={() => setActiveTab("all")}
            className="font-kanit text-xs h-8"
          >
            ทั้งหมด
          </Button>
          <Button 
            variant={activeTab === "positive" ? "default" : "outline"}
            size="sm" 
            onClick={() => setActiveTab("positive")}
            className="font-kanit text-xs h-8"
          >
            เชิงบวก
          </Button>
          <Button 
            variant={activeTab === "negative" ? "default" : "outline"}
            size="sm" 
            onClick={() => setActiveTab("negative")}
            className="font-kanit text-xs h-8"
          >
            เชิงลบ
          </Button>
        </div>
      </div>

      {/* Feedback cards - Simple design matching HTML */}
      <div className="space-y-4">
        {feedbackByTab.map((item) => (
          <div key={item.id} className={`${getCardColor(item.overallSentiment)} rounded-lg p-4 text-sm`}>
            {/* Header with location and date */}
            <div className="flex justify-between items-start text-xs text-muted-foreground mb-2">
              <span className="font-kanit">
                {item.region} • {item.district} • {item.branch}
              </span>
              <span className="font-kanit">
                {item.date} {item.time}
              </span>
            </div>
            
            {/* Feedback text */}
            <p className="mb-2 font-kanit text-foreground">
              {item.feedback}
            </p>
            
            {/* Category tags */}
            <div className="flex flex-wrap gap-1">
              {item.categories.map((category, index) => (
                <Badge 
                  key={index} 
                  className={`${getSentimentColor(category.sentiment)} font-kanit text-xs px-2 py-0.5`}
                >
                  {category.name}
                </Badge>
              ))}
            </div>
          </div>
        ))}

        {feedbackByTab.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-kanit text-muted-foreground">ไม่พบความคิดเห็นในช่วงเวลาที่เลือก</p>
            <p className="text-sm font-kanit text-muted-foreground mt-2">ลองเปลี่ยนตัวกรองหรือช่วงเวลาใหม่</p>
          </div>
        )}
      </div>
    </div>
  );
};