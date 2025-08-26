import React from 'react';

interface DiagonalSectionOverlayProps {
  children: React.ReactNode;
  leftColor: string;
  rightColor: string;
  animated?: boolean;
  pattern?: 'dots' | 'lines' | 'geometric' | 'none';
}

export default function DiagonalSectionOverlay({
  children,
  leftColor,
  rightColor,
  animated = false,
  pattern = 'none'
}: DiagonalSectionOverlayProps) {
  
  const getPatternSVG = (pattern: string) => {
    switch (pattern) {
      case 'dots':
        return `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Ccircle cx='3' cy='3' r='1'/%3E%3Ccircle cx='13' cy='13' r='1'/%3E%3C/g%3E%3C/svg%3E")`;
      case 'lines':
        return `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='1' stroke-opacity='0.15'%3E%3Cpath d='M0 40L40 0M10 40L40 10M20 40L40 20M30 40L40 30'/%3E%3C/g%3E%3C/svg%3E")`;
      case 'geometric':
        return `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='1' stroke-opacity='0.15'%3E%3Cpath d='M30 0L60 30L30 60L0 30Z'/%3E%3C/g%3E%3C/svg%3E")`;
      default:
        return 'none';
    }
  };

  return (
    <section className="relative min-h-screen">
      {/* Full viewport diagonal backgrounds */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Left background - extends to screen edge */}
        <div 
          className={`absolute inset-0 ${leftColor}`}
          style={{
            clipPath: `polygon(0% 0%, 70% 0%, 30% 100%, 0% 100%)`
          }}
        />
        
        {/* Right background - extends to screen edge */}
        <div 
          className={`absolute inset-0 ${rightColor}`}
          style={{
            clipPath: `polygon(30% 0%, 100% 0%, 100% 100%, 70% 100%)`,
            backgroundImage: pattern !== 'none' ? getPatternSVG(pattern) : undefined
          }}
        >
          {/* Animated shimmer overlay */}
          {animated && (
            <div 
              className="absolute inset-0 opacity-30"
              style={{
                background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)',
                animation: 'shimmer 3s ease-in-out infinite'
              }}
            />
          )}
        </div>
      </div>
      
      {/* Content layer */}
      <div className="relative z-10">
        {children}
      </div>
    </section>
  );
}