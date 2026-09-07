import React from "react";
import { motion, useScroll, useVelocity, useSpring, useTransform, useReducedMotion } from "framer-motion";

interface VelocityTiltWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export const VelocityTiltWrapper: React.FC<VelocityTiltWrapperProps> = ({ children, className = "" }) => {
  const shouldReduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);

  // Smooth out velocity with responsive spring physics
  const smoothVelocity = useSpring(scrollVelocity, {
    stiffness: 300,
    damping: 32,
    mass: 0.5,
  });

  // Map scroll velocity (-3000px/s to +3000px/s) to subtle skew (-1.1deg to +1.1deg)
  const skewY = useTransform(smoothVelocity, [-3000, 0, 3000], [-1.1, 0, 1.1]);

  return (
    <motion.div
      style={{
        skewY: shouldReduceMotion ? 0 : skewY,
        willChange: "transform",
      }}
      className={`w-full origin-center ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default VelocityTiltWrapper;
