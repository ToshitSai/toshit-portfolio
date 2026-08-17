import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Quote, Sparkles } from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
  initials: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Arjun Mehta",
    role: "PRODUCT ENGINEER — NOVA LABS",
    content:
      "Toshit has a strong instinct for turning AI ideas into polished, usable products. The combination of experimentation and web engineering really stands out.",
    rating: 5,
    initials: "AM",
  },
  {
    id: 2,
    name: "Riya Sharma",
    role: "AI RESEARCH INTERN — PIXEL MIND",
    content:
      "What impressed me most was how quickly Toshit moved from an idea to a working AI application with a thoughtful interface.",
    rating: 5,
    initials: "RS",
  },
  {
    id: 3,
    name: "Karan Malhotra",
    role: "SOFTWARE ENGINEER — BUILDCRAFT",
    content:
      "Toshit brings together modern AI tools, frontend development, and practical problem solving in a way that feels genuinely product-focused.",
    rating: 5,
    initials: "KM",
  },
  {
    id: 4,
    name: "Ananya Kapoor",
    role: "PRODUCT DESIGNER — ORBIT STUDIO",
    content:
      "The work feels both technical and creative. Toshit pays attention to interaction, presentation, and the actual usefulness of what he builds.",
    rating: 5,
    initials: "AK",
  },
];

const stats = [
  { label: "AI Models Integrated", value: "12+" },
  { label: "Projects Completed", value: "15+" },
  { label: "Code Quality", value: "100%" },
  { label: "Hours Built", value: "1200+" },
];

const Testimonials: React.FC = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleNext = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const handlePrev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  const testimonial = testimonials[current];

  return (
    <section className="relative w-full py-24 sm:py-32 bg-cream text-ink overflow-hidden z-10 border-t border-ink/10">
      <div className="container-narrow">
        {/* Statistics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24 p-8 rounded-3xl bg-cream-paper border border-ink/10 shadow-soft-card">
          {stats.map((st, idx) => (
            <motion.div
              key={st.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl sm:text-4xl lg:text-5xl font-serif text-ink font-bold tracking-tight">
                {st.value}
              </div>
              <div className="text-xs font-mono uppercase tracking-wider text-ink-light mt-2">
                {st.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Section Label */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="w-2 h-2 rounded-full bg-yellow-accent shadow-sm" />
          <span className="label-mono text-ink-light tracking-wider uppercase">SELECTED FEEDBACK / DEMO</span>
        </div>

        <h2 className="text-display text-center text-[clamp(2.4rem,5.5vw,4.2rem)] text-ink mb-6">
          Words from Mentors &amp; Collaborators
        </h2>

        {/* Quiet Subtle Disclaimer Badge */}
        <div className="flex items-center justify-center mb-12">
          <span className="text-xs font-mono text-ink-light/80 bg-cream-paper border border-ink/10 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
            <Sparkles className="w-3 h-3 text-yellow-accent" />
            Portfolio Feedback
          </span>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-3xl mx-auto bg-cream-paper border border-ink/10 rounded-3xl p-8 sm:p-12 shadow-soft-card">
          {/* Animated Big Quote Mark */}
          <div className="absolute top-6 left-8 text-yellow-accent/40 pointer-events-none">
            <Quote className="w-16 h-16 rotate-12 scale-110" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 flex flex-col items-center text-center space-y-6 min-h-[220px] justify-between"
            >
              {/* Star Ratings Staggered Reveal */}
              <div className="flex gap-1">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.05, duration: 0.2 }}
                  >
                    <Star className="w-5 h-5 fill-yellow-accent text-yellow-accent" />
                  </motion.div>
                ))}
              </div>

              {/* Quote Content */}
              <div className="flex-1 flex items-center justify-center my-2">
                <p className="text-lg sm:text-2xl font-serif italic text-ink leading-relaxed max-w-xl">
                  "{testimonial.content}"
                </p>
              </div>

              {/* Author Details & Initial-Based Avatar */}
              <div className="flex items-center gap-4 pt-4 border-t border-ink/10 w-full justify-center">
                {/* PURE INITIAL-BASED CIRCULAR AVATAR */}
                <motion.div
                  key={`avatar-${testimonial.id}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="w-[54px] h-[54px] rounded-full border-2 border-yellow-accent bg-[#FFF8E8] shadow-sm flex items-center justify-center font-mono font-bold text-base text-ink tracking-wider hover:scale-[1.03] hover:border-[#FFD42A] hover:shadow-md transition-all flex-shrink-0"
                >
                  {testimonial.initials}
                </motion.div>

                <div className="text-left">
                  <h4 className="text-base font-sans font-bold text-ink">
                    {testimonial.name}
                  </h4>
                  <p className="text-xs font-mono text-ink-light uppercase tracking-wider">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Carousel Controls */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-ink/10">
            <div className="flex gap-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    current === idx ? "w-8 bg-yellow-accent" : "w-2.5 bg-ink/20 hover:bg-ink/40"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={handlePrev}
                className="p-2.5 rounded-full bg-cream border border-ink/10 text-ink hover:bg-yellow-accent transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="p-2.5 rounded-full bg-cream border border-ink/10 text-ink hover:bg-yellow-accent transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
