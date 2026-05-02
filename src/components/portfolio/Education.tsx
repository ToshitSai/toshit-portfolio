import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { GraduationCap, Calendar, MapPin, Award } from "lucide-react";

const education = [
  {
    degree: "Bachelor of Technology (B.Tech) in Computer Science Engineering",
    institution: "Chaitanya Deemed to be University\nNxtWave Institute of Advanced Technologies (NIAT)",
    location: "India",
    period: "2025 - 2029",
    status: "In Progress",
    gpa: "",
    highlights: [
      "Computer Science Engineering",
      "Web Development",
      "Data Structures & Algorithms",
      "Software Engineering",
    ],
  },
  {
    degree: "Intermediate (12th Grade) - MPC Stream",
    institution: "Bhavishya Junior College",
    location: "India",
    period: "2021 - 2023",
    status: "Completed",
    gpa: "",
    highlights: [
      "Mathematics",
      "Physics",
      "Chemistry",
    ],
  },
];

const Education = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="education" className="section-padding">
      <div className="container-narrow" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-accent uppercase tracking-wider">Education</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">
            Academic Background
          </h2>
        </motion.div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-border hidden md:block" />

          <div className="space-y-8">
            {education.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -40 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative"
              >
                {/* Timeline Dot */}
                <div className="absolute left-6 top-8 w-5 h-5 rounded-full bg-accent border-4 border-background shadow-glow hidden md:block" />

                <div className="md:ml-20 p-6 md:p-8 rounded-2xl bg-card border border-border hover:border-accent/30 hover:shadow-card-hover transition-all duration-300">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <GraduationCap className="w-5 h-5 text-accent" />
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          item.status === "In Progress" 
                            ? "bg-accent/10 text-accent" 
                            : "bg-muted text-muted-foreground"
                        }`}>
                          {item.status}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-foreground">{item.degree}</h3>
                      <p className="text-muted-foreground font-medium whitespace-pre-line">{item.institution}</p>
                    </div>
                    {item.gpa && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                        <Award className="w-4 h-4" />
                        GPA: {item.gpa}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {item.period}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {item.location}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {item.highlights.map((highlight, i) => (
                      <span
                        key={i}
                        className="text-xs px-3 py-1 rounded-full bg-secondary text-secondary-foreground"
                      >
                        {highlight}
                      </span>
                    ))}
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

export default Education;
