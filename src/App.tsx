import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "@/components/portfolio/Navbar";
import CustomScrollbar from "@/components/portfolio/CustomScrollbar";
import CustomCursor from "@/components/portfolio/CustomCursor";
import PageTransitionOverlay from "@/components/portfolio/PageTransitionOverlay";
import { IntroProvider } from "@/context/IntroContext";
import { PageTransitionProvider } from "@/context/PageTransitionContext";
import Index from "./pages/Index";
import ProjectsPage from "./pages/ProjectsPage";
import AboutPage from "./pages/AboutPage";
import PlaygroundPage from "./pages/PlaygroundPage";
import ContactPage from "./pages/ContactPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// ROUTE CONTAINER (COVER-REVEAL IS HANDLED BY PAGETRANSITIONOVERLAY)
const AppRoutes: React.FC = () => {
  const location = useLocation();

  return (
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
  );
};

const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FFF8E8] text-[#20252B] selection:bg-[#FFD42A] selection:text-[#20252B] font-sans relative overflow-x-hidden">
      {/* COVER-REVEAL PAGE TRANSITION OVERLAY */}
      <PageTransitionOverlay />

      {/* HIGH PERFORMANCE GLOBAL CUSTOM CURSOR */}
      <CustomCursor />

      {/* REFINED MINIMAL CUSTOM VERTICAL SCROLLBAR */}
      <CustomScrollbar />

      {/* PERSISTENT GLOBAL NAVBAR — NEVER UNMOUNTS, PREVENTS FLICKER */}
      <Navbar />

      {/* ROUTES */}
      <AppRoutes />
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <IntroProvider>
          <PageTransitionProvider>
            <AppLayout />
          </PageTransitionProvider>
        </IntroProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
