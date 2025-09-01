import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Filter, ChevronUp, ChevronDown, Check } from "lucide-react";
import { useState, useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const sentimentData = [
  { name: "เชิงบวก", value: 72.3, count: 892, color: "#20A161" },
  { name: "เชิงลบ", value: 27.7, count: 342, color: "#D14343" }
];

// Main topics to sub-topics mapping
const mainTopicsMapping = {
  "พนักงานและบุคลากร": [
    "ความสุภาพและมารยาทของพนักงาน", "ความเอาใจใส่ในการให้บริการลูกค้า", 
    "ความสามารถในการตอบคำถามหรือให้คำแนะนำ", "ความถูกต้องในการให้บริการ", 
    "ความรวดเร็วในการให้บริการ", "ความเป็นมืออาชีพและการแก้ไขปัญหาเฉพาะหน้า", 
    "ความประทับใจในการให้บริการ", "รปภ", "แม่บ้าน"
  ],
  "ระบบและกระบวนการให้บริการ": [
    "ความพร้อมในการให้บริการ", "กระบวนการให้บริการ ความเป็นธรรมให้บริการ", 
    "ระบบเรียกคิวและจัดการคิว", "ภาระเอกสาร"
  ],
  "เทคโนโลยีและดิจิทัล": [
    "ระบบ Core ของธนาคาร", "เครื่องออกบัตรคิว", "ATM ADM CDM", 
    "E-KYC Scanner", "แอพพลิเคชั่น MyMo", "เครื่องปรับสมุด", "เครื่องนับเงิน"
  ],
  "เงื่อนไขและผลิตภัณฑ์": [
    "รายละเอียด ผลิตภัณฑ์", "เงื่อนไขอนุมัติ", "ระยะเวลาอนุมัติ", 
    "ความยืดหยุ่น", "ความเรียบง่ายข้อมูล"
  ],
  "สภาพแวดล้อมและสิ่งอำนวยความสะดวก": [
    "ความสะอาด", "พื้นที่และความคับคั่ง", "อุณหภูมิ", "โต๊ะรับบริการ", 
    "จุดรอรับบริการ", "แสง", "เสียง", "ห้องน้ำ", "ที่จอดรถ", 
    "ป้าย-สื่อประชาสัมพันธ์", "สิ่งอำนวยความสะดวกอื่นๆ"
  ],
  "Market Conduct": [
    "ไม่หลอกลวง", "ไม่เอาเปรียบ", "ไม่บังคับ", "ไม่รบกวน"
  ],
  "ความประทับใจอื่นๆ": [
    "ความประทับใจอื่นๆ"
  ]
};

// Extended topics data with main category mapping
const topicsData = [
  { main: "สภาพแวดล้อมและสิ่งอำนวยความสะดวก", sub: "แสง", negative_count: 158, positive_count: 349 },
  { main: "พนักงานและบุคลากร", sub: "ความเอาใจใส่ในการให้บริการลูกค้า", negative_count: 48, positive_count: 288 },
  { main: "พนักงานและบุคลากร", sub: "ความสามารถในการตอบคำถามหรือให้คำแนะนำ", negative_count: 37, positive_count: 294 },
  { main: "เงื่อนไขและผลิตภัณฑ์", sub: "ความเรียบง่ายข้อมูล", negative_count: 40, positive_count: 279 },
  { main: "ระบบและกระบวนการให้บริการ", sub: "ความพร้อมในการให้บริการ", negative_count: 30, positive_count: 278 },
  { main: "สภาพแวดล้อมและสิ่งอำนวยความสะดวก", sub: "ที่จอดรถ", negative_count: 119, positive_count: 264 },
  { main: "เทคโนโลยีและดิจิทัล", sub: "เครื่องออกบัตรคิว", negative_count: 142, positive_count: 245 },
  { main: "พนักงานและบุคลากร", sub: "ความประทับใจในการให้บริการ", negative_count: 151, positive_count: 241 },
  { main: "Market Conduct", sub: "ไม่เอาเปรียบ", negative_count: 47, positive_count: 229 },
  { main: "เงื่อนไขและผลิตภัณฑ์", sub: "ระยะเวลาอนุมัติ", negative_count: 152, positive_count: 78 },
  { main: "สภาพแวดล้อมและสิ่งอำนวยความสะดวก", sub: "พื้นที่และความคับคั่ง", negative_count: 39, positive_count: 155 },
  { main: "เทคโนโลยีและดิจิทัล", sub: "E-KYC Scanner", negative_count: 114, positive_count: 188 },
  { main: "Market Conduct", sub: "ไม่บังคับ", negative_count: 35, positive_count: 152 },
  { main: "Market Conduct", sub: "ไม่รบกวน", negative_count: 30, positive_count: 112 },
  { main: "เทคโนโลยีและดิจิทัล", sub: "เครื่องปรับสมุด", negative_count: 124, positive_count: 135 },
  { main: "พนักงานและบุคลากร", sub: "ความถูกต้องในการให้บริการ", negative_count: 28, positive_count: 127 },
  { main: "เงื่อนไขและผลิตภัณฑ์", sub: "รายละเอียด ผลิตภัณฑ์", negative_count: 146, positive_count: 120 },
  { main: "เทคโนโลยีและดิจิทัล", sub: "ระบบ Core ของธนาคาร", negative_count: 47, positive_count: 118 },
  { main: "เทคโนโลยีและดิจิทัล", sub: "ATM ADM CDM", negative_count: 66, positive_count: 48 },
  { main: "สภาพแวดล้อมและสิ่งอำนวยความสะดวก", sub: "จุดรอรับบริการ", negative_count: 125, positive_count: 62 },
  { main: "พนักงานและบุคลากร", sub: "ความสุภาพและมารยาทของพนักงาน", negative_count: 85, positive_count: 195 },
  { main: "พนักงานและบุคลากร", sub: "ความรวดเร็วในการให้บริการ", negative_count: 92, positive_count: 178 },
  { main: "สภาพแวดล้อมและสิ่งอำนวยความสะดวก", sub: "ความสะอาด", negative_count: 45, positive_count: 210 },
  { main: "ระบบและกระบวนการให้บริการ", sub: "ระบบเรียกคิวและจัดการคิว", negative_count: 98, positive_count: 134 },
  { main: "เทคโนโลยีและดิจิทัล", sub: "แอพพลิเคชั่น MyMo", negative_count: 73, positive_count: 89 }
];

const regionFeedbackData = [
  { region: "ภาค 1", previous: 45, positive: 67, negative: 23 },
  { region: "ภาค 2", previous: 52, positive: 58, negative: 28 },
  { region: "ภาค 3", previous: 38, positive: 72, negative: 18 },
  { region: "ภาค 4", previous: 41, positive: 49, negative: 31 },
  { region: "ภาค 5", previous: 47, positive: 63, negative: 26 },
  { region: "ภาค 6", previous: 55, positive: 61, negative: 34 },
  { region: "ภาค 7", previous: 43, positive: 78, negative: 19 },
  { region: "ภาค 8", previous: 39, positive: 52, negative: 29 },
  { region: "ภาค 9", previous: 48, positive: 69, negative: 22 },
  { region: "ภาค 10", previous: 35, positive: 44, negative: 35 },
  { region: "ภาค 11", previous: 51, positive: 73, negative: 20 },
  { region: "ภาค 12", previous: 44, positive: 57, negative: 25 },
  { region: "ภาค 13", previous: 40, positive: 48, negative: 32 },
  { region: "ภาค 14", previous: 46, positive: 65, negative: 27 },
  { region: "ภาค 15", previous: 37, positive: 41, negative: 38 },
  { region: "ภาค 16", previous: 49, positive: 59, negative: 24 },
  { region: "ภาค 17", previous: 42, positive: 71, negative: 21 },
  { region: "ภาค 18", previous: 36, positive: 46, negative: 33 }
];

export const FeedbackBlock = () => {
  const [selectedFilter, setSelectedFilter] = useState<'none' | 'positive' | 'negative'>('positive');
  
  // Main topics filter state - all selected by default
  const [selectedMainTopics, setSelectedMainTopics] = useState<string[]>(Object.keys(mainTopicsMapping));
  
  // Sorting states for butterfly chart - both start as ascending (arrow up) for Top 10
  const [leftSortDirection, setLeftSortDirection] = useState<'asc' | 'desc'>('desc'); // desc = arrow up = high→low
  const [rightSortDirection, setRightSortDirection] = useState<'asc' | 'desc'>('desc'); // desc = arrow up = high→low
  
  // Filtered topics data based on selected main topics
  const filteredTopicsData = useMemo(() => {
    if (selectedMainTopics.length === 0) {
      return topicsData; // If nothing selected, show all (equivalent to "select all")
    }
    return topicsData.filter(item => selectedMainTopics.includes(item.main));
  }, [selectedMainTopics]);
  
  // Determine if we should show all sub-topics (single main topic) or top 10 (multiple)
  const shouldShowAllSubTopics = selectedMainTopics.length === 1;
  
  // Base data for butterfly chart (before sorting)
  const baseChartData = useMemo(() => {
    if (shouldShowAllSubTopics) {
      // Case A: Single main topic selected - show all sub-topics
      return filteredTopicsData.map(item => ({
        topic: item.sub,
        negative: -item.negative_count, // Convert to negative for display
        positive: item.positive_count,
        leftTopic: item.sub,
        rightTopic: item.sub
      }));
    } else {
      // Case B: Multiple main topics - show top 10 by total count
      const sortedByTotal = filteredTopicsData
        .sort((a, b) => (b.positive_count + b.negative_count) - (a.positive_count + a.negative_count))
        .slice(0, 10);
      
      return sortedByTotal.map(item => ({
        topic: item.sub,
        negative: -item.negative_count, // Convert to negative for display
        positive: item.positive_count,
        leftTopic: item.sub,
        rightTopic: item.sub
      }));
    }
  }, [filteredTopicsData, shouldShowAllSubTopics]);
  
  // Memoized sorted data for left and right sides independently
  const sortedLeftTopics = useMemo(() => {
    const sorted = [...baseChartData].sort((a, b) => {
      const aValue = Math.abs(a.negative);
      const bValue = Math.abs(b.negative);
      return leftSortDirection === 'desc' ? bValue - aValue : aValue - bValue;
    });
    return sorted;
  }, [baseChartData, leftSortDirection]);

  const sortedRightTopics = useMemo(() => {
    const sorted = [...baseChartData].sort((a, b) => {
      return rightSortDirection === 'desc' ? b.positive - a.positive : a.positive - b.positive;
    });
    return sorted;
  }, [baseChartData, rightSortDirection]);

  // Combined data for butterfly chart display
  const butterflyData = useMemo(() => {
    const maxLength = Math.max(sortedLeftTopics.length, sortedRightTopics.length);
    const combined = [];
    
    for (let i = 0; i < maxLength; i++) {
      const leftItem = sortedLeftTopics[i];
      const rightItem = sortedRightTopics[i];
      
      combined.push({
        topic: leftItem?.topic || rightItem?.topic || '',
        negative: leftItem?.negative || 0,
        positive: rightItem?.positive || 0,
        leftTopic: leftItem?.topic || '',
        rightTopic: rightItem?.topic || ''
      });
    }
    
    return combined;
  }, [sortedLeftTopics, sortedRightTopics]);
  
  // Checkbox handlers
  const handleMainTopicToggle = (topic: string) => {
    setSelectedMainTopics(prev => {
      if (prev.includes(topic)) {
        return prev.filter(t => t !== topic);
      } else {
        return [...prev, topic];
      }
    });
  };
  
  const handleSelectAll = () => {
    if (selectedMainTopics.length === Object.keys(mainTopicsMapping).length) {
      setSelectedMainTopics([]); // Deselect all
    } else {
      setSelectedMainTopics(Object.keys(mainTopicsMapping)); // Select all
    }
  };
  
  const renderPieLabel = ({ value, payload }: any) => {
    const count = payload.count;
    return `${value}% (จาก ${count} ความคิดเห็น)`;
  };
  
  return (
    <Card className="rounded-2xl border shadow-card bg-white overflow-hidden">
      {/* Pink header strip */}
      <div 
        className="h-2 rounded-t-2xl"
        style={{ background: 'var(--gradient-pink-strip)' }}
      />
      
      <CardHeader className="pb-4 pt-5">
        <CardTitle className="font-kanit text-xl font-bold text-foreground">
          ข้อคิดเห็น/ข้อเสนอแนะ
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6 p-6 pt-0">
        {/* Top Row - Two sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sentiment Donut */}
          <div className="shasha">
            <div className="space-y-4">
              <h3 className="font-kanit text-lg font-semibold text-foreground text-center">ทัศนคติข้อคิดเห็น</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sentimentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      label={(props) => (
                        <text
                          x={props.x}
                          y={props.y}
                          fill={props.payload.color}
                          textAnchor={props.x > props.cx ? 'start' : 'end'}
                          dominantBaseline="central"
                          fontSize="12"
                          fontFamily="Kanit"
                          fontWeight="500"
                        >
                          {renderPieLabel(props)}
                        </text>
                      )}
                      labelLine={false}
                    >
                      {sentimentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: any, name: string, props: any) => [
                        `${value}% (${props.payload.count} ครั้ง)`,
                        'สัดส่วน'
                      ]}
                      labelFormatter={(label) => `ทัศนคติ: ${label}`}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        fontFamily: 'Kanit'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4">
                {sentimentData.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-kanit text-sm text-muted-foreground">
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Topics Mentioned - Butterfly Chart */}
          <div className="shasha">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-kanit text-lg font-semibold text-foreground">ประเด็นที่ถูกกล่าวถึง</h3>
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="w-8 h-8 rounded-full text-muted-foreground hover:text-foreground transition-colors duration-200"
                        aria-label="กรองหัวข้อหลัก"
                      >
                        <Filter className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                      className="w-80 p-4 bg-white border shadow-lg rounded-lg z-50"
                      align="end"
                      sideOffset={4}
                    >
                      <div className="space-y-4">
                        <h4 className="font-kanit text-sm font-semibold text-foreground border-b border-gray-200 pb-2">
                          หัวข้อหลัก
                        </h4>
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                          {Object.keys(mainTopicsMapping).map((topic) => (
                            <label
                              key={topic}
                              className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors duration-200"
                            >
                              <div className="relative">
                                <Checkbox
                                  checked={selectedMainTopics.includes(topic)}
                                  onCheckedChange={() => handleMainTopicToggle(topic)}
                                  className="w-4 h-4 rounded border-2 border-pink-400 data-[state=checked]:bg-pink-400 data-[state=checked]:border-pink-400 data-[state=checked]:text-white"
                                />
                              </div>
                              <span className="font-kanit text-sm text-gray-700 leading-relaxed">
                                {topic}
                              </span>
                            </label>
                          ))}
                        </div>
                        <div className="border-t border-gray-200 pt-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleSelectAll}
                            className="w-full font-kanit text-sm border-pink-200 text-pink-600 hover:bg-pink-50 hover:border-pink-300 transition-colors duration-200"
                          >
                            {selectedMainTopics.length === Object.keys(mainTopicsMapping).length ? 'ยกเลิกเลือกทั้งหมด' : 'เลือกทั้งหมด'}
                          </Button>
                        </div>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              <div 
                className="relative overflow-y-visible"
                style={{
                  height: shouldShowAllSubTopics 
                    ? `${Math.max(butterflyData.length * 40 + 80, 320)}px` // Auto height: N*40px + padding, min 320px
                    : window.innerWidth >= 1024 
                      ? '420px' // Desktop: 10*24px + 9*12px + 40px top + 40px bottom ≈ 420px
                      : '360px' // Mobile: 10*20px + 9*10px + 40px top + 40px bottom ≈ 360px
                }}
              >
                <div className="flex flex-col h-full">
                  {/* Chart area with circular sort buttons - NO SCROLL */}
                  <div className="h-full overflow-y-visible">
                    <div className="space-y-2 py-4 transition-all duration-300 ease-in-out relative h-full">
                      {/* Left Circular Sort Button */}
                      <button
                        onClick={() => setLeftSortDirection(prev => prev === 'desc' ? 'asc' : 'desc')}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 z-20 w-8 h-8 rounded-full border-2 border-red-500 bg-white text-red-500 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md"
                        style={{ minHeight: '32px', minWidth: '32px' }}
                        aria-label={`เรียงลำดับฝั่งซ้าย ${leftSortDirection === 'desc' ? 'น้อยไปมาก' : 'มากไปน้อย'}`}
                      >
                        {leftSortDirection === 'desc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                      
                      {/* Right Circular Sort Button */}
                      <button
                        onClick={() => setRightSortDirection(prev => prev === 'desc' ? 'asc' : 'desc')}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 z-20 w-8 h-8 rounded-full border-2 border-green-500 bg-white text-green-500 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md"
                        style={{ minHeight: '32px', minWidth: '32px' }}
                        aria-label={`เรียงลำดับฝั่งขวา ${rightSortDirection === 'desc' ? 'น้อยไปมาก' : 'มากไปน้อย'}`}
                      >
                        {rightSortDirection === 'desc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                      
                      {butterflyData.map((item, index) => (
                        <div 
                          key={`${item.leftTopic}-${item.rightTopic}-${index}`} 
                          className="flex items-center relative transition-all duration-300 ease-in-out"
                          style={{
                            height: shouldShowAllSubTopics 
                              ? '32px' // Single main topic: 32px per row
                              : window.innerWidth >= 1024 
                                ? '24px' // Desktop Top 10: 24px per row
                                : '20px' // Mobile Top 10: 20px per row
                          }}
                        >
                          {/* Negative bar (left side) */}
                          <div className="flex-1 flex justify-end pr-1">
                            {item.negative < 0 && (
                              <div 
                                className="bg-red-500 flex items-center justify-center text-white text-xs font-kanit font-medium transition-all duration-300 ease-in-out"
                                style={{ 
                                  height: shouldShowAllSubTopics 
                                    ? '24px' 
                                    : window.innerWidth >= 1024 
                                      ? '18px' 
                                      : '16px',
                                  width: `${(Math.abs(item.negative) / 200) * 100}%`,
                                  minWidth: Math.abs(item.negative) > 10 ? 'auto' : '24px'
                                }}
                              >
                                {Math.abs(item.negative)}
                              </div>
                            )}
                          </div>
                          
                          {/* Center area with topic name */}
                          <div className="w-40 flex items-center justify-center px-2 flex-shrink-0">
                            <div 
                              className="w-px bg-gray-300 absolute"
                              style={{
                                height: shouldShowAllSubTopics 
                                  ? '32px' 
                                  : window.innerWidth >= 1024 
                                    ? '24px' 
                                    : '20px'
                              }}
                            ></div>
                            <span className="text-xs font-kanit text-gray-700 font-medium bg-white px-1 relative z-10 text-center leading-tight">
                              {item.leftTopic && item.rightTopic ? (
                                item.leftTopic === item.rightTopic ? item.leftTopic : `${item.leftTopic.slice(0, 10)}...`
                              ) : (
                                item.leftTopic || item.rightTopic
                              )}
                            </span>
                          </div>
                          
                          {/* Positive bar (right side) */}
                          <div className="flex-1 flex justify-start pl-1">
                            {item.positive > 0 && (
                              <div 
                                className="bg-green-500 flex items-center justify-center text-white text-xs font-kanit font-medium transition-all duration-300 ease-in-out"
                                style={{ 
                                  height: shouldShowAllSubTopics 
                                    ? '24px' 
                                    : window.innerWidth >= 1024 
                                      ? '18px' 
                                      : '16px',
                                  width: `${(item.positive / 400) * 100}%`,
                                  minWidth: item.positive > 10 ? 'auto' : '24px'
                                }}
                              >
                                {item.positive}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Legend */}
              <div className="flex flex-col gap-3">
                <div className="flex justify-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="font-kanit text-sm text-muted-foreground">ความคิดเห็นเชิงลบ</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="font-kanit text-sm text-muted-foreground">ความคิดเห็นเชิงบวก</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Section - Regional Feedback Chart */}
        <div className="shasha">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-kanit text-lg font-semibold text-foreground">ทัศนคติความคิดเห็นรายพื้นที่</h3>
              <div className="flex items-center gap-2">
                <Button 
                  variant={selectedFilter === 'positive' ? "outline" : "ghost"}
                  size="sm"
                  onClick={() => {
                    if (selectedFilter !== 'positive') {
                      setSelectedFilter('positive');
                    }
                    // If already 'positive', do nothing (no-op)
                  }}
                  className={`font-kanit text-xs border-green-200 transition-all duration-200 ${
                    selectedFilter === 'positive' ? 'text-green-700 bg-green-50 hover:bg-green-100 border-green-300' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  [เชิงบวก]
                </Button>
                <Button 
                  variant={selectedFilter === 'negative' ? "outline" : "ghost"}
                  size="sm"
                  onClick={() => {
                    if (selectedFilter !== 'negative') {
                      setSelectedFilter('negative');
                    }
                    // If already 'negative', do nothing (no-op)
                  }}
                  className={`font-kanit text-xs border-red-200 transition-all duration-200 ${
                    selectedFilter === 'negative' ? 'text-red-700 bg-red-50 hover:bg-red-100 border-red-300' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  [เชิงลบ]
                </Button>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={regionFeedbackData} 
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  style={{ transition: 'all 0.3s ease-in-out' }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
                  <XAxis 
                    dataKey="region" 
                    tick={{ fontSize: 11, fontFamily: 'Kanit' }}
                    stroke="#6B7280"
                    height={60}
                    angle={-15}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fontFamily: 'Kanit' }}
                    stroke="#6B7280"
                  />
                  <Tooltip 
                    formatter={(value: any, name: string) => {
                      const nameMap: { [key: string]: string } = {
                        'previous': 'เดือนที่แล้ว',
                        'positive': 'เชิงบวก',
                        'negative': 'เชิงลบ'
                      };
                      return [`${value} ครั้ง`, nameMap[name] || name];
                    }}
                    labelFormatter={(label) => `${label}`}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      fontFamily: 'Kanit'
                    }}
                  />
                  <Bar 
                    dataKey="previous" 
                    fill="#9CA3AF" 
                    radius={[4, 4, 0, 0]}
                    name="previous"
                    style={{ transition: 'opacity 0.3s ease-in-out' }}
                  />
                  {selectedFilter === 'positive' && (
                    <Bar 
                      dataKey="positive" 
                      fill="#20A161" 
                      radius={[4, 4, 0, 0]}
                      name="positive"
                      style={{ transition: 'all 0.3s ease-in-out' }}
                    />
                  )}
                  {selectedFilter === 'negative' && (
                    <Bar 
                      dataKey="negative" 
                      fill="#D14343" 
                      radius={[4, 4, 0, 0]}
                      name="negative"
                      style={{ transition: 'all 0.3s ease-in-out' }}
                    />
                  )}
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-[#9CA3AF]"></div>
                <span className="font-kanit text-[14px] font-normal text-[#6B7280]">เดือนที่แล้ว</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded ${selectedFilter === 'positive' ? 'bg-[#20A161]' : 'bg-[#D14343]'}`}></div>
                <span className="font-kanit text-[14px] font-normal text-[#6B7280]">
                  {selectedFilter === 'positive' ? 'เชิงบวก' : 'เชิงลบ'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};