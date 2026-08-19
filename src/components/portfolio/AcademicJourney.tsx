import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

interface TimelineEntry {
  id: string;
  isCurrent: boolean;
  startYear: string;
  endYear: string;
  statusLabel: string;
  degree: string;
  field: string;
  institution: string;
  subinstitution: string;
  focusArea: string[];
}

const timelineEntries: TimelineEntry[] = [
  {
    id: "btech",
    isCurrent: true,
    startYear: "2025",
    endYear: "2029",
    statusLabel: "● IN PROGRESS",
    degree: "B.Tech",
    field: "/ Computer Science",
    institution: "NxtWave Institute of Advanced Technologies (NIAT)",
    subinstitution: "Chaitanya Deemed to be University",
    focusArea: ["AI Systems", "Full Stack", "Cloud Infrastructure", "Software Architecture"],
  },
  {
    id: "intermediate",
    isCurrent: false,
    startYear: "2023",
    endYear: "2025",
    statusLabel: "COMPLETED",
    degree: "Intermediate",
    field: "/ MPC (12th Grade)",
    institution: "Bhavishya Junior College",
    subinstitution: "Board of Intermediate Education",
    focusArea: ["Mathematics", "Physics", "Chemistry"],
  },
];

const AcademicJourney: React.FC = () => {
  return (
    <section
      id="education"
      style={{ backgroundColor: "#F7F2E7", color: "#1B1B18" }}
      className="relative w-full py-24 sm:py-32 font-sans select-none overflow-hidden z-10"
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-12 lg:px-16 relative z-10">
        
        {/* HEADER ROW */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[#1B1B18]/12 pb-10 mb-16 sm:mb-24 gap-6">
          <div>
            <div className="flex items-center gap-2.5 font-mono text-xs sm:text-sm tracking-wider text-[#4A4A45] mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D9A62C]" />
              <span>03 // ACADEMIC JOURNEY</span>
            </div>
            <h2
              style={{ fontFamily: "'Instrument Sans', 'Space Grotesk', sans-serif" }}
              className="font-bold text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight text-[#1B1B18]"
            >
              Academic<br />
              <span className="text-[#A9A69C]">Timeline.</span>
            </h2>
          </div>

          <p className="max-w-xs text-sm sm:text-base leading-relaxed text-[#55554F] md:text-right font-normal">
            A concise record of the academic foundations, core technical disciplines, and engineering history shaping my work.
          </p>
        </div>

        {/* TIMELINE SECTION */}
        <div className="relative pl-8 sm:pl-12">
          
          {/* Vertical Timeline Track Line */}
          <div
            className="absolute left-[5px] top-2.5 bottom-2.5 w-[1px]"
            style={{
              background: "linear-gradient(to bottom, rgba(27,27,24,0.18), rgba(27,27,24,0.05))",
            }}
          />

          {/* Timeline Entries */}
          <div className="space-y-16 sm:space-y-20">
            {timelineEntries.map((entry, idx) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.7,
                  delay: idx * 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative grid grid-cols-1 md:grid-cols-[130px_1fr] gap-6 md:gap-10 pb-16 border-b border-[#1B1B18]/08 last:border-b-0 last:pb-0"
              >
                {/* Timeline Node Bullet */}
                <div
                  className={`absolute -left-[32px] sm:-left-[48px] top-1.5 w-[11px] h-[11px] rounded-full border-[1.5px] transition-all duration-300 ${
                    entry.isCurrent
                      ? "bg-[#D9A62C] border-[#D9A62C] shadow-[0_0_0_4px_rgba(217,166,44,0.18)]"
                      : "bg-[#F7F2E7] border-[#1B1B18]"
                  }`}
                />

                {/* Period Column */}
                <div className="font-mono text-xs sm:text-sm text-[#85847C] pt-0.5">
                  <div className="leading-snug">
                    {entry.startYear}
                    <br />
                    —
                    <br />
                    {entry.endYear}
                  </div>
                  <span
                    className={`block mt-2.5 font-mono text-[11px] tracking-wider font-semibold ${
                      entry.isCurrent ? "text-[#B08420]" : "text-[#85847C]"
                    }`}
                  >
                    {entry.statusLabel}
                  </span>
                </div>

                {/* Main Content Column */}
                <div className="space-y-4">
                  {/* Degree Title Row */}
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span
                      style={{ fontFamily: "'Instrument Sans', 'Space Grotesk', sans-serif" }}
                      className="font-bold text-2xl sm:text-3xl text-[#1B1B18]"
                    >
                      {entry.degree}
                    </span>
                    <span
                      style={{ fontFamily: "'Instrument Sans', 'Space Grotesk', sans-serif" }}
                      className="font-medium text-2xl sm:text-3xl text-[#A9A69C]"
                    >
                      {entry.field}
                    </span>
                  </div>

                  {/* Institutions */}
                  <div>
                    <div className="text-base sm:text-lg font-medium text-[#3A3A35]">
                      {entry.institution}
                    </div>
                    <div className="text-sm text-[#85847C] mt-0.5">
                      {entry.subinstitution}
                    </div>
                  </div>

                  {/* Detail Row: Focus Tags + Link Arrow */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 pt-4">
                    <div>
                      <div className="font-mono text-xs tracking-wider text-[#B08420] font-semibold mb-2">
                        FOCUS
                      </div>
                      <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-[#55554F]">
                        {entry.focusArea.map((tag, tIdx) => (
                          <React.Fragment key={tag}>
                            <span>{tag}</span>
                            {tIdx < entry.focusArea.length - 1 && (
                              <span className="text-[#C9C6BA] font-light">/</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>

                    {/* Circular Interactive Arrow Button */}
                    <a
                      href="#contact"
                      className="w-[38px] h-[38px] rounded-full border border-[#1B1B18]/20 flex items-center justify-center text-[#1B1B18] hover:bg-[#1B1B18] hover:text-[#F7F7F7] hover:border-[#1B1B18] transition-all duration-200 flex-shrink-0"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  </div>

                </div>
              </motion.div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};

export default AcademicJourney;
