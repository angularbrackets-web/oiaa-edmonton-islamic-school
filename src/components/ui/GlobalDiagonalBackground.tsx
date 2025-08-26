import React from 'react';

interface GlobalDiagonalBackgroundProps {
  children: React.ReactNode;
  angle?: number;
  leftColor?: string;
  rightColor?: string;
  animated?: boolean;
}

export default function GlobalDiagonalBackground({
  children,
  angle = 15,
  leftColor = '#F2F0EC', // warm-white
  rightColor = '#bdc19c', // sage-green-light
  animated = false
}: GlobalDiagonalBackgroundProps) {
  
  // Calculate the diagonal line parameters
  const slopePercent = Math.tan(angle * Math.PI / 180) * 100;
  
  return (
    <div className="relative min-h-screen">
      {/* Global diagonal backgrounds */}
      <div className="fixed inset-0 z-0">
        {/* Left side background */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundColor: leftColor,
            clipPath: `polygon(0 0, calc(50vw + ${slopePercent}vh) 0, calc(50vw - ${slopePercent}vh) 100%, 0 100%)`
          }}
        />
        
        {/* Right side background */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundColor: rightColor,
            clipPath: `polygon(calc(50vw + ${slopePercent}vh) 0, 100% 0, 100% 100%, calc(50vw - ${slopePercent}vh) 100%)`,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='1' stroke-opacity='0.05'%3E%3Cpath d='M0 40L40 0M10 40L40 10M20 40L40 20M30 40L40 30'/%3E%3C/g%3E%3C/svg%3E")`
          }}
        >
          {/* Animated overlay */}
          {animated && (
            <div className="absolute inset-0 opacity-20 diagonal-shimmer bg-gradient-to-r from-transparent via-white to-transparent" />
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}