import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
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

const Navbar: React.FC = () => {
  const [activeSection, setActiveSection] = useState("work");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 1. SINGLE UNIFIED CONTINUOUS SCROLL PROGRESS VALUE (0px -> 50px timeline)
  // Driven directly by window.scrollY — 100% reversible, 60fps GPU motion
  const { scrollY } = useScroll();

  // Fast & snappy raw progress [0, 1] clamped between 0px and 50px scroll range
  const rawProgress = useTransform(scrollY, [0, 50], [0, 1]);

  // Reactive high-stiffness physics spring for instant, snappy scroll motion
  const smoothProgress = useSpring(rawProgress, {
    stiffness: 450,
    damping: 28,
    mass: 0.1,
    restDelta: 0.001,
  });

  // A) Compact Glassmorphism Parameters (475px->245px width, 46px height, 16px->10px top, 9999px radius)
  const navTop = useTransform(smoothProgress, [0, 1], ["16px", "10px"]);
  const navHeight = useTransform(smoothProgress, [0, 1], ["46px", "46px"]);
  const navRadius = useTransform(smoothProgress, [0, 1], ["9999px", "9999px"]);
  const navMaxWidth = useTransform(smoothProgress, [0, 1], ["475px", "245px"]);
  const navPadding = useTransform(smoothProgress, [0, 1], ["3px 4px", "3px 4px"]);
  const navScale = useTransform(smoothProgress, [0, 1], [1, 0.98]);

  // Translucent glass backgrounds (increased transparency when scrolled down)
  const navBg = useTransform(
    smoothProgress,
    [0, 1],
    ["rgba(255, 255, 255, 0.25)", "rgba(255, 255, 255, 0.32)"]
  );
  const navBorder = useTransform(
    smoothProgress,
    [0, 1],
    ["rgba(255, 255, 255, 0.40)", "rgba(255, 255, 255, 0.45)"]
  );
  const navShadow = useTransform(
    smoothProgress,
    [0, 1],
    [
      "0px 8px 24px rgba(0, 0, 0, 0.06)",
      "0px 10px 24px rgba(0, 0, 0, 0.10), inset 0px 0px 0px 0.5px rgba(255, 255, 255, 0.5)",
    ]
  );
  const navBlur = useTransform(smoothProgress, [0, 1], ["blur(14px)", "blur(16px)"]);

  // B) Anchor Avatar / T Logo (34px x 34px, stable & anchored)
  const logoScale = useTransform(smoothProgress, [0, 1], [1, 0.94]);

  // C) Full Navigation Container (Links + CTA Button)
  // Continuous smooth cross-fade exit: 0.0 -> 0.55
  const fullNavOpacity = useTransform(smoothProgress, [0, 0.55], [1, 0]);
  const fullNavX = useTransform(smoothProgress, [0, 0.55], [0, -14]);
  const fullNavScale = useTransform(smoothProgress, [0, 0.55], [1, 0.96]);
  const fullNavPointerEvents = useTransform(smoothProgress, (p) => (p > 0.50 ? "none" : "auto"));

  // D) Compact Availability Content ("Available for work 🟡")
  // Continuous smooth entrance: 0.25 -> 0.80
  const compactOpacity = useTransform(smoothProgress, [0.25, 0.80], [0, 1]);
  const compactX = useTransform(smoothProgress, [0.25, 0.80], [14, 0]);
  const compactScale = useTransform(smoothProgress, [0.25, 0.80], [0.96, 1]);
  const compactPointerEvents = useTransform(smoothProgress, (p) => (p < 0.30 ? "none" : "auto"));

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

      if (currentScroll < 100) {
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
    <motion.header
      style={{ paddingTop: navTop }}
      className="fixed top-0 left-0 right-0 z-[1000] flex justify-center items-center pointer-events-none px-4 sm:px-6 transition-all duration-300"
    >
      {/* TARGET REFERENCE COMPACT FLOATING PILL NAVBAR */}
      <motion.nav
        style={{
          width: "min(475px, calc(100vw - 32px))",
          maxWidth: navMaxWidth,
          height: navHeight,
          borderRadius: navRadius,
          padding: navPadding,
          scale: navScale,
          backgroundColor: navBg,
          borderColor: navBorder,
          boxShadow: navShadow,
          backdropFilter: navBlur,
          WebkitBackdropFilter: navBlur,
          transform: "translateZ(0)",
          willChange: "transform, width, height, padding, backdrop-filter",
          contain: "layout paint style",
        }}
        className="nav-container pointer-events-auto relative flex items-center justify-between border transition-all duration-300"
      >
        {/* ANCHOR: AVATAR / T MONOGRAM BADGE (34px x 34px) */}
        <motion.a
          style={{ scale: logoScale }}
          href="#hero"
          onClick={(e) => handleNavClick(e, "#hero")}
          aria-label="Toshit Sai - Return to top"
          className="group relative flex items-center justify-center w-[34px] h-[34px] rounded-full bg-[#FFD42A] text-[#20252B] shadow-xs hover:scale-105 hover:shadow-md transition-all flex-shrink-0 z-20 ml-0.5"
        >
          <span className="font-sans text-xs font-bold tracking-tight text-[#20252B] group-hover:rotate-6 transition-transform">
            T
          </span>
        </motion.a>

        {/* DESKTOP CONTENT: STACKED GRID CELL (ZERO LAYOUT REFLOW) */}
        <div className="hidden md:grid grid-cols-1 grid-rows-1 items-center flex-1 pl-1.5">
          {/* LAYER 1: EXPANDED FULL NAVIGATION (LINKS + CTA) */}
          <motion.div
            style={{
              gridArea: "1 / 1 / 2 / 2",
              opacity: fullNavOpacity,
              x: fullNavX,
              scale: fullNavScale,
              pointerEvents: fullNavPointerEvents,
            }}
            className="flex items-center justify-between w-full whitespace-nowrap pl-1.5 pr-0.5"
          >
            {/* NAV LINKS WITH UNIFORM GAP 14px (WORK 64px x 32px ACTIVE PILL, ABOUT/PLAYGROUND TEXT ONLY) */}
            <div className="flex items-center gap-[14px]">
              {NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className={`relative text-[13.5px] font-medium leading-none transition-colors duration-200 ${
                      isActive
                        ? "w-[64px] h-[32px] rounded-full bg-white/95 text-[#20252B] font-semibold flex items-center justify-center shadow-xs"
                        : "text-white hover:text-white/80 py-1 px-1"
                    }`}
                  >
                    <span>{item.label}</span>
                  </a>
                );
              })}
            </div>

            {/* WORK WITH ME CTA BUTTON (148px wide x 32px high, ELEGANT WHITE PILL INSIDE NAVBAR) */}
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, "#contact")}
              className="group relative flex items-center justify-center gap-1.5 w-[148px] h-[32px] rounded-full bg-white text-[#20252B] text-[13.5px] font-semibold tracking-tight shadow-sm hover:bg-white/95 hover:scale-[1.02] active:scale-[0.98] transition-all flex-shrink-0 ml-auto"
            >
              {/* BLACK MAIL ENVELOPE SYMBOL (17px x 12px) */}
              <svg
                className="w-[17px] h-[12px] flex-shrink-0 group-hover:rotate-6 transition-transform"
                viewBox="0 0 18 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="18" height="12" rx="2.5" fill="#20252B" />
                <path
                  d="M3 3.5L9 8L15 3.5"
                  stroke="white"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-[#20252B] font-semibold">Work with me</span>
            </a>
          </motion.div>

          {/* LAYER 2: COMPACT AVAILABILITY STATUS ("Available for work 🟡") */}
          <motion.div
            style={{
              gridArea: "1 / 1 / 2 / 2",
              opacity: compactOpacity,
              x: compactX,
              scale: compactScale,
              pointerEvents: compactPointerEvents,
            }}
            className="flex items-center justify-center whitespace-nowrap pr-2"
          >
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, "#contact")}
              className="group flex items-center gap-3 px-2 py-1.5 text-base font-medium text-[#20252B] hover:text-[#4A525D] transition-colors"
            >
              <span className="font-semibold">Available for work</span>
              <span className="relative flex h-3 w-3 items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFD42A] opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FFD42A] shadow-[0_0_8px_#FFD42A]" />
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
              <span>Work with me</span>
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
