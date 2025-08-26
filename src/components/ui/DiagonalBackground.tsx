import React from 'react';

interface DiagonalBackgroundProps {
  children: React.ReactNode;
  leftColor?: string;
  rightColor?: string;
  animated?: boolean;
  pattern?: 'dots' | 'lines' | 'geometric' | 'none';
  className?: string;
}

export default function DiagonalBackground({
  children,
  leftColor = 'bg-warm-white',
  rightColor = 'bg-sage-green-lighter', 
  animated = false,
  pattern = 'none',
  className = ''
}: DiagonalBackgroundProps) {
  
  const getPatternSVG = () => {
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

  return (
    <section className={`relative overflow-hidden ${className}`}>
      {/* Base background layers */}
      <div className="absolute inset-0">
        {/* Left side */}
        <div className={`absolute inset-0 ${leftColor}`} 
             style={{ clipPath: 'polygon(0 0, 60% 0, 40% 100%, 0 100%)' }} />
        
        {/* Right side with optional animation */}
        <div 
          className={`absolute inset-0 ${rightColor} ${animated ? 'animate-pulse' : ''}`} 
          style={{ 
            clipPath: 'polygon(40% 0, 100% 0, 100% 100%, 60% 100%)',
            backgroundImage: pattern !== 'none' ? getPatternSVG() : undefined
          }} 
        />
        
        {/* Animated overlay for right side */}
        {animated && (
          <div 
            className="absolute inset-0 opacity-20"
            style={{ 
              clipPath: 'polygon(40% 0, 100% 0, 100% 100%, 60% 100%)',
              background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
              animation: 'shimmer 3s ease-in-out infinite'
            }}
          />
        )}
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </section>
  );
}