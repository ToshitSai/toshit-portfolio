import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

interface AcademicRecord {
  id: string;
  number: string;
  yearRange: string;
  status: "CURRENT" | "COMPLETED";
  degreeMain: string;
  degreeSub: string;
  institutionLine1: string;
  institutionLine2?: string;
  focusTopics: string[];
  leftOffsetClass: string;
}

const dossierRecords: AcademicRecord[] = [
  {
    id: "btech",
    number: "01",
    yearRange: "2025 / 2029",
    status: "CURRENT",
    degreeMain: "B.TECH",
    degreeSub: "/ COMPUTER SCIENCE",
    institutionLine1: "NxtWave Institute of Advanced Technologies (NIAT)",
    institutionLine2: "Chaitanya Deemed to be University",
    focusTopics: ["AI SYSTEMS", "FULL STACK", "CLOUD INFRASTRUCTURE", "SOFTWARE ARCHITECTURE"],
    leftOffsetClass: "lg:col-span-8 lg:col-start-5",
  },
  {
    id: "intermediate",
    number: "02",
    yearRange: "2023 / 2025",
    status: "COMPLETED",
    degreeMain: "INTERMEDIATE",
    degreeSub: "/ MPC (12TH GRADE)",
    institutionLine1: "Bhavishya Junior College",
    focusTopics: ["MATHEMATICS", "PHYSICS", "CHEMISTRY"],
    leftOffsetClass: "lg:col-span-8 lg:col-start-4",
  },
];

const AcademicJourney: React.FC = () => {
  return (
    <section
      id="education"
      style={{ backgroundColor: "#F8F2E6", color: "#191C21" }}
      className="relative w-full py-20 sm:py-28 lg:py-36 overflow-hidden z-10 select-none"
    >
      {/* Tiny Vertical Edge Index */}
      <div className="hidden lg:block absolute left-8 top-1/2 -translate-y-1/2 pointer-events-none select-none z-0">
        <span
          style={{ writingMode: "vertical-rl" }}
          className="font-mono text-[10px] tracking-[0.25em] text-[#9A9891] uppercase rotate-180 block"
        >
          EDUCATION // ACADEMIC DOSSIER
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
        {/* COMPACT EDITORIAL HEADER */}
        <div className="mb-12 sm:mb-16">
          {/* Top Metadata Strip */}
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6 border-b border-[#191C21]/10 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#D2A900] shadow-xs" />
              <span className="font-mono text-xs tracking-[0.18em] text-[#191C21]/70 uppercase font-semibold">
                03 // ACADEMIC JOURNEY
              </span>
            </div>
            <span className="font-mono text-[11px] tracking-[0.16em] text-[#85837D] uppercase font-medium">
              ACADEMIC ARCHIVE / 2023 — PRESENT
            </span>
          </div>

          {/* Heading + Short Editorial Intro Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-end pt-2">
            <div className="lg:col-span-7">
              <h2
                style={{ fontFamily: "'Instrument Sans', sans-serif" }}
                className="font-medium text-[clamp(42px,5vw,72px)] leading-[0.92] tracking-[-0.045em] text-[#191C21]"
              >
                ACADEMIC <br />
                DOSSIER
              </h2>
            </div>
            <div className="lg:col-span-5 lg:pb-1">
              <p
                style={{ fontFamily: "'Instrument Sans', sans-serif" }}
                className="text-[16px] sm:text-[17px] leading-[1.4] text-[#60646A] max-w-[420px] font-normal"
              >
                A concise record of the academic foundations, core technical disciplines, and engineering history shaping my work.
              </p>
            </div>
          </div>
        </div>

        {/* MAIN SECTION DIVIDER */}
        <div className="w-full h-px bg-[#191C21]/16 mb-12 sm:mb-16" />

        {/* OPEN EDITORIAL DOSSIER RECORDS LIST (NO CARDS / NO SHADOWS) */}
        <div className="space-y-16 sm:space-y-24">
          {dossierRecords.map((record, idx) => (
            <motion.article
              key={record.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.7,
                delay: idx * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group relative border-b border-[#191C21]/14 pb-12 sm:pb-16 pt-2"
            >
              {/* ASYMMETRIC GRID SYSTEM */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start relative">
                
                {/* NUMBER + YEAR + STATUS METADATA COLUMN */}
                <div className="lg:col-span-3 flex lg:flex-col justify-between items-baseline lg:items-start gap-3">
                  <div className="flex items-baseline gap-4">
                    <span
                      style={{ fontFamily: "'Instrument Sans', sans-serif" }}
                      className="text-[clamp(48px,5vw,76px)] font-medium leading-none tracking-[-0.05em] text-[#191C21]/22 group-hover:text-[#191C21]/50 transition-colors duration-400 block"
                    >
                      {record.number}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5 font-mono text-xs tracking-[0.14em] text-[#70757C] uppercase font-medium">
                    <span>{record.yearRange}</span>
                    
                    {/* Status Badge */}
                    {record.status === "CURRENT" ? (
                      <span className="flex items-center gap-1.5 text-[10px] text-[#B08B00] font-semibold tracking-widest mt-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D2A900] animate-pulse" />
                        CURRENT
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#70757C]/80 font-semibold tracking-widest mt-1">
                        COMPLETED
                      </span>
                    )}
                  </div>
                </div>

                {/* MAIN DEGREE & INSTITUTION CONTENT COLUMN (ASYMMETRICALLY SHIFTED) */}
                <div className={`${record.leftOffsetClass} space-y-6`}>
                  {/* Degree Headline & Interactive Archive Marker */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3
                        style={{ fontFamily: "'Instrument Sans', sans-serif" }}
                        className="text-[clamp(30px,3.4vw,50px)] font-medium leading-[0.98] tracking-[-0.04em] text-[#191C21] group-hover:translate-x-1.5 transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]"
                      >
                        <div>{record.degreeMain}</div>
                        <div className="text-[#191C21]/50 font-normal">{record.degreeSub}</div>
                      </h3>
                    </div>

                    {/* Circular Interactive Archive Marker */}
                    <div className="w-[44px] h-[44px] rounded-full border border-[#191C21]/18 flex items-center justify-center text-[#191C21]/70 group-hover:border-[#191C21] group-hover:text-[#191C21] group-hover:bg-white/50 transition-all duration-300 flex-shrink-0 mt-1">
                      <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </div>
                  </div>

                  {/* University Name */}
                  <div
                    style={{ fontFamily: "'Instrument Sans', sans-serif" }}
                    className="text-[16px] sm:text-[17px] font-medium leading-[1.4] text-[#35393F] space-y-0.5"
                  >
                    <div>{record.institutionLine1}</div>
                    {record.institutionLine2 && (
                      <div className="text-[#60646A] font-normal">{record.institutionLine2}</div>
                    )}
                  </div>

                  {/* Technical FOCUS Metadata Strip */}
                  <div className="pt-3">
                    <span className="font-mono text-[11px] font-semibold tracking-[0.14em] text-[#D2A900] uppercase block mb-1.5">
                      FOCUS
                    </span>
                    <div className="font-mono text-[11px] sm:text-xs tracking-[0.12em] text-[#191C21]/75 uppercase flex flex-wrap gap-x-2.5 gap-y-1">
                      {record.focusTopics.map((topic, tIdx) => (
                        <React.Fragment key={topic}>
                          <span>{topic}</span>
                          {tIdx < record.focusTopics.length - 1 && (
                            <span className="text-[#191C21]/25">/</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AcademicJourney;
