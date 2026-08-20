import React, { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Mail, ArrowUpRight, Send, CheckCircle2, MapPin, Clock, Github, Linkedin, FileText, Loader2, X, Sparkles } from "lucide-react";
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
    subject: "",
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
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 900);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      id="contact"
      ref={ref}
      style={{ backgroundColor: "#20252A" }}
      className="relative w-full text-[#F5F0E6] overflow-hidden select-none z-20 font-sans border-t border-[#F5F0E6]/10"
    >
      {/* Subtle Noise Texture Overlay */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-20 sm:pt-28 pb-16 relative z-10">
        
        {/* 1. SECTION LABEL */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-2.5 font-mono text-xs sm:text-sm tracking-[0.18em] text-[#F5C518] mb-8 font-semibold uppercase"
        >
          <span className="w-2 h-2 rounded-full bg-[#F5C518] shadow-[0_0_8px_#F5C518]" />
          <span>05 // GET IN TOUCH</span>
        </motion.div>

        {/* 2. EDITORIAL HEADLINE & EMAIL CTA */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 lg:gap-16 mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            <h2
              style={{ fontFamily: "'Instrument Serif', 'Cormorant Garamond', Georgia, serif" }}
              className="text-[clamp(44px,6.2vw,96px)] leading-[0.92] tracking-[-0.02em] font-normal text-[#F5F0E6] mb-6"
            >
              Let's build something <br className="hidden sm:block" />
              remarkable together.
            </h2>

            <p
              style={{ fontFamily: "'Instrument Sans', sans-serif" }}
              className="text-[#E5DED2]/85 text-lg sm:text-xl md:text-[22px] leading-relaxed max-w-[650px] font-normal"
            >
              Have a project in mind, open opportunities, or want to collaborate? Send me a message below or email directly.
            </p>
          </motion.div>

          {/* EMAIL CTA BUTTON */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="w-full lg:w-auto flex-shrink-0"
          >
            <a
              href="mailto:iamtoshitsai@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-3 w-full lg:w-auto px-7 py-4 sm:px-9 sm:py-5 rounded-full bg-[#F5C518] hover:bg-[#FFD21F] text-[#1A1D21] font-mono text-xs sm:text-sm font-bold tracking-wider uppercase transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] shadow-xl shadow-[#F5C518]/15 border border-[#F5C518]"
            >
              <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-[#1A1D21] group-hover:rotate-6 transition-transform" />
              <span>IAMTOSHITSAI@GMAIL.COM</span>
              <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#1A1D21] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>
          </motion.div>
        </div>

        {/* 3. INTERACTIVE SYSTEM NODE DIAGRAM STAGE */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 rounded-3xl bg-[#171A1E]/80 border border-[#F5F0E6]/10 p-6 sm:p-10 relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-4 font-mono text-xs text-[#F5C518] tracking-widest uppercase">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="font-semibold">FIG 02. LIVE SYSTEM NODE</span>
            </div>
            <span className="text-[#F5F0E6]/50 hidden sm:inline">CLICK NODE TO OPEN DRAWER</span>
          </div>

          <div
            ref={stageRef}
            onMouseEnter={() => setIsHoveringStage(true)}
            onMouseLeave={() => setIsHoveringStage(false)}
            onMouseMove={handleMouseMove}
            onClick={() => setIsDrawerOpen(true)}
            className="relative w-full h-[320px] sm:h-[380px] flex items-center justify-center cursor-pointer group select-none"
          >
            {/* Corner Brackets */}
            <div className="absolute top-4 left-4 w-5 h-5 border-t-2 border-l-2 border-[#F5F0E6]/30" />
            <div className="absolute bottom-4 right-4 w-5 h-5 border-b-2 border-r-2 border-[#F5F0E6]/30" />

            {/* SVG Orbit Diagram */}
            <svg width="620" height="380" viewBox="0 0 620 380" className="w-full max-w-[620px] h-auto overflow-visible">
              <circle cx="310" cy="190" r="80" fill="none" stroke="rgba(245,240,230,0.15)" strokeWidth="1" />
              <circle cx="310" cy="190" r="140" fill="none" stroke="rgba(245,240,230,0.15)" strokeWidth="1" strokeDasharray="4 6" />

              {/* Spokes */}
              <line x1="310" y1="190" x2="230" y2="90" stroke="rgba(245,240,230,0.2)" strokeWidth="1" />
              <line x1="310" y1="190" x2="400" y2="80" stroke="rgba(245,240,230,0.2)" strokeWidth="1" />
              <line x1="310" y1="190" x2="150" y2="190" stroke="rgba(245,240,230,0.2)" strokeWidth="1" />
              <line x1="310" y1="190" x2="470" y2="190" stroke="rgba(245,240,230,0.2)" strokeWidth="1" />
              <line x1="310" y1="190" x2="210" y2="290" stroke="rgba(245,240,230,0.2)" strokeWidth="1" />
              <line x1="310" y1="190" x2="410" y2="285" stroke="rgba(245,240,230,0.2)" strokeWidth="1" />

              {/* Nodes */}
              <circle cx="230" cy="90" r="6" stroke="#F5C518" strokeWidth="1.5" className={`transition-all duration-300 ${isHoveringStage ? "fill-[#F5C518]" : "fill-[#20252A]"}`} />
              <circle cx="400" cy="80" r="6" stroke="#F5C518" strokeWidth="1.5" className={`transition-all duration-300 ${isHoveringStage ? "fill-[#F5C518]" : "fill-[#20252A]"}`} />
              <circle cx="150" cy="190" r="6" stroke="#F5C518" strokeWidth="1.5" className={`transition-all duration-300 ${isHoveringStage ? "fill-[#F5C518]" : "fill-[#20252A]"}`} />
              <circle cx="470" cy="190" r="6" stroke="#F5C518" strokeWidth="1.5" className={`transition-all duration-300 ${isHoveringStage ? "fill-[#F5C518]" : "fill-[#20252A]"}`} />
              <circle cx="210" cy="290" r="6" stroke="#F5C518" strokeWidth="1.5" className={`transition-all duration-300 ${isHoveringStage ? "fill-[#F5C518]" : "fill-[#20252A]"}`} />
              <circle cx="410" cy="285" r="6" stroke="#F5C518" strokeWidth="1.5" className={`transition-all duration-300 ${isHoveringStage ? "fill-[#F5C518]" : "fill-[#20252A]"}`} />

              <text x="310" y="35" textAnchor="middle" className="font-mono text-[11px] tracking-[0.2em] fill-[#F5F0E6]/60">
                AI · SYSTEMS · DESIGN
              </text>

              {/* Center Core Node */}
              <circle cx="310" cy="190" r="18" fill="none" stroke="rgba(245,197,24,0.4)" strokeWidth="1.5" className="animate-ping origin-center" />
              <circle cx="310" cy="190" r="12" fill="#F5C518" stroke="#171A1E" strokeWidth="2" className={`transition-transform duration-300 origin-center ${isHoveringStage ? "scale-125" : "scale-100"}`} />
            </svg>

            {/* Rising Particles */}
            {isHoveringStage && (
              <>
                <div className="absolute w-2 h-2 rounded-full bg-[#F5C518] animate-ping pointer-events-none" style={{ left: "50%", top: "45%" }} />
                <div className="absolute w-1.5 h-1.5 rounded-full bg-[#F5C518] animate-ping pointer-events-none" style={{ left: "48%", top: "52%" }} />
              </>
            )}

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
                <span className="font-mono text-[10px] tracking-wider font-bold bg-[#F5C518] text-[#171A1E] px-2.5 py-1 rounded-md shadow-lg whitespace-nowrap">
                  CLICK TO CONNECT
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* 4. EDITORIAL DIVIDER LINE */}
        <div className="w-full h-[1px] bg-[#F5F0E6]/15 mb-16 sm:mb-20" />

        {/* 5. FORM & LOCATION 2-COLUMN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-20">
          
          {/* LEFT: INLINE CONTACT FORM */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7"
          >
            {isSubmitted ? (
              <div className="p-8 sm:p-10 rounded-3xl bg-[#171A1E] border border-[#F5C518]/30 shadow-2xl text-left">
                <div className="w-12 h-12 rounded-full bg-[#F5C518]/15 text-[#F5C518] flex items-center justify-center mb-6 border border-[#F5C518]/30">
                  <CheckCircle2 className="w-6 h-6 text-[#F5C518]" />
                </div>
                <h3
                  style={{ fontFamily: "'Instrument Serif', serif" }}
                  className="text-3xl sm:text-4xl text-[#F5F0E6] font-normal mb-3"
                >
                  Message Sent Successfully.
                </h3>
                <p className="text-[#E5DED2]/80 text-base sm:text-lg leading-relaxed mb-8 max-w-md">
                  Thank you for getting in touch! I'll review your notes and respond within 24 to 48 hours.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="px-6 py-3 rounded-full bg-[#F5F0E6]/10 hover:bg-[#F5F0E6]/20 text-[#F5F0E6] font-mono text-xs uppercase tracking-widest font-semibold transition-colors border border-[#F5F0E6]/20"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                  {/* Name Input */}
                  <div className="space-y-2">
                    <label className="block font-mono text-xs tracking-wider text-[#F5F0E6]/70 uppercase font-medium">
                      YOUR NAME <span className="text-[#F5C518]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Appleseed"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#171A1E]/80 border border-[#F5F0E6]/15 rounded-xl px-4 py-3.5 text-[#F5F0E6] placeholder-[#F5F0E6]/30 text-sm focus:outline-none focus:border-[#F5C518] focus:ring-1 focus:ring-[#F5C518] transition-all font-sans"
                    />
                  </div>

                  {/* Email Input */}
                  <div className="space-y-2">
                    <label className="block font-mono text-xs tracking-wider text-[#F5F0E6]/70 uppercase font-medium">
                      EMAIL ADDRESS <span className="text-[#F5C518]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="you@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#171A1E]/80 border border-[#F5F0E6]/15 rounded-xl px-4 py-3.5 text-[#F5F0E6] placeholder-[#F5F0E6]/30 text-sm focus:outline-none focus:border-[#F5C518] focus:ring-1 focus:ring-[#F5C518] transition-all font-sans"
                    />
                  </div>
                </div>

                {/* Subject Input */}
                <div className="space-y-2">
                  <label className="block font-mono text-xs tracking-wider text-[#F5F0E6]/70 uppercase font-medium">
                    PROJECT / SUBJECT
                  </label>
                  <input
                    type="text"
                    placeholder="AI System Development / Full-Time Role"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-[#171A1E]/80 border border-[#F5F0E6]/15 rounded-xl px-4 py-3.5 text-[#F5F0E6] placeholder-[#F5F0E6]/30 text-sm focus:outline-none focus:border-[#F5C518] focus:ring-1 focus:ring-[#F5C518] transition-all font-sans"
                  />
                </div>

                {/* Message Textarea */}
                <div className="space-y-2">
                  <label className="block font-mono text-xs tracking-wider text-[#F5F0E6]/70 uppercase font-medium">
                    MESSAGE <span className="text-[#F5C518]">*</span>
                  </label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Tell me about your vision, timeline, or requirements..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-[#171A1E]/80 border border-[#F5F0E6]/15 rounded-xl p-4 text-[#F5F0E6] placeholder-[#F5F0E6]/30 text-sm focus:outline-none focus:border-[#F5C518] focus:ring-1 focus:ring-[#F5C518] transition-all resize-none font-sans"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#F5C518] hover:bg-[#FFD21F] text-[#1A1D21] font-mono text-xs sm:text-sm font-bold tracking-wider uppercase transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-[#F5C518]/10 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#1A1D21]" />
                      <span>SENDING MESSAGE...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-[#1A1D21] group-hover:translate-x-0.5 transition-transform" />
                      <span>SEND MESSAGE</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>

          {/* RIGHT: LOCATION, TIMEZONE & CHANNELS CARD */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="p-8 sm:p-10 rounded-3xl bg-[#171A1E]/90 border border-[#F5F0E6]/10 space-y-8 backdrop-blur-sm">
              <div>
                <span className="font-mono text-xs tracking-widest text-[#F5C518] uppercase font-semibold block mb-4">
                  LOCATION &amp; TIMEZONE
                </span>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3.5">
                    <MapPin className="w-5 h-5 text-[#F5C518] flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-[#F5F0E6] font-semibold text-base">Hyderabad, India</h4>
                      <p className="font-mono text-xs text-[#F5F0E6]/50 mt-0.5">Open for Global Remote &amp; Relocation</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <Clock className="w-5 h-5 text-[#F5C518] flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-[#F5F0E6] font-semibold text-base">IST (UTC +5:30)</h4>
                      <p className="font-mono text-xs text-[#F5F0E6]/50 mt-0.5">Flexible overlap for US &amp; EU timezones</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* STATUS INDICATOR */}
              <div className="p-4 rounded-2xl bg-[#20252A] border border-[#F5F0E6]/10 flex items-center gap-3">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#10B981]" />
                </span>
                <span className="font-mono text-xs text-[#F5F0E6]/80 tracking-wide font-medium">
                  AVAILABLE FOR FULL-TIME ROLES &amp; AI ENGINEERING OPPORTUNITIES
                </span>
              </div>

              {/* DIRECT CHANNELS */}
              <div>
                <span className="font-mono text-xs tracking-widest text-[#F5F0E6]/50 uppercase font-semibold block mb-4">
                  DIRECT CHANNELS
                </span>
                
                <div className="flex flex-wrap gap-3">
                  <a
                    href="https://github.com/ToshitSai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#20252A] hover:bg-[#F5C518] hover:text-[#171A1E] text-[#F5F0E6] font-mono text-xs tracking-wider transition-all duration-300 border border-[#F5F0E6]/10 font-semibold"
                  >
                    <Github className="w-4 h-4" />
                    <span>GitHub ↗</span>
                  </a>

                  <a
                    href="https://www.linkedin.com/in/toshit-sai-galam-177788276/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#20252A] hover:bg-[#F5C518] hover:text-[#171A1E] text-[#F5F0E6] font-mono text-xs tracking-wider transition-all duration-300 border border-[#F5F0E6]/10 font-semibold"
                  >
                    <Linkedin className="w-4 h-4" />
                    <span>LinkedIn ↗</span>
                  </a>

                  <button
                    onClick={() => setIsResumeModalOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#20252A] hover:bg-[#F5C518] hover:text-[#171A1E] text-[#F5F0E6] font-mono text-xs tracking-wider transition-all duration-300 border border-[#F5F0E6]/10 font-semibold"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Resume Viewer ↗</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 6. BOTTOM FOOTER COPYRIGHT & BACK TO TOP */}
        <div className="pt-8 border-t border-[#F5F0E6]/10 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-[#F5F0E6]/50">
          <p>© 2026 Toshit Sai Galam • Built in Hyderabad, India</p>
          
          <button
            onClick={scrollToTop}
            className="hover:text-[#F5C518] transition-colors flex items-center gap-1 uppercase tracking-widest font-semibold"
          >
            <span>BACK TO TOP</span>
            <span>↑</span>
          </button>
        </div>
      </div>

      {/* 7. SLIDE-OVER DRAWER CONTACT FORM */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000]"
            />

            {/* Slide-over Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-lg bg-[#171A1E] text-[#F5F0E6] border-l border-[#F5F0E6]/15 z-[1001] p-8 sm:p-12 overflow-y-auto shadow-2xl flex flex-col justify-between"
            >
              <div>
                {/* Header & Close */}
                <div className="flex items-center justify-between pb-6 border-b border-[#F5F0E6]/10 mb-8">
                  <div className="flex items-center gap-2 font-mono text-xs text-[#F5C518] uppercase tracking-widest font-semibold">
                    <span className="w-2 h-2 rounded-full bg-[#F5C518]" />
                    <span>AVAILABLE FOR NEW PROJECTS</span>
                  </div>
                  <button
                    onClick={() => setIsDrawerOpen(false)}
                    className="w-9 h-9 rounded-full bg-[#20252A] hover:bg-[#F5C518] hover:text-[#171A1E] text-[#F5F0E6] flex items-center justify-center transition-colors border border-[#F5F0E6]/10"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <h2
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  className="text-3xl sm:text-4xl font-bold mb-4 text-[#F5F0E6]"
                >
                  Let's connect.
                </h2>
                <p className="text-[#E5DED2]/70 text-sm leading-relaxed mb-8">
                  Tell me what you're building — a product, a research idea, a role worth exploring. I'll write back within 48 hours.
                </p>

                {/* Form inside Drawer */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="block font-mono text-xs text-[#F5F0E6]/60 uppercase">YOUR NAME *</label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Appleseed"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#20252A] border border-[#F5F0E6]/15 rounded-xl p-3.5 text-[#F5F0E6] placeholder-[#F5F0E6]/30 text-sm focus:border-[#F5C518] outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block font-mono text-xs text-[#F5F0E6]/60 uppercase">EMAIL ADDRESS *</label>
                    <input
                      type="email"
                      required
                      placeholder="you@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#20252A] border border-[#F5F0E6]/15 rounded-xl p-3.5 text-[#F5F0E6] placeholder-[#F5F0E6]/30 text-sm focus:border-[#F5C518] outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block font-mono text-xs text-[#F5F0E6]/60 uppercase">WHAT ARE WE BUILDING? *</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="A few lines about your project, timeline, or budget..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-[#20252A] border border-[#F5F0E6]/15 rounded-xl p-3.5 text-[#F5F0E6] placeholder-[#F5F0E6]/30 text-sm focus:border-[#F5C518] outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-full bg-[#F5C518] text-[#171A1E] font-mono text-sm font-bold tracking-wider uppercase hover:bg-[#FFD21F] transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    <span>Send it over ✉</span>
                  </button>
                </form>
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
