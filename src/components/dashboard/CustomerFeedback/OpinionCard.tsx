import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { MultiSelect } from "./MultiSelect";


const mainCategories = [
  "เลือกทั้งหมด", "Market Conduct", "กระบวนการให้บริการ", "ความประทับใจอื่นๆ", "เงื่อนไขผลิตภัณฑ์", 
  "พนักงานและบุคลากร", "ระบบธนาคารและเทคโนโลยี", "สภาพแวดล้อมและสิ่งอำนวยความสะดวก"
];

const subCategories = [
  "เลือกทั้งหมด", "การบังคับ", "การรบกวน", "การหลอกลวง", "การเอาเปรียบ", "ขั้นตอนการให้บริการ", "ความพร้อมในการให้บริการ",
  "ภาระเอกสาร", "อื่นๆ", "เกณฑ์การอนุมัติ", "ความเรียบง่ายข้อมูล", "ระยะเวลาอนุมัติ", "รายละเอียดผลิตภัณฑ์",
  "การจัดการและแก้ไขปัญหาเฉพาะหน้า", "ความถูกต้องในการให้บริการ", "ความประทับใจในการให้บริการ",
  "ความรวดเร็วในการให้บริการ", "ความสามารถในการตอบคำถามหรือให้คำแนะนำ", "ความสุภาพและมารยาทของพนักงาน",
  "ความเอาใจใส่ในการให้บริการลูกค้า", "รปภ. แม่บ้าน ฯลฯ", "ATM ADM CDM", "เครื่องนับเงิน", "เครื่องปรับสมุด",
  "เครื่องออกบัตรคิว", "ระบบ Core ของธนาคาร", "ระบบยืนยันตัวตน", "แอปพลิเคชั่น MyMo", "ความสะอาด",
  "ทำเลพื้นที่และความคับคั่ง", "ที่จอดรถ", "ที่นั่งรอ", "ป้าย-สื่อประชาสัมพันธ์", "สิ่งอำนวยความสะดวกอื่นๆ",
  "เสียง", "แสงสว่าง", "ห้องน้ำ", "อุณหภูมิ"
];

export const OpinionCard = () => {
  const [selectedMainCategories, setSelectedMainCategories] = useState<string[]>([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>([]);

  const handleReset = () => {
    setSelectedMainCategories([]);
    setSelectedSubCategories([]);
  };

  return (
    <Card className="bg-white rounded-2xl shadow-card border border-gray-200">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold font-kanit text-gray-800">
            ความคิดเห็น
          </CardTitle>
          <Button
            variant="ghost" 
            size="icon"
            onClick={handleReset}
            className="h-8 w-8 rounded-xl hover:bg-gray-100"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <MultiSelect
          label="หมวดหมู่"
          options={mainCategories}
          selectedItems={selectedMainCategories}
          onSelectionChange={setSelectedMainCategories}
        />
        
        <MultiSelect
          label="หมวดย่อย"
          options={subCategories}
          selectedItems={selectedSubCategories}
          onSelectionChange={setSelectedSubCategories}
        />
        
        <p className="text-xs text-gray-500 font-kanit mt-4">
          เลือกแล้ว: {selectedMainCategories.length} หมวดหมู่, {selectedSubCategories.length} หมวดย่อย
        </p>
      </CardContent>
    </Card>
  );
};