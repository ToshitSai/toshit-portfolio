import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, FileText, ExternalLink, Mail, Code2, GraduationCap, Briefcase, FileSpreadsheet } from "lucide-react";

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  const [img1Error, setImg1Error] = useState(false);
  const [img2Error, setImg2Error] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const pdfPath = "/resume/Toshit_Sai_Galam_Resume.pdf";
  const page1Path = "/resume/resume-page1.png";
  const page2Path = "/resume/resume-page2.png";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100000] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl overflow-y-auto"
          onClick={onClose}
        >
          {/* MODAL CONTAINER */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-3xl bg-[#191C21] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl my-auto text-[#FFF8E8]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* CLOSE BUTTON */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 hover:bg-white hover:text-black flex items-center justify-center transition-colors text-white"
              aria-label="Close resume modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* HEADER BADGE & TITLE */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#FFD42A] text-[#191C21] flex items-center justify-center font-bold shadow-lg">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-2xl sm:text-3xl text-[#FFF8E8] tracking-tight">
                  Toshit Sai Galam — Official Resume
                </h3>
                <p className="font-mono text-xs text-[#FFD42A] uppercase tracking-wider font-semibold">
                  Computer Science Student • AI Full-Stack Developer
                </p>
              </div>
            </div>

            {/* EXECUTIVE SUMMARY & CORE SPECS */}
            <div className="space-y-4 mb-6 bg-[#111317] p-5 rounded-2xl border border-white/10">
              <p className="text-sm text-white/80 leading-relaxed font-sans">
                ATS-Compliant Full-Stack Engineer resume detailing core competencies in AI application development, distributed backend systems, and modern frontend design.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-white/10 font-mono text-xs">
                <div className="flex items-center gap-2 text-white/70">
                  <GraduationCap className="w-4 h-4 text-[#FFD42A]" />
                  <span>B.Tech CS (AI/ML)</span>
                </div>
                <div className="flex items-center gap-2 text-white/70">
                  <Code2 className="w-4 h-4 text-[#FFD42A]" />
                  <span>React, TS, Python</span>
                </div>
                <div className="flex items-center gap-2 text-white/70">
                  <Briefcase className="w-4 h-4 text-[#FFD42A]" />
                  <span>Hyderabad, IN</span>
                </div>
              </div>
            </div>

            {/* PREVIEW FALLBACK UI SECTION */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {/* PAGE 1 CARD / FALLBACK */}
              <div className="bg-[#111317] p-4 rounded-xl border border-white/10 flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between font-mono text-xs text-[#FFD42A] font-semibold">
                  <span>PAGE 01 // PROFILE & EXPERIENCE</span>
                  <a
                    href={page1Path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline flex items-center gap-1 text-[11px]"
                  >
                    <span>VIEW ↗</span>
                  </a>
                </div>

                {!img1Error ? (
                  <div className="overflow-hidden rounded-lg border border-white/10 bg-white max-h-[180px]">
                    <img
                      src={page1Path}
                      alt="Toshit Sai Galam Resume Page 1"
                      onError={() => setImg1Error(true)}
                      className="w-full h-auto block object-cover"
                    />
                  </div>
                ) : (
                  <div className="p-6 rounded-lg bg-white/5 border border-dashed border-white/20 text-center flex flex-col items-center justify-center space-y-2 min-h-[140px]">
                    <FileSpreadsheet className="w-8 h-8 text-[#FFD42A]" />
                    <p className="font-mono text-xs text-white/70">Page 1 PDF Document</p>
                    <a
                      href={pdfPath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-mono text-[#FFD42A] hover:underline"
                    >
                      Open ATS PDF ↗
                    </a>
                  </div>
                )}
              </div>

              {/* PAGE 2 CARD / FALLBACK */}
              <div className="bg-[#111317] p-4 rounded-xl border border-white/10 flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between font-mono text-xs text-[#FFD42A] font-semibold">
                  <span>PAGE 02 // SKILLS & CERTIFICATIONS</span>
                  <a
                    href={page2Path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline flex items-center gap-1 text-[11px]"
                  >
                    <span>VIEW ↗</span>
                  </a>
                </div>

                {!img2Error ? (
                  <div className="overflow-hidden rounded-lg border border-white/10 bg-white max-h-[180px]">
                    <img
                      src={page2Path}
                      alt="Toshit Sai Galam Resume Page 2"
                      onError={() => setImg2Error(true)}
                      className="w-full h-auto block object-cover"
                    />
                  </div>
                ) : (
                  <div className="p-6 rounded-lg bg-white/5 border border-dashed border-white/20 text-center flex flex-col items-center justify-center space-y-2 min-h-[140px]">
                    <FileSpreadsheet className="w-8 h-8 text-[#FFD42A]" />
                    <p className="font-mono text-xs text-white/70">Page 2 PDF Document</p>
                    <a
                      href={pdfPath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-mono text-[#FFD42A] hover:underline"
                    >
                      Open ATS PDF ↗
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* PRIMARY ACTIONS */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={pdfPath}
                download="Toshit_Sai_Galam_Resume.pdf"
                className="flex-1 py-3.5 px-5 rounded-full bg-[#FFD42A] text-[#191C21] font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#ffe169] transition-all text-center flex items-center justify-center gap-2 shadow-md"
              >
                <Download className="w-4 h-4" />
                <span>Download ATS Resume (PDF)</span>
              </a>

              <a
                href="mailto:iamtoshitsai@gmail.com?subject=Resume%20Inquiry%20-%20Toshit%20Sai%20Galam"
                className="py-3.5 px-5 rounded-full bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all text-center flex items-center justify-center gap-2 border border-white/15"
              >
                <Mail className="w-4 h-4 text-[#FFD42A]" />
                <span>Email Toshit</span>
              </a>

              <a
                href="https://github.com/ToshitSai"
                target="_blank"
                rel="noopener noreferrer"
                className="py-3.5 px-4 rounded-full bg-white/5 hover:bg-white/15 text-white/80 hover:text-white font-mono text-xs font-bold uppercase tracking-wider transition-all text-center flex items-center justify-center gap-1.5 border border-white/10"
              >
                <span>GitHub</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ResumeModal;
