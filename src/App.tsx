import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import AomsinLogin from "./pages/AomsinLogin";
import Dashboard from "./pages/Dashboard";
import MarketConduct from "./pages/MarketConduct";
import NotFound from "./pages/NotFound";
import Aichatbot from "./pages/Aichatbot";
import RegionalDashboard from "./pages/RegionalDashboard";
import StrongComplaints from "./pages/StrongComplaints";
import CustomerFeedback from "./pages/CustomerFeedback";
import ForbiddenPage from "./pages/ForbiddenPage";
import ReferenceTables from "./pages/ReferenceTables";
import { AuthProvider } from "@/auth/AuthContext";
import RequireAdmin from "@/auth/RequireAdmin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      {/* ⬇️ ครอบด้วย AuthProvider เพื่อให้ RequireAdmin ใช้งานค่า role ได้ */}
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* public routes */}
            <Route path="/" element={<AomsinLogin />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/market-conduct" element={<MarketConduct />} />
            <Route path="/regional" element={<RegionalDashboard />} />
            <Route path="/strong-complaints" element={<StrongComplaints />} />
            <Route path="/customer-feedback" element={<CustomerFeedback />} />
            <Route path="/reference-tables" element={<ReferenceTables />} />
            <Route path="/ai-chatbot" element={<Aichatbot />} />
            <Route path="/403" element={<ForbiddenPage />} />
            {/* fallback (must be last) */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;