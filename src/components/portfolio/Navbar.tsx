import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
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

  // 1. SINGLE UNIFIED CONTINUOUS SCROLL PROGRESS VALUE (0px -> 120px timeline)
  // Driven directly by window.scrollY — 100% reversible, 60fps GPU motion
  const { scrollY } = useScroll();

  // Linear progress [0, 1] clamped between 0px and 120px scroll range
  const rawProgress = useTransform(scrollY, [0, 120], [0, 1]);

  // Eased progress curve (cubic-bezier(0.075, 0.82, 0.165, 1) fluid response)
  const easedProgress = useTransform(rawProgress, (v) => {
    const clamped = Math.min(Math.max(v, 0), 1);
    return 1 - Math.pow(1 - clamped, 3);
  });

  // A) Compact Glassmorphism Parameters (72px->48px height, 0px->12px top, 960px->300px width, 0px->9999px radius)
  const navTop = useTransform(easedProgress, [0, 1], ["0px", "12px"]);
  const navHeight = useTransform(easedProgress, [0, 1], ["72px", "48px"]);
  const navRadius = useTransform(easedProgress, [0, 1], ["0px", "9999px"]);
  const navMaxWidth = useTransform(easedProgress, [0, 1], ["960px", "300px"]);
  const navPadding = useTransform(easedProgress, [0, 1], ["0 32px", "0 16px"]);
  const navScale = useTransform(easedProgress, [0, 1], [1, 0.97]);

  const navBg = useTransform(
    easedProgress,
    [0, 1],
    ["rgba(255, 255, 255, 0.35)", "rgba(242, 246, 252, 0.78)"]
  );
  const navBorder = useTransform(
    easedProgress,
    [0, 1],
    ["rgba(255, 255, 255, 0.40)", "rgba(255, 255, 255, 0.85)"]
  );
  const navShadow = useTransform(
    easedProgress,
    [0, 1],
    [
      "0px 0px 0px rgba(0, 0, 0, 0)",
      "0px 16px 32px rgba(0, 0, 0, 0.14), inset 0px 0px 0px 0.5px rgba(255, 255, 255, 0.6)",
    ]
  );
  const navBlur = useTransform(easedProgress, [0, 1], ["blur(4px)", "blur(12px)"]);

  // B) Anchor Avatar / T Logo (48px x 48px, stable & anchored)
  const logoScale = useTransform(easedProgress, [0, 1], [1, 0.92]);

  // C) Full Navigation Container (Links + CTA Button)
  // Clean exit: 0.0 -> 0.30 opacity fade out, 0.0 -> 0.30 translation
  const fullNavOpacity = useTransform(easedProgress, [0, 0.30], [1, 0]);
  const fullNavX = useTransform(easedProgress, [0, 0.30], [0, -15]);
  const fullNavScale = useTransform(easedProgress, [0, 0.30], [1, 0.96]);
  const fullNavPointerEvents = useTransform(easedProgress, (p) => (p > 0.30 ? "none" : "auto"));

  // D) Compact Availability Content ("Available for work 🟡")
  // Clean entrance: 0.45 -> 0.80 opacity fade in, 0.45 -> 0.80 translation
  const compactOpacity = useTransform(easedProgress, [0.45, 0.80], [0, 1]);
  const compactX = useTransform(easedProgress, [0.45, 0.80], [15, 0]);
  const compactScale = useTransform(easedProgress, [0.45, 0.80], [0.96, 1]);
  const compactPointerEvents = useTransform(easedProgress, (p) => (p < 0.45 ? "none" : "auto"));

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
      {/* PRODUCTION GLASSMORPHIC SCROLL NAVIGATION CONTAINER */}
      <motion.nav
        style={{
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
        className="nav-container pointer-events-auto relative w-full flex items-center justify-between border transition-all duration-300 gap-4"
      >
        {/* ANCHOR: AVATAR / T MONOGRAM BADGE (48px x 48px) */}
        <motion.a
          style={{ scale: logoScale }}
          href="#hero"
          onClick={(e) => handleNavClick(e, "#hero")}
          aria-label="Toshit Sai - Return to top"
          className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-[#FFD42A] text-[#20252B] shadow-xs hover:scale-105 hover:shadow-md transition-all flex-shrink-0 z-20"
        >
          <span className="font-sans text-xl font-bold tracking-tight text-[#20252B] group-hover:rotate-6 transition-transform">
            T
          </span>
        </motion.a>

        {/* DESKTOP CONTENT: STACKED GRID CELL (ZERO LAYOUT REFLOW) */}
        <div className="hidden md:grid grid-cols-1 grid-rows-1 items-center flex-1 pl-2">
          {/* LAYER 1: EXPANDED FULL NAVIGATION (LINKS + CTA) */}
          <motion.div
            style={{
              gridArea: "1 / 1 / 2 / 2",
              opacity: fullNavOpacity,
              x: fullNavX,
              scale: fullNavScale,
              pointerEvents: fullNavPointerEvents,
            }}
            className="flex items-center justify-between w-full whitespace-nowrap pl-4 sm:pl-8"
          >
            {/* NAV LINKS WITH PURE WHITE TYPOGRAPHY MATCHING REFERENCE */}
            <div className="flex items-center gap-10 sm:gap-11">
              {NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className={`relative px-4 py-2 rounded-full text-base font-medium transition-colors duration-200 ${
                      isActive ? "text-white font-semibold" : "text-white/90 hover:text-white"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="activeNavPill"
                        className="absolute inset-0 rounded-full bg-white/25 backdrop-blur-md border border-white/40 -z-10"
                        transition={{ type: "spring", stiffness: 450, damping: 35 }}
                      />
                    )}
                    <span className="relative z-10">{item.label}</span>
                  </a>
                );
              })}
            </div>

            {/* WORK WITH ME CTA BUTTON (WHITE PILL, BLACK MAIL ICON & BLACK TEXT) */}
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, "#contact")}
              className="group relative flex items-center justify-center gap-2.5 px-6 py-2.5 rounded-full bg-white text-black text-base font-semibold tracking-tight shadow-sm hover:bg-white/95 hover:scale-[1.02] active:scale-[0.98] transition-all flex-shrink-0 ml-auto"
            >
              <Mail className="w-5 h-5 text-black fill-black group-hover:rotate-6 transition-transform" />
              <span className="text-black font-semibold">Work with me</span>
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
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#FFF8E8] text-[#20252B] text-xs font-semibold uppercase border border-white/80 shadow-xs hover:bg-white transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-[#20252B]" />
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
