import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FeedbackLogEntry {
  id: string;
  badge: string;
  name: string;
  roleLine1: string;
  roleLine2: string;
  quote: string;
  metaTag: string;
}

const feedbackLogs: FeedbackLogEntry[] = [
  {
    id: "log-1",
    badge: "RS",
    name: "Riya Sharma",
    roleLine1: "AI RESEARCH INTERN",
    roleLine2: "PIXEL MIND",
    quote: "What impressed me most was how quickly Toshit moved from an idea to a working AI application with a thoughtful interface.",
    metaTag: "RE: HireScope",
  },
  {
    id: "log-2",
    badge: "AK",
    name: "Arjun Kapoor",
    roleLine1: "SENIOR ENGINEER",
    roleLine2: "NIAT FACULTY",
    quote: "Solid grasp of system design for someone early in their degree — the API architecture on CourseForge held up well under review.",
    metaTag: "RE: CourseForge",
  },
  {
    id: "log-3",
    badge: "AM",
    name: "Arjun Mehta",
    roleLine1: "PRODUCT ENGINEER",
    roleLine2: "NOVA LABS",
    quote: "Toshit has a strong instinct for turning AI ideas into polished, usable products. The combination of experimentation and web engineering really stands out.",
    metaTag: "RE: Greetly",
  },
  {
    id: "log-4",
    badge: "KM",
    name: "Karan Malhotra",
    roleLine1: "SOFTWARE ENGINEER",
    roleLine2: "BUILDCRAFT",
    quote: "Toshit brings together modern AI tools, frontend development, and practical problem solving in a way that feels genuinely product-focused.",
    metaTag: "RE: AI Systems",
  },
  {
    id: "log-5",
    badge: "NK",
    name: "Ananya Kapoor",
    roleLine1: "PRODUCT DESIGNER",
    roleLine2: "ORBIT STUDIO",
    quote: "The work feels both technical and creative. Toshit pays attention to interaction, presentation, and the actual usefulness of what he builds.",
    metaTag: "RE: Avengers Doomsday",
  },
];

const ITEMS_PER_PAGE = 2;

const Testimonials: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = Math.ceil(feedbackLogs.length / ITEMS_PER_PAGE);

  const handleNext = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const handlePrev = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const startIndex = currentPage * ITEMS_PER_PAGE;
  const currentEntries = feedbackLogs.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const visibleCount = Math.min(startIndex + ITEMS_PER_PAGE, feedbackLogs.length);
  const progressPercent = ((currentPage + 1) / totalPages) * 100;

  return (
    <section
      id="feedback"
      style={{ backgroundColor: "#F7F2E7", color: "#1B1B18" }}
      className="relative w-full py-24 sm:py-32 font-sans select-none overflow-hidden z-10 border-t border-[#1B1B18]/10"
    >
      <div className="max-w-[1100px] mx-auto px-6 sm:px-12 lg:px-16 relative z-10">
        
        {/* HEADER ROW */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-[#1B1B18]/12 pb-9 mb-14 gap-4">
          <div>
            <div className="flex items-center gap-2.5 font-mono text-xs sm:text-sm tracking-wider text-[#4A4A45] mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D9A62C]" />
              <span>FEEDBACK LOG</span>
            </div>
            <h2
              style={{ fontFamily: "'Instrument Sans', 'Space Grotesk', sans-serif" }}
              className="font-bold text-3xl sm:text-4xl lg:text-[42px] leading-tight tracking-tight text-[#1B1B18]"
            >
              Words from mentors &amp; collaborators.
            </h2>
          </div>

          <div className="font-mono text-xs sm:text-sm text-[#85847C] sm:text-right">
            <b className="text-[#1B1B18] text-sm sm:text-base font-semibold">
              {String(visibleCount).padStart(2, "0")}
            </b>{" "}
            / {String(feedbackLogs.length).padStart(2, "0")} entries
          </div>
        </div>

        {/* LOG-STYLE FEEDBACK LIST */}
        <div className="border-t border-[#1B1B18]/12 min-h-[320px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {currentEntries.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6 md:gap-10 py-9 border-b border-[#1B1B18]/10 items-start"
                >
                  {/* WHO COLUMN */}
                  <div className="flex flex-col gap-2.5">
                    <div className="w-[34px] h-[34px] rounded bg-[#1B1B18] text-[#F7F2E7] font-mono text-xs font-medium flex items-center justify-center">
                      {item.badge}
                    </div>
                    <div
                      style={{ fontFamily: "'Instrument Sans', 'Space Grotesk', sans-serif" }}
                      className="font-bold text-base sm:text-lg text-[#1B1B18]"
                    >
                      {item.name}
                    </div>
                    <div className="font-mono text-[11px] tracking-wider text-[#85847C] leading-tight uppercase">
                      <div>{item.roleLine1}</div>
                      <div>{item.roleLine2}</div>
                    </div>
                  </div>

                  {/* QUOTE & META COLUMN */}
                  <div>
                    <p className="text-base sm:text-lg leading-[1.65] text-[#2A2A25] font-normal">
                      <span className="text-[#D9A62C] font-serif text-2xl mr-1 leading-none">“</span>
                      {item.quote}
                    </p>
                    <span className="inline-block mt-4 font-mono text-[11px] tracking-wider text-[#B08420] bg-[#D9A62C]/10 border border-[#D9A62C]/35 px-2.5 py-1 rounded">
                      {item.metaTag}
                    </span>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* FOOTER NAVIGATION */}
        <div className="flex items-center justify-between pt-8">
          <div className="font-mono text-xs text-[#85847C] flex items-center gap-3">
            <span>
              {String(visibleCount).padStart(2, "0")} / {String(feedbackLogs.length).padStart(2, "0")}
            </span>
            <div className="w-[120px] h-[2px] bg-[#1B1B18]/12 relative overflow-hidden">
              <div
                className="h-full bg-[#D9A62C] transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handlePrev}
              aria-label="Previous feedback entries"
              className="w-[34px] h-[34px] rounded border border-[#1B1B18]/20 bg-transparent flex items-center justify-center text-[#1B1B18] text-sm hover:bg-[#1B1B18] hover:text-[#F7F2E7] transition-colors"
            >
              ←
            </button>
            <button
              onClick={handleNext}
              aria-label="Next feedback entries"
              className="w-[34px] h-[34px] rounded border border-[#1B1B18]/20 bg-transparent flex items-center justify-center text-[#1B1B18] text-sm hover:bg-[#1B1B18] hover:text-[#F7F2E7] transition-colors"
            >
              →
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Testimonials;
