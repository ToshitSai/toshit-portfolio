import React from "react";
import { motion } from "framer-motion";
import { Cpu, Code2, Sparkles, Database } from "lucide-react";

interface SkillCategory {
  title: string;
  icon: React.ElementType;
  skills: string[];
}

const categories: SkillCategory[] = [
  {
    title: "AI Tools & APIs",
    icon: Sparkles,
    skills: ["Claude 3.5 Sonnet", "OpenAI GPT-4", "LangChain", "Groq API", "Serper API", "Whisper"],
  },
  {
    title: "Web Frameworks",
    icon: Code2,
    skills: ["React", "Next.js", "Vite", "Flask", "Tailwind CSS", "Node.js"],
  },
  {
    title: "Languages & AI/ML",
    icon: Cpu,
    skills: ["TypeScript", "JavaScript", "Python", "C++", "REST APIs", "JSON/Prompt Ops"],
  },
  {
    title: "Databases & Cloud",
    icon: Database,
    skills: ["PostgreSQL", "MongoDB", "Vercel", "Supabase", "Git & GitHub", "Puppeteer"],
  },
];

const TechnicalSkills: React.FC = () => {
  return (
    <section id="skills" className="relative w-full py-24 sm:py-32 bg-cream-paper text-ink overflow-hidden z-10 border-t border-ink/10">
      {/* Drifting Background Cloud */}
      <div className="absolute bottom-10 left-[-5%] w-80 sm:w-96 opacity-25 pointer-events-none z-0">
        <svg viewBox="0 0 200 110" fill="none" className="w-full animate-float-cloud">
          <path
            d="M30 85 C 15 85, 0 70, 0 50 C 0 35, 15 25, 35 25 C 50 10, 80 5, 110 18 C 130 5, 165 10, 180 30 C 195 30, 205 45, 205 60 C 205 78, 190 85, 170 85 Z"
            fill="#A9D5EE"
          />
        </svg>
      </div>

      <div className="container-narrow relative z-10">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-4">
          <span className="w-2 h-2 rounded-full bg-yellow-accent shadow-sm" />
          <span className="label-mono text-ink-light">04 // TECHNICAL SKILLS</span>
        </div>

        <h2 className="text-display text-[clamp(2.4rem,6vw,4.5rem)] text-ink mb-12 sm:mb-16">
          Toolbox & Technical Mastery
        </h2>

        {/* Four Lift Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group p-8 rounded-3xl bg-cream border border-ink/10 shadow-soft-card hover:-translate-y-2 hover:border-yellow-accent transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Card Header with Icon */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3.5 rounded-2xl bg-yellow-accent/20 text-ink border border-yellow-accent/40 group-hover:scale-110 group-hover:bg-yellow-accent transition-all">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-serif text-ink tracking-tight">
                      {cat.title}
                    </h3>
                  </div>

                  {/* Skill Pills */}
                  <div className="flex flex-wrap gap-2.5">
                    {cat.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3.5 py-1.5 rounded-full bg-cream-paper border border-ink/10 text-ink text-xs font-mono tracking-wider uppercase font-medium hover:border-yellow-accent hover:bg-yellow-accent/25 transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-ink/10 text-right">
                  <span className="text-[10px] font-mono tracking-[0.2em] text-ink-light uppercase">
                    {cat.skills.length} CORE TECHNOLOGIES
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TechnicalSkills;
