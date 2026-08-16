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
  const [isScrolledForMobile, setIsScrolledForMobile] = useState(false);

  // 1. CONTINUOUS SCROLL PROGRESS (0px -> 120px)
  const { scrollY } = useScroll();

  // Outer Capsule Continuous Interpolation
  const navScale = useTransform(scrollY, [0, 120], [1, 0.94]);
  const navBg = useTransform(
    scrollY,
    [0, 120],
    ["rgba(255, 255, 255, 0.45)", "rgba(255, 255, 255, 0.85)"]
  );
  const navBorder = useTransform(
    scrollY,
    [0, 120],
    ["rgba(255, 255, 255, 0.75)", "rgba(255, 255, 255, 0.95)"]
  );
  const navShadow = useTransform(
    scrollY,
    [0, 120],
    [
      "0px 12px 40px rgba(32, 37, 43, 0.06)",
      "0px 6px 24px rgba(32, 37, 43, 0.12)",
    ]
  );

  // Logo T Badge Anchor Continuous Interpolation
  const logoScale = useTransform(scrollY, [0, 120], [1, 0.95]);

  // Full Nav State Content (Links + CTA) -> Fades out & lifts up (0px -> 65px)
  const fullNavOpacity = useTransform(scrollY, [0, 65], [1, 0]);
  const fullNavY = useTransform(scrollY, [0, 65], [0, -6]);
  const fullNavScale = useTransform(scrollY, [0, 65], [1, 0.94]);
  const fullNavPointerEvents = useTransform(scrollY, (y) => (y > 65 ? "none" : "auto"));

  // Compact State Content ("Available for work ●") -> Fades in & lifts into place (45px -> 120px)
  const compactOpacity = useTransform(scrollY, [45, 120], [0, 1]);
  const compactY = useTransform(scrollY, [45, 120], [6, 0]);
  const compactScale = useTransform(scrollY, [45, 120], [0.94, 1]);
  const compactPointerEvents = useTransform(scrollY, (y) => (y < 45 ? "none" : "auto"));

  // Active Section Observer & Mobile Scroll Tracking
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setIsScrolledForMobile(currentScroll > 75);

      const sections = [
        { id: "work", el: document.getElementById("work") || document.getElementById("projects") },
        { id: "about", el: document.getElementById("about") },
        { id: "playground", el: document.getElementById("playground") || document.getElementById("skills") },
        { id: "contact", el: document.getElementById("contact") },
      ];

      const scrollPosition = currentScroll + 280;

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
    <div className="fixed top-4 left-0 right-0 z-50 flex justify-center items-center pointer-events-none px-4">
      {/* SINGLE UNIFIED SCROLL-LINKED TRANSFORMING NAVBAR CAPSULE */}
      <motion.nav
        layout
        style={{
          scale: navScale,
          backgroundColor: navBg,
          borderColor: navBorder,
          boxShadow: navShadow,
        }}
        transition={{
          layout: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
        }}
        className="pointer-events-auto relative flex items-center justify-between backdrop-blur-2xl rounded-full border px-3 py-1.5 overflow-hidden"
      >
        {/* LOGO: T BADGE (ANCHOR ELEMENT) */}
        <motion.a
          style={{ scale: logoScale }}
          href="#hero"
          onClick={(e) => handleNavClick(e, "#hero")}
          className="group relative w-8 h-8 rounded-full bg-[#FFD42A] text-[#20252B] font-bold flex items-center justify-center text-sm shadow-xs hover:scale-105 transition-transform flex-shrink-0 z-20"
          aria-label="Toshit Sai Home"
        >
          <span className="font-sans font-extrabold group-hover:rotate-6 transition-transform">T</span>
        </motion.a>

        {/* DESKTOP SCROLL-LINKED TRANSFORM CONTAINER */}
        <div className="hidden sm:grid items-center ml-3 relative">
          {/* FULL NAV CONTENT (LINKS + CTA) */}
          <motion.div
            style={{
              opacity: fullNavOpacity,
              y: fullNavY,
              scale: fullNavScale,
              pointerEvents: fullNavPointerEvents,
            }}
            className="col-start-1 row-start-1 flex items-center gap-2 sm:gap-3 whitespace-nowrap"
          >
            {/* NAV LINKS */}
            <div className="flex items-center gap-1 text-xs font-mono tracking-[0.16em] uppercase text-[#20252B] font-bold">
              {NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className={`relative px-3.5 sm:px-4 py-1.5 rounded-full transition-all duration-200 hover:-translate-y-[1px] ${
                      isActive
                        ? "text-[#20252B] font-bold"
                        : "text-[#20252B]/75 hover:text-[#20252B]"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="activeNavPill"
                        className="absolute inset-0 rounded-full bg-white/70 border border-white/90 shadow-xs -z-10"
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
              className="group ml-1 px-4 sm:px-4.5 py-1.5 rounded-full bg-[#FFF8E8] text-[#20252B] text-xs font-mono font-bold tracking-[0.16em] uppercase hover:bg-white hover:scale-[1.03] transition-all shadow-xs flex items-center gap-2 border border-white/80"
            >
              <Mail className="w-3.5 h-3.5 text-[#20252B] stroke-[2.2] group-hover:translate-x-0.5 transition-transform" />
              <span>Work with me</span>
            </a>
          </motion.div>

          {/* COMPACT CONTENT ("Available for work ●") */}
          <motion.div
            style={{
              opacity: compactOpacity,
              y: compactY,
              scale: compactScale,
              pointerEvents: compactPointerEvents,
            }}
            className="col-start-1 row-start-1 flex items-center gap-3 pr-1.5 whitespace-nowrap justify-end"
          >
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, "#contact")}
              className="text-xs font-mono tracking-[0.14em] uppercase font-bold text-[#20252B] hover:text-[#4A525D] transition-colors flex items-center gap-2.5"
            >
              <span>Available for work</span>
              <span className="relative flex h-2.5 w-2.5 items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFD42A] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FFD42A] shadow-[0_0_6px_#FFD42A]" />
              </span>
            </a>
          </motion.div>
        </div>

        {/* MOBILE TRIGGER BUTTON */}
        <div className="flex sm:hidden items-center ml-2">
          {!isScrolledForMobile ? (
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 text-[#20252B] focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          ) : (
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, "#contact")}
              className="flex items-center gap-2 text-[11px] font-mono tracking-wider font-bold uppercase text-[#20252B] px-2"
            >
              <span>Available</span>
              <span className="w-2 h-2 rounded-full bg-[#FFD42A] shadow-[0_0_6px_#FFD42A] animate-pulse" />
            </a>
          )}
        </div>
      </motion.nav>

      {/* MOBILE MENU DROPDOWN */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="pointer-events-auto absolute top-16 left-4 right-4 bg-white/95 backdrop-blur-2xl border border-white/80 p-4 rounded-2xl shadow-2xl flex flex-col gap-2 font-mono text-xs font-bold uppercase tracking-wider text-[#20252B]"
          >
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="px-4 py-2.5 rounded-xl hover:bg-cream-paper/80 transition-colors flex items-center justify-between"
              >
                <span>{item.label}</span>
                {activeSection === item.id && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFD42A]" />
                )}
              </a>
            ))}
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, "#contact")}
              className="mt-2 px-4 py-3 rounded-xl bg-[#FFF8E8] text-[#20252B] flex items-center justify-center gap-2 font-bold shadow-sm border border-white"
            >
              <Mail className="w-4 h-4 text-[#20252B]" />
              <span>Work with me</span>
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
