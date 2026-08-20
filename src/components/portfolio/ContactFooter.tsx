import React, { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Mail, ArrowUpRight, Send, CheckCircle2, MapPin, Clock, Github, Linkedin, FileText, Loader2 } from "lucide-react";
import ResumeModal from "./ResumeModal";

const ContactFooter: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

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

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-24 sm:pt-32 pb-16 relative z-10">
        
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

        {/* 2. HEADLINE & EMAIL CTA COMPOSITION */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 lg:gap-16 mb-12 sm:mb-16">
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
              <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-[#1A1D21] transition-transform group-hover:scale-110" />
              <span>IAMTOSHITSAI@GMAIL.COM</span>
              <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#1A1D21] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>
          </motion.div>
        </div>

        {/* 3. DIVIDER */}
        <motion.hr
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="border-none border-t border-[#F5F0E6]/18 my-12 sm:my-16 origin-left"
        />

        {/* 4. MAIN FORM & LOCATION INFO GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* CONTACT FORM AREA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7"
          >
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name Input */}
                  <div className="space-y-2">
                    <label htmlFor="form-name" className="block font-mono text-xs tracking-wider text-[#A8A196] uppercase">
                      YOUR NAME <span className="text-[#F5C518]">*</span>
                    </label>
                    <input
                      id="form-name"
                      type="text"
                      placeholder="Jane Appleseed"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#171A1E]/80 border border-[#F5F0E6]/15 rounded-xl px-5 py-4 text-[#F5F0E6] placeholder-[#7E786E] font-sans text-base focus:outline-none focus:border-[#F5C518] focus:ring-1 focus:ring-[#F5C518] transition-all duration-200"
                    />
                  </div>

                  {/* Email Input */}
                  <div className="space-y-2">
                    <label htmlFor="form-email" className="block font-mono text-xs tracking-wider text-[#A8A196] uppercase">
                      EMAIL ADDRESS <span className="text-[#F5C518]">*</span>
                    </label>
                    <input
                      id="form-email"
                      type="email"
                      placeholder="you@company.com"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#171A1E]/80 border border-[#F5F0E6]/15 rounded-xl px-5 py-4 text-[#F5F0E6] placeholder-[#7E786E] font-sans text-base focus:outline-none focus:border-[#F5C518] focus:ring-1 focus:ring-[#F5C518] transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Subject Input */}
                <div className="space-y-2">
                  <label htmlFor="form-subject" className="block font-mono text-xs tracking-wider text-[#A8A196] uppercase">
                    PROJECT / SUBJECT
                  </label>
                  <input
                    id="form-subject"
                    type="text"
                    placeholder="AI System Development / Full-Time Role"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-[#171A1E]/80 border border-[#F5F0E6]/15 rounded-xl px-5 py-4 text-[#F5F0E6] placeholder-[#7E786E] font-sans text-base focus:outline-none focus:border-[#F5C518] focus:ring-1 focus:ring-[#F5C518] transition-all duration-200"
                  />
                </div>

                {/* Message Textarea */}
                <div className="space-y-2">
                  <label htmlFor="form-message" className="block font-mono text-xs tracking-wider text-[#A8A196] uppercase">
                    MESSAGE <span className="text-[#F5C518]">*</span>
                  </label>
                  <textarea
                    id="form-message"
                    rows={5}
                    placeholder="Tell me about your vision, timeline, or requirements..."
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-[#171A1E]/80 border border-[#F5F0E6]/15 rounded-xl px-5 py-4 text-[#F5F0E6] placeholder-[#7E786E] font-sans text-base focus:outline-none focus:border-[#F5C518] focus:ring-1 focus:ring-[#F5C518] transition-all duration-200 resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#F5C518] hover:bg-[#FFD21F] text-[#1A1D21] font-mono text-xs sm:text-sm uppercase font-bold tracking-widest transition-all duration-300 hover:-translate-y-0.5 shadow-lg shadow-[#F5C518]/20 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#1A1D21]" />
                      <span>SENDING MESSAGE...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-[#1A1D21]" />
                      <span>SEND MESSAGE</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#171A1E]/90 border border-[#F5C518]/40 rounded-2xl p-8 sm:p-10 space-y-6 text-left"
              >
                <div className="w-12 h-12 rounded-full bg-[#F5C518]/15 border border-[#F5C518]/50 flex items-center justify-center text-[#F5C518]">
                  <CheckCircle2 className="w-6 h-6 text-[#F5C518]" />
                </div>
                <div>
                  <h3
                    style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
                    className="text-3xl sm:text-4xl text-[#F5F0E6] font-normal mb-2"
                  >
                    Message Sent Successfully.
                  </h3>
                  <p className="text-[#E5DED2]/80 text-base leading-relaxed max-w-md">
                    Thank you for getting in touch! I'll review your notes and respond within 24 to 48 hours.
                  </p>
                </div>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-[#F5C518] hover:text-[#1A1D21] text-[#F5F0E6] font-mono text-xs uppercase tracking-wider transition-all duration-200 font-semibold"
                >
                  <span>Send another message</span>
                </button>
              </motion.div>
            )}
          </motion.div>

          {/* LOCATION & TIMEZONE / INFORMATION AREA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 space-y-8"
          >
            <div className="bg-[#171A1E]/80 border border-[#F5F0E6]/12 rounded-2xl p-7 sm:p-9 space-y-8">
              
              {/* Location & Timezone Header */}
              <div>
                <div className="font-mono text-xs tracking-[0.18em] text-[#F5C518] uppercase font-semibold mb-4">
                  LOCATION &amp; TIMEZONE
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#F5C518] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-sans text-lg font-semibold text-[#F5F0E6]">Hyderabad, India</div>
                      <div className="font-mono text-xs text-[#A8A196]">Open for Global Remote &amp; Relocation</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-[#F5C518] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-sans text-lg font-semibold text-[#F5F0E6]">IST (UTC +5:30)</div>
                      <div className="font-mono text-xs text-[#A8A196]">Flexible overlap for US &amp; EU timezones</div>
                    </div>
                  </div>
                </div>
              </div>

              <hr className="border-none border-t border-[#F5F0E6]/10" />

              {/* Status Indicator */}
              <div className="flex items-center gap-3 bg-[#20252A] border border-[#F5C518]/25 p-4 rounded-xl">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse shrink-0" />
                <span className="font-mono text-xs text-[#E5DED2] tracking-wider uppercase">
                  Available for Full-time Roles &amp; AI Engineering Opportunities
                </span>
              </div>

              {/* Quick Connect Links */}
              <div>
                <div className="font-mono text-xs tracking-[0.18em] text-[#A8A196] uppercase mb-4">
                  DIRECT CHANNELS
                </div>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="https://github.com/ToshitSai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[#F5F0E6] hover:bg-[#F5C518] hover:text-[#1A1D21] hover:border-[#F5C518] font-mono text-xs tracking-wider transition-all duration-200"
                  >
                    <Github className="w-4 h-4" />
                    <span>GitHub ↗</span>
                  </a>

                  <a
                    href="https://www.linkedin.com/in/toshit-sai-galam-177788276/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[#F5F0E6] hover:bg-[#F5C518] hover:text-[#1A1D21] hover:border-[#F5C518] font-mono text-xs tracking-wider transition-all duration-200"
                  >
                    <Linkedin className="w-4 h-4" />
                    <span>LinkedIn ↗</span>
                  </a>

                  <button
                    onClick={() => setIsResumeModalOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[#F5F0E6] hover:bg-[#F5C518] hover:text-[#1A1D21] hover:border-[#F5C518] font-mono text-xs tracking-wider transition-all duration-200"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Resume Viewer ↗</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 5. BOTTOM FOOTER BAR */}
        <div className="mt-20 pt-8 border-t border-[#F5F0E6]/10 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-[#A8A196]">
          <span>© {new Date().getFullYear()} Toshit Sai Galam · Built in Hyderabad, India</span>
          <button
            onClick={scrollToTop}
            className="hover:text-[#F5C518] transition-colors flex items-center gap-1 uppercase tracking-wider"
          >
            <span>Back to Top</span>
            <span>↑</span>
          </button>
        </div>
      </div>

      {/* RESUME MODAL */}
      <ResumeModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
      />
    </footer>
  );
};

export default ContactFooter;

