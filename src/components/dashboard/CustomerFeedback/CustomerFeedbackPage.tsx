import { useState } from "react";
import { Menu, RefreshCcw, Settings, User, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FilterModal } from "./FilterModal";
import { ServiceAreaCard } from "./ServiceAreaCard";
import { TimePeriodCard } from "./TimePeriodCard";
import { OpinionCard } from "./OpinionCard";
import { TransactionTypeCard } from "./TransactionTypeCard";
import { FeedbackChartsCard } from "./FeedbackChartsCard";
import { CustomerOpinionsCard } from "./CustomerOpinionsCard";
export const CustomerFeedbackPage = () => {
  const [serviceAreaModalOpen, setServiceAreaModalOpen] = useState(false);
  const [opinionModalOpen, setOpinionModalOpen] = useState(false);
  const handleRefresh = () => {
    window.location.reload();
  };
  const handleSettings = () => {
    // Placeholder for settings functionality
  };
  const handleLogout = () => {
    // Placeholder for logout functionality  
  };
  return <div className="min-h-screen" style={{
    backgroundColor: '#FAFAFB'
  }}>
      {/* Sticky Header */}
      

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-8 py-8">
        {/* Page Title Section */}
        <div className="mb-8">
          
          
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[32%_68%] gap-6">
          {/* Left Column - 30% */}
          <div className="space-y-6">
            <ServiceAreaCard />
            <TimePeriodCard />
            <OpinionCard />
            <TransactionTypeCard />
          </div>

          {/* Right Column - 70% */}
          <div className="space-y-6">
            <FeedbackChartsCard />
            <CustomerOpinionsCard />
          </div>
        </div>
      </div>

      {/* Modals */}
      <FilterModal isOpen={serviceAreaModalOpen} onClose={() => setServiceAreaModalOpen(false)} title="แก้ไขพื้นที่ดูแล" />
      <FilterModal isOpen={opinionModalOpen} onClose={() => setOpinionModalOpen(false)} title="แก้ไขความคิดเห็น" />
    </div>;
};