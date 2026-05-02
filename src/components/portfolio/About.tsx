import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Code2, Lightbulb, Target, Users } from "lucide-react";

const highlights = [
  { icon: Code2, label: "Clean Code", description: "Writing maintainable solutions" },
  { icon: Lightbulb, label: "Problem Solver", description: "Analytical thinking approach" },
  { icon: Users, label: "Team Player", description: "Collaborative mindset" },
  { icon: Target, label: "Goal Oriented", description: "Focused on results" },
];

const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="section-padding bg-card">
      <div className="container-narrow" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-accent uppercase tracking-wider">About Me</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">
            Get to Know Me
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Avatar & Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative mx-auto w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20 p-1">
              <div className="w-full h-full rounded-xl bg-muted flex items-center justify-center">
                <div className="text-6xl md:text-8xl">👨‍💻</div>
              </div>
            </div>
            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="space-y-6 text-muted-foreground">
              <p className="text-lg leading-relaxed">
                Hello! I'm <span className="text-foreground font-medium">Toshit Sai Galam</span>, a motivated 
                student with a strong interest in <span className="text-foreground font-medium">web development</span> and 
                emerging technologies.
              </p>
              <p className="leading-relaxed">
                I enjoy building real-world projects that help me improve my problem-solving and 
                technical skills. Currently pursuing my B.Tech in Computer Science Engineering, 
                I'm focused on learning modern technologies through hands-on experience.
              </p>
              <p className="leading-relaxed">
                My goal is to secure an <span className="text-foreground font-medium">internship or entry-level role</span> where 
                I can learn, grow, and contribute to meaningful software solutions.
              </p>
            </div>

            {/* Highlights Grid */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              {highlights.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  className="p-4 rounded-xl bg-background border border-border hover:border-accent/50 transition-colors group"
                >
                  <item.icon className="w-5 h-5 text-accent mb-2 group-hover:scale-110 transition-transform" />
                  <p className="font-medium text-foreground text-sm">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
