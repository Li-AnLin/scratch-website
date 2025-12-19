import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const baseStyle = "font-bold rounded-2xl transition-transform active:scale-95 flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-yellow-400 text-yellow-900 hover:bg-yellow-300 shadow-[0_4px_0_rgb(180,83,9)]",
    secondary: "bg-blue-400 text-white hover:bg-blue-300 shadow-[0_4px_0_rgb(29,78,216)]",
    accent: "bg-green-500 text-white hover:bg-green-400 shadow-[0_4px_0_rgb(21,128,61)]",
    outline: "border-2 border-slate-300 text-slate-500 hover:border-slate-400 hover:text-slate-600"
  };

  const sizes = {
    sm: "px-3 py-1 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-xl"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};