import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Painel from "./pages/Painel";
import NotFound from "./pages/NotFound";
import Wishlist from "./pages/Wishlist";
import GiftThankYou from "./pages/GiftThankYou";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/painel" element={<Painel />} />
          <Route path="/presentes" element={<Wishlist />} />
          <Route path="/presentes/obrigado" element={<GiftThankYou />} />
          <Route path="/painel/presentes" element={<Navigate to="/painel?aba=presentes" replace />} />
          <Route path="/painel/relatorios" element={<Navigate to="/painel?aba=relatorios" replace />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
