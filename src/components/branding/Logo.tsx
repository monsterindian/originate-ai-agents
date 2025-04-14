
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
        src="/lovable-uploads/b33a1622-519b-4d29-bcb5-c1f47afab476.png" 
        alt="gaigentic Logo" 
        className={`${getSizeClass()}`}
      />
    </div>
  );
};

export default Logo;
