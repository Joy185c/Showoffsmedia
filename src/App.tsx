import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import SiteContentPage from "./pages/admin/SiteContentPage";
import StatsPage from "./pages/admin/StatsPage";
import TestimonialsPage from "./pages/admin/TestimonialsPage";
import WorkPage from "./pages/admin/WorkPage";
import CaseStudiesPage from "./pages/admin/CaseStudiesPage";
import ComparisonPage from "./pages/admin/ComparisonPage";
import ProcessPage from "./pages/admin/ProcessPage";
import ServicesPage from "./pages/admin/ServicesPage";
import ClientsPage from "./pages/admin/ClientsPage";
import FAQsPage from "./pages/admin/FAQsPage";
import RolesPage from "./pages/admin/RolesPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="site-content" element={<SiteContentPage />} />
              <Route path="stats" element={<StatsPage />} />
              <Route path="testimonials" element={<TestimonialsPage />} />
              <Route path="work" element={<WorkPage />} />
              <Route path="case-studies" element={<CaseStudiesPage />} />
              <Route path="comparison" element={<ComparisonPage />} />
              <Route path="process" element={<ProcessPage />} />
              <Route path="services" element={<ServicesPage />} />
              <Route path="clients" element={<ClientsPage />} />
              <Route path="faqs" element={<FAQsPage />} />
              <Route path="roles" element={<RolesPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
