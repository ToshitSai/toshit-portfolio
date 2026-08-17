import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Mail, Menu, X } from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: "work", label: "WORK", href: "#work" },
  { id: "about", label: "ABOUT", href: "#about" },
  { id: "playground", label: "PLAYGROUND", href: "#playground" },
];

const Navbar: React.FC = () => {
  const [activeSection, setActiveSection] = useState("work");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 1. SINGLE UNIFIED CONTINUOUS SCROLL PROGRESS VALUE (20px -> 180px)
  // Driven directly by window.scrollY — 100% reversible, 60fps GPU motion
  const { scrollY } = useScroll();

  // Linear progress [0, 1] clamped between 20px and 180px scroll
  const rawProgress = useTransform(scrollY, [20, 180], [0, 1]);

  // Eased progress curve (cubic-bezier(0.16, 1, 0.3, 1) response)
  const easedProgress = useTransform(rawProgress, (v) => {
    const clamped = Math.min(Math.max(v, 0), 1);
    return 1 - Math.pow(1 - clamped, 3);
  });

  // A) Outer Capsule Container Continuous Morph
  const navMaxWidth = useTransform(easedProgress, [0, 1], ["630px", "240px"]);
  const navScale = useTransform(easedProgress, [0, 1], [1, 0.95]);
  const navBg = useTransform(
    easedProgress,
    [0, 1],
    ["rgba(255, 255, 255, 0.35)", "rgba(242, 246, 252, 0.60)"]
  );
  const navBorder = useTransform(
    easedProgress,
    [0, 1],
    ["rgba(255, 255, 255, 0.70)", "rgba(255, 255, 255, 0.95)"]
  );
  const navShadow = useTransform(
    easedProgress,
    [0, 1],
    [
      "0px 8px 32px rgba(32, 37, 43, 0.06), inset 0px 1px 1px rgba(255, 255, 255, 0.8)",
      "0px 10px 36px rgba(32, 37, 43, 0.12), inset 0px 1px 1px rgba(255, 255, 255, 0.95)",
    ]
  );

  // B) Anchor T Logo (Remains stable & visually anchored)
  const logoScale = useTransform(easedProgress, [0, 1], [1, 0.92]);

  // C) Full Navigation Container (Links + CTA Button)
  // Overlapping exit: 0.0 -> 0.45 opacity fade, 0.0 -> 0.45 translation
  const fullNavOpacity = useTransform(easedProgress, [0, 0.45], [1, 0]);
  const fullNavX = useTransform(easedProgress, [0, 0.45], [0, -15]);
  const fullNavScale = useTransform(easedProgress, [0, 0.45], [1, 0.96]);
  const fullNavPointerEvents = useTransform(easedProgress, (p) => (p > 0.45 ? "none" : "auto"));

  // D) Compact Availability Content ("AVAILABLE FOR WORK ●")
  // Overlapping entrance: 0.35 -> 0.85 opacity fade, 0.35 -> 0.85 translation
  const compactOpacity = useTransform(easedProgress, [0.35, 0.85], [0, 1]);
  const compactX = useTransform(easedProgress, [0.35, 0.85], [15, 0]);
  const compactScale = useTransform(easedProgress, [0.35, 0.85], [0.96, 1]);
  const compactPointerEvents = useTransform(easedProgress, (p) => (p < 0.35 ? "none" : "auto"));

  // Active section tracking (purely for highlighting the current section link)
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;

      const sections = [
        { id: "work", el: document.getElementById("work") || document.getElementById("projects") },
        { id: "about", el: document.getElementById("about") },
        { id: "playground", el: document.getElementById("playground") || document.getElementById("skills") },
      ];

      const scrollPosition = currentScroll + 250;

      for (let i = sections.length - 1; i >= 0; i--) {
        const sec = sections[i];
        if (sec.el) {
          const top = sec.el.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(sec.id);
            break;
          }
        }
      }

      if (currentScroll < 180) {
        setActiveSection("work");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const targetId = href.replace("#", "");

    if (targetId === "hero" || href === "#") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    let targetEl = document.getElementById(targetId);
    if (!targetEl && targetId === "work") targetEl = document.getElementById("projects");
    if (!targetEl && targetId === "playground") targetEl = document.getElementById("skills");

    if (targetEl) {
      targetEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="fixed top-4 sm:top-6 left-0 right-0 z-50 flex justify-center items-center pointer-events-none px-4 sm:px-6">
      {/* SINGLE UNIFIED FLOATING GLASSMORPHISM MORPHING CAPSULE */}
      <motion.nav
        style={{
          maxWidth: navMaxWidth,
          scale: navScale,
          backgroundColor: navBg,
          borderColor: navBorder,
          boxShadow: navShadow,
        }}
        className="pointer-events-auto relative w-full flex items-center justify-between rounded-full px-3 py-2 sm:px-4 sm:py-2.5 backdrop-blur-md backdrop-saturate-150 border transition-all duration-75 gap-3 sm:gap-4"
      >
        {/* ANCHOR: YELLOW MONOGRAM "T" LOGO */}
        <motion.a
          style={{ scale: logoScale }}
          href="#hero"
          onClick={(e) => handleNavClick(e, "#hero")}
          aria-label="Toshit Sai - Return to top"
          className="group relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#FFD42A] text-[#20252B] shadow-xs hover:scale-105 hover:shadow-md transition-all flex-shrink-0 z-20"
        >
          <span className="font-sans text-base sm:text-lg font-bold tracking-tight text-[#20252B] group-hover:rotate-6 transition-transform">
            T
          </span>
        </motion.a>

        {/* DESKTOP CONTENT: STACKED GRID CELL (ZERO LAYOUT REFLOW) */}
        <div className="hidden md:grid grid-cols-1 grid-rows-1 items-center flex-1 justify-end pl-2">
          {/* LAYER 1: EXPANDED FULL NAVIGATION (LINKS + CTA) */}
          <motion.div
            style={{
              gridArea: "1 / 1 / 2 / 2",
              opacity: fullNavOpacity,
              x: fullNavX,
              scale: fullNavScale,
              pointerEvents: fullNavPointerEvents,
            }}
            className="flex items-center justify-end gap-3 sm:gap-5 whitespace-nowrap"
          >
            {/* NAV LINKS */}
            <div className="flex items-center gap-1 sm:gap-2">
              {NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className={`relative px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-medium tracking-[0.14em] transition-colors duration-200 ${
                      isActive ? "text-[#20252B] font-semibold" : "text-[#20252B]/75 hover:text-[#20252B]"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="activeNavPill"
                        className="absolute inset-0 rounded-full bg-white/85 backdrop-blur-sm shadow-[0_2px_10px_rgba(0,0,0,0.05)] border border-white/90 -z-10"
                        transition={{ type: "spring", stiffness: 450, damping: 35 }}
                      />
                    )}
                    <span className="relative z-10">{item.label}</span>
                  </a>
                );
              })}
            </div>

            {/* WORK WITH ME CTA BUTTON */}
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, "#contact")}
              className="group relative flex items-center gap-2 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-[#FFF8E8]/90 backdrop-blur-sm text-[#20252B] text-xs font-semibold tracking-[0.12em] uppercase border border-white/80 shadow-xs hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all flex-shrink-0"
            >
              <Mail className="w-3.5 h-3.5 text-[#20252B] stroke-[2.2] group-hover:rotate-6 transition-transform" />
              <span>WORK WITH ME</span>
            </a>
          </motion.div>

          {/* LAYER 2: COMPACT AVAILABILITY STATUS ("AVAILABLE FOR WORK ●") */}
          <motion.div
            style={{
              gridArea: "1 / 1 / 2 / 2",
              opacity: compactOpacity,
              x: compactX,
              scale: compactScale,
              pointerEvents: compactPointerEvents,
            }}
            className="flex items-center justify-center whitespace-nowrap pr-1"
          >
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, "#contact")}
              className="group flex items-center gap-2.5 px-3 py-1.5 text-xs font-medium tracking-[0.14em] uppercase text-[#20252B] hover:text-[#4A525D] transition-colors"
            >
              <span className="font-semibold">AVAILABLE FOR WORK</span>
              <span className="relative flex h-2.5 w-2.5 items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFD42A] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FFD42A] shadow-[0_0_6px_#FFD42A]" />
              </span>
            </a>
          </motion.div>
        </div>

        {/* MOBILE CONTROLS */}
        <div className="flex md:hidden items-center gap-2 pl-2">
          {/* Mobile CTA */}
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, "#contact")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFF8E8] text-[#20252B] text-[11px] font-semibold tracking-[0.12em] uppercase border border-white/80 shadow-xs hover:bg-white transition-colors"
          >
            <Mail className="w-3 h-3 text-[#20252B]" />
            <span>WORK WITH ME</span>
          </a>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1.5 text-[#20252B] hover:text-black rounded-full bg-white/40 border border-white/60 focus:outline-none"
            aria-label="Toggle Mobile Menu"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </motion.nav>

      {/* MOBILE DROPDOWN MENU */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto absolute top-20 left-4 right-4 max-w-md mx-auto bg-white/90 backdrop-blur-2xl border border-white p-3 rounded-3xl shadow-2xl flex flex-col gap-1.5"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`px-4 py-2.5 rounded-full text-xs font-semibold tracking-[0.14em] flex items-center justify-between transition-all ${
                    isActive
                      ? "bg-white text-[#20252B] shadow-sm border border-white"
                      : "text-[#20252B]/75 hover:text-[#20252B] hover:bg-white/50"
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-[#FFD42A] shadow-[0_0_8px_#FFD42A]" />
                  )}
                </a>
              );
            })}
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, "#contact")}
              className="mt-1 px-4 py-2.5 rounded-full bg-[#FFF8E8] text-[#20252B] text-xs font-semibold tracking-[0.14em] uppercase flex items-center justify-center gap-2 border border-white/80 shadow-xs hover:bg-white transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-[#20252B]" />
              <span>WORK WITH ME</span>
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
