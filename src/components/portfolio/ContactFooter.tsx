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
      style={{ backgroundColor: "#F3EEE2", color: "#1B1B18" }}
      className="relative w-full overflow-hidden select-none z-20 font-sans border-t border-[#1B1B18]/10"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-16 sm:pt-24 pb-16 relative z-10">
        
        {/* 1. TOP METADATA BAR */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-6 border-b border-[#1B1B18]/10 font-mono text-xs text-[#1B1B18]/70"
        >
          <div className="flex items-center gap-2 font-semibold">
            <span>📍 HYDERABAD, IN</span>
            <span className="text-[#1B1B18]/30">•</span>
            <span>IST (UTC +5:30)</span>
          </div>

          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#1B1B18]/5 border border-[#1B1B18]/10">
            <span className="w-5 h-5 rounded-full bg-[#1B1B18] text-[#F3EEE2] text-[10px] font-bold flex items-center justify-center">
              TS
            </span>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D9A62C] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D9A62C]" />
            </span>
            <span className="font-semibold text-[#1B1B18] tracking-tight">Available for work</span>
          </div>
        </motion.div>

        {/* 2. HERO HEADLINE & LEDE */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 lg:gap-16 mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl space-y-4"
          >
            <p className="text-[#1B1B18]/75 text-base sm:text-lg md:text-xl leading-relaxed max-w-[620px]">
              From early prototypes to production systems, I help teams ship AI-powered products that are fast, thoughtful, and built to scale.
            </p>

            <div className="relative inline-block pt-2">
              <h1
                style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
                className="text-[clamp(38px,5.5vw,84px)] font-bold leading-[0.95] tracking-[-0.03em] text-[#1B1B18]"
              >
                Let's build your next system
              </h1>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : {}}
                transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="h-1.5 bg-[#D9A62C] w-full mt-3 origin-left rounded-full"
              />
            </div>
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
              className="group inline-flex items-center justify-center gap-3 w-full lg:w-auto px-7 py-4 sm:px-9 sm:py-5 rounded-full bg-[#1B1B18] hover:bg-[#20252A] text-[#F3EEE2] font-mono text-xs sm:text-sm font-bold tracking-wider uppercase transition-all duration-300 transform hover:-translate-y-1 shadow-xl border border-[#1B1B18]"
            >
              <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-[#D9A62C] group-hover:rotate-6 transition-transform" />
              <span>IAMTOSHITSAI@GMAIL.COM</span>
              <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#D9A62C] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>
          </motion.div>
        </div>

        {/* 3. INTERACTIVE SYSTEM NODE DIAGRAM STAGE */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 rounded-3xl bg-[#F9F6F0] border border-[#1B1B18]/15 p-6 sm:p-10 relative overflow-hidden shadow-sm"
        >
          <div className="flex items-center justify-between mb-4 font-mono text-xs text-[#1B1B18]/70 tracking-widest uppercase">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#D9A62C]" />
              <span className="font-semibold text-[#1B1B18]">FIG 02. LIVE SYSTEM NODE</span>
            </div>
            <span className="text-[#1B1B18]/50 hidden sm:inline">CLICK NODE TO OPEN DRAWER</span>
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
            <div className="absolute top-4 left-4 w-5 h-5 border-t-2 border-l-2 border-[#1B1B18]/30" />
            <div className="absolute bottom-4 right-4 w-5 h-5 border-b-2 border-r-2 border-[#1B1B18]/30" />

            {/* SVG Orbit Diagram */}
            <svg width="620" height="380" viewBox="0 0 620 380" className="w-full max-w-[620px] h-auto overflow-visible">
              <circle cx="310" cy="190" r="80" fill="none" stroke="rgba(27,27,24,0.15)" strokeWidth="1" />
              <circle cx="310" cy="190" r="140" fill="none" stroke="rgba(27,27,24,0.15)" strokeWidth="1" strokeDasharray="4 6" />

              {/* Spokes */}
              <line x1="310" y1="190" x2="230" y2="90" stroke="rgba(27,27,24,0.2)" strokeWidth="1" />
              <line x1="310" y1="190" x2="400" y2="80" stroke="rgba(27,27,24,0.2)" strokeWidth="1" />
              <line x1="310" y1="190" x2="150" y2="190" stroke="rgba(27,27,24,0.2)" strokeWidth="1" />
              <line x1="310" y1="190" x2="470" y2="190" stroke="rgba(27,27,24,0.2)" strokeWidth="1" />
              <line x1="310" y1="190" x2="210" y2="290" stroke="rgba(27,27,24,0.2)" strokeWidth="1" />
              <line x1="310" y1="190" x2="410" y2="285" stroke="rgba(27,27,24,0.2)" strokeWidth="1" />

              {/* Nodes */}
              <circle cx="230" cy="90" r="6" stroke="#1B1B18" strokeWidth="1.5" className={`transition-all duration-300 ${isHoveringStage ? "fill-[#D9A62C]" : "fill-[#F3EEE2]"}`} />
              <circle cx="400" cy="80" r="6" stroke="#1B1B18" strokeWidth="1.5" className={`transition-all duration-300 ${isHoveringStage ? "fill-[#D9A62C]" : "fill-[#F3EEE2]"}`} />
              <circle cx="150" cy="190" r="6" stroke="#1B1B18" strokeWidth="1.5" className={`transition-all duration-300 ${isHoveringStage ? "fill-[#D9A62C]" : "fill-[#F3EEE2]"}`} />
              <circle cx="470" cy="190" r="6" stroke="#1B1B18" strokeWidth="1.5" className={`transition-all duration-300 ${isHoveringStage ? "fill-[#D9A62C]" : "fill-[#F3EEE2]"}`} />
              <circle cx="210" cy="290" r="6" stroke="#1B1B18" strokeWidth="1.5" className={`transition-all duration-300 ${isHoveringStage ? "fill-[#D9A62C]" : "fill-[#F3EEE2]"}`} />
              <circle cx="410" cy="285" r="6" stroke="#1B1B18" strokeWidth="1.5" className={`transition-all duration-300 ${isHoveringStage ? "fill-[#D9A62C]" : "fill-[#F3EEE2]"}`} />

              <text x="310" y="35" textAnchor="middle" className="font-mono text-[11px] tracking-[0.2em] fill-[#1B1B18]/50">
                AI · SYSTEMS · DESIGN
              </text>

              {/* Center Core Node */}
              <circle cx="310" cy="190" r="18" fill="none" stroke="rgba(217,166,44,0.5)" strokeWidth="1.5" className="animate-ping origin-center" />
              <circle cx="310" cy="190" r="12" fill="#D9A62C" stroke="#1B1B18" strokeWidth="2" className={`transition-transform duration-300 origin-center ${isHoveringStage ? "scale-125" : "scale-100"}`} />
            </svg>

            {/* Rising Particles */}
            {isHoveringStage && (
              <>
                <div className="absolute w-2 h-2 rounded-full bg-[#D9A62C] animate-ping pointer-events-none" style={{ left: "50%", top: "45%" }} />
                <div className="absolute w-1.5 h-1.5 rounded-full bg-[#D9A62C] animate-ping pointer-events-none" style={{ left: "48%", top: "52%" }} />
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
                <span className="font-mono text-[10px] tracking-wider font-bold bg-[#D9A62C] text-[#1B1B18] px-2.5 py-1 rounded-md shadow-md whitespace-nowrap">
                  CLICK TO CONNECT
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* 4. DIVIDER LINE */}
        <div className="w-full h-[1px] bg-[#1B1B18]/15 mb-16 sm:mb-20" />

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
              <div className="p-8 sm:p-10 rounded-3xl bg-[#F9F6F0] border border-[#D9A62C] shadow-lg text-left">
                <div className="w-12 h-12 rounded-full bg-[#D9A62C]/20 text-[#1B1B18] flex items-center justify-center mb-6 border border-[#D9A62C]">
                  <CheckCircle2 className="w-6 h-6 text-[#1B1B18]" />
                </div>
                <h3
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  className="text-3xl sm:text-4xl text-[#1B1B18] font-bold mb-3"
                >
                  Message Sent Successfully.
                </h3>
                <p className="text-[#1B1B18]/75 text-base sm:text-lg leading-relaxed mb-8 max-w-md">
                  Thank you for getting in touch! I'll review your notes and respond within 24 to 48 hours.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="px-6 py-3 rounded-full bg-[#1B1B18] text-[#F3EEE2] font-mono text-xs uppercase tracking-widest font-semibold transition-colors border border-[#1B1B18]"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                  {/* Name Input */}
                  <div className="space-y-2">
                    <label className="block font-mono text-xs tracking-wider text-[#1B1B18]/80 uppercase font-medium">
                      YOUR NAME <span className="text-[#D9A62C]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Appleseed"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#F9F6F0] border border-[#1B1B18]/20 rounded-xl px-4 py-3.5 text-[#1B1B18] placeholder-[#1B1B18]/40 text-sm focus:outline-none focus:border-[#1B1B18] focus:ring-1 focus:ring-[#1B1B18] transition-all font-sans"
                    />
                  </div>

                  {/* Email Input */}
                  <div className="space-y-2">
                    <label className="block font-mono text-xs tracking-wider text-[#1B1B18]/80 uppercase font-medium">
                      EMAIL ADDRESS <span className="text-[#D9A62C]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="you@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#F9F6F0] border border-[#1B1B18]/20 rounded-xl px-4 py-3.5 text-[#1B1B18] placeholder-[#1B1B18]/40 text-sm focus:outline-none focus:border-[#1B1B18] focus:ring-1 focus:ring-[#1B1B18] transition-all font-sans"
                    />
                  </div>
                </div>

                {/* Subject Input */}
                <div className="space-y-2">
                  <label className="block font-mono text-xs tracking-wider text-[#1B1B18]/80 uppercase font-medium">
                    PROJECT / SUBJECT
                  </label>
                  <input
                    type="text"
                    placeholder="AI System Development / Full-Time Role"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-[#F9F6F0] border border-[#1B1B18]/20 rounded-xl px-4 py-3.5 text-[#1B1B18] placeholder-[#1B1B18]/40 text-sm focus:outline-none focus:border-[#1B1B18] focus:ring-1 focus:ring-[#1B1B18] transition-all font-sans"
                  />
                </div>

                {/* Message Textarea */}
                <div className="space-y-2">
                  <label className="block font-mono text-xs tracking-wider text-[#1B1B18]/80 uppercase font-medium">
                    MESSAGE <span className="text-[#D9A62C]">*</span>
                  </label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Tell me about your vision, timeline, or requirements..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-[#F9F6F0] border border-[#1B1B18]/20 rounded-xl p-4 text-[#1B1B18] placeholder-[#1B1B18]/40 text-sm focus:outline-none focus:border-[#1B1B18] focus:ring-1 focus:ring-[#1B1B18] transition-all resize-none font-sans"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#1B1B18] hover:bg-[#20252A] text-[#F3EEE2] font-mono text-xs sm:text-sm font-bold tracking-wider uppercase transition-all duration-300 transform hover:-translate-y-0.5 shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#D9A62C]" />
                      <span>SENDING MESSAGE...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-[#D9A62C] group-hover:translate-x-0.5 transition-transform" />
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
            <div className="p-8 sm:p-10 rounded-3xl bg-[#F9F6F0] border border-[#1B1B18]/15 space-y-8 shadow-sm">
              <div>
                <span className="font-mono text-xs tracking-widest text-[#D9A62C] uppercase font-bold block mb-4">
                  LOCATION &amp; TIMEZONE
                </span>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3.5">
                    <MapPin className="w-5 h-5 text-[#1B1B18] flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-[#1B1B18] font-bold text-base">Hyderabad, India</h4>
                      <p className="font-mono text-xs text-[#1B1B18]/60 mt-0.5">Open for Global Remote &amp; Relocation</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <Clock className="w-5 h-5 text-[#1B1B18] flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-[#1B1B18] font-bold text-base">IST (UTC +5:30)</h4>
                      <p className="font-mono text-xs text-[#1B1B18]/60 mt-0.5">Flexible overlap for US &amp; EU timezones</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* STATUS INDICATOR */}
              <div className="p-4 rounded-2xl bg-[#F3EEE2] border border-[#1B1B18]/15 flex items-center gap-3">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#10B981]" />
                </span>
                <span className="font-mono text-xs text-[#1B1B18] tracking-wide font-semibold">
                  AVAILABLE FOR FULL-TIME ROLES &amp; AI ENGINEERING OPPORTUNITIES
                </span>
              </div>

              {/* DIRECT CHANNELS */}
              <div>
                <span className="font-mono text-xs tracking-widest text-[#1B1B18]/60 uppercase font-bold block mb-4">
                  DIRECT CHANNELS
                </span>
                
                <div className="flex flex-wrap gap-3">
                  <a
                    href="https://github.com/ToshitSai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1B1B18] hover:bg-[#D9A62C] hover:text-[#1B1B18] text-[#F3EEE2] font-mono text-xs tracking-wider transition-all duration-300 font-semibold"
                  >
                    <Github className="w-4 h-4" />
                    <span>GitHub ↗</span>
                  </a>

                  <a
                    href="https://www.linkedin.com/in/toshit-sai-galam-177788276/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1B1B18] hover:bg-[#D9A62C] hover:text-[#1B1B18] text-[#F3EEE2] font-mono text-xs tracking-wider transition-all duration-300 font-semibold"
                  >
                    <Linkedin className="w-4 h-4" />
                    <span>LinkedIn ↗</span>
                  </a>

                  <button
                    onClick={() => setIsResumeModalOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1B1B18] hover:bg-[#D9A62C] hover:text-[#1B1B18] text-[#F3EEE2] font-mono text-xs tracking-wider transition-all duration-300 font-semibold"
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
        <div className="pt-8 border-t border-[#1B1B18]/15 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-[#1B1B18]/60">
          <p>Built by Toshit Sai · Hyderabad, India @2026</p>
          
          <button
            onClick={scrollToTop}
            className="hover:text-[#D9A62C] transition-colors flex items-center gap-1 uppercase tracking-widest font-semibold"
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
