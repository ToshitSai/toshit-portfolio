import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

interface EducationRecord {
  id: string;
  number: string;
  yearStart: string;
  yearEnd: string;
  degree: string;
  institution: string;
  focusArea: string[];
}

const academicRecords: EducationRecord[] = [
  {
    id: "btech",
    number: "01",
    yearStart: "2025",
    yearEnd: "2029",
    degree: "B.Tech Computer Science",
    institution: "NxtWave Institute of Advanced Technologies (NIAT), Chaitanya Deemed to be University",
    focusArea: [
      "APPLIED AI SYSTEMS",
      "FULL STACK DEVELOPMENT",
      "CLOUD INFRASTRUCTURE",
      "SOFTWARE ARCHITECTURE",
    ],
  },
  {
    id: "intermediate",
    number: "02",
    yearStart: "2023",
    yearEnd: "2025",
    degree: "Intermediate MPC (12th Grade)",
    institution: "Bhavishya Junior College",
    focusArea: [
      "MATHEMATICS",
      "PHYSICS",
      "CHEMISTRY",
    ],
  },
];

const AcademicJourney: React.FC = () => {
  return (
    <section
      id="education"
      style={{ backgroundColor: "#F8F2E6" }}
      className="relative w-full py-28 sm:py-36 lg:py-44 text-[#1D2024] overflow-hidden z-10 select-none"
    >
      {/* Subtle Vertical Technical Label */}
      <div className="hidden lg:block absolute left-8 top-1/2 -translate-y-1/2 pointer-events-none select-none z-0">
        <span
          style={{ writingMode: "vertical-rl" }}
          className="font-mono text-xs tracking-[0.35em] text-[#8D8B84]/40 uppercase rotate-180 block"
        >
          ACADEMIC ARCHIVE // NIAT & BHAVISHYA
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
        {/* EDITORIAL SECTION HEADER */}
        <div className="border-b border-[#1D2024]/14 pb-12 mb-20 sm:mb-28">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#FFD42A] shadow-xs" />
              <span className="font-mono text-xs tracking-[0.18em] text-[#1D2024]/60 uppercase font-semibold">
                03 // ACADEMIC JOURNEY
              </span>
            </div>
            <span className="font-mono text-[11px] tracking-[0.15em] text-[#1D2024]/40 uppercase font-medium">
              ACADEMIC ARCHIVE / 2023 — PRESENT
            </span>
          </div>

          <h2
            style={{ fontFamily: "'Instrument Sans', sans-serif" }}
            className="font-medium text-[clamp(48px,6vw,88px)] leading-[0.95] tracking-[-0.045em] text-[#1D2024] max-w-4xl"
          >
            Education <br className="hidden sm:block" />
            & Credentials
          </h2>
        </div>

        {/* EDITORIAL ACADEMIC RECORDS LIST */}
        <div className="space-y-24 sm:space-y-32 lg:space-y-36">
          {academicRecords.map((record, idx) => (
            <motion.article
              key={record.id}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.8,
                delay: idx * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group relative border-b border-[#1D2024]/14 pb-16 sm:pb-24 pt-4 px-3 sm:px-6 rounded-xl hover:bg-white/20 transition-colors duration-500"
            >
              {/* ASYMMETRIC GRID LAYOUT */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start relative">
                
                {/* LEFT COLUMN: LARGE NUMBER + YEAR METADATA */}
                <div className="lg:col-span-4 flex lg:flex-col justify-between lg:justify-start items-baseline lg:items-start gap-4">
                  {/* Large Editorial Number */}
                  <span
                    style={{ fontFamily: "'Instrument Sans', sans-serif" }}
                    className="text-[clamp(60px,7vw,110px)] font-medium leading-none tracking-[-0.05em] text-[#1D2024]/12 group-hover:text-[#1D2024]/25 transition-colors duration-500 block"
                  >
                    {record.number}
                  </span>

                  {/* Year Metadata */}
                  <div className="font-mono text-xs sm:text-sm tracking-[0.18em] text-[#686F78] uppercase font-semibold flex items-center gap-2 lg:mt-2">
                    <span>{record.yearStart}</span>
                    <span className="text-[#1D2024]/30">/</span>
                    <span>{record.yearEnd}</span>
                  </div>
                </div>

                {/* RIGHT COLUMN: DEGREE + INSTITUTION + FOCUS METADATA */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Degree Title & Interactive Arrow */}
                  <div className="flex items-start justify-between gap-4">
                    <h3
                      style={{ fontFamily: "'Instrument Sans', sans-serif" }}
                      className="text-[clamp(32px,3.5vw,52px)] font-medium leading-[1.0] tracking-[-0.035em] text-[#1D2024] group-hover:translate-x-2 transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]"
                    >
                      {record.degree}
                    </h3>

                    {/* Subtle Editorial Interactive Arrow Marker */}
                    <div className="w-9 h-9 rounded-full border border-[#1D2024]/20 flex items-center justify-center text-[#1D2024]/70 group-hover:border-[#1D2024] group-hover:text-[#1D2024] group-hover:bg-white/60 transition-all duration-300 flex-shrink-0 mt-1">
                      <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>

                  {/* University / Institution */}
                  <p
                    style={{ fontFamily: "'Instrument Sans', sans-serif" }}
                    className="text-[17px] sm:text-[19px] font-medium leading-[1.35] text-[#2B2F34] max-w-2xl"
                  >
                    {record.institution}
                  </p>

                  {/* Editorial FOCUS Metadata Block */}
                  <div className="pt-4 border-t border-[#1D2024]/08">
                    <span className="font-mono text-[11px] font-semibold tracking-[0.18em] text-[#D6A900] uppercase block mb-2">
                      FOCUS
                    </span>
                    <div className="font-mono text-xs sm:text-sm tracking-wider text-[#1D2024]/70 uppercase flex flex-wrap gap-x-3 gap-y-1">
                      {record.focusArea.map((topic, tIdx) => (
                        <React.Fragment key={topic}>
                          <span>{topic}</span>
                          {tIdx < record.focusArea.length - 1 && (
                            <span className="text-[#1D2024]/30">/</span>
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
