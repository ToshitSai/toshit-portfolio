import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, FileText } from "lucide-react";

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100000] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-black/90 backdrop-blur-2xl overflow-y-auto"
          onClick={onClose}
        >
          {/* MODAL CONTAINER */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-6xl bg-[#191C21] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl my-auto text-[#FFF8E8]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-6 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#FFD42A] text-[#20252B] flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5 text-[#20252B]" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#FFF8E8]">
                    Toshit Sai Galam — Official Resume
                  </h3>
                  <p className="font-mono text-xs text-[#FFD42A] uppercase tracking-wider">
                    Computer Science Student • AI Full-Stack Developer
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href="/resume/resume-page1.png"
                  download="Toshit_Sai_Galam_Resume_Page1.png"
                  className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-[#FFD42A] hover:text-[#20252B] transition-all font-mono text-xs uppercase font-semibold"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Page 1</span>
                </a>
                <a
                  href="/resume/resume-page2.png"
                  download="Toshit_Sai_Galam_Resume_Page2.png"
                  className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-[#FFD42A] hover:text-[#20252B] transition-all font-mono text-xs uppercase font-semibold"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Page 2</span>
                </a>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white hover:text-black flex items-center justify-center transition-colors text-white"
                  aria-label="Close resume viewer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* BOTH RESUME PAGES DISPLAYED SIMULTANEOUSLY SIDE-BY-SIDE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar">
              {/* PAGE 1 */}
              <div className="space-y-3 bg-[#111317] p-3 sm:p-4 rounded-2xl border border-white/10">
                <div className="flex items-center justify-between font-mono text-xs text-[#FFD42A] uppercase tracking-wider font-semibold px-1">
                  <span>Page 01 // Profile &amp; Experience</span>
                  <a
                    href="/resume/resume-page1.png"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline flex items-center gap-1 text-[11px]"
                  >
                    <span>Full View ↗</span>
                  </a>
                </div>
                <div className="overflow-hidden rounded-xl border border-white/10 bg-white">
                  <img
                    src="/resume/resume-page1.png"
                    alt="Toshit Sai Galam Resume Page 1"
                    className="w-full h-auto block object-contain"
                  />
                </div>
              </div>

              {/* PAGE 2 */}
              <div className="space-y-3 bg-[#111317] p-3 sm:p-4 rounded-2xl border border-white/10">
                <div className="flex items-center justify-between font-mono text-xs text-[#FFD42A] uppercase tracking-wider font-semibold px-1">
                  <span>Page 02 // Skills &amp; Certifications</span>
                  <a
                    href="/resume/resume-page2.png"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline flex items-center gap-1 text-[11px]"
                  >
                    <span>Full View ↗</span>
                  </a>
                </div>
                <div className="overflow-hidden rounded-xl border border-white/10 bg-white">
                  <img
                    src="/resume/resume-page2.png"
                    alt="Toshit Sai Galam Resume Page 2"
                    className="w-full h-auto block object-contain"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ResumeModal;
