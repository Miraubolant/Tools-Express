import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'success' | 'secondary';
  icon?: LucideIcon;
  isLoading?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  icon: Icon,
  isLoading,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/25',
    success: 'bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/25',
    secondary: 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-5 h-5" />}
      {children}
    </button>
  );
}