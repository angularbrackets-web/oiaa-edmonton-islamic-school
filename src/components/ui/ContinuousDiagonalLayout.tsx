import React from 'react';

interface DiagonalSection {
  id: string;
  children: React.ReactNode;
  leftColor: string;
  rightColor: string;
  animated?: boolean;
  pattern?: 'dots' | 'lines' | 'geometric' | 'none';
}

interface ContinuousDiagonalLayoutProps {
  sections: DiagonalSection[];
  angle?: number; // degrees from horizontal
}

export default function ContinuousDiagonalLayout({
  sections,
  angle = 15
}: ContinuousDiagonalLayoutProps) {
  
  const getPatternSVG = (pattern: string) => {
    switch (pattern) {
      case 'dots':
        return `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='3' cy='3' r='1'/%3E%3Ccircle cx='13' cy='13' r='1'/%3E%3C/g%3E%3C/svg%3E")`;
      case 'lines':
        return `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='1' stroke-opacity='0.1'%3E%3Cpath d='M0 40L40 0M10 40L40 10M20 40L40 20M30 40L40 30'/%3E%3C/g%3E%3C/svg%3E")`;
      case 'geometric':
        return `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='1' stroke-opacity='0.1'%3E%3Cpath d='M30 0L60 30L30 60L0 30Z'/%3E%3C/g%3E%3C/svg%3E")`;
      default:
        return 'none';
    }
  };

  // Calculate the slope for continuous diagonal line
  const slopePercent = Math.tan(angle * Math.PI / 180) * 100;

  return (
    <div className="relative">
      {sections.map((section, index) => {
        // Calculate the diagonal offset for each section to create continuity
        const baseOffset = 50; // Start at 50% width
        const diagonalShift = index * slopePercent * 0.8; // Adjust shift rate
        
        // Calculate diagonal points - ensure they extend beyond screen edges
        const leftTop = Math.max(-50, Math.min(150, baseOffset - diagonalShift));
        const leftBottom = leftTop - slopePercent;
        const rightTop = leftTop;
        const rightBottom = leftTop + slopePercent;
        
        return (
          <section key={section.id} className="relative min-h-screen">
            {/* Background layer that extends beyond section boundaries */}
            <div className="absolute inset-0 -top-20 -bottom-20 overflow-hidden">
              {/* Left background */}
              <div 
                className={`absolute inset-0 ${section.leftColor}`}
                style={{
                  clipPath: `polygon(0% 0%, 60% 0%, 40% 100%, 0% 100%)`
                }}
              />
              
              {/* Right background with optional animation and pattern */}
              <div 
                className={`absolute inset-0 ${section.rightColor}`}
                style={{
                  clipPath: `polygon(40% 0%, 100% 0%, 100% 100%, 60% 100%)`,
                  backgroundImage: section.pattern !== 'none' ? getPatternSVG(section.pattern || 'none') : undefined
                }}
              >
              {/* Animated overlay for Stripe-style effect */}
              {section.animated && (
                <div 
                  className="absolute inset-0 opacity-20 diagonal-shimmer"
                  style={{
                    background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)',
                  }}
                />
              )}
            </div>
            </div>
            
            {/* Content */}
            <div className="relative z-10">
              {section.children}
            </div>
          </section>
        );
      })}
    </div>
  );
}