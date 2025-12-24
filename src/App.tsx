import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import Identity from "./pages/Identity";
import Saathi from "./pages/Saathi";
import Khata from "./pages/Khata";
import Yojana from "./pages/Yojana";
import Seekho from "./pages/Seekho";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/identity" element={<Identity />} />
            <Route path="/saathi" element={<Saathi />} />
            <Route path="/khata" element={<Khata />} />
            <Route path="/yojana" element={<Yojana />} />
            <Route path="/yojana/:id" element={<Yojana />} />
            <Route path="/seekho" element={<Seekho />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
