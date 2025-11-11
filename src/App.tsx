
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AppDetail from "./pages/AppDetail";
import SearchResults from "./pages/SearchResults";
import Games from "./pages/Games";
import Finance from "./pages/Finance";
import Utilities from "./pages/Utilities";
import NFT from "./pages/NFT";
import Projects from "./pages/Projects";
import TGE from "./pages/TGE";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/app/:id" element={<AppDetail />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/games" element={<Games />} />
          <Route path="/finance" element={<Finance />} />
          <Route path="/utilities" element={<Utilities />} />
          <Route path="/nft" element={<NFT />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/tge" element={<TGE />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
