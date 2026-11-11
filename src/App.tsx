import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Painel from "./pages/Painel";
import NotFound from "./pages/NotFound";
import Wishlist from "./pages/Wishlist";
import ManageGifts from "./pages/ManageGifts";
import GiftReports from "./pages/GiftReports";
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
          <Route path="/painel/presentes" element={<ManageGifts />} />
          <Route path="/painel/relatorios" element={<GiftReports />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
