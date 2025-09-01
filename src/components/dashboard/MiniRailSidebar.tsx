import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Menu,
  BarChart3, 
  MapPin, 
  MessageSquareText, 
  AlertTriangle, 
  Bot, 
  FileText,
  Briefcase 
} from "lucide-react";

interface MiniRailSidebarProps {
  activeMenu: string;
  onMenuSelect: (item: string) => void;
  onToggleMainSidebar?: () => void;
  className?: string;
}

const menuItems = [
  {
    icon: BarChart3,
    label: "สรุปภาพรวมประจำเดือน",
    tooltip: "สรุปภาพรวมประจำเดือน",
  },
  {
    icon: MapPin,
    label: "ผลการดำเนินงานรายพื้นที่",
    tooltip: "ผลการดำเนินงานรายพื้นที่",
  },
  {
    icon: MessageSquareText,
    label: "ข้อคิดเห็นของลูกค้า",
    tooltip: "ข้อคิดเห็นของลูกค้า",
  },
  {
    icon: AlertTriangle,
    label: "ข้อร้องเรียนของลูกค้า",
    tooltip: "ข้อร้องเรียนของลูกค้า",
  },
  {
    icon: Briefcase,
    label: "Market Conduct",
    tooltip: "Market Conduct",
  },
  {
    icon: Bot,
    label: "AI Chat ช่วยวิเคราะห์",
    tooltip: "AI Chat ช่วยวิเคราะห์",
  },
  {
    icon: FileText,
    label: "เอกสารอ้างอิง",
    tooltip: "เอกสารอ้างอิง",
  },
];

export const MiniRailSidebar = ({ 
  activeMenu, 
  onMenuSelect, 
  onToggleMainSidebar,
  className = ""
}: MiniRailSidebarProps) => {
  const handleMenuToggle = () => {
    onToggleMainSidebar?.();
  };

  return (
    <TooltipProvider>
      <div 
        className={`mini-rail hidden md:flex flex-col items-center ${className}`}
      >
        
        {/* Hamburger Menu Button */}
        <div className="pt-3 pb-3">
          <Button
            onClick={handleMenuToggle}
            className="w-10 h-10 rounded-[14px] border border-[#E5E7EB] bg-[#F9FAFB] transition-all duration-200 ease-out"
            style={{
              color: '#6B7280'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#FFF1F7';
              e.currentTarget.style.color = '#CE5997';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#F9FAFB';
              e.currentTarget.style.color = '#6B7280';
            }}
            onFocus={(e) => {
              e.currentTarget.style.outline = '2px solid #DF7AB0';
              e.currentTarget.style.outlineOffset = '2px';
            }}
            onBlur={(e) => {
              e.currentTarget.style.outline = 'none';
            }}
            aria-label="เปิดเมนู"
          >
            <Menu 
              className="h-5 w-5" 
              strokeWidth={2}
            />
          </Button>
        </div>

        {/* Menu Icons */}
        <div className="flex flex-col space-y-3 pb-3">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.label;
            
            return (
              <Tooltip key={index} delayDuration={300}>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => onMenuSelect(item.label)}
                    className={`w-11 h-11 rounded-[14px] border transition-all duration-200 ease-out ${
                      isActive 
                        ? 'border-[#F5A3C5]' 
                        : 'bg-transparent border-transparent hover:border-[#F7B4D1]'
                    }`}
                    style={{
                      background: isActive 
                        ? 'linear-gradient(180deg, #FFD6EB 0%, #FFEAF4 100%)'
                        : 'transparent',
                      boxShadow: isActive 
                        ? '0 4px 12px rgba(216, 33, 140, 0.22)'
                        : 'none',
                      color: isActive ? '#D8218C' : '#6B7280'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = '#FFF1F7';
                        e.currentTarget.style.color = '#CE5997';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#6B7280';
                      }
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.outline = '2px solid #DF7AB0';
                      e.currentTarget.style.outlineOffset = '2px';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.outline = 'none';
                    }}
                    aria-label={item.tooltip}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <Icon 
                      className="h-5 w-5" 
                      strokeWidth={2}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent 
                  side="right" 
                  className="bg-black/80 border-0 text-white shadow-lg rounded-md"
                  sideOffset={8}
                >
                  <p className="font-kanit text-sm">{item.tooltip}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </div>
    </TooltipProvider>
  );
};