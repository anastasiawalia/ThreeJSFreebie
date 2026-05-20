import { useRef, useEffect, useState } from "react";
import svgPaths from "../utils/svgPaths";
import ThreeBackground from "./ThreeBackground";

function FollowButton() {
  return (
    <button className="relative w-full max-w-[314px] h-[51px] group hover:opacity-90 transition-opacity">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 314 51">
        <path 
          clipRule="evenodd" 
          d={svgPaths.p24003300} 
          fill="url(#paint0_linear_1_38)" 
          fillRule="evenodd" 
        />
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_38" x1="0" x2="314" y1="25.5" y2="25.5">
            <stop stopColor="#8338EC" />
            <stop offset="0.769231" stopColor="#B923FF" />
          </linearGradient>
        </defs>
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-['Open_Sans',sans-serif] font-semibold text-[#f8f8f8] text-[16px] tracking-[1px] uppercase">
        Subscribe
      </span>
    </button>
  );
}

export default function Hero() {
  const backgroundRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);

  const handleCTAClick = () => {
    if (backgroundRef.current) {
      backgroundRef.current.triggerExplosion();
    }
  };

  // Listen for clicks anywhere on the screen
  useEffect(() => {
    const handleClick = () => {
      if (backgroundRef.current) {
        backgroundRef.current.triggerExplosion();
      }
    };

    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, []);

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate parallax transform for hero content
  const parallaxOffset = scrollY * 0.5;

  return (
    <div className="min-h-[92vh] w-full flex items-center justify-center px-4 py-8 md:py-16 relative overflow-hidden" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
      <ThreeBackground ref={backgroundRef} />
      <div 
        className="flex flex-col items-center text-center max-w-4xl w-full relative z-10"
        style={{ transform: `translateY(${parallaxOffset}px)` }}
      >
        {/* Main heading */}
        <h1 className="font-['Open_Sans',sans-serif] font-semibold text-black text-4xl sm:text-5xl md:text-6xl lg:text-[60px] leading-tight tracking-[-1.5px] uppercase mb-2 md:mb-3">
          Anastasia
        </h1>
        
        {/* Subtitle */}
        <h2 className="font-['Bacasime_Antique',sans-serif] text-black text-3xl sm:text-4xl md:text-5xl lg:text-[60px] leading-tight tracking-[-1.5px] uppercase mb-1">
          Product Designer
        </h2>
        
        {/* Description */}
        <div className="font-['Open_Sans',sans-serif] font-normal text-[#787878] text-sm uppercase leading-relaxed mb-6 md:mb-8 space-y-1">
          <p>AI • Research</p>
        </div>
        
        {/* Button */}
        <a 
          href="https://substack.com/@anastasiawalia" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-block"
          onClick={handleCTAClick}
        >
          <FollowButton />
        </a>
        
        {/* Hire Me Link */}
        <a 
          href="https://www.linkedin.com/in/anastasiawalia" 
          target="_blank" 
          rel="noopener noreferrer"
          className="font-['Open_Sans',sans-serif] font-normal text-[#787878] text-sm mt-4 hover:text-black transition-colors underline"
          onClick={handleCTAClick}
        >
          hire me
        </a>
      </div>
    </div>
  );
}
