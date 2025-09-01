import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Seed data as specified
const mockComments = [
  {
    id: "1",
    meta: "ภาค16 • เขต กะทู้ • ป่าตอง",
    time: "10 มิ.ย. 2025 09:14",
    text: "พนักงานเป็นกันเอง",
    sentiment: "positive" as const,
    tags: [{ label: "ความเอาใจใส่ในการให้บริการลูกค้า", tone: "positive" as const }]
  },
  {
    id: "2", 
    meta: "ภาค3 • เขต บางกอกใหญ่ • ท่าพระ",
    time: "27 พ.ค. 2025 14:13",
    text: "พี่เจ้าหน้าที่แนะนำดีค่ะ บริการรวดเร็ว ยิ้มแย้ม",
    sentiment: "positive" as const,
    tags: [
      { label: "ความสามารถในการตอบคำถามหรือให้คำแนะนำ", tone: "positive" as const },
      { label: "ความรวดเร็วในการให้บริการ", tone: "positive" as const },
      { label: "ความสุภาพและมารยาทของพนักงาน", tone: "positive" as const }
    ]
  },
  {
    id: "3",
    meta: "ภาค16 • เขต หลังสวน • หลังสวน",
    time: "06 พ.ค. 2025 14:35", 
    text: "บริการดีค่ะ",
    sentiment: "positive" as const,
    tags: [{ label: "ความเอาใจใส่ในการให้บริการลูกค้า", tone: "positive" as const }]
  },
  {
    id: "4",
    meta: "ภาค16 • เขต กำแพงเพชร • กำแพงเพชร",
    time: "29 เม.ย. 2025 10:07",
    text: "ถ้าไม่มีมาติดต่อธนาคารจะไม่ทราบเลยว่ามาสุภาษาลูกค้า… ขอบคุณพนักงาน", 
    sentiment: "mixed" as const,
    tags: [
      { label: "ความถูกต้องในการให้บริการ", tone: "negative" as const },
      { label: "ความประทับใจในการให้บริการ", tone: "positive" as const }
    ]
  },
  {
    id: "5",
    meta: "ภาค1 • เขต จตุจักร • เซ็นทรัล ลาดพร้าว",
    time: "12 ม.ค. 2025 14:32",
    text: "คนใช้บริการวันเสาร์อาทิตย์ค่อนข้างเยอะ จัดระบบรับคิว",
    sentiment: "negative" as const,
    tags: [{ label: "ขั้นตอนการให้บริการ", tone: "negative" as const }]
  }
];

type FilterType = "all" | "positive" | "negative";

export const CustomerOpinionsCard = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const getFilteredComments = () => {
    switch (activeFilter) {
      case "positive":
        return mockComments.filter(comment => comment.sentiment === "positive");
      case "negative": 
        return mockComments.filter(comment => comment.sentiment === "negative");
      default:
        return mockComments;
    }
  };

  const filteredComments = getFilteredComments();

  const getBackgroundColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive": return "bg-emerald-50";
      case "negative": return "bg-rose-50"; 
      case "mixed": return "bg-amber-50";
      default: return "bg-gray-50";
    }
  };

  const getTagColor = (tone: string) => {
    switch (tone) {
      case "positive": return "bg-emerald-600 text-white";
      case "negative": return "bg-rose-600 text-white";
      default: return "bg-gray-600 text-white";
    }
  };

  return (
    <Card className="bg-white rounded-2xl shadow-card border border-gray-200 relative overflow-hidden">
      {/* Purple-Pink Gradient Top Strip */}
      <div 
        className="h-2 w-full rounded-t-2xl relative"
        style={{
          background: 'linear-gradient(to right, #c081a8, #dda4c7, #f4d3e6)',
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.3)'
        }}
      />
      
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold font-kanit text-gray-800">
            ความคิดเห็นลูกค้า
          </CardTitle>
          
          {/* Filter Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={() => setActiveFilter("all")}
              className={`text-xs h-8 px-3 font-kanit rounded-xl ${
                activeFilter === "all" 
                  ? "bg-gray-800 text-white hover:bg-gray-700" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              ทั้งหมด
            </Button>
            <Button
              onClick={() => setActiveFilter("positive")}
              className={`text-xs h-8 px-3 font-kanit rounded-xl ${
                activeFilter === "positive" 
                  ? "bg-gray-800 text-white hover:bg-gray-700" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              เชิงบวก
            </Button>
            <Button
              onClick={() => setActiveFilter("negative")}
              className={`text-xs h-8 px-3 font-kanit rounded-xl ${
                activeFilter === "negative" 
                  ? "bg-gray-800 text-white hover:bg-gray-700" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              เชิงลบ
            </Button>
          </div>
        </div>
        
        <p className="text-sm font-kanit text-gray-500 mt-2">
          พบความคิดเห็น {filteredComments.length} รายการ
        </p>
      </CardHeader>
      
      <CardContent>
        {/* Scrollable Comments List */}
        <div className="max-h-[580px] overflow-y-auto space-y-4">
          {filteredComments.map((comment) => (
            <div
              key={comment.id}
              className={`${getBackgroundColor(comment.sentiment)} rounded-lg p-4`}
            >
              {/* Meta Header */}
              <div className="flex justify-between items-start text-xs text-gray-500 mb-2">
                <span className="font-kanit">{comment.meta}</span>
                <span className="font-kanit">{comment.time}</span>
              </div>
              
              {/* Comment Text */}
              <p className="mb-3 font-kanit text-gray-800 text-base leading-relaxed">
                {comment.text}
              </p>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {comment.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    className={`${getTagColor(tag.tone)} font-kanit text-xs px-2 py-1 rounded-full`}
                  >
                    {tag.label}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
          
          {filteredComments.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg font-kanit text-gray-500">
                ไม่พบความคิดเห็นในกรองที่เลือก
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};