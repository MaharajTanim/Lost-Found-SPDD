import React from 'react';
import { Compass } from 'lucide-react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = 'h-6 w-6' }) => {
  return <Compass className={className} />;
};

export default Logo;