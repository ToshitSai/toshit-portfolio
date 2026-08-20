import React, { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Send, CheckCircle2, Loader2, X, Sparkles } from "lucide-react";
import ResumeModal from "./ResumeModal";

const ContactFooter: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // System Node hover & cursor tracking state
  const [isHoveringStage, setIsHoveringStage] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    setCursorPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
    }, 900);
  };

  return (
    <footer
      id="contact"
      ref={ref}
      style={{ backgroundColor: "#F3EEE2", color: "#1B1B18" }}
      className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden select-none z-20 font-sans px-6 sm:px-12 lg:px-20 pt-24 sm:pt-32 pb-10 sm:pb-14"
    >
      {/* 1. TOP METADATA BAR */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full flex items-center justify-start font-mono text-xs sm:text-sm text-[#1B1B18]/70 font-medium z-10"
      >
        <div className="flex items-center gap-2">
          <span>📍 HYDERABAD, IN</span>
        </div>
      </motion.div>

      {/* 2. MAIN CENTER HERO SECTION */}
      <div className="w-full max-w-5xl mx-auto my-auto py-8 sm:py-12 flex flex-col items-center text-center z-10">
        
        {/* Lede Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-[#1B1B18]/75 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-6 font-normal"
        >
          From early prototypes to production systems, I help teams ship AI-powered products that are fast, thoughtful, and built to scale.
        </motion.p>

        {/* H1 Main Title with Underline */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative inline-block max-w-full mb-12 sm:mb-16"
        >
          <h1
            style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
            className="text-[clamp(18px,4.2vw,72px)] font-bold leading-tight tracking-[-0.03em] text-[#1B1B18] sm:whitespace-nowrap max-w-full"
          >
            Let's build your next system
          </h1>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="h-[3px] bg-[#1B1B18] w-full mt-3 origin-center rounded-full"
          />
        </motion.div>

        {/* 3. INTERACTIVE SYSTEM NODE DIAGRAM STAGE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          ref={stageRef}
          onMouseEnter={() => setIsHoveringStage(true)}
          onMouseLeave={() => setIsHoveringStage(false)}
          onMouseMove={handleMouseMove}
          onClick={() => setIsDrawerOpen(true)}
          className="relative w-full max-w-3xl h-[340px] sm:h-[400px] flex flex-col justify-between items-center cursor-pointer group select-none py-4 px-6"
        >
          {/* Top Center Category Label */}
          <div className="font-mono text-xs text-[#1B1B18]/50 tracking-[0.25em] uppercase font-semibold">
            AI · SYSTEMS · DESIGN
          </div>

          {/* Corner Brackets */}
          <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-[#1B1B18]/25" />
          <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-[#1B1B18]/25" />

          {/* SVG Orbit Diagram */}
          <div className="relative w-full flex-1 flex items-center justify-center">
            <svg width="600" height="320" viewBox="0 0 600 320" className="w-full max-w-[580px] h-auto overflow-visible">
              <circle cx="300" cy="160" r="75" fill="none" stroke="rgba(27,27,24,0.15)" strokeWidth="1" />
              <circle cx="300" cy="160" r="135" fill="none" stroke="rgba(27,27,24,0.15)" strokeWidth="1" strokeDasharray="4 6" />

              {/* Spokes */}
              <line x1="300" y1="160" x2="225" y2="65" stroke="rgba(27,27,24,0.2)" strokeWidth="1" />
              <line x1="300" y1="160" x2="385" y2="55" stroke="rgba(27,27,24,0.2)" strokeWidth="1" />
              <line x1="300" y1="160" x2="145" y2="160" stroke="rgba(27,27,24,0.2)" strokeWidth="1" />
              <line x1="300" y1="160" x2="455" y2="160" stroke="rgba(27,27,24,0.2)" strokeWidth="1" />
              <line x1="300" y1="160" x2="205" y2="255" stroke="rgba(27,27,24,0.2)" strokeWidth="1" />
              <line x1="300" y1="160" x2="395" y2="250" stroke="rgba(27,27,24,0.2)" strokeWidth="1" />

              {/* Nodes */}
              <circle cx="225" cy="65" r="7" stroke="#1B1B18" strokeWidth="1.5" className={`transition-all duration-300 ${isHoveringStage ? "fill-[#D9A62C]" : "fill-[#F3EEE2]"}`} />
              <circle cx="385" cy="55" r="7" stroke="#1B1B18" strokeWidth="1.5" className={`transition-all duration-300 ${isHoveringStage ? "fill-[#D9A62C]" : "fill-[#F3EEE2]"}`} />
              <circle cx="145" cy="160" r="7" stroke="#1B1B18" strokeWidth="1.5" className={`transition-all duration-300 ${isHoveringStage ? "fill-[#D9A62C]" : "fill-[#F3EEE2]"}`} />
              <circle cx="455" cy="160" r="7" stroke="#1B1B18" strokeWidth="1.5" className={`transition-all duration-300 ${isHoveringStage ? "fill-[#D9A62C]" : "fill-[#F3EEE2]"}`} />
              <circle cx="205" cy="255" r="7" stroke="#1B1B18" strokeWidth="1.5" className={`transition-all duration-300 ${isHoveringStage ? "fill-[#D9A62C]" : "fill-[#F3EEE2]"}`} />
              <circle cx="395" cy="250" r="7" stroke="#1B1B18" strokeWidth="1.5" className={`transition-all duration-300 ${isHoveringStage ? "fill-[#D9A62C]" : "fill-[#F3EEE2]"}`} />

              {/* Center Core Node */}
              <circle cx="300" cy="160" r="18" fill="none" stroke="rgba(217,166,44,0.5)" strokeWidth="1.5" className="animate-ping origin-center" />
              <circle cx="300" cy="160" r="12" fill="#D9A62C" stroke="#1B1B18" strokeWidth="2" className={`transition-transform duration-300 origin-center ${isHoveringStage ? "scale-125" : "scale-100"}`} />
            </svg>
          </div>

          {/* Bottom Left Fig Label */}
          <div className="w-full flex items-center justify-between font-mono text-xs text-[#1B1B18]/50 tracking-[0.18em] uppercase">
            <span>FIG 02. LIVE SYSTEM NODE</span>
            <span className="hidden sm:inline text-[#1B1B18]/40">CLICK TO CONNECT</span>
          </div>

          {/* Hover Floating Cursor Tag */}
          {isHoveringStage && (
            <div
              className="absolute pointer-events-none z-30 flex flex-col items-center transition-opacity duration-150"
              style={{
                left: cursorPos.x,
                top: cursorPos.y - 20,
                transform: "translate(-50%, -100%)",
              }}
            >
              <span className="text-xl mb-1">⚡</span>
              <span className="font-mono text-[10px] tracking-wider font-bold bg-[#D9A62C] text-[#1B1B18] px-2.5 py-1 rounded-md shadow-md whitespace-nowrap">
                CLICK TO CONNECT
              </span>
            </div>
          )}
        </motion.div>
      </div>

      {/* 4. BOTTOM FOOTER BAR */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs sm:text-sm text-[#1B1B18]/70 pt-6 border-t border-[#1B1B18]/10 z-10"
      >
        <p>Built by Toshit Sai · Hyderabad, India @2026</p>

        <div className="flex items-center gap-6 font-medium">
          <a
            href="https://github.com/ToshitSai"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#1B1B18] transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/toshit-sai-galam-177788276/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#1B1B18] transition-colors"
          >
            LinkedIn
          </a>
          <button
            onClick={() => setIsResumeModalOpen(true)}
            className="hover:text-[#1B1B18] transition-colors"
          >
            Resume
          </button>
        </div>
      </motion.div>

      {/* 5. SLIDE-OVER DRAWER CONTACT FORM */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-[#14120C]/40 backdrop-blur-sm z-[1000]"
            />

            {/* Slide-over Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-lg bg-[#FBF7ED] text-[#1B1B18] border-l border-[#1B1B18]/15 z-[1001] p-8 sm:p-12 overflow-y-auto shadow-2xl flex flex-col justify-between"
            >
              <div>
                {/* Header & Close */}
                <div className="flex items-center justify-between pb-6 border-b border-[#1B1B18]/10 mb-8">
                  <div className="flex items-center gap-2 font-mono text-xs text-[#1B1B18] uppercase tracking-widest font-bold">
                    <span className="w-2 h-2 rounded-full bg-[#D9A62C]" />
                    <span>AVAILABLE FOR NEW PROJECTS</span>
                  </div>
                  <button
                    onClick={() => setIsDrawerOpen(false)}
                    className="w-9 h-9 rounded-full bg-[#1B1B18]/5 hover:bg-[#1B1B18] hover:text-[#FBF7ED] text-[#1B1B18] flex items-center justify-center transition-colors border border-[#1B1B18]/10"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <h2
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  className="text-3xl sm:text-4xl font-bold mb-4 text-[#1B1B18]"
                >
                  Let's connect.
                </h2>
                <p className="text-[#1B1B18]/70 text-sm leading-relaxed mb-8">
                  Tell me what you're building — a product, a research idea, a role worth exploring. I'll write back within 48 hours.
                </p>

                {/* Form inside Drawer */}
                {isSubmitted ? (
                  <div className="p-6 rounded-2xl bg-[#F3EEE2] border border-[#D9A62C] text-left space-y-4">
                    <div className="w-10 h-10 rounded-full bg-[#D9A62C]/20 text-[#1B1B18] flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold text-[#1B1B18]">Message sent!</h3>
                    <p className="text-sm text-[#1B1B18]/70">
                      Thanks for reaching out — I'll get back to you within 48 hours to talk through what we're building.
                    </p>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="px-4 py-2 rounded-full bg-[#1B1B18] text-[#F3EEE2] font-mono text-xs uppercase font-semibold"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label className="block font-mono text-xs text-[#1B1B18]/80 uppercase font-semibold">YOUR NAME *</label>
                      <input
                        type="text"
                        required
                        placeholder="Jane Appleseed"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-[#F3EEE2] border border-[#1B1B18]/20 rounded-xl p-3.5 text-[#1B1B18] placeholder-[#1B1B18]/40 text-sm focus:border-[#1B1B18] outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block font-mono text-xs text-[#1B1B18]/80 uppercase font-semibold">EMAIL ADDRESS *</label>
                      <input
                        type="email"
                        required
                        placeholder="you@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-[#F3EEE2] border border-[#1B1B18]/20 rounded-xl p-3.5 text-[#1B1B18] placeholder-[#1B1B18]/40 text-sm focus:border-[#1B1B18] outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block font-mono text-xs text-[#1B1B18]/80 uppercase font-semibold">WHAT ARE WE BUILDING? *</label>
                      <textarea
                        rows={4}
                        required
                        placeholder="A few lines about your project, timeline, or budget..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full bg-[#F3EEE2] border border-[#1B1B18]/20 rounded-xl p-3.5 text-[#1B1B18] placeholder-[#1B1B18]/40 text-sm focus:border-[#1B1B18] outline-none resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 rounded-full bg-[#1B1B18] text-[#FBF7ED] font-mono text-sm font-bold tracking-wider uppercase hover:bg-[#20252A] transition-all flex items-center justify-center gap-2 shadow-md"
                    >
                      {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin text-[#D9A62C]" /> : <Send className="w-4 h-4 text-[#D9A62C]" />}
                      <span>Send it over ✉</span>
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* RESUME MODAL INTEGRATION */}
      <ResumeModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
      />
    </footer>
  );
};

export default ContactFooter;
