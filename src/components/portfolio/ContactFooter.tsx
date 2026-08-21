import React, { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Send, CheckCircle2, Loader2, X, ExternalLink, ArrowUp, Twitter, Github, Linkedin } from "lucide-react";
import { toast } from "sonner";
import ResumeModal from "./ResumeModal";

const ContactFooter: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // System Node hover & cursor tracking state
  const [isHoveringStage, setIsHoveringStage] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    setCursorPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    website: "", // Anti-Spam Honeypot Field
  });

  const [formErrors, setFormErrors] = useState<{
    name?: string;
    email?: string;
    message?: string;
  }>({});

  const [lastSubmittedData, setLastSubmittedData] = useState<{
    name: string;
    email: string;
    message: string;
  } | null>(null);

  const [copied, setCopied] = useState(false);

  const validateForm = () => {
    const errors: { name?: string; email?: string; message?: string } = {};
    if (!formData.name.trim()) {
      errors.name = "Your name is required.";
    } else if (formData.name.trim().length > 100) {
      errors.name = "Name cannot exceed 100 characters.";
    }

    if (!formData.email.trim()) {
      errors.email = "Email address is required.";
    } else if (formData.email.trim().length > 254) {
      errors.email = "Email cannot exceed 254 characters.";
    } else {
      const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
      if (!emailRegex.test(formData.email.trim())) {
        errors.email = "Please enter a valid email address.";
      }
    }

    if (!formData.message.trim()) {
      errors.message = "Message cannot be empty.";
    } else if (formData.message.trim().length > 5000) {
      errors.message = "Message cannot exceed 5000 characters.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSendError(null);

    if (!validateForm()) {
      toast.error("Please fix the errors in the form before submitting.");
      return;
    }

    setIsSubmitting(true);
    const submittedDetails = { ...formData };
    setLastSubmittedData(submittedDetails);

    const minAnimationDuration = new Promise((resolve) => setTimeout(resolve, 900));

    try {
      const apiPromise = fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          subject: `Portfolio Inquiry from ${formData.name.trim()}`,
          message: formData.message.trim(),
          website: formData.website,
        }),
      });

      const [response] = await Promise.all([apiPromise, minAnimationDuration]);
      const data = (await response.json().catch(() => null)) as { success?: boolean; error?: string; message?: string } | null;

      if (response.ok && data?.success) {
        setIsSubmitting(false);
        setIsSubmitted(true);
        setSendError(null);
        setFormErrors({});
        setFormData({ name: "", email: "", message: "", website: "" });
        toast.success("Message dispatched successfully to Toshit!");
      } else {
        const errorMsg =
          data?.error ||
          "Something went wrong while sending your message. Please check your network or try again.";
        console.error("[Form Submission API Error]:", errorMsg);
        setSendError(errorMsg);
        setIsSubmitting(false);
        toast.error(errorMsg);
      }
    } catch (error: unknown) {
      const networkErr = "Network error: Unable to reach contact API server. Please try again.";
      console.error("[Form Submission Network Error]:", error);
      setSendError(networkErr);
      setIsSubmitting(false);
      toast.error(networkErr);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getMailtoUrl = () => {
    const data = lastSubmittedData || formData;
    const subj = encodeURIComponent(`Portfolio Message from ${data.name || "Visitor"}`);
    const body = encodeURIComponent(
      `Hi Toshit,\n\n${data.message || ""}\n\n---\nSender Name: ${data.name || ""}\nSender Email: ${data.email || ""}`
    );
    return `mailto:iamtoshitsai@gmail.com?subject=${subj}&body=${body}`;
  };

  const handleCopyMessage = () => {
    const data = lastSubmittedData || formData;
    const textToCopy = `To: iamtoshitsai@gmail.com\nSubject: Portfolio Inquiry\n\nHi Toshit,\n${data.message}\n\nSender: ${data.name} (${data.email})`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    toast.success("Message template copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <footer
      id="contact"
      ref={ref}
      style={{ backgroundColor: "#F3EEE2", color: "#1B1B18" }}
      className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden select-none z-20 font-sans px-6 sm:px-12 lg:px-20 pt-24 sm:pt-32 pb-10 sm:pb-14"
    >
      {/* ORGANIC WAVE TOP SEPARATOR */}
      <div className="absolute top-0 left-0 right-0 w-full overflow-hidden leading-none z-10 pointer-events-none -translate-y-[99%]">
        <svg
          className="relative block w-full h-8 sm:h-12 md:h-16 text-[#F3EEE2]"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 C150,90 350,-40 500,50 C650,140 900,10 1200,40 L1200,120 L0,120 Z"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* 1. TOP METADATA BAR */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full flex items-center justify-between font-mono text-xs sm:text-sm text-[#1B1B18]/70 font-medium z-10"
      >
        <div className="flex items-center gap-2">
          <span>📍 Based in Hyderabad, India • 17.3850° N, 78.4867° E</span>
        </div>
        <div className="flex items-center gap-2 text-[#1B1B18]/60">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="hidden sm:inline">DIRECT MAIL READY</span>
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
          className="relative inline-block max-w-full mb-6 sm:mb-8"
        >
          <h1
            style={{ fontFamily: "'Instrument Serif', serif" }}
            className="text-[clamp(28px,5vw,76px)] font-normal leading-tight text-[#1B1B18] sm:whitespace-nowrap max-w-full"
          >
            Let's build something thoughtful together
          </h1>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="h-[3px] bg-[#1B1B18] w-full mt-3 origin-center rounded-full"
          />
        </motion.div>

        {/* DIRECT SEND MAIL ACTION BUTTON */}
        <motion.button
          onClick={() => setIsDrawerOpen(true)}
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.96 }}
          transition={{ duration: 0.3 }}
          className="mb-8 px-7 py-3.5 rounded-full bg-[#1B1B18] text-[#F3EEE2] font-mono text-xs uppercase tracking-widest font-bold flex items-center gap-2.5 shadow-xl border border-[#D9A62C]/40 hover:border-[#D9A62C] transition-all group"
        >
          <Send className="w-4 h-4 text-[#D9A62C] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          <span>Send Message Directly ✉</span>
        </motion.button>

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
          className="relative w-full max-w-3xl h-[300px] sm:h-[360px] flex flex-col justify-between items-center cursor-pointer group select-none py-4 px-6 mb-10"
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

        {/* 4. MAIN PAGE "NOT A FAN OF FORMS?" REFERENCE SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.45, ease: "easeOut" }}
          className="w-full max-w-3xl text-left pt-8 border-t border-[#1B1B18]/15"
        >
          <p className="font-mono text-xs sm:text-sm tracking-[0.2em] text-[#85847C] uppercase font-medium mb-3">
            NOT A FAN OF FORMS?
          </p>

          <a
            href="mailto:iamtoshitsai@gmail.com"
            className="inline-block text-2xl sm:text-3xl font-medium text-[#1B1B18] underline underline-offset-4 decoration-[#1B1B18]/40 hover:decoration-[#1B1B18] hover:text-black transition-all mb-6 font-sans break-all sm:break-normal"
          >
            iamtoshitsai@gmail.com
          </a>

          <div className="flex flex-wrap items-center gap-6 sm:gap-8 font-mono text-xs sm:text-sm text-[#85847C]">
            <a
              href="https://www.linkedin.com/in/toshit-sai-galam-177788276/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-[#1B1B18] transition-colors group"
            >
              <span>LinkedIn</span>
              <span className="text-[11px] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
            </a>

            <a
              href="https://github.com/ToshitSai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-[#1B1B18] transition-colors group"
            >
              <span>GitHub</span>
              <span className="text-[11px] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
            </a>

            <a
              href="https://www.instagram.com/toshit.codespace/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-[#1B1B18] transition-colors group"
            >
              <span>Instagram</span>
              <span className="text-[11px] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
            </a>
          </div>
        </motion.div>

      </div>

      {/* 5. BOTTOM FOOTER BAR WITH BACK TO TOP */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs sm:text-sm text-[#1B1B18]/70 pt-6 border-t border-[#1B1B18]/10 z-10"
      >
        <p>© 2026 Toshit Sai Galam • All rights reserved</p>

        <div className="flex items-center gap-5 sm:gap-6 font-medium">
          <a
            href="mailto:iamtoshitsai@gmail.com"
            className="hover:text-[#1B1B18] transition-colors flex items-center gap-1"
          >
            <span>Email</span>
          </a>
          <a
            href="https://github.com/ToshitSai"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#1B1B18] transition-colors flex items-center gap-1"
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>
          <a
            href="https://www.linkedin.com/in/toshit-sai-galam-177788276/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#1B1B18] transition-colors flex items-center gap-1"
          >
            <Linkedin className="w-3.5 h-3.5" />
            <span>LinkedIn</span>
          </a>
          <a
            href="https://x.com/toshitsai"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#1B1B18] transition-colors flex items-center gap-1"
          >
            <Twitter className="w-3.5 h-3.5" />
            <span>X/Twitter</span>
          </a>
          <button
            onClick={() => setIsResumeModalOpen(true)}
            className="hover:text-[#1B1B18] transition-colors"
          >
            Resume
          </button>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1 ml-2 text-[#1B1B18] hover:text-[#D9A62C] transition-colors font-bold uppercase tracking-wider"
            aria-label="Back to top"
          >
            <span>Top</span>
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* 6. SLIDE-OVER CONTACT OVERLAY */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {isDrawerOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setIsDrawerOpen(false)}
                  className="fixed inset-0 bg-[#14120C]/40 backdrop-blur-xs z-[99998]"
                />

                {/* Slide-over Container */}
                <motion.div
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "spring", damping: 28, stiffness: 220 }}
                  className="fixed top-0 right-0 bottom-0 w-full max-w-md sm:max-w-lg lg:max-w-[540px] bg-[#FFFBF3] text-[#1B1B18] border-l border-[#1B1B18]/15 z-[99999] p-6 sm:p-8 lg:p-10 overflow-y-auto shadow-2xl flex flex-col justify-between"
                >
                  <div>
                    {/* TOP SECTION: AVAILABILITY & CIRCULAR CLOSE BUTTON */}
                    <div className="flex items-center justify-between mb-6 sm:mb-8">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        className="flex items-center gap-2 font-mono text-[10px] sm:text-[11px] text-[#85847C] uppercase tracking-[0.18em] font-medium"
                      >
                        <span className="w-2.5 h-2.5 rounded-full bg-[#FFD42A] inline-block shadow-xs animate-pulse" />
                        <span>AVAILABLE FOR NEW PROJECTS</span>
                      </motion.div>

                      {/* CIRCULAR CLOSE BUTTON */}
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        whileHover={{ rotate: 90, scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsDrawerOpen(false)}
                        aria-label="Close contact overlay"
                        className="w-10 h-10 rounded-full border border-[#1B1B18]/15 bg-white/50 text-[#1B1B18] flex items-center justify-center transition-colors hover:bg-white hover:border-[#1B1B18]/30 shadow-xs"
                      >
                        <X className="w-4 h-4 stroke-[1.75]" />
                      </motion.button>
                    </div>

                    {/* MAIN HEADING: "Grow together?" */}
                    <motion.h2
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.15 }}
                      style={{ fontFamily: "'Instrument Serif', serif" }}
                      className="text-3xl sm:text-4xl md:text-[46px] font-normal leading-[1.08] text-[#1B1B18] tracking-tight mb-3"
                    >
                      Grow together?
                    </motion.h2>

                    {/* DESCRIPTION */}
                    <motion.p
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="text-sm sm:text-base text-[#1B1B18]/70 font-sans leading-relaxed max-w-lg mb-6 sm:mb-8"
                    >
                      Tell me what you're growing — a product, a brand, a wild idea. I'll write back within 48 hours.
                    </motion.p>

                    {/* THIN HORIZONTAL DIVIDER */}
                    <motion.div
                      initial={{ opacity: 0, scaleX: 0 }}
                      animate={{ opacity: 1, scaleX: 1 }}
                      transition={{ duration: 0.5, delay: 0.25 }}
                      className="w-full border-b border-[#1B1B18]/15 mb-7 sm:mb-8 origin-left"
                    />

                    {/* FORM CONTENT */}
                    {isSubmitted ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.96, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4 }}
                        className="py-6 space-y-5 text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-full bg-[#1B1B18] text-[#FFF8E8] flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5 stroke-[2.2]" />
                          </div>
                          <div>
                            <h3 className="text-xl font-serif text-[#1B1B18]">Message sent ✓</h3>
                            <p className="text-xs font-mono text-[#85847C]">I'll respond within 48 hours.</p>
                          </div>
                        </div>

                        <p className="text-sm text-[#1B1B18]/80 leading-relaxed font-sans pt-1">
                          Thank you for reaching out! Your message was delivered directly to{" "}
                          <strong className="font-mono text-[#1B1B18]">iamtoshitsai@gmail.com</strong>.
                        </p>

                        <div className="pt-3 flex flex-col sm:flex-row gap-2.5">
                          <button
                            onClick={() => setIsSubmitted(false)}
                            className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[#1B1B18] text-[#FFF8E8] font-mono text-[11px] uppercase font-bold tracking-wider hover:bg-black transition-all"
                          >
                            Send another message
                          </button>
                          <a
                            href={getMailtoUrl()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full border border-[#1B1B18]/20 text-[#1B1B18] font-mono text-[11px] uppercase font-bold tracking-wider hover:border-[#1B1B18] transition-all"
                          >
                            <span>Open Mail App</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                          <button
                            onClick={handleCopyMessage}
                            type="button"
                            className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[#1B1B18]/5 text-[#1B1B18] font-mono text-[11px] uppercase font-bold tracking-wider hover:bg-[#1B1B18]/10 transition-all"
                          >
                            {copied ? "Copied! ✓" : "Copy Template"}
                          </button>
                        </div>
                      </motion.div>
                    ) : (
                      <form onSubmit={handleSubmit} noValidate className="space-y-6 sm:space-y-7">
                        {/* Anti-Spam Honeypot Field */}
                        <div className="hidden opacity-0 pointer-events-none select-none h-0 overflow-hidden" aria-hidden="true" tabIndex={-1}>
                          <label htmlFor="website">Website</label>
                          <input
                            type="text"
                            id="website"
                            name="website"
                            tabIndex={-1}
                            autoComplete="off"
                            value={formData.website}
                            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                          />
                        </div>

                        {/* API Error Banner */}
                        {sendError && (
                          <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 font-mono text-xs leading-relaxed"
                          >
                            <strong>⚠️ Submission Error:</strong> {sendError}
                          </motion.div>
                        )}

                        {/* 1. NAME FIELD (MINIMAL UNDERLINE INPUT) */}
                        <motion.div
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.3 }}
                          className="group"
                        >
                          <label
                            htmlFor="contact-name"
                            className="block font-mono text-[10px] sm:text-[11px] tracking-[0.18em] text-[#85847C] uppercase font-medium mb-1.5"
                          >
                            YOUR NAME
                          </label>
                          <input
                            type="text"
                            id="contact-name"
                            name="name"
                            placeholder="Jane Appleseed"
                            value={formData.name}
                            onChange={(e) => {
                              setFormData({ ...formData, name: e.target.value });
                              if (formErrors.name) setFormErrors({ ...formErrors, name: undefined });
                            }}
                            className={`w-full bg-transparent border-0 border-b ${
                              formErrors.name ? "border-red-500" : "border-[#1B1B18]/20 focus:border-[#1B1B18]"
                            } rounded-none px-0 py-2 sm:py-2.5 text-base sm:text-lg text-[#1B1B18] placeholder:text-[#1B1B18]/30 outline-none transition-colors duration-300`}
                          />
                          {formErrors.name && (
                            <p className="font-mono text-[11px] text-red-600 mt-1">{formErrors.name}</p>
                          )}
                        </motion.div>

                        {/* 2. EMAIL FIELD (MINIMAL UNDERLINE INPUT) */}
                        <motion.div
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.35 }}
                          className="group"
                        >
                          <label
                            htmlFor="contact-email"
                            className="block font-mono text-[10px] sm:text-[11px] tracking-[0.18em] text-[#85847C] uppercase font-medium mb-1.5"
                          >
                            EMAIL
                          </label>
                          <input
                            type="email"
                            id="contact-email"
                            name="email"
                            placeholder="you@company.com"
                            value={formData.email}
                            onChange={(e) => {
                              setFormData({ ...formData, email: e.target.value });
                              if (formErrors.email) setFormErrors({ ...formErrors, email: undefined });
                            }}
                            className={`w-full bg-transparent border-0 border-b ${
                              formErrors.email ? "border-red-500" : "border-[#1B1B18]/20 focus:border-[#1B1B18]"
                            } rounded-none px-0 py-2 sm:py-2.5 text-base sm:text-lg text-[#1B1B18] placeholder:text-[#1B1B18]/30 outline-none transition-colors duration-300`}
                          />
                          {formErrors.email && (
                            <p className="font-mono text-[11px] text-red-600 mt-1">{formErrors.email}</p>
                          )}
                        </motion.div>

                        {/* 3. MESSAGE FIELD (MINIMAL UNDERLINE TEXTAREA) */}
                        <motion.div
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.4 }}
                          className="group"
                        >
                          <label
                            htmlFor="contact-message"
                            className="block font-mono text-[10px] sm:text-[11px] tracking-[0.18em] text-[#85847C] uppercase font-medium mb-1.5"
                          >
                            WHAT ARE WE MAKING?
                          </label>
                          <textarea
                            id="contact-message"
                            name="message"
                            rows={3}
                            placeholder="A few lines about your project, timeline, or budget"
                            value={formData.message}
                            onChange={(e) => {
                              setFormData({ ...formData, message: e.target.value });
                              if (formErrors.message) setFormErrors({ ...formErrors, message: undefined });
                            }}
                            className={`w-full bg-transparent border-0 border-b ${
                              formErrors.message ? "border-red-500" : "border-[#1B1B18]/20 focus:border-[#1B1B18]"
                            } rounded-none px-0 py-2 sm:py-2.5 text-base sm:text-lg text-[#1B1B18] placeholder:text-[#1B1B18]/30 outline-none resize-none transition-colors duration-300`}
                          />
                          {formErrors.message && (
                            <p className="font-mono text-[11px] text-red-600 mt-1">{formErrors.message}</p>
                          )}
                        </motion.div>

                        {/* 4. SUBMIT BUTTON (COMPACT BLACK PILL WITH PURE SVG WHITE ENVELOPE ICON) */}
                        <motion.div
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.45 }}
                          className="pt-2 sm:pt-3"
                        >
                          <motion.button
                            type="submit"
                            disabled={isSubmitting}
                            whileHover={!isSubmitting ? { y: -2, scale: 1.02 } : {}}
                            whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                            className="inline-flex items-center gap-3 bg-[#1B1B18] text-[#FFF8E8] font-sans text-sm font-medium px-6 py-3 rounded-full shadow-md hover:bg-black transition-all group disabled:opacity-75 disabled:cursor-not-allowed"
                          >
                            <span>
                              {isSubmitting ? "Sending..." : isSubmitted ? "Sent ✓" : "Send it over"}
                            </span>

                            {isSubmitting ? (
                              <Loader2 className="w-4 h-4 animate-spin text-[#FFF8E8]" />
                            ) : (
                              <svg
                                className="w-4 h-4 text-[#FFF8E8] group-hover:translate-x-0.5 transition-transform flex-shrink-0"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <rect width="20" height="16" x="2" y="4" rx="2" />
                                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                              </svg>
                            )}
                          </motion.button>
                        </motion.div>
                      </form>
                    )}

                    {/* 5. NOT A FAN OF FORMS? SECTION (MATCHING REFERENCE IMAGE EXACTLY) */}
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
                      className="pt-8 sm:pt-10 mt-8 sm:mt-10 border-t border-[#1B1B18]/15"
                    >
                      <p className="font-mono text-[10px] sm:text-[11px] tracking-[0.2em] text-[#85847C] uppercase font-medium mb-3">
                        NOT A FAN OF FORMS?
                      </p>

                      <a
                        href="mailto:iamtoshitsai@gmail.com"
                        className="inline-block text-xl sm:text-2xl font-medium text-[#1B1B18] underline underline-offset-4 decoration-[#1B1B18]/40 hover:decoration-[#1B1B18] hover:text-black transition-all mb-5 font-sans break-all sm:break-normal"
                      >
                        iamtoshitsai@gmail.com
                      </a>

                      <div className="flex flex-wrap items-center gap-6 sm:gap-8 font-mono text-xs sm:text-sm text-[#85847C]">
                        <a
                          href="https://www.linkedin.com/in/toshit-sai-galam-177788276/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 hover:text-[#1B1B18] transition-colors group"
                        >
                          <span>LinkedIn</span>
                          <span className="text-[11px] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
                        </a>

                        <a
                          href="https://github.com/ToshitSai"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 hover:text-[#1B1B18] transition-colors group"
                        >
                          <span>GitHub</span>
                          <span className="text-[11px] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
                        </a>

                        <a
                          href="https://www.instagram.com/toshit.codespace/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 hover:text-[#1B1B18] transition-colors group"
                        >
                          <span>Instagram</span>
                          <span className="text-[11px] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
                        </a>
                      </div>
                    </motion.div>

                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body
        )}

      {/* RESUME MODAL INTEGRATION */}
      <ResumeModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
      />
    </footer>
  );
};

export default ContactFooter;
