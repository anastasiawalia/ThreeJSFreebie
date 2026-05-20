import svgPaths from "../../imports/svg-bmuco7av5y";

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
        Follow Me
      </span>
    </button>
  );
}

export default function Hero() {
  return (
    <div className="bg-white min-h-screen w-full flex items-center justify-center px-4 py-8 md:py-16">
      <div className="flex flex-col items-center text-center max-w-4xl w-full">
        {/* Main heading */}
        <h1 className="font-['Open_Sans',sans-serif] font-semibold text-black text-4xl sm:text-5xl md:text-6xl lg:text-[60px] leading-tight tracking-[-1.5px] uppercase mb-4 md:mb-6">
          Anastasia Walia
        </h1>
        
        {/* Subtitle */}
        <h2 className="font-['Bacasime_Antique',sans-serif] text-black text-3xl sm:text-4xl md:text-5xl lg:text-[60px] leading-tight tracking-[-1.5px] uppercase mb-6 md:mb-8">
          Lead Product Designer
        </h2>
        
        {/* Description */}
        <div className="font-['Open_Sans',sans-serif] font-normal text-[#787878] text-sm uppercase leading-relaxed mb-6 md:mb-8 space-y-1">
          <p>AI • Research</p>
          <p>Follow me on sub stack</p>
        </div>
        
        {/* Button */}
        <FollowButton />
      </div>
    </div>
  );
}
