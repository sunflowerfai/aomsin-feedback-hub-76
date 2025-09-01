import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

// Seed data as specified
const donutData = [
  { name: "เชิงบวก", value: 247, percentage: 72.3, color: "#20A161" },
  { name: "เชิงลบ", value: 95, percentage: 27.7, color: "#D14343" }
];

const issuesData = [
  { label: "ความรวดเร็วในการให้บริการ", positive: 345, negative: 123 },
  { label: "ระยะเวลารอคอย", positive: 298, negative: 156 },
  { label: "การปรับปรุงระบบ", positive: 267, negative: 89 },
  { label: "ความสะอาดของระบบออนไลน์", positive: 234, negative: 67 },
  { label: "ทักษะและความรู้ของเจ้าหน้าที่", positive: 198, negative: 134 }
];

export const FeedbackChartsCard = () => {
  const maxPositive = Math.max(...issuesData.map(item => item.positive));
  const maxNegative = Math.max(...issuesData.map(item => item.negative));

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
        <div className="bg-gray-50 rounded-md p-3">
          <CardTitle className="text-sm font-semibold font-kanit text-gray-800">
            ข้อคิดเห็น/ข้อเสนอแนะ
          </CardTitle>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6">
          {/* Left: Donut Chart */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-center mb-4 font-semibold font-kanit text-sm text-gray-800">
              การแบ่งแยกความคิดเห็น
            </h3>
            
            <div className="h-[120px] mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={32}
                    outerRadius={50}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="#fff"
                    strokeWidth={3}
                  >
                    {donutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Legend */}
            <div className="flex justify-center gap-4 mb-3">
              {donutData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-kanit text-xs text-gray-600">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
            
            {/* Summary Statistics - Two sides */}
            <div className="flex justify-between text-xs font-kanit">
              <span style={{ color: '#20A161' }}>
                72.3% (จาก 247 ความคิดเห็น)
              </span>
              <span style={{ color: '#D14343' }}>
                27.7% (จาก 95 ความคิดเห็น)
              </span>
            </div>
          </div>

          {/* Right: Butterfly Chart */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-center mb-4 font-semibold font-kanit text-sm text-gray-800">
              ประเด็นที่ถูกกล่าวถึง
            </h3>
            
            <div className="space-y-3">
              {issuesData.map((item, index) => {
                const negativeWidth = (item.negative / maxNegative) * 100;
                const positiveWidth = (item.positive / maxPositive) * 100;
                
                return (
                  <div key={index} className="grid grid-cols-[1fr_auto_1fr] gap-6 items-center text-xs">
                    {/* Left Side - Negative (Red) */}
                    <div className="flex justify-end">
                      <div className="bg-gray-100 h-4 rounded-sm relative w-full">
                        {/* Inner spacer - Gray spacer on the right side */}
                        <div 
                          className="absolute right-0 top-0 w-3 h-4 bg-gray-200"
                        />
                        {/* Red bar anchored to right */}
                        <div 
                          className="absolute right-3 top-0 h-4 bg-red-500 rounded-r-sm flex items-center justify-center text-white font-kanit text-xs"
                          style={{ width: `${negativeWidth}%` }}
                        >
                          {item.negative}
                        </div>
                      </div>
                    </div>

                    {/* Center - Label */}
                    <div className="text-center font-kanit text-gray-700 whitespace-nowrap px-2">
                      {item.label}
                    </div>

                    {/* Right Side - Positive (Green) */}
                    <div className="flex justify-start">
                      <div className="bg-gray-100 h-4 rounded-sm relative w-full">
                        {/* Inner spacer - Gray spacer on the left side */}
                        <div 
                          className="absolute left-0 top-0 w-3 h-4 bg-gray-200"
                        />
                        {/* Green bar anchored to left */}
                        <div 
                          className="absolute left-3 top-0 h-4 bg-emerald-500 rounded-l-sm flex items-center justify-center text-white font-kanit text-xs"
                          style={{ width: `${positiveWidth}%` }}
                        >
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
      </CardContent>
    </Card>
  );
};