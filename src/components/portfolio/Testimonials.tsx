import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Subba Rao",
    role: "Senior Tech Lead",
    company: "NIAT Engineering Labs",
    content:
      "Toshit demonstrates remarkable aptitude in combining AI capabilities with scalable Web engineering. HireScope AI shows incredible polish and practical utility.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
  },
  {
    id: 2,
    name: "Ananya Sharma",
    role: "Product Designer",
    company: "Studio Craft",
    content:
      "Working alongside Toshit on UI and LLM integrations is inspiring. His eye for subtle typography details and micro-animations elevates the user experience.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80",
  },
  {
    id: 3,
    name: "Vikram Reddy",
    role: "Full Stack Architect",
    company: "CloudScale Systems",
    content:
      "Toshit's problem-solving skills and rapid adaptation to modern tech stacks like Next.js, Claude API, and Flask are outstanding for a student developer.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
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
          <span className="label-mono text-ink-light">TESTIMONIALS & ENDORSEMENTS</span>
        </div>

        <h2 className="text-display text-center text-[clamp(2.4rem,5.5vw,4.2rem)] text-ink mb-16">
          Words from Mentors & Collaborators
        </h2>

        {/* Carousel Container */}
        <div className="relative max-w-3xl mx-auto bg-cream-paper border border-ink/10 rounded-3xl p-8 sm:p-12 shadow-soft-card">
          {/* Animated Big Quote Mark */}
          <div className="absolute top-6 left-8 text-yellow-accent/40 pointer-events-none">
            <Quote className="w-16 h-16 rotate-12 scale-110" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative z-10 flex flex-col items-center text-center space-y-6"
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
              <p className="text-lg sm:text-2xl font-serif italic text-ink leading-relaxed max-w-xl">
                "{testimonial.content}"
              </p>

              {/* Author Details */}
              <div className="flex items-center gap-4 pt-4 border-t border-ink/10">
                <motion.img
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-yellow-accent shadow-sm"
                />
                <div className="text-left">
                  <h4 className="text-base font-sans font-bold text-ink">
                    {testimonial.name}
                  </h4>
                  <p className="text-xs font-mono text-ink-light uppercase tracking-wider">
                    {testimonial.role} — {testimonial.company}
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
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    current === idx ? "w-8 bg-yellow-accent" : "bg-ink/20 hover:bg-ink/40"
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
