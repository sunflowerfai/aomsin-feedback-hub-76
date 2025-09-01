import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { MultiSelect } from "./MultiSelect";

const transactionTypes = [
  "เลือกทั้งหมด",
  "ฝาก-ถอนเงิน/สลาก",
  "ชำระสินเชื่อ/ชำระค่าสินค้าและบริการ", 
  "สมัครใช้บริการ เงินฝาก/สินเชื่อ/MyMo/บัตร",
  "สอบถาม/ขอคำปรึกษา",
  "อื่น ๆ"
];

export const TransactionTypeCard = () => {
  const [selectedTransactionTypes, setSelectedTransactionTypes] = useState<string[]>([]);

  const handleReset = () => {
    setSelectedTransactionTypes([]);
  };

  return (
    <Card className="bg-white rounded-2xl shadow-card border border-gray-200">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold font-kanit text-gray-800">
            ประเภทธุรกรรม
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
          label="ประเภทธุรกรรม"
          options={transactionTypes}
          selectedItems={selectedTransactionTypes}
          onSelectionChange={setSelectedTransactionTypes}
        />
        
        <p className="text-xs text-gray-500 font-kanit mt-4">
          เลือกแล้ว: {selectedTransactionTypes.length} ประเภท
        </p>
      </CardContent>
    </Card>
  );
};