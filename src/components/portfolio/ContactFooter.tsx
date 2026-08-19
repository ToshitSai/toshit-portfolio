import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle2, ArrowUp, Github, Linkedin, Mail, ExternalLink, Loader2, AlertTriangle } from "lucide-react";
import ResumeModal from "./ResumeModal";

interface FormFieldError {
  id: string;
  fieldId: string;
  msg: string;
}

const ContactFooter: React.FC = () => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [summaryErrors, setSummaryErrors] = useState<FormFieldError[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);

  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    const summary: FormFieldError[] = [];

    if (!formData.name.trim()) {
      errors.name = "Enter your full name.";
      summary.push({ id: "name-err-summary", fieldId: "full-name", msg: "Enter your full name." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      errors.email = "Enter a valid email address.";
      summary.push({ id: "email-err-summary", fieldId: "email-address", msg: "Enter a valid email address." });
    }

    if (!formData.message.trim()) {
      errors.message = "Enter your message.";
      summary.push({ id: "message-err-summary", fieldId: "message-content", msg: "Enter your message." });
    }

    return { errors, summary };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { errors, summary } = validateForm();

    setFieldErrors(errors);
    setSummaryErrors(summary);

    if (summary.length > 0) {
      // Focus summary box for keyboard & screen reader accessibility
      setTimeout(() => {
        if (errorSummaryRef.current) {
          errorSummaryRef.current.focus();
        }
      }, 50);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: "", email: "", phone: "", message: "" });
      setFieldErrors({});
      setSummaryErrors([]);
    }, 1200);
  };

  const handleSummaryLinkClick = (fieldId: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (fieldId === "full-name" && nameInputRef.current) nameInputRef.current.focus();
    if (fieldId === "email-address" && emailInputRef.current) emailInputRef.current.focus();
    if (fieldId === "message-content" && messageInputRef.current) messageInputRef.current.focus();
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer id="contact" className="relative w-full bg-[#20252B] text-[#FFF8E8] overflow-hidden z-20 pt-20 pb-12 studio-noise-bg">
      {/* Top Inverted Cream Rolling Waves */}
      <div className="absolute top-0 left-0 right-0 w-full h-14 sm:h-20 overflow-hidden pointer-events-none -translate-y-[98%]">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          preserveAspectRatio="none"
          className="w-full h-full block"
        >
          <path
            d="M0,64L48,58.7C96,53,192,43,288,48C384,53,480,75,576,80C672,85,768,75,864,64C960,53,1056,43,1152,48C1248,53,1344,75,1392,80L1440,85L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
            fill="#FFF8E8"
          />
        </svg>
      </div>

      <div className="container-narrow relative z-10 pt-8">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-6">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FFD42A] shadow-sm" />
          <span className="label-mono text-[#FFD42A]">05 // GET IN TOUCH</span>
        </div>

        {/* Big Editorial Headline */}
        <h2 id="contact-heading" className="text-display text-[clamp(2.6rem,8.5vw,6.5rem)] text-[#FFF8E8] mb-6 leading-[0.88] max-w-5xl">
          Let's build something remarkable together.
        </h2>

        {/* Subtitle & Direct Mailto Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-16 pb-12 border-b border-white/20">
          <p className="text-base sm:text-xl font-sans text-[#FFF8E8]/90 max-w-xl leading-relaxed">
            Have a project in mind, open opportunities, or want to collaborate? Send me a message below or email directly.
          </p>

          <a
            href="mailto:iamtoshitsai@gmail.com"
            className="inline-flex items-center justify-center gap-3 px-6 py-4 rounded-full bg-[#FFD42A] text-[#20252B] font-mono text-xs sm:text-sm tracking-wider font-bold uppercase shadow-xl hover:-translate-y-1 hover:bg-[#FFF8E8] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#FFD42A] transition-all duration-300 w-max"
          >
            <Mail className="w-4 h-4 text-[#20252B]" />
            <span>iamtoshitsai@gmail.com ↗</span>
          </a>
        </div>

        {/* Dynamic Focusable Error Summary Container */}
        {summaryErrors.length > 0 && (
          <div
            ref={errorSummaryRef}
            tabIndex={-1}
            role="alert"
            aria-labelledby="error-summary-title"
            className="p-5 mb-8 rounded-2xl bg-red-950/80 border-2 border-red-500 text-red-200 focus:outline-none focus:ring-4 focus:ring-red-400"
          >
            <h3 id="error-summary-title" className="text-base font-mono font-bold text-red-100 flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              There is a problem with your submission
            </h3>
            <ul className="list-disc list-inside space-y-1 text-xs font-mono text-red-200">
              {summaryErrors.map((err) => (
                <li key={err.id}>
                  <a
                    href={`#${err.fieldId}`}
                    onClick={handleSummaryLinkClick(err.fieldId)}
                    className="underline hover:text-white focus:outline-none focus:text-white"
                  >
                    {err.msg}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Form & Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-20">
          {/* Interactive Accessible Form Card */}
          <div className="lg:col-span-7 bg-[#2A3038] border border-white/20 p-8 sm:p-10 rounded-3xl shadow-2xl">
            <h3 className="text-2xl font-serif text-[#FFF8E8] mb-6">Send a Direct Message</h3>

            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 text-center space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-[#FFD42A] text-[#20252B] mx-auto flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="text-2xl font-serif text-[#FFF8E8]">Message Sent Successfully!</h4>
                <p className="text-sm font-sans text-[#FFF8E8]/80 max-w-md mx-auto">
                  Thank you for reaching out, Toshit will get back to you shortly.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="mt-4 px-6 py-2.5 rounded-full bg-[#FFD42A] text-[#20252B] text-xs font-mono font-semibold uppercase tracking-wider hover:bg-[#FFF8E8] transition-colors"
                >
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                
                {/* Field 1: Full Name */}
                <div className={`space-y-2 ${fieldErrors.name ? "has-error" : ""}`}>
                  <label
                    htmlFor="full-name"
                    className="block text-xs font-mono uppercase tracking-wider text-[#FFD42A] font-semibold"
                  >
                    Your Name <span className="text-red-400 font-bold" aria-hidden="true">*</span>
                    <span className="sr-only">(Required)</span>
                  </label>
                  <input
                    ref={nameInputRef}
                    id="full-name"
                    type="text"
                    name="name"
                    autoComplete="name"
                    required
                    aria-required="true"
                    aria-invalid={fieldErrors.name ? "true" : "false"}
                    aria-describedby={fieldErrors.name ? "full-name-error" : undefined}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full min-h-[48px] bg-[#1F2329] border rounded-xl px-4 py-3 text-[#FFF8E8] placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#FFD42A] transition-colors text-base ${
                      fieldErrors.name ? "border-red-500 bg-red-950/20" : "border-white/20 focus:border-[#FFD42A]"
                    }`}
                    placeholder="e.g. Alex Morgan"
                  />
                  {fieldErrors.name && (
                    <div id="full-name-error" className="flex items-center gap-1.5 text-xs font-mono text-red-300 mt-1 font-semibold">
                      <span aria-hidden="true">⚠️</span>
                      <span>{fieldErrors.name}</span>
                    </div>
                  )}
                </div>

                {/* Field 2: Email Address */}
                <div className={`space-y-2 ${fieldErrors.email ? "has-error" : ""}`}>
                  <label
                    htmlFor="email-address"
                    className="block text-xs font-mono uppercase tracking-wider text-[#FFD42A] font-semibold"
                  >
                    Your Email <span className="text-red-400 font-bold" aria-hidden="true">*</span>
                    <span className="sr-only">(Required)</span>
                  </label>
                  <span id="email-hint" className="block text-xs font-mono text-white/50 mb-1">
                    Example: name@domain.com
                  </span>
                  <input
                    ref={emailInputRef}
                    id="email-address"
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    aria-required="true"
                    aria-invalid={fieldErrors.email ? "true" : "false"}
                    aria-describedby={`email-hint ${fieldErrors.email ? "email-error" : ""}`}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full min-h-[48px] bg-[#1F2329] border rounded-xl px-4 py-3 text-[#FFF8E8] placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#FFD42A] transition-colors text-base ${
                      fieldErrors.email ? "border-red-500 bg-red-950/20" : "border-white/20 focus:border-[#FFD42A]"
                    }`}
                    placeholder="alex@company.com"
                  />
                  {fieldErrors.email && (
                    <div id="email-error" className="flex items-center gap-1.5 text-xs font-mono text-red-300 mt-1 font-semibold">
                      <span aria-hidden="true">⚠️</span>
                      <span>{fieldErrors.email}</span>
                    </div>
                  )}
                </div>

                {/* Field 3: Phone Number (Optional) */}
                <div className="space-y-2">
                  <label
                    htmlFor="phone-number"
                    className="block text-xs font-mono uppercase tracking-wider text-[#FFD42A] font-semibold"
                  >
                    Phone Number <span className="text-white/50 text-xs lowercase font-normal">(optional)</span>
                  </label>
                  <input
                    id="phone-number"
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full min-h-[48px] bg-[#1F2329] border border-white/20 rounded-xl px-4 py-3 text-[#FFF8E8] placeholder-white/40 focus:outline-none focus:border-[#FFD42A] focus:ring-2 focus:ring-[#FFD42A] transition-colors text-base"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                {/* Field 4: Message */}
                <div className={`space-y-2 ${fieldErrors.message ? "has-error" : ""}`}>
                  <label
                    htmlFor="message-content"
                    className="block text-xs font-mono uppercase tracking-wider text-[#FFD42A] font-semibold"
                  >
                    Your Message <span className="text-red-400 font-bold" aria-hidden="true">*</span>
                    <span className="sr-only">(Required)</span>
                  </label>
                  <textarea
                    ref={messageInputRef}
                    id="message-content"
                    name="message"
                    rows={4}
                    required
                    aria-required="true"
                    aria-invalid={fieldErrors.message ? "true" : "false"}
                    aria-describedby={fieldErrors.message ? "message-error" : undefined}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className={`w-full min-h-[120px] bg-[#1F2329] border rounded-xl px-4 py-3 text-[#FFF8E8] placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#FFD42A] transition-colors text-base resize-none ${
                      fieldErrors.message ? "border-red-500 bg-red-950/20" : "border-white/20 focus:border-[#FFD42A]"
                    }`}
                    placeholder="Tell me about your project or opportunity..."
                  />
                  {fieldErrors.message && (
                    <div id="message-error" className="flex items-center gap-1.5 text-xs font-mono text-red-300 mt-1 font-semibold">
                      <span aria-hidden="true">⚠️</span>
                      <span>{fieldErrors.message}</span>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full min-h-[48px] py-4 rounded-full bg-[#FFD42A] text-[#20252B] font-mono text-xs font-bold uppercase tracking-[0.2em] shadow-lg hover:bg-[#FFF8E8] active:scale-[0.98] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#FFD42A] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#20252B]" />
                      <span>SENDING MESSAGE...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-[#20252B]" />
                      <span>SEND MESSAGE</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Info Grid */}
          <div className="lg:col-span-5 space-y-8 lg:pt-4">
            <dl className="space-y-8">
              <div>
                <dt className="text-xs font-mono uppercase tracking-[0.2em] text-[#FFD42A] font-semibold mb-2">
                  LOCATION & TIMEZONE
                </dt>
                <dd className="text-lg font-sans text-[#FFF8E8]">
                  INDIA <span className="text-[#FFF8E8]/70 text-sm font-mono">(IST, UTC+5:30)</span>
                </dd>
              </div>

              <div>
                <dt className="text-xs font-mono uppercase tracking-[0.2em] text-[#FFD42A] font-semibold mb-3">
                  ONLINE PRESENCE
                </dt>
                <dd className="flex flex-col space-y-3 font-mono text-sm">
                  <a
                    href="https://github.com/ToshitSai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 text-[#FFF8E8] hover:text-[#FFD42A] transition-colors"
                  >
                    <Github className="w-4 h-4 text-[#FFD42A]" />
                    <span>GitHub / ToshitSai ↗</span>
                  </a>
                  <a
                    href="https://www.linkedin.com/in/toshit-sai-galam-177788276/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 text-[#FFF8E8] hover:text-[#FFD42A] transition-colors"
                  >
                    <Linkedin className="w-4 h-4 text-[#FFD42A]" />
                    <span>LinkedIn / Toshit Sai Galam ↗</span>
                  </a>
                  <a
                    href="mailto:iamtoshitsai@gmail.com"
                    className="inline-flex items-center gap-2.5 text-[#FFF8E8] hover:text-[#FFD42A] transition-colors"
                  >
                    <Mail className="w-4 h-4 text-[#FFD42A]" />
                    <span>Email / iamtoshitsai@gmail.com ↗</span>
                  </a>
                </dd>
              </div>

              <div>
                <dt className="text-xs font-mono uppercase tracking-[0.2em] text-[#FFD42A] font-semibold mb-3">
                  RESUME / DOCUMENTATION
                </dt>
                <dd className="flex flex-wrap gap-4 font-mono text-xs">
                  <button
                    type="button"
                    onClick={() => setIsResumeModalOpen(true)}
                    className="px-4 py-2.5 rounded-full border border-white/30 text-[#FFF8E8] hover:bg-[#FFD42A] hover:text-[#20252B] hover:border-[#FFD42A] transition-all inline-flex items-center gap-1.5 font-semibold cursor-pointer"
                  >
                    <span>View Resume</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* RESUME MODAL VIEWER */}
        <ResumeModal
          isOpen={isResumeModalOpen}
          onClose={() => setIsResumeModalOpen(false)}
        />

        {/* Footer Bottom Row */}
        <div className="pt-8 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#FFF8E8]/90">
          <div>
            © TOSHIT SAI GALAM · BUILT WITH CARE & APPLIED AI.
          </div>

          {/* Scroll to Top Button */}
          <button
            onClick={scrollToTop}
            className="px-4 py-2.5 rounded-full bg-[#FFD42A] text-[#20252B] hover:bg-[#FFF8E8] transition-all shadow-lg flex items-center justify-center gap-2 font-bold font-mono text-xs tracking-wider"
            aria-label="Scroll to top"
          >
            <span>BACK TO TOP</span>
            <ArrowUp className="w-4 h-4 text-[#20252B]" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default ContactFooter;
