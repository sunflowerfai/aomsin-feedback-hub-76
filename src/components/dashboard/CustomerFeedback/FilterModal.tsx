import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

export const FilterModal = ({ isOpen, onClose, title }: FilterModalProps) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-card border border-gray-200 w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold font-kanit text-gray-800">
            {title}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-xl hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-6">
          <p className="text-gray-500 font-kanit text-center">
            เนื้อหาสำหรับการแก้ไขจะแสดงที่นี่
          </p>
        </div>
      </div>
    </div>
  );
};