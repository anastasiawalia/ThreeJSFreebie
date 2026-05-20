import svgPaths from "./svg-bmuco7av5y";

function Group() {
  return (
    <div className="-translate-x-1/2 absolute contents leading-[0] left-[calc(50%+0.5px)] text-[60px] text-black text-center top-[435px] tracking-[-1.5px] uppercase whitespace-nowrap">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Open_Sans:SemiBold',sans-serif] font-semibold justify-center left-1/2 top-[463px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[55.8px]">Anastasia Walia</p>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Bacasime_Antique:Regular',sans-serif] justify-center left-[calc(50%+0.5px)] not-italic top-[532.8px]">
        <p className="leading-[55.8px]">Lead Product Designer</p>
      </div>
    </div>
  );
}

function IconsVisit() {
  return (
    <div className="absolute h-[51px] left-[803px] top-[646.8px] w-[314px]" data-name="icons/visit">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 314 51">
        <path clipRule="evenodd" d={svgPaths.p24003300} fill="url(#paint0_linear_1_38)" fillRule="evenodd" id="Fill 1" />
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_38" x1="0" x2="314" y1="25.5" y2="25.5">
            <stop stopColor="#8338EC" />
            <stop offset="0.769231" stopColor="#B923FF" />
          </linearGradient>
        </defs>
      </svg>
      <p className="absolute font-['Open_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[35.34%] right-[31.85%] text-[#f8f8f8] text-[16px] text-center top-[calc(50%-9.5px)] tracking-[1px] uppercase" style={{ fontVariationSettings: "'wdth' 100" }}>
        Follow Me
      </p>
    </div>
  );
}

function Group1() {
  return (
    <div className="-translate-x-1/2 absolute contents left-[calc(50%+0.5px)] top-[435px]">
      <Group />
      <div className="-translate-x-1/2 absolute font-['Open_Sans:Regular',sans-serif] font-normal leading-[18.9px] left-1/2 text-[#787878] text-[14px] text-center top-[584.8px] uppercase whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="mb-0">{`AI • Research `}</p>
        <p>{`Follow me on sub stack `}</p>
      </div>
      <IconsVisit />
    </div>
  );
}

export default function Hero() {
  return (
    <div className="bg-white relative size-full" data-name="Hero">
      <Group1 />
    </div>
  );
}