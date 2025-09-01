import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  MapPin, 
  MessageSquare, 
  AlertTriangle, 
  Bot, 
  FileText,
  Briefcase 
} from "lucide-react";

interface MenuItemsProps {
  onMenuSelect: (item: string) => void;
  activeMenu: string;
}

const menuItems = [
  {
    icon: BarChart3,
    label: "สรุปภาพรวมประจำเดือน",
  },
  {
    icon: MapPin,
    label: "ผลการดำเนินงานรายพื้นที่",
  },
  {
    icon: MessageSquare,
    label: "ข้อคิดเห็นของลูกค้า",
  },
  {
    icon: AlertTriangle,
    label: "ข้อร้องเรียนรุนแรง",
  },
  {
    icon: Briefcase,
    label: "Market Conduct",
  },
  {
    icon: Bot,
    label: "AI Chat ช่วยวิเคราะห์",
  },
  {
    icon: FileText,
    label: "เอกสารอ้างอิง",
  },
];

export const MenuItems = ({ onMenuSelect, activeMenu }: MenuItemsProps) => {
  return (
    <div className="space-y-2">
      {menuItems.map((item, index) => {
        const Icon = item.icon;
        const isActive = activeMenu === item.label;
        
        return (
          <Button
            key={index}
            variant={isActive ? "default" : "ghost"}
            className={`w-full justify-start h-12 ${
              isActive 
                ? "bg-primary text-primary-foreground" 
                : "hover:bg-accent hover:text-accent-foreground"
            }`}
            onClick={() => onMenuSelect(item.label)}
          >
            <Icon className="h-4 w-4 mr-3" />
            {item.label}
          </Button>
        );
      })}
    </div>
  );
};