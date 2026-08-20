import React from "react";
import Navbar from "@/components/portfolio/Navbar";
import ContactFooter from "@/components/portfolio/ContactFooter";
import CustomCursor from "@/components/portfolio/CustomCursor";

const ContactPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#20252A] text-[#F3EEE2] font-sans relative">
      <CustomCursor />
      <Navbar />
      <div className="pt-16">
        <ContactFooter />
      </div>
    </div>
  );
};

export default ContactPage;
