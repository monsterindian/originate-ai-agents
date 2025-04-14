
import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'white' | 'mono';
}

const Logo: React.FC<LogoProps> = ({ 
  className = "", 
  size = "md",
  variant = "default"
}) => {
  const getSizeClass = () => {
    switch (size) {
      case 'sm': return 'h-6';
      case 'md': return 'h-8';
      case 'lg': return 'h-10';
      case 'xl': return 'h-12';
      default: return 'h-8';
    }
  };

  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src="/lovable-uploads/c358cff4-5e06-49e8-af0b-d9e4c7099001.png" 
        alt="GaIGentic Logo" 
        className={`${getSizeClass()}`}
      />
    </div>
  );
};

export default Logo;
