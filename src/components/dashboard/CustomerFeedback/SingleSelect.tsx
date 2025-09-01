import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SingleSelectProps {
  label: string;
  options: string[];
  selectedItem: string;
  onSelectionChange: (selected: string) => void;
}

export const SingleSelect = ({ label, options, selectedItem, onSelectionChange }: SingleSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelect = (option: string) => {
    onSelectionChange(option);
    setIsOpen(false);
  };

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
          {selectedItem || label || options[0]}
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isOpen ? 'animate-spin' : ''}`} />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-48 overflow-y-auto">
          {options.map((option) => (
            <div 
              key={option}
              onClick={() => handleSelect(option)}
              className={`p-3 hover:bg-gray-50 cursor-pointer font-kanit text-sm border-b border-gray-100 last:border-b-0 ${
                selectedItem === option ? 'bg-pink-50 text-pink-600' : ''
              }`}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};