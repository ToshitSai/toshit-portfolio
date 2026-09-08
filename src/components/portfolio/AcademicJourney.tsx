import React, { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import RecordScratchHeading from "./RecordScratchHeading";
import { useIsMobile } from "@/hooks/use-mobile";
import { motionDistance, useFocusBand } from "@/lib/scrollMotion";

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
  mapUrl: string;
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
    mapUrl: "https://maps.app.goo.gl/WZe3FTwGNj2e3MAU8",
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
    mapUrl: "https://maps.app.goo.gl/sX3tuQTFbeLMkXS28",
  },
];

interface ArchiveRowProps {
  entry: TimelineEntry;
  idx: number;
}

const ArchiveRow: React.FC<ArchiveRowProps> = ({ entry, idx }) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({
    target: rowRef,
    offset: ["start 85%", "center center", "start 15%"],
  });

  const [isReached, setIsReached] = React.useState(entry.isCurrent);

  React.useEffect(() => {
    if (entry.isCurrent) return;
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      if (latest > 0.15) {
        setIsReached(true);
      } else {
        setIsReached(false);
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress, entry.isCurrent]);

  const lineScale = useTransform(scrollYProgress, [0, 0.18], shouldReduceMotion ? [1, 1] : [0, 1]);
  const dateOpacity = useTransform(scrollYProgress, [0.08, 0.22], [0, 1]);
  const contentOpacity = useTransform(scrollYProgress, [0.14, 0.32], [0, 1]);
  const titleFocus = useFocusBand(scrollYProgress, 0.5);
  const titleY = useTransform(scrollYProgress, [0.2, 0.5, 0.8], shouldReduceMotion ? [0, 0, 0] : [0, -motionDistance(isMobile, 6), 0]);

  return (
    <div ref={rowRef} className="group/row relative w-full">
      {/* TIMELINE NODE DOT - Centered precisely on the vertical line axis */}
      <div className="absolute left-4 sm:left-6 top-3 sm:top-3.5 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
        <motion.div
          animate={{
            scale: isReached ? 1 : 0.95,
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`w-[13px] h-[13px] rounded-full transition-all duration-300 flex items-center justify-center ${
            entry.isCurrent
              ? "bg-[#D9A62C] border-2 border-[#1B1B18] shadow-[0_0_0_4px_rgba(217,166,44,0.25)] group-hover/row:scale-125 group-hover/row:shadow-[0_0_0_6px_rgba(217,166,44,0.38)]"
              : isReached
              ? "bg-[#1B1B18] border-2 border-[#D9A62C] shadow-[0_0_0_4px_rgba(217,166,44,0.2)] group-hover/row:scale-125 group-hover/row:bg-[#D9A62C]"
              : "bg-[#F7F2E7] border-2 border-[#1B1B18]/50 group-hover/row:border-[#D9A62C] group-hover/row:bg-[#D9A62C]/20 group-hover/row:scale-110"
          }`}
        >
          {/* Inner dot core indicator when active */}
          {entry.isCurrent ? (
            <span className="w-1.5 h-1.5 rounded-full bg-[#1B1B18] animate-pulse" />
          ) : (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: isReached ? 1 : 0 }}
              transition={{ duration: 0.2 }}
              className="w-1.5 h-1.5 rounded-full bg-[#D9A62C]"
            />
          )}
        </motion.div>
      </div>

      {/* TOP HORIZONTAL ACCENT LINE */}
      <div className="pl-12 sm:pl-16 w-full mb-8">
        <motion.div style={{ scaleX: lineScale }} className="w-full h-[1px] bg-[#1B1B18]/12 origin-left" />
      </div>

      {/* ROW CONTENT GRID */}
      <motion.div
        style={{ opacity: contentOpacity }}
        className="relative grid grid-cols-1 md:grid-cols-[130px_1fr] gap-6 md:gap-10 pb-16 pl-12 sm:pl-16 transition-transform duration-300 ease-out group-hover/row:translate-x-1"
      >
        <motion.div style={{ opacity: dateOpacity }} className="font-mono text-xs sm:text-sm text-[#85847C] pt-0.5">
          <div className="leading-snug">
            {entry.startYear}
            <br />
            —
            <br />
            {entry.endYear}
          </div>
          <span
            className={`inline-flex items-center gap-1.5 mt-2.5 font-mono text-[11px] tracking-wider font-semibold transition-colors duration-300 ${
              entry.isCurrent || isReached ? "text-[#B08420]" : "text-[#85847C]"
            }`}
          >
            {entry.isCurrent ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-[#D9A62C] animate-ping" />
                <span>● IN PROGRESS</span>
              </>
            ) : isReached ? (
              <>
                <span className="text-[#D9A62C] font-bold">✓</span>
                <span>COMPLETED</span>
              </>
            ) : (
              entry.statusLabel
            )}
          </span>
        </motion.div>

        <div className="space-y-4">
          <motion.div style={{ opacity: titleFocus, y: titleY }} className="flex items-baseline gap-2 flex-wrap">
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
          </motion.div>

          <div>
            <div className="text-base sm:text-lg font-medium text-[#3A3A35]">{entry.institution}</div>
            <div className="text-sm text-[#85847C] mt-0.5">{entry.subinstitution}</div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 pt-4">
            <div>
              <div className="font-mono text-xs tracking-wider text-[#B08420] font-semibold mb-2">FOCUS</div>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-[#55554F]">
                {entry.focusArea.map((tag, tIdx) => (
                  <React.Fragment key={tag}>
                    <span>{tag}</span>
                    {tIdx < entry.focusArea.length - 1 && <span className="text-[#C9C6BA] font-light">/</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <a
              href={entry.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${entry.institution} location on Google Maps`}
              className="w-[38px] h-[38px] rounded-full border border-[#1B1B18]/20 flex items-center justify-center text-[#1B1B18] hover:bg-[#1B1B18] hover:text-[#F7F7F7] hover:border-[#1B1B18] transition-all duration-200 flex-shrink-0"
            >
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const AcademicJourney: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineTrackRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Scroll Progress across the entire section for Timeline line drawing
  const { scrollYProgress: sectionProgress } = useScroll({
    target: containerRef,
    offset: ["start 65%", "end 60%"],
  });

  const timelineScaleY = useTransform(sectionProgress, [0, 1], shouldReduceMotion ? [1, 1] : [0, 1]);

  return (
    <section
      ref={containerRef}
      id="education"
      style={{ backgroundColor: "#F7F2E7", color: "#1B1B18" }}
      className="relative w-full py-24 sm:py-32 font-sans select-none overflow-hidden z-10"
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-12 lg:px-16 relative z-10">
        
        {/* HEADER ROW WITH RECORD-SCRATCH SECTION TRANSITION */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end pb-4 mb-16 sm:mb-24 gap-6">
          <div className="flex-1">
            <RecordScratchHeading
              sectionTag="04 // EXPERIENCE"
              lineColor="bg-[#1B1B18]/12"
              accentColor="#D9A62C"
              title={
                <h2
                  style={{ fontFamily: "'Instrument Sans', 'Space Grotesk', sans-serif" }}
                  className="font-bold text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight text-[#1B1B18]"
                >
                  Academic<br />
                  <span className="text-[#A9A69C]">Timeline.</span>
                </h2>
              }
            />
          </div>

          <p className="max-w-xs text-sm sm:text-base leading-relaxed text-[#55554F] md:text-right font-normal mb-10 sm:mb-16">
            A concise record of the academic foundations, core technical disciplines, and engineering history shaping my work.
          </p>
        </div>

        {/* TIMELINE SECTION */}
        <div ref={timelineTrackRef} className="relative w-full">
          
          {/* Static Faint Vertical Timeline Track Line */}
          <div
            className="absolute left-4 sm:left-6 -translate-x-1/2 top-3 bottom-3 w-[1.5px]"
            style={{
              background: "rgba(27,27,24,0.14)",
            }}
          />

          {/* Active Fill-As-You-Scroll Vertical Timeline Line */}
          <div className="absolute left-4 sm:left-6 -translate-x-1/2 top-3 bottom-3 w-[2.5px] z-10 pointer-events-none">
            <motion.div
              style={{
                scaleY: timelineScaleY,
              }}
              className="w-full h-full bg-[#1B1B18] origin-top relative"
            >
              {/* Needle Tip Marker Dot at Leading Tip of Moving Timeline Line */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3.5 h-3.5 rounded-full bg-[#D9A62C] shadow-[0_0_10px_#D9A62C] border-2 border-[#1B1B18] z-20" />
            </motion.div>
          </div>

          {/* Timeline Entries */}
          <div className="space-y-16 sm:space-y-20">
            {timelineEntries.map((entry, idx) => (
              <ArchiveRow key={entry.id} entry={entry} idx={idx} />
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};

export default AcademicJourney;
