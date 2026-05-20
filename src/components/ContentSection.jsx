import { useEffect, useState } from 'react';

export default function ContentSection() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const items = [
    { id: 1, title: "Item 1", subtitle: "Interactive product sphere", link: "http://localhost:3000/Item1" },
    { id: 2, title: "Item 2", subtitle: "Morphing blob", link: "http://localhost:3000/Item2" },
    { id: 3, title: "Item 3", subtitle: "Scroll-driven 3D scene", link: "http://localhost:3000/Item4" },
  ];

  // Parallax effect - content moves slower than scroll
  const parallaxOffset = scrollY * 0.3;

  return (
    <div 
      className="w-full bg-[#EDE7F6] py-16 px-4 md:px-8"
      style={{ transform: `translateY(${parallaxOffset}px)` }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="bg-[#EDE7F6] rounded-3xl p-8 md:p-12">
          <div className="flex flex-col md:flex-row gap-8 md:gap-12">
            {/* Title Section */}
            <div className="flex-shrink-0">
              <h2 className="font-['Open_Sans',sans-serif] font-bold text-[#030213] text-3xl md:text-4xl">
                Examples
              </h2>
            </div>

            {/* Items List */}
            <div className="flex-1">
              <div className="space-y-0">
                {items.map((item, index) => (
                  <div key={item.id}>
                    <a
                      href={item.link || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between py-4 group hover:opacity-80 transition-opacity"
                    >
                      <div className="flex-1">
                        <h3 className="font-['Open_Sans',sans-serif] font-semibold text-[#030213] text-lg md:text-xl mb-1">
                          {item.title}
                        </h3>
                        <p className="font-['Open_Sans',sans-serif] font-normal text-gray-500 text-sm md:text-base">
                          {item.subtitle}
                        </p>
                      </div>
                      {/* Arrow Icon - pointing up at an angle */}
                      <svg
                        className="w-5 h-5 text-gray-600 flex-shrink-0 ml-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 17L17 7M7 7h10v10"
                        />
                      </svg>
                    </a>
                    {index < items.length - 1 && (
                      <div className="border-t border-gray-300"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
