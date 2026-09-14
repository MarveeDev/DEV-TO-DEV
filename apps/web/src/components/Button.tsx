import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
};

const VARIANT_CLASS: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'btn--primary',
  secondary: 'btn--secondary',
  outline: 'btn--outline',
  ghost: 'btn--ghost',
};

const SIZE_CLASS: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'btn--sm',
  md: 'btn--md',
  lg: 'btn--lg',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  style,
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  const classes = [
    'btn',
    VARIANT_CLASS[variant],
    SIZE_CLASS[size],
    fullWidth ? 'btn--block' : '',
    className || '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button type={type} className={classes} style={style} {...props}>
      {children}
    </button>
  );
}
