import React, { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Send, CheckCircle2, Loader2, X, Sparkles, Mail, ExternalLink, ArrowUp, Twitter, Github, Linkedin } from "lucide-react";
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
    subject: "",
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
    subject?: string;
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
        errors.email = "Please enter a valid email address (e.g. name@company.com).";
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

    // 1. Client-side Validation
    if (!validateForm()) {
      toast.error("Please fix the errors in the form before submitting.");
      return;
    }

    setIsSubmitting(true);
    const submittedDetails = { ...formData };
    setLastSubmittedData(submittedDetails);

    const minAnimationDuration = new Promise((resolve) => setTimeout(resolve, 1100));

    try {
      // 2. Real Backend API Call to POST /api/contact
      const apiPromise = fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          subject: formData.subject.trim() || `Portfolio Inquiry from ${formData.name.trim()}`,
          message: formData.message.trim(),
          website: formData.website, // Honeypot field sent to backend
        }),
      });

      const [response] = await Promise.all([apiPromise, minAnimationDuration]);
      const data = (await response.json().catch(() => null)) as { success?: boolean; error?: string; message?: string } | null;

      // 3. Process Server Response
      if (response.ok && data?.success) {
        setIsSubmitting(false);
        setIsSubmitted(true);
        setSendError(null);
        setFormErrors({});
        setFormData({ name: "", email: "", subject: "", message: "", website: "" });
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
    const subj = encodeURIComponent(data.subject || `Portfolio Message from ${data.name || "Visitor"}`);
    const body = encodeURIComponent(
      `Hi Toshit,\n\n${data.message || ""}\n\n---\nSender Name: ${data.name || ""}\nSender Email: ${data.email || ""}`
    );
    return `mailto:iamtoshitsai@gmail.com?subject=${subj}&body=${body}`;
  };

  const handleCopyMessage = () => {
    const data = lastSubmittedData || formData;
    const textToCopy = `To: iamtoshitsai@gmail.com\nSubject: ${data.subject || "Portfolio Inquiry"}\n\nHi Toshit,\n${data.message}\n\nSender: ${data.name} (${data.email})`;
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

      {/* 4. BOTTOM FOOTER BAR WITH BACK TO TOP */}
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
            <Mail className="w-3.5 h-3.5 text-[#D9A62C]" />
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

      {/* 5. SLIDE-OVER DRAWER CONTACT FORM (PORTALED) */}
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
                  onClick={() => setIsDrawerOpen(false)}
                  className="fixed inset-0 bg-[#14120C]/40 backdrop-blur-sm z-[99998]"
                />

                {/* Slide-over Drawer */}
                <motion.div
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="fixed top-0 right-0 bottom-0 w-full max-w-lg bg-[#FBF7ED] text-[#1B1B18] border-l border-[#1B1B18]/15 z-[99999] p-8 sm:p-12 overflow-y-auto shadow-2xl flex flex-col justify-between"
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
                      style={{ fontFamily: "'Instrument Serif', serif" }}
                      className="text-3xl sm:text-4xl font-bold mb-4 text-[#1B1B18]"
                    >
                      Let's connect.
                    </h2>
                    <p className="text-[#1B1B18]/70 text-sm leading-relaxed mb-8">
                      Tell me what you're building — a product, a research idea, a role worth exploring. Your message will be sent directly to my personal email (<strong className="text-[#1B1B18]">iamtoshitsai@gmail.com</strong>).
                    </p>

                    {/* Form inside Drawer */}
                    {isSubmitted ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.94, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="p-8 rounded-3xl bg-[#F3EEE2] border-2 border-[#D9A62C]/40 text-left space-y-6 shadow-xl relative overflow-hidden"
                      >
                        {/* Success Header Icon & Sparkle Pill */}
                        <div className="flex items-center justify-between">
                          <motion.div
                            initial={{ scale: 0, rotate: -45 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", damping: 15, stiffness: 200, delay: 0.1 }}
                            className="w-14 h-14 rounded-full bg-[#D9A62C] text-[#1B1B18] flex items-center justify-center shadow-lg"
                          >
                            <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
                          </motion.div>

                          <motion.div
                            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.05, 1] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#D9A62C] bg-[#1B1B18] px-3.5 py-1.5 rounded-full shadow-md"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>DIRECTLY DISPATCHED</span>
                          </motion.div>
                        </div>

                        <div>
                          <motion.h3
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-2xl font-bold text-[#1B1B18] tracking-tight mb-2"
                          >
                            Message sent to Toshit! 🚀
                          </motion.h3>
                          <motion.p
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-sm text-[#1B1B18]/80 leading-relaxed"
                          >
                            Thank you for reaching out! Your message has been sent directly to{" "}
                            <strong className="text-[#1B1B18] font-mono underline decoration-[#D9A62C] underline-offset-2">
                              iamtoshitsai@gmail.com
                            </strong>
                            . I'll read your note and write back to you within 48 hours.
                          </motion.p>
                        </div>

                        {/* Recipient status badge */}
                        <div className="bg-[#1B1B18]/5 rounded-xl p-3.5 border border-[#1B1B18]/10 flex flex-col gap-2">
                          <div className="flex items-center gap-3">
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="font-mono text-xs font-semibold text-[#1B1B18]/80">
                              RECIPIENT: iamtoshitsai@gmail.com
                            </span>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="pt-2 flex flex-col sm:flex-row gap-3">
                          <button
                            onClick={() => setIsSubmitted(false)}
                            className="flex-1 py-3.5 px-4 rounded-full bg-[#1B1B18] text-[#F3EEE2] font-mono text-xs uppercase font-bold tracking-wider hover:bg-[#20252A] transition-all text-center shadow-md"
                          >
                            Send another message
                          </button>
                          <a
                            href={getMailtoUrl()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-3.5 px-4 rounded-full border-2 border-[#1B1B18] text-[#1B1B18] font-mono text-xs uppercase font-bold tracking-wider hover:bg-[#1B1B18] hover:text-[#F3EEE2] transition-all text-center flex items-center justify-center gap-1.5"
                          >
                            <span>Open Mail App</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                          <button
                            onClick={handleCopyMessage}
                            type="button"
                            className="py-3.5 px-4 rounded-full bg-[#D9A62C]/20 border border-[#D9A62C]/50 text-[#1B1B18] font-mono text-xs uppercase font-bold tracking-wider hover:bg-[#D9A62C] transition-all text-center"
                          >
                            {copied ? "Copied! ✓" : "Copy Text"}
                          </button>
                        </div>
                      </motion.div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                        {/* Anti-Spam Honeypot Field (Hidden from legitimate users) */}
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

                        {/* API Submission Error Banner */}
                        {sendError && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-700 text-xs font-mono leading-relaxed flex items-start gap-2.5"
                          >
                            <span className="font-bold">⚠️</span>
                            <div>
                              <p className="font-bold mb-0.5">Submission Failed</p>
                              <p>{sendError}</p>
                            </div>
                          </motion.div>
                        )}

                        {/* Name Field */}
                        <div className="space-y-1.5">
                          <label className="block font-mono text-xs text-[#1B1B18]/80 uppercase font-semibold">
                            YOUR NAME <span className="text-red-500">*</span>
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
                            className={`w-full bg-[#F3EEE2] border ${formErrors.name ? "border-red-500 ring-1 ring-red-500/50" : "border-[#1B1B18]/20"
                              } rounded-xl p-3.5 text-[#1B1B18] placeholder-[#1B1B18]/40 text-sm focus:border-[#1B1B18] outline-none transition-all focus:ring-2 focus:ring-[#D9A62C]/40`}
                          />
                          {formErrors.name && (
                            <p className="font-mono text-[11px] text-red-600 font-medium">{formErrors.name}</p>
                          )}
                        </div>

                        {/* Email Field */}
                        <div className="space-y-1.5">
                          <label className="block font-mono text-xs text-[#1B1B18]/80 uppercase font-semibold">
                            EMAIL ADDRESS <span className="text-red-500">*</span>
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
                            className={`w-full bg-[#F3EEE2] border ${formErrors.email ? "border-red-500 ring-1 ring-red-500/50" : "border-[#1B1B18]/20"
                              } rounded-xl p-3.5 text-[#1B1B18] placeholder-[#1B1B18]/40 text-sm focus:border-[#1B1B18] outline-none transition-all focus:ring-2 focus:ring-[#D9A62C]/40`}
                          />
                          {formErrors.email && (
                            <p className="font-mono text-[11px] text-red-600 font-medium">{formErrors.email}</p>
                          )}
                        </div>

                        {/* Subject Field */}
                        <div className="space-y-1.5">
                          <label className="block font-mono text-xs text-[#1B1B18]/80 uppercase font-semibold">
                            SUBJECT / PROJECT TYPE <span className="text-[#1B1B18]/40 font-normal">(OPTIONAL)</span>
                          </label>
                          <input
                            type="text"
                            id="contact-subject"
                            name="subject"
                            placeholder="e.g. AI System Collaboration / Role Inquiry"
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            className="w-full bg-[#F3EEE2] border border-[#1B1B18]/20 rounded-xl p-3.5 text-[#1B1B18] placeholder-[#1B1B18]/40 text-sm focus:border-[#1B1B18] outline-none transition-all focus:ring-2 focus:ring-[#D9A62C]/40"
                          />
                        </div>

                        {/* Message Field */}
                        <div className="space-y-1.5">
                          <label className="block font-mono text-xs text-[#1B1B18]/80 uppercase font-semibold">
                            WHAT ARE WE BUILDING? <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            id="contact-message"
                            name="message"
                            rows={4}
                            placeholder="A few lines about your project, timeline, or budget..."
                            value={formData.message}
                            onChange={(e) => {
                              setFormData({ ...formData, message: e.target.value });
                              if (formErrors.message) setFormErrors({ ...formErrors, message: undefined });
                            }}
                            className={`w-full bg-[#F3EEE2] border ${formErrors.message ? "border-red-500 ring-1 ring-red-500/50" : "border-[#1B1B18]/20"
                              } rounded-xl p-3.5 text-[#1B1B18] placeholder-[#1B1B18]/40 text-sm focus:border-[#1B1B18] outline-none resize-none transition-all focus:ring-2 focus:ring-[#D9A62C]/40`}
                          />
                          {formErrors.message && (
                            <p className="font-mono text-[11px] text-red-600 font-medium">{formErrors.message}</p>
                          )}
                        </div>

                        {/* SEND IT OVER BUTTON WITH SMOOTH MICRO-ANIMATIONS */}
                        <motion.button
                          type="submit"
                          disabled={isSubmitting}
                          whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                          whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                          className="relative w-full py-4 rounded-full bg-[#1B1B18] text-[#FBF7ED] font-mono text-sm font-bold tracking-wider uppercase overflow-hidden shadow-xl border border-[#D9A62C]/40 transition-all hover:bg-[#20252A] group disabled:opacity-80 disabled:cursor-not-allowed"
                        >
                          {/* Animated Shimmer beam moving across button during submitting */}
                          <AnimatePresence>
                            {isSubmitting && (
                              <motion.div
                                initial={{ x: "-100%" }}
                                animate={{ x: "100%" }}
                                transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D9A62C]/35 to-transparent z-0"
                              />
                            )}
                          </AnimatePresence>

                          <div className="relative z-10 flex items-center justify-center gap-3">
                            {isSubmitting ? (
                              <>
                                <motion.div
                                  initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                                  animate={{
                                    x: [0, 35, 110],
                                    y: [0, -20, -55],
                                    scale: [1, 1.35, 0.2],
                                    opacity: [1, 1, 0],
                                  }}
                                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                                  className="flex items-center justify-center"
                                >
                                  <Send className="w-5 h-5 text-[#D9A62C] transform -rotate-45" />
                                </motion.div>

                                <motion.div
                                  animate={{ opacity: [0.5, 1, 0.5] }}
                                  transition={{ duration: 0.8, repeat: Infinity }}
                                  className="flex items-center gap-2 font-mono text-xs text-[#D9A62C] tracking-widest font-bold"
                                >
                                  <Loader2 className="w-4 h-4 animate-spin text-[#D9A62C]" />
                                  <span>SENDING...</span>
                                </motion.div>
                              </>
                            ) : (
                              <>
                                <Send className="w-4 h-4 text-[#D9A62C] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                <span>SEND MESSAGE</span>
                              </>
                            )}
                          </div>
                        </motion.button>
                      </form>
                    )}
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
