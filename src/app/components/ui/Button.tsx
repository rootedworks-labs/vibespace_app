import * as React from 'react';
import { Slot } from '@radix-ui/react-slot'; // 1. Import Slot
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-full text-sm font-bold font-heading transition-all duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'bg-brand-sage text-brand-deep-blue hover:bg-brand-sage/90',
        destructive: 'bg-brand-terracotta text-white hover:bg-brand-terracotta/90',
        outline: 'border border-brand-deep-blue text-brand-deep-blue hover:bg-brand-deep-blue hover:text-white',
        secondary: 'bg-brand-deep-blue text-white hover:bg-brand-deep-blue/90',
        ghost: 'hover:bg-brand-sand hover:text-brand-deep-blue',
        link: 'underline-offset-4 hover:underline text-brand-deep-blue',
      },
      size: {
        default: 'h-10 py-2 px-6',
        sm: 'h-9 px-4',
        lg: 'h-11 px-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean; // 2. Add asChild prop
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    // 3. Use Slot if asChild is true
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
