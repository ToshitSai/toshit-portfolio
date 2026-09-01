import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Menu, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

interface NavItem {
  id: string;
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: "work", label: "Work", href: "/#work" },
  { id: "about", label: "About", href: "/about" },
  { id: "playground", label: "Playground", href: "/playground" },
];

// Unified 200ms cubic-bezier transition (fast, direct & smooth)
const NAV_TRANSITION = {
  duration: 0.2,
  ease: [0.22, 1, 0.36, 1] as const,
};

interface NavbarProps {
  onTriggerLogin?: () => void;
  onOpenContact?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onTriggerLogin, onOpenContact }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // SINGLE SOURCE OF TRUTH FOR NAVBAR MODE (NO SECTION TRACKING)
  const [navbarMode, setNavbarMode] = useState<"full" | "compact">("full");
  const navbarModeRef = useRef<"full" | "compact">("full");
  const lastScrollYRef = useRef<number>(0);

  // SINGLE PASSIVE rAF SCROLL DIRECTIONAL STATE MACHINE + HERO BOUNDARY DETECTION
  useEffect(() => {
    lastScrollYRef.current = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const delta = currentScrollY - lastScrollYRef.current;
        const DIRECTION_THRESHOLD = 5;

        let targetMode = navbarModeRef.current;

        if (currentScrollY <= 5) {
          targetMode = "full";
        } else if (delta > DIRECTION_THRESHOLD) {
          // Meaningfully scrolling DOWN -> COMPACT
          targetMode = "compact";
        } else if (delta < -DIRECTION_THRESHOLD) {
          // Meaningfully scrolling UP -> FULL
          targetMode = "full";
        }

        // ONLY trigger React re-render when state actually changes
        if (targetMode !== navbarModeRef.current) {
          navbarModeRef.current = targetMode;
          setNavbarMode(targetMode);
        }

        lastScrollYRef.current = currentScrollY;
        ticking = false;
      });
    };

    // Run initial scroll check
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const navLockRef = useRef<number>(0);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);

    // Prevent rapid double-clicks during transition (200ms cooldown)
    const now = Date.now();
    if (now - navLockRef.current < 200) return;
    navLockRef.current = now;

    if (href === "/about") {
      if (location.pathname !== "/about") {
        navigate("/about");
      }
      window.scrollTo({ top: 0, behavior: "instant" });
      return;
    }

    if (href === "/playground") {
      if (location.pathname !== "/playground") {
        navigate("/playground");
      }
      window.scrollTo({ top: 0, behavior: "instant" });
      return;
    }

    if (href === "#hero" || href === "/#hero" || href === "/") {
      if (location.pathname !== "/") {
        navigate("/");
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    const targetId = href.replace("/#", "").replace("#", "");

    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        let targetEl = document.getElementById(targetId);
        if (!targetEl && targetId === "work") targetEl = document.getElementById("projects");
        if (targetEl) targetEl.scrollIntoView({ behavior: "smooth" });
      }, 150);
      return;
    }

    let targetEl = document.getElementById(targetId);
    if (!targetEl && targetId === "work") targetEl = document.getElementById("projects");

    if (targetEl) {
      targetEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Dedicated handler for "Work with me" / "Available for work" buttons that opens the right drawer smoothly
  const handleWorkWithMeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    if (onOpenContact) {
      onOpenContact();
    } else {
      window.dispatchEvent(new CustomEvent("open-contact-drawer"));
    }
  };

  const isCompact = navbarMode === "compact";
  const isAboutRoute = location.pathname === "/about";
  const isPlaygroundRoute = location.pathname === "/playground";
  const isHomeRoute = location.pathname === "/";

  return (
    <header className="fixed top-0 left-0 right-0 z-[1000] flex justify-center items-center pointer-events-none px-4 sm:px-6 pt-[18px]">
      {/* HIGH-TRANSPARENCY GLASSMORPHIC FLOATING CAPSULE NAVBAR */}
      <motion.nav
        animate={{
          width: isCompact ? "310px" : "min(545px, calc(100vw - 24px))",
          maxWidth: isCompact ? "310px" : "545px",
          height: "60px",
          opacity: 1,
          y: 0,
          pointerEvents: "auto",
        }}
        transition={NAV_TRANSITION}
        style={{
          borderRadius: "9999px",
          backgroundColor: "rgba(248, 242, 230, 0.78)",
          borderColor: "rgba(255, 255, 255, 0.5)",
          boxShadow: "0px 8px 30px rgba(25, 28, 33, 0.08)",
          backdropFilter: "blur(20px) saturate(130%)",
          WebkitBackdropFilter: "blur(20px) saturate(130%)",
          transform: "translateZ(0)",
          willChange: "transform, opacity, width",
          boxSizing: "border-box",
        }}
        className="nav-container pointer-events-auto relative flex items-center border px-2 py-1.5 transition-colors overflow-hidden"
      >
        {/* LAYER 1: FULL EXPANDED NAVBAR CONTENT */}
        <motion.div
          animate={{
            opacity: isCompact ? 0 : 1,
            scale: isCompact ? 0.95 : 1,
            pointerEvents: isCompact ? "none" : "auto",
          }}
          transition={NAV_TRANSITION}
          className="flex items-center justify-between w-full h-full"
        >
          {/* AVATAR / T MONOGRAM BADGE */}
          <a
            href="/"
            onClick={(e) => {
              handleNavClick(e, "/");
              if (onTriggerLogin && e.detail === 2) onTriggerLogin();
            }}
            aria-label="Toshit Sai - Return to top"
            className="group relative flex items-center justify-center w-[44px] h-[44px] rounded-full bg-[#FFD42A] text-[#20252B] shadow-xs hover:scale-105 transition-transform flex-shrink-0 ml-0.5"
          >
            <span className="font-sans text-base font-bold tracking-tight text-[#20252B] group-hover:rotate-6 transition-transform">
              T
            </span>
          </a>

          {/* STATIC DESKTOP NAV LINKS */}
          <div className="hidden md:flex items-center gap-[12px] whitespace-nowrap ml-2.5">
            {NAV_ITEMS.map((item) => {
              const isActive =
                (item.id === "about" && isAboutRoute) ||
                (item.id === "playground" && isPlaygroundRoute) ||
                (item.id === "work" && isHomeRoute);

              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`relative text-[15px] font-medium leading-none transition-all duration-200 ${isActive
                      ? "px-4 h-[40px] rounded-full bg-white/90 text-[#20252B] font-semibold flex items-center justify-center shadow-xs backdrop-blur-md"
                      : "text-[#20252B] hover:text-[#20252B]/80 py-2 px-3 rounded-full hover:bg-white/40"
                    }`}
                >
                  <span>{item.label}</span>
                </a>
              );
            })}
          </div>

          {/* WORK WITH ME CTA BUTTON — OPENS RIGHT DRAWER */}
          <button
            type="button"
            onClick={handleWorkWithMeClick}
            className="group flex items-center justify-center gap-2 w-[170px] h-[40px] px-3.5 rounded-full bg-white/90 text-[#20252B] text-[14px] font-semibold tracking-tight shadow-sm hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap backdrop-blur-md ml-auto cursor-pointer"
          >
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
          </button>
        </motion.div>

        {/* LAYER 2: COMPACT "AVAILABLE FOR WORK" STATUS BAR */}
        <motion.div
          animate={{
            opacity: isCompact ? 1 : 0,
            scale: isCompact ? 1 : 0.95,
            pointerEvents: isCompact ? "auto" : "none",
          }}
          transition={NAV_TRANSITION}
          className="absolute inset-0 flex items-center justify-between px-2 py-1.5 whitespace-nowrap"
        >
          {/* REUSED 44px YELLOW T AVATAR MONOGRAM */}
          <a
            href="#hero"
            onClick={(e) => {
              handleNavClick(e, "#hero");
              if (onTriggerLogin && e.detail === 2) onTriggerLogin();
            }}
            aria-label="Toshit Sai - Return to top"
            className="group relative flex items-center justify-center w-[44px] h-[44px] rounded-full bg-[#FFD42A] text-[#20252B] shadow-xs hover:scale-105 transition-transform flex-shrink-0 ml-0.5"
          >
            <span className="font-sans text-base font-bold tracking-tight text-[#20252B] group-hover:rotate-6 transition-transform">
              T
            </span>
          </a>

          {/* "AVAILABLE FOR WORK" TEXT BUTTON — OPENS RIGHT DRAWER */}
          <button
            type="button"
            onClick={handleWorkWithMeClick}
            className="flex-1 flex items-center justify-center px-2 group cursor-pointer"
          >
            <span className="font-sans text-[17px] font-normal tracking-tight text-[#20252B] group-hover:opacity-80 transition-opacity whitespace-nowrap">
              Available for work
            </span>
          </button>

          {/* SUBTLE GLOWING YELLOW STATUS INDICATOR DOT — OPENS RIGHT DRAWER */}
          <button
            type="button"
            onClick={handleWorkWithMeClick}
            aria-label="Available for work status"
            className="w-[30px] h-[30px] rounded-full border border-white/40 bg-white/20 backdrop-blur-xs flex items-center justify-center flex-shrink-0 mr-1 group cursor-pointer"
          >
            <span className="relative flex h-[9px] w-[9px] items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFD42A] opacity-75" />
              <span className="relative inline-flex rounded-full h-[9px] w-[9px] bg-[#FFD42A] shadow-[0_0_8px_#FFD42A]" />
            </span>
          </button>
        </motion.div>

        {/* MOBILE CONTROLS */}
        <div className="flex md:hidden items-center gap-2 ml-auto pr-1">
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
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="px-4 py-2.5 rounded-full text-xs font-semibold tracking-[0.14em] flex items-center justify-between transition-all text-[#20252B]/75 hover:text-[#20252B] hover:bg-white/50"
                >
                  <span>{item.label}</span>
                </a>
              );
            })}
            <button
              type="button"
              onClick={handleWorkWithMeClick}
              className="mt-1 px-4 py-2.5 rounded-full bg-[#FFF8E8] text-[#20252B] text-xs font-semibold tracking-[0.14em] uppercase flex items-center justify-center gap-2 border border-white/80 shadow-xs hover:bg-white transition-colors cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5 text-[#20252B]" />
              <span>Work with me</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
