import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Code2, Globe, Wrench, Sparkles } from "lucide-react";

const skillCategories = [
  {
    title: "Web Technologies",
    icon: Globe,
    skills: ["HTML", "CSS", "React (Basics)", "Node.js (Basics)"],
  },
  {
    title: "Frameworks & Libraries",
    icon: Code2,
    skills: ["Bootstrap", "Tailwind CSS"],
  },
  {
    title: "Tools & Platforms",
    icon: Wrench,
    skills: ["Git", "GitHub", "VS Code", "Webflow"],
  },
  {
    title: "Soft Skills",
    icon: Sparkles,
    skills: ["Problem Solving", "Teamwork", "Communication", "Time Management"],
  },
];

const Skills = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="skills" className="section-padding bg-card">
      <div className="container-narrow" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-accent uppercase tracking-wider">Skills</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">
            Technical Expertise
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            A snapshot of the technologies and skills I've developed through coursework and personal projects.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {skillCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-6 md:p-8 rounded-2xl bg-background border border-border hover:border-accent/30 hover:shadow-card transition-all duration-300 group"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                  <category.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-foreground">{category.title}</h3>
              </div>

              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, skillIndex) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.3, delay: index * 0.1 + skillIndex * 0.05 }}
                    className="px-3 py-1.5 text-sm rounded-lg bg-muted text-foreground hover:bg-accent/10 hover:text-accent transition-colors cursor-default"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
