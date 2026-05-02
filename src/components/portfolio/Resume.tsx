import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { FileText, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

const Resume = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="section-padding bg-card">
      <div className="container-narrow" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 text-accent mb-6">
            <FileText className="w-8 h-8" />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Want to Know More?
          </h2>
          
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            Download my resume to get a comprehensive overview of my education, 
            skills, and experience. I'm excited to bring my passion and skills to your team!
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="xl" className="group">
              <Download className="w-5 h-5 mr-2 group-hover:animate-bounce" />
              Download Resume
            </Button>
            <Button variant="outline" size="xl">
              <Eye className="w-5 h-5 mr-2" />
              View Online
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mt-6">
            Last updated: January 2026
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Resume;
