import React from "react";
import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";

interface EducationItem {
  years: string;
  degree: string;
  institution: string;
  details: string;
}

const educationData: EducationItem[] = [
  {
    years: "2025 — 2029",
    degree: "B.Tech Computer Science",
    institution: "NxtWave Institute of Advanced Technologies (NIAT), Chaitanya Deemed to be University",
    details: "Focusing on Applied AI Systems, Full Stack Web Development, Cloud Infrastructure, and Modern Software Architecture.",
  },
  {
    years: "2023 — 2025",
    degree: "Intermediate MPC (12th Grade)",
    institution: "Bhavishya Junior College",
    details: "Rigorous coursework in Mathematics, Physics, and Chemistry, graduating with academic distinction.",
  },
];

const AcademicJourney: React.FC = () => {
  return (
    <section id="education" className="relative w-full py-24 sm:py-32 bg-cream text-ink overflow-hidden z-10">
      <div className="container-narrow">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-4">
          <span className="w-2 h-2 rounded-full bg-yellow-accent shadow-sm" />
          <span className="label-mono text-ink-light">03 // ACADEMIC JOURNEY</span>
        </div>

        <h2 className="text-display text-[clamp(2.4rem,6vw,4.5rem)] text-ink mb-12 sm:mb-16">
          Education & Credentials
        </h2>

        {/* Divide-y List */}
        <div className="divide-y divide-ink/15 border-y border-ink/15">
          {educationData.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group py-8 sm:py-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-start hover:bg-cream-paper/60 px-4 sm:px-6 rounded-2xl transition-all duration-300"
            >
              {/* Year column */}
              <div className="md:col-span-3 flex flex-col justify-start">
                <span className="text-sm font-mono text-ink-light tracking-widest font-semibold uppercase">
                  {item.years}
                </span>
              </div>

              {/* Main content column */}
              <div className="md:col-span-8 space-y-2">
                <h3 className="text-2xl sm:text-3xl font-serif text-ink group-hover:translate-x-2 transition-transform duration-300 flex flex-wrap items-center gap-3">
                  <span>{item.degree}</span>
                </h3>
                <p className="text-sm sm:text-base font-sans font-medium text-ink/90">
                  {item.institution}
                </p>
                <p className="text-xs sm:text-sm text-ink-light leading-relaxed font-sans pt-1">
                  {item.details}
                </p>
              </div>

              {/* Icon column */}
              <div className="md:col-span-1 hidden md:flex justify-end pt-1">
                <div className="p-3 rounded-full bg-cream-paper border border-ink/10 text-ink group-hover:bg-yellow-accent group-hover:text-ink transition-colors">
                  <GraduationCap className="w-5 h-5" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AcademicJourney;
