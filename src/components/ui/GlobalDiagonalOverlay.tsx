import React from 'react';

interface DiagonalSection {
  sectionId: string;
  startY: number;
  endY: number;
  leftColor: string;
  rightColor: string;
  animated?: boolean;
  pattern?: 'dots' | 'lines' | 'geometric' | 'none';
}

interface GlobalDiagonalOverlayProps {
  sections: DiagonalSection[];
  angle?: number;
}

export default function GlobalDiagonalOverlay({
  sections,
  angle = 12
}: GlobalDiagonalOverlayProps) {
  
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

  // Calculate diagonal slope
  const slope = Math.tan(angle * Math.PI / 180);
  const slopePercent = slope * 100;

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {sections.map((section, index) => {
        // Calculate diagonal position for this section
        const baseOffset = 50; // Start at center
        const diagonalShift = (section.startY / window.innerHeight) * slopePercent * 0.5;
        
        // Calculate diagonal line points that extend beyond screen edges
        const leftTop = Math.max(-100, Math.min(200, baseOffset - diagonalShift));
        const leftBottom = leftTop - slopePercent * 2;
        const rightTop = leftTop;
        const rightBottom = leftTop + slopePercent * 2;

        return (
          <div key={section.sectionId} className="absolute inset-0">
            {/* Left side background */}
            <div 
              className={`absolute ${section.leftColor}`}
              style={{
                top: `${section.startY}px`,
                height: `${section.endY - section.startY}px`,
                left: 0,
                right: 0,
                clipPath: `polygon(0% 0%, ${leftTop}% 0%, ${leftBottom}% 100%, 0% 100%)`
              }}
            />
            
            {/* Right side background */}
            <div 
              className={`absolute ${section.rightColor}`}
              style={{
                top: `${section.startY}px`,
                height: `${section.endY - section.startY}px`,
                left: 0,
                right: 0,
                clipPath: `polygon(${rightTop}% 0%, 100% 0%, 100% 100%, ${rightBottom}% 100%)`,
                backgroundImage: section.pattern !== 'none' ? getPatternSVG(section.pattern || 'none') : undefined
              }}
            >
              {/* Animated overlay */}
              {section.animated && (
                <div 
                  className="absolute inset-0 opacity-20 diagonal-shimmer"
                  style={{
                    background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)'
                  }}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}