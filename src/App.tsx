
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ServicesPage from "./pages/ServicesPage";
import ServiceDetail from "./pages/ServiceDetail";
import WorkerProfile from "./pages/WorkerProfile";
import ProfilePage from "./pages/ProfilePage";
import BecomeProvider from "./pages/BecomeProvider";
import AuthPage from "./pages/AuthPage";
import AdminPage from "./pages/AdminPage";
import ProviderDetailPage from "./pages/ProviderDetailPage";
import AccountSettingsPage from "./pages/AccountSettingsPage";
import AppSettingsPage from "./pages/AppSettingsPage";
import NotificationsPage from "./pages/NotificationsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="pb-16"> {/* Add padding to account for bottom navigation */}
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/:serviceId" element={<ServiceDetail />} />
            <Route path="/workers/:workerId" element={<WorkerProfile />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/become-provider" element={<BecomeProvider />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin/providers/:providerId" element={<ProviderDetailPage />} />
            <Route path="/account-settings" element={<AccountSettingsPage />} />
            <Route path="/app-settings" element={<AppSettingsPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
