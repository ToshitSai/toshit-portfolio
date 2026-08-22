import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const About: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
          end: "bottom 40%",
          toggleActions: "play none none reverse",
        },
      });

      // Animate text lines sliding up from mask
      tl.to(
        ".gsap-bio-line",
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          stagger: 0.15,
        },
        0
      );

      // Animate the floating plane along a curved path
      if (planeRef.current) {
        tl.fromTo(
          planeRef.current,
          { opacity: 0, x: -50, y: 30, rotation: -20 },
          {
            opacity: 1,
            x: 120,
            y: -40,
            rotation: 10,
            duration: 2.2,
            ease: "power1.out",
          },
          0.2
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      style={{ backgroundColor: "#FAF6ED" }}
      className="relative w-full py-24 sm:py-32 lg:py-40 text-[#1F2328] overflow-hidden z-10 select-none"
    >
      {/* SUBTLE PAPER NOISE OVERLAY */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply z-0">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <filter id="aboutNoiseFilterClean">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#aboutNoiseFilterClean)" />
        </svg>
      </div>

      <div
        ref={containerRef}
        className="relative max-w-[880px] mx-auto px-6 text-center z-10"
        style={{
          fontFamily: "'Instrument Sans', 'Plus Jakarta Sans', sans-serif",
        }}
      >
        {/* SVG Paper Plane / Accent */}
        <svg
          ref={planeRef}
          className="absolute top-0 left-[10%] sm:left-[15%] w-10 h-10 sm:w-12 sm:h-12 pointer-events-none opacity-0 z-20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M2 12L22 2L13 22L11 13L2 12Z" fill="#F4B5A4" />
        </svg>

        {/* PARAGRAPH 1 MASKED LINES */}
        <div className="overflow-hidden block mb-1.5 sm:mb-2">
          <span className="gsap-bio-line block transform translate-y-full opacity-0 font-normal text-[18px] sm:text-[22px] md:text-[26px] leading-[1.5] text-[#1F2328]">
            I&apos;m Toshit Sai, a Computer Science Engineering student specializing
          </span>
        </div>
        <div className="overflow-hidden block mb-1.5 sm:mb-2">
          <span className="gsap-bio-line block transform translate-y-full opacity-0 font-normal text-[18px] sm:text-[22px] md:text-[26px] leading-[1.5] text-[#1F2328]">
            in Artificial Intelligence &amp; Machine Learning, building what&apos;s next
          </span>
        </div>
        <div className="overflow-hidden block mb-1.5 sm:mb-2">
          <span className="gsap-bio-line block transform translate-y-full opacity-0 font-normal text-[18px] sm:text-[22px] md:text-[26px] leading-[1.5] text-[#1F2328]">
            from intelligent automation tools and prompt engineered workflows
          </span>
        </div>
        <div className="overflow-hidden block mb-8 sm:mb-10">
          <span className="gsap-bio-line block transform translate-y-full opacity-0 font-normal text-[18px] sm:text-[22px] md:text-[26px] leading-[1.5] text-[#1F2328]">
            to context aware web applications and scalable AI powered products.
          </span>
        </div>

        {/* BOLD STATEMENT MASKED LINES */}
        <div className="overflow-hidden block mb-1.5 sm:mb-2">
          <span className="gsap-bio-line block transform translate-y-full opacity-0 font-bold text-[19px] sm:text-[23px] md:text-[27px] leading-[1.4] text-[#1F2328]">
            I believe every great design forms the basis for an even greater story
          </span>
        </div>
        <div className="overflow-hidden block">
          <span className="gsap-bio-line block transform translate-y-full opacity-0 font-bold text-[19px] sm:text-[23px] md:text-[27px] leading-[1.4] text-[#1F2328]">
            and I&apos;m here to keep writing mine.
          </span>
        </div>

      </div>
    </section>
  );
};

export default About;
