import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple authentication check
    if ((username === "HR User" && password === "password123") || 
        (username === "Admin" && password === "password123")) {
      toast({
        title: "เข้าสู่ระบบสำเร็จ",
        description: `ยินดีต้อนรับ ${username}`,
      });
      navigate("/dashboard");
    } else {
      toast({
        title: "เข้าสู่ระบบไม่สำเร็จ",
        description: "กรุณาตรวจสอบชื่อผู้ใช้และรหัสผ่าน",
        variant: "destructive",
      });
    }
  };

  const handleDemoLogin = (user: string, pass: string) => {
    setUsername(user);
    setPassword(pass);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray/30 via-tertiary/20 to-secondary/30 p-4">
      <Card className="w-full max-w-md shadow-soft backdrop-blur-sm bg-white/80">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold text-primary">
            ระบบจัดการความคิดเห็นลูกค้า
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Customer Feedback Management System
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">ชื่อผู้ใช้</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="กรุณากรอกชื่อผู้ใช้"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">รหัสผ่าน</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="กรุณากรอกรหัสผ่าน"
                required
              />
            </div>
            
            <Button type="submit" className="w-full bg-secondary hover:bg-primary transition-colors">
              เข้าสู่ระบบ
            </Button>
          </form>
          
          <div className="space-y-3">
            <div className="text-sm text-center text-muted-foreground">
              ตัวอย่างบัญชีผู้ใช้:
            </div>
            
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-xs"
                onClick={() => handleDemoLogin("HR User", "password123")}
              >
                <span className="font-medium">HR User</span>
                <span className="mx-2">—</span>
                <span>สมศรี ใจดี (password123)</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-xs"
                onClick={() => handleDemoLogin("Admin", "password123")}
              >
                <span className="font-medium">Admin</span>
                <span className="mx-2">—</span>
                <span>สมชาย บริหาร (password123)</span>
              </Button>
            </div>
          </div>
          
          <div className="text-xs text-center text-muted-foreground border-t pt-4">
            ติดต่อสอบถาม: สำนักบริการสาธารณสุข<br />
            โทร 02-XXX-XXXX ต่อ XXXX
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;