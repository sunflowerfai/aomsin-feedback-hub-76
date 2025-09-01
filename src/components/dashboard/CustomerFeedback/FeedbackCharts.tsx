import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

// Updated data to match the HTML specification
const sentimentData = [
  { name: "เชิงบวก", value: 72.3, count: 892, color: "#20A161" },
  { name: "เชิงลบ", value: 27.7, count: 342, color: "#D14343" }
];

const topicsData = [
  { topic: "ความรวดเร็วในการให้บริการ", positive: 345, negative: 123 },
  { topic: "ระยะเวลารอคอย", positive: 298, negative: 156 },
  { topic: "ความเป็นมิตรของพนักงาน", positive: 267, negative: 91 },
  { topic: "ความสะดวกของระบบออนไลน์", positive: 234, negative: 67 },
  { topic: "ทักษะและความรู้ของพนักงาน", positive: 198, negative: 134 }
];

export const FeedbackCharts = () => {
  const renderPieLabel = ({ name, value }: any) => `${name}: ${value}%`;
  
  return (
    <Card className="bg-white shadow-card border border-gray-200 mb-6">
      <CardHeader className="pb-4">
        <div className="bg-gray-50 rounded-md p-3 text-sm font-semibold font-kanit">
          ข้อคิดเห็น/ข้อเสนอแนะ
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Sentiment Donut Chart */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-center mb-4 font-semibold font-kanit text-sm">
              ก่่นคนติข้อคิดเห็น
            </h3>
            <div className="flex justify-center mb-4">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={sentimentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    label={renderPieLabel}
                    labelLine={false}
                  >
                    {sentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any, name: string) => [
                      `${value}% (จาก ${sentimentData.find(d => d.name === name)?.count} ความคิดเห็น)`,
                      name
                    ]}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontFamily: 'Kanit'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Legend */}
            <div className="flex justify-center gap-6 text-xs font-kanit">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-[#20A161]"></div>
                <span>เชิงบวก</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-[#D14343]"></div>
                <span>เชิงลบ</span>
              </div>
            </div>
            
            {/* Statistics */}
            <div className="flex justify-between mt-2 text-xs font-kanit">
              <span className="text-[#20A161]">72.3% (จาก 892 ความคิดเห็น)</span>
              <span className="text-[#D14343]">27.7% (จาก 342 ความคิดเห็น)</span>
            </div>
          </div>

          {/* Right: Topics Bar Chart */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-center mb-4 font-semibold font-kanit text-sm">
              ประเด็นที่ถูกกล่าวถึง
            </h3>
            <div className="space-y-3">
              {topicsData.map((item, index) => {
                const maxValue = Math.max(...topicsData.map(d => d.positive + d.negative));
                const positiveWidth = (item.positive / maxValue) * 100;
                const negativeWidth = (item.negative / maxValue) * 100;
                
                return (
                  <div key={index} className="flex items-center gap-2 text-xs">
                    <div className="w-32 text-right font-kanit">
                      {item.topic}
                    </div>
                    <div className="flex-1 bg-gray-200 rounded h-4 relative">
                      <div 
                        className="absolute left-0 top-0 h-4 rounded bg-[#D14343]" 
                        style={{ width: `${negativeWidth}%` }}
                      />
                      <div 
                        className="absolute right-0 top-0 h-4 rounded bg-[#20A161]" 
                        style={{ width: `${positiveWidth}%` }}
                      />
                    </div>
                    <div className="w-8 text-xs text-white bg-[#D14343] rounded text-center py-0.5">
                      {item.negative}
                    </div>
                    <div className="w-8 text-xs text-white bg-[#20A161] rounded text-center py-0.5">
                      {item.positive}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};