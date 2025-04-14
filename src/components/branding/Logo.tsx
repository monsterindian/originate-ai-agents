
import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'white' | 'mono';
  showTagline?: boolean;
}

const Logo: React.FC<LogoProps> = ({ 
  className = "", 
  size = "md",
  variant = "default",
  showTagline = false
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
    <div className={`flex flex-col items-center ${className}`}>
      <img 
        src="/lovable-uploads/e4b25188-2fa1-497d-ae5d-db4b07d5cd39.png" 
        alt="Credion Logo" 
        className={`${getSizeClass()}`}
      />
      {showTagline && (
        <span className="text-xs mt-1 font-medium">Beter gefinancierd</span>
      )}
    </div>
  );
};

export default Logo;
