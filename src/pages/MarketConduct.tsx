import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MarketConduct = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-[#FF4FAE] font-kanit">
            Market Conduct
          </h1>
          <p className="text-gray-600 font-kanit">
            หน้าติดตามและวิเคราะห์ด้าน Market Conduct
          </p>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Placeholder Card 1 */}
          <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-[#FF4FAE] font-kanit">
                การติดตาม Market Conduct
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500 font-kanit">เตรียมไว้สำหรับตาราง/กราฟ</p>
              </div>
            </CardContent>
          </Card>

          {/* Placeholder Card 2 */}
          <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-[#FF4FAE] font-kanit">
                การวิเคราะห์ข้อมูล
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500 font-kanit">เตรียมไว้สำหรับการ์ด/ข้อมูล</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Full Width Card */}
        <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-[#FF4FAE] font-kanit">
              รายงานสรุป Market Conduct
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-500 font-kanit">เตรียมไว้สำหรับกราฟ/ตารางใหญ่</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MarketConduct;