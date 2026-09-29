import React from 'react';
import Link from 'next/link';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  className?: string;
  children?: React.ReactNode;
  target?: string;
  rel?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'btn-gradient text-white shadow-md hover:scale-[1.02] active:scale-[0.98] border-transparent',
  secondary: 'bg-secondary text-white hover:bg-secondary/90 shadow-sm border-transparent hover:scale-[1.02] active:scale-[0.98]',
  outline: 'bg-white border-2 border-primary text-primary hover:bg-brand-light shadow-xs hover:scale-[1.02] active:scale-[0.98]',
  ghost: 'bg-brand-light/80 hover:bg-brand-light text-primary border border-brand-border/60 hover:border-brand-border',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3.5 py-1.5 text-xs rounded-full gap-1.5',
  md: 'px-6 py-3 text-sm rounded-full gap-2',
  lg: 'px-8 py-4 text-base rounded-full gap-2.5',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  href,
  icon,
  iconPosition = 'left',
  className = '',
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses = `inline-flex items-center justify-center font-bold text-center transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:pointer-events-none ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  const content = (
    <>
      {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
      {children && <span>{children}</span>}
      {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
    </>
  );

  if (href) {
    if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
      return (
        <a href={href} className={baseClasses} target={props.target} rel={props.rel}>
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={baseClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button className={baseClasses} disabled={disabled} {...props}>
      {content}
    </button>
  );
}
