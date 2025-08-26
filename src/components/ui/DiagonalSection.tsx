import React from 'react';

interface DiagonalSectionProps {
  children: React.ReactNode;
  className?: string;
  angle?: 'up' | 'down' | 'both' | 'none';
  intensity?: 'subtle' | 'medium' | 'strong';
  background?: string;
}

export default function DiagonalSection({ 
  children, 
  className = '',
  angle = 'none',
  intensity = 'medium',
  background = 'bg-white'
}: DiagonalSectionProps) {
  const angles = {
    subtle: '2vw',
    medium: '4vw', 
    strong: '6vw'
  };
  
  const getClipPath = () => {
    switch (angle) {
      case 'up':
        return `polygon(0 ${angles[intensity]}, 100% 0, 100% 100%, 0 100%)`;
      case 'down':
        return `polygon(0 0, 100% 0, 100% calc(100% - ${angles[intensity]}), 0 100%)`;
      case 'both':
        return `polygon(0 ${angles[intensity]}, 100% 0, 100% calc(100% - ${angles[intensity]}), 0 100%)`;
      default:
        return 'none';
    }
  };
  
  const getPadding = () => {
    const base = 'py-20';
    const angleAdjustment = angles[intensity];
    
    switch (angle) {
      case 'up':
        return `pt-[calc(5rem+${angleAdjustment})] pb-20`;
      case 'down':
        return `pt-20 pb-[calc(5rem+${angleAdjustment})]`;
      case 'both':
        return `pt-[calc(5rem+${angleAdjustment})] pb-[calc(5rem+${angleAdjustment})]`;
      default:
        return base;
    }
  };
  
  const clipPath = getClipPath();
  const paddingClass = getPadding();
  
  return (
    <section 
      className={`${background} ${paddingClass} ${className} relative`}
      style={{ 
        clipPath: clipPath !== 'none' ? clipPath : undefined
      }}
    >
      {children}
    </section>
  );
}