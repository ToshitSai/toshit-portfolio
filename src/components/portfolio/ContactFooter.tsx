import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle2, ArrowUp, Github, Linkedin, Mail, ExternalLink, Loader2 } from "lucide-react";

const ContactFooter: React.FC = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formError, setFormError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setFormError("Please fill out all required fields.");
      return;
    }
    setFormError("");
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
    }, 1200);
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
        <h2 className="text-display text-[clamp(2.6rem,8.5vw,6.5rem)] text-[#FFF8E8] mb-6 leading-[0.88] max-w-5xl">
          Let's build something remarkable together.
        </h2>

        {/* Subtitle & Direct Mailto Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-16 pb-12 border-b border-white/20">
          <p className="text-base sm:text-xl font-sans text-[#FFF8E8]/90 max-w-xl leading-relaxed">
            Have a project in mind, open opportunities, or want to collaborate? Send me a message below or email directly.
          </p>

          <a
            href="mailto:iamtoshitsai@gmail.com"
            className="inline-flex items-center justify-center gap-3 px-6 py-4 rounded-full bg-[#FFD42A] text-[#20252B] font-mono text-xs sm:text-sm tracking-wider font-bold uppercase shadow-xl hover:-translate-y-1 hover:bg-[#FFF8E8] transition-all duration-300 w-max"
          >
            <Mail className="w-4 h-4 text-[#20252B]" />
            <span>iamtoshitsai@gmail.com ↗</span>
          </a>
        </div>

        {/* Contact Form & Info Grid Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-20">
          {/* Interactive Form Card */}
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
              <form onSubmit={handleSubmit} className="space-y-8">
                {formError && (
                  <div className="p-3 rounded-lg bg-red-500/20 border border-red-400 text-red-200 text-xs font-mono">
                    {formError}
                  </div>
                )}

                {/* Name Input */}
                <div className="relative">
                  <label
                    htmlFor="name"
                    className="block text-xs font-mono uppercase tracking-wider text-[#FFD42A] mb-2 font-semibold"
                  >
                    Your Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onFocus={() => setFocusedField("name")}
                    onBlur={() => setFocusedField(null)}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#1F2329] border border-white/20 rounded-xl px-4 py-3 text-[#FFF8E8] placeholder-white/40 focus:outline-none focus:border-[#FFD42A] transition-colors text-base"
                    placeholder="e.g. Alex Morgan"
                  />
                </div>

                {/* Email Input */}
                <div className="relative">
                  <label
                    htmlFor="email"
                    className="block text-xs font-mono uppercase tracking-wider text-[#FFD42A] mb-2 font-semibold"
                  >
                    Your Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#1F2329] border border-white/20 rounded-xl px-4 py-3 text-[#FFF8E8] placeholder-white/40 focus:outline-none focus:border-[#FFD42A] transition-colors text-base"
                    placeholder="alex@company.com"
                  />
                </div>

                {/* Message Input */}
                <div className="relative">
                  <label
                    htmlFor="message"
                    className="block text-xs font-mono uppercase tracking-wider text-[#FFD42A] mb-2 font-semibold"
                  >
                    Your Message *
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    value={formData.message}
                    onFocus={() => setFocusedField("message")}
                    onBlur={() => setFocusedField(null)}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-[#1F2329] border border-white/20 rounded-xl px-4 py-3 text-[#FFF8E8] placeholder-white/40 focus:outline-none focus:border-[#FFD42A] transition-colors text-base resize-none"
                    placeholder="Tell me about your project or opportunity..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-full bg-[#FFD42A] text-[#20252B] font-mono text-xs font-bold uppercase tracking-[0.2em] shadow-lg hover:bg-[#FFF8E8] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
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

          {/* Info Grid (<dl>) */}
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
                  <a
                    href="https://github.com/ToshitSai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-full border border-white/30 text-[#FFF8E8] hover:bg-[#FFD42A] hover:text-[#20252B] hover:border-[#FFD42A] transition-all inline-flex items-center gap-1.5 font-semibold"
                  >
                    <span>View Resume & Projects</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </div>

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
