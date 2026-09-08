import React from "react";

interface VelocityTiltWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export const VelocityTiltWrapper: React.FC<VelocityTiltWrapperProps> = ({ children, className = "" }) => {
  return (
    <div className={`w-full ${className}`}>
      {children}
    </div>
  );
};

export default VelocityTiltWrapper;

