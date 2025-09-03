import React from "react";

export default function ForbiddenPage() {
  return (
    <div className="min-h-[60vh] grid place-items-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2 font-kanit">403 – ไม่มีสิทธิ์เข้าถึง</h1>
        <p className="text-muted-foreground font-kanit">หน้านี้อนุญาตเฉพาะผู้ดูแลระบบ (admin)</p>
      </div>
    </div>
  );
}
