import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonProps) {
  const baseClasses = 'btn inline-flex items-center justify-center font-medium transition-all focus-ring disabled:opacity-40 disabled:cursor-not-allowed';

  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'text-foreground hover:bg-background-elevated',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-md',
    md: 'px-6 py-2.5 text-sm rounded-lg',
    lg: 'px-8 py-3 text-base rounded-lg',
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${variant === 'ghost' ? sizes[size] : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
