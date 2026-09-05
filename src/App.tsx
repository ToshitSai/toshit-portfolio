import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "@/components/portfolio/Navbar";
import CustomScrollbar from "@/components/portfolio/CustomScrollbar";
import CustomCursor from "@/components/portfolio/CustomCursor";
import Index from "./pages/Index";
import ProjectsPage from "./pages/ProjectsPage";
import AboutPage from "./pages/AboutPage";
import PlaygroundPage from "./pages/PlaygroundPage";
import ContactPage from "./pages/ContactPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// ANIMATED ROUTE CONTAINER WITH PERSISTENT ANIMATEPRESENCE
const AnimatedAppRoutes: React.FC = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Index />} />
        <Route path="/work/:slug" element={<Index />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/work/:slug" element={<ProjectsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/playground" element={<PlaygroundPage />} />
        <Route path="/contact" element={<ContactPage />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FFF8E8] text-[#20252B] selection:bg-[#FFD42A] selection:text-[#20252B] font-sans relative overflow-x-hidden">
      {/* HIGH PERFORMANCE GLOBAL CUSTOM CURSOR */}
      <CustomCursor />

      {/* REFINED MINIMAL CUSTOM VERTICAL SCROLLBAR */}
      <CustomScrollbar />

      {/* PERSISTENT GLOBAL NAVBAR — NEVER UNMOUNTS, PREVENTS FLICKER */}
      <Navbar />
      
      {/* ANIMATED ROUTES */}
      <AnimatedAppRoutes />
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
