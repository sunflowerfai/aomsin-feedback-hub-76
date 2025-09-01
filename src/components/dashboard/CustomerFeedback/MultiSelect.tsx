import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface MultiSelectProps {
  label: string;
  options: string[];
  selectedItems: string[];
  onSelectionChange: (selected: string[]) => void;
}

export const MultiSelect = ({ label, options, selectedItems, onSelectionChange }: MultiSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter(option => 
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (option: string) => {
    if (option === "เลือกทั้งหมด") {
      // Select all options except "เลือกทั้งหมด"
      const allItems = options.slice(1);
      onSelectionChange(selectedItems.length === allItems.length ? [] : allItems);
    } else {
      // Toggle individual item
      if (selectedItems.includes(option)) {
        onSelectionChange(selectedItems.filter(item => item !== option));
      } else {
        onSelectionChange([...selectedItems, option]);
      }
    }
  };

  const isAllSelected = selectedItems.length === options.length - 1;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between border-gray-300 rounded-xl px-3 py-2 text-sm h-auto"
      >
        <span className="font-kanit truncate text-left">
          {selectedItems.length > 0 
            ? `เลือกแล้ว ${selectedItems.length} ${label}`
            : label
          }
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isOpen ? 'animate-spin' : ''}`} />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
          {/* Search Box */}
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="ค้นหา..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 border-pink-200 focus:border-pink-400 focus:ring-pink-400"
              />
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.map((option) => {
              const isSelected = option === "เลือกทั้งหมด" ? isAllSelected : selectedItems.includes(option);
              
              return (
                <div 
                  key={option}
                  onClick={() => handleSelect(option)}
                  className="flex items-center space-x-3 p-3 hover:bg-gray-50 cursor-pointer"
                >
                  <div className="relative">
                    <div className={`w-5 h-5 border-2 rounded-sm flex items-center justify-center transition-colors ${
                      isSelected 
                        ? 'border-pink-500 bg-pink-500' 
                        : 'border-pink-300'
                    }`}>
                      {isSelected && <Check className="h-3 w-3 text-white" />}
                    </div>
                  </div>
                  <span className="font-kanit text-sm flex-1">{option}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};