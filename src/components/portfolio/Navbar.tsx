import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Menu, X } from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: "work", label: "Work", href: "#work" },
  { id: "about", label: "About", href: "#about" },
  { id: "playground", label: "Playground", href: "#playground" },
];

// Unified 250ms cubic-bezier transition as requested (0.25s duration, fast, direct & smooth)
const NAV_TRANSITION = {
  duration: 0.25,
  ease: [0.22, 1, 0.36, 1] as const,
};

const Navbar: React.FC = () => {
  const [activeSection, setActiveSection] = useState("work");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // OPTIMIZED PASSIVE rAF HYSTERESIS SCROLL LISTENER
  // - Eliminates continuous React re-renders on scroll
  // - Throttled using window.requestAnimationFrame
  // - Hysteresis thresholds: FULL -> COMPACT (>= 40px), COMPACT -> FULL (<= 15px)
  useEffect(() => {
    let ticking = false;
    let currentState = isScrolled;

    const updateScrollState = () => {
      const currentY = window.scrollY;

      // Hysteresis threshold checking to prevent flickering
      let nextState = currentState;
      if (!currentState && currentY >= 40) {
        nextState = true;
      } else if (currentState && currentY <= 15) {
        nextState = false;
      }

      // ONLY call setIsScrolled if state actually changed
      if (nextState !== currentState) {
        currentState = nextState;
        setIsScrolled(nextState);
      }

      // Active section tracking (throttled inside rAF)
      const sections = [
        { id: "work", el: document.getElementById("work") || document.getElementById("projects") },
        { id: "about", el: document.getElementById("about") },
        { id: "playground", el: document.getElementById("playground") || document.getElementById("skills") },
      ];

      const scrollPosition = currentY + 250;
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

      if (currentY < 100) {
        setActiveSection("work");
      }

      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollState);
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    updateScrollState();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
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
    <motion.header
      animate={{
        paddingTop: isScrolled ? "12px" : "16px",
      }}
      transition={NAV_TRANSITION}
      className="fixed top-0 left-0 right-0 z-[1000] flex justify-center items-center pointer-events-none px-4 sm:px-6"
    >
      {/* COMPACT FLOATING PILL NAVBAR - EXACT REFERENCE PROPORTIONS */}
      <motion.nav
        animate={{
          width: isScrolled ? "300px" : "min(545px, calc(100vw - 24px))",
          maxWidth: isScrolled ? "300px" : "545px",
          height: "58px",
          backgroundColor: isScrolled ? "rgba(255, 255, 255, 0.35)" : "rgba(255, 255, 255, 0.28)",
          borderColor: isScrolled ? "rgba(255, 255, 255, 0.50)" : "rgba(255, 255, 255, 0.45)",
          boxShadow: isScrolled
            ? "0px 10px 24px rgba(0, 0, 0, 0.10), inset 0px 0px 0px 0.5px rgba(255, 255, 255, 0.5)"
            : "0px 8px 24px rgba(0, 0, 0, 0.06)",
        }}
        transition={NAV_TRANSITION}
        style={{
          borderRadius: "9999px",
          backdropFilter: isScrolled ? "blur(16px)" : "blur(14px)",
          WebkitBackdropFilter: isScrolled ? "blur(16px)" : "blur(14px)",
          transform: "translateZ(0)",
          willChange: "transform, opacity, width",
          boxSizing: "border-box",
        }}
        className="nav-container pointer-events-auto relative flex items-center border px-2 py-1.5 transition-colors overflow-hidden"
      >
        {/* AVATAR / T MONOGRAM BADGE (44px x 44px) - STABLE ANCHOR */}
        <motion.a
          animate={{ scale: isScrolled ? 0.94 : 1 }}
          transition={NAV_TRANSITION}
          href="#hero"
          onClick={(e) => handleNavClick(e, "#hero")}
          aria-label="Toshit Sai - Return to top"
          className="group relative flex items-center justify-center w-[44px] h-[44px] rounded-full bg-[#FFD42A] text-[#20252B] shadow-xs hover:scale-105 hover:shadow-md transition-transform flex-shrink-0 z-20 ml-0.5"
        >
          <span className="font-sans text-base font-bold tracking-tight text-[#20252B] group-hover:rotate-6 transition-transform">
            T
          </span>
        </motion.a>

        {/* DESKTOP CONTENT CONTAINER */}
        <div className="hidden md:flex items-center flex-1 ml-2.5 relative h-full overflow-hidden">
          {/* LAYER 1: EXPANDED FULL NAVIGATION */}
          <motion.div
            initial={false}
            animate={{
              opacity: isScrolled ? 0 : 1,
              x: isScrolled ? -20 : 0,
              scale: isScrolled ? 0.95 : 1,
              pointerEvents: isScrolled ? "none" : "auto",
            }}
            transition={NAV_TRANSITION}
            className="flex items-center whitespace-nowrap w-full"
          >
            {/* NAV LINKS GROUP (WORK 80px x 40px ACTIVE PILL, ABOUT/PLAYGROUND TEXT ONLY, 24px GAPS) */}
            <div className="flex items-center gap-[24px] flex-shrink-0 whitespace-nowrap">
              {NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className={`relative text-[15px] font-medium leading-none transition-colors duration-200 ${
                      isActive
                        ? "w-[80px] h-[40px] rounded-full bg-white/95 text-[#20252B] font-semibold flex items-center justify-center shadow-xs"
                        : "text-[#20252B] hover:text-[#20252B]/80 py-1 px-1"
                    }`}
                  >
                    <span>{item.label}</span>
                  </a>
                );
              })}
            </div>

            {/* WORK WITH ME CTA BUTTON (170px wide x 40px high, SITS NATURALLY WITH 24px GAP, ZERO OVERFLOW) */}
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, "#contact")}
              className="group flex-shrink-0 relative flex items-center justify-center gap-2 w-[170px] h-[40px] px-3.5 rounded-full bg-white text-[#20252B] text-[14px] font-semibold tracking-tight shadow-sm hover:bg-white/95 hover:scale-[1.02] active:scale-[0.98] transition-all ml-[24px] whitespace-nowrap"
            >
              {/* BLACK MAIL ENVELOPE SYMBOL (18px x 13px) */}
              <svg
                className="w-[18px] h-[13px] flex-shrink-0 group-hover:rotate-6 transition-transform"
                viewBox="0 0 20 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="20" height="14" rx="3" fill="#20252B" />
                <path
                  d="M3.5 4L10 9.5L16.5 4"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-[#20252B] font-semibold whitespace-nowrap">Work with me</span>
            </a>
          </motion.div>

          {/* LAYER 2: COMPACT AVAILABILITY STATUS ("Available for work 🟡") */}
          <motion.div
            initial={false}
            animate={{
              opacity: isScrolled ? 1 : 0,
              x: isScrolled ? 0 : 20,
              scale: isScrolled ? 1 : 0.95,
              pointerEvents: isScrolled ? "auto" : "none",
            }}
            transition={NAV_TRANSITION}
            className="absolute inset-0 flex items-center justify-center whitespace-nowrap pr-2"
          >
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, "#contact")}
              className="group flex items-center gap-2.5 px-1 py-1 text-[#20252B] hover:text-[#4A525D] transition-colors"
            >
              <span className="font-semibold text-[15px] whitespace-nowrap">Available for work</span>
              <span className="relative flex h-3 w-3 items-center justify-center flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFD42A] opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FFD42A] shadow-[0_0_8px_#FFD42A]" />
              </span>
            </a>
          </motion.div>
        </div>

        {/* MOBILE CONTROLS */}
        <div className="flex md:hidden items-center gap-2 ml-auto pr-1">
          {/* Mobile CTA */}
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, "#contact")}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white text-[#20252B] text-xs font-semibold uppercase border border-white/80 shadow-xs hover:bg-white transition-colors"
          >
            <svg
              className="w-3.5 h-2.5 flex-shrink-0"
              viewBox="0 0 20 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="20" height="15" rx="3" fill="#20252B" />
              <path
                d="M3.5 4.5L10 9.5L16.5 4.5"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Work with me</span>
          </a>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-[#20252B] hover:text-black rounded-full bg-white/40 border border-white/60 focus:outline-none"
            aria-label="Toggle Mobile Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
            transition={NAV_TRANSITION}
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
              <span>Work with me</span>
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
