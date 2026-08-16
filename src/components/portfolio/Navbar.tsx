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

const smoothEasing = [0.16, 1, 0.3, 1];

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("work");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      // Hysteresis scroll threshold for butter-smooth state shifts
      if (scrollY > 90) {
        setIsScrolled(true);
      } else if (scrollY < 30) {
        setIsScrolled(false);
      }

      // Active section detection
      const sections = [
        { id: "work", el: document.getElementById("work") || document.getElementById("projects") },
        { id: "about", el: document.getElementById("about") },
        { id: "playground", el: document.getElementById("playground") || document.getElementById("skills") },
        { id: "contact", el: document.getElementById("contact") },
      ];

      const scrollPosition = scrollY + 280;

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

      if (scrollY < 180) {
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
      {/* SINGLE UNIFIED VELVET-SMOOTH TRANSFORMING NAVBAR CAPSULE */}
      <motion.nav
        layout
        transition={{
          duration: 0.65,
          ease: smoothEasing,
        }}
        className={`pointer-events-auto relative flex items-center justify-between shadow-[0_10px_38px_rgba(32,37,43,0.08)] backdrop-blur-2xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] rounded-full border overflow-hidden ${
          isScrolled
            ? "bg-white/85 border-white/95 px-3 py-1.5"
            : "bg-white/45 border-white/75 px-2.5 sm:px-3 py-1.5"
        }`}
      >
        {/* LOGO: T BADGE */}
        <motion.a
          layout="position"
          transition={{ duration: 0.65, ease: smoothEasing }}
          href="#hero"
          onClick={(e) => handleNavClick(e, "#hero")}
          className="group relative w-8 h-8 rounded-full bg-[#FFD42A] text-[#20252B] font-bold flex items-center justify-center text-sm shadow-xs hover:scale-105 transition-transform flex-shrink-0 z-10"
          aria-label="Toshit Sai Home"
        >
          <span className="font-sans font-extrabold group-hover:rotate-6 transition-transform">T</span>
        </motion.a>

        {/* DESKTOP CONTENT: LIQUID CROSS-FADE MORPH */}
        <div className="hidden sm:flex items-center overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false}>
            {!isScrolled ? (
              <motion.div
                key="full-nav"
                layout
                initial={{ opacity: 0, x: -12, scale: 0.96 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 12, scale: 0.96 }}
                transition={{ duration: 0.55, ease: smoothEasing }}
                className="flex items-center gap-2 sm:gap-3 ml-3 whitespace-nowrap"
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
            ) : (
              <motion.div
                key="compact-availability"
                layout
                initial={{ opacity: 0, x: 12, scale: 0.96 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -12, scale: 0.96 }}
                transition={{ duration: 0.55, ease: smoothEasing }}
                className="flex items-center gap-3 ml-3 pr-1.5 whitespace-nowrap"
              >
                {/* AVAILABLE FOR WORK TEXT */}
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
            )}
          </AnimatePresence>
        </div>

        {/* MOBILE TRIGGER BUTTON */}
        <div className="flex sm:hidden items-center ml-2">
          {!isScrolled ? (
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
