import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import cn from '@/lib/cn';

const buttonVariants = cva(
    'relative overflow-hidden font-mono inline-flex items-center justify-center rounded-3xl disabled:opacity-50 disabled:pointer-events-none outline-dashed -outline-offset-2 transition-all ease-elastic focus:bg-opacity-30 focus:outline-offset-8 hover:outline-offset-8 focus:scale-100 outline-1 outline-dashed outline-slate-500 disabled:cursor-not-allowed select-none group',
    {
        variants: {
            variant: {
                default: 'bg-transparent text-white',
                destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
                outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
                secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
                ghost: 'hover:bg-accent hover:text-accent-foreground',
                link: 'underline-offset-4 hover:underline text-primary',
            },
            size: {
                default: 'h-10 py-2 px-4',
                sm: 'h-9 px-3',
                lg: 'h-11 px-8',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    },
);

export interface ButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    // eslint-disable-next-line react/require-default-props
    asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({
        className, variant, size, asChild = false, ...props
    }, ref) => {
        const Comp = asChild ? Slot : 'button';
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...{ ...props, children: undefined }}
            >
                <div className="absolute inset-0 bg-background/20 bg-gradient-to-br from-slate-500 to-pink-500 w-[400%] h-[400%] group-data-loading:animate-gradient-flow transition-all duration-5000 group-active:-translate-x-1/2 group-active:-translate-y-1/2" aria-hidden="true" />
                <div className="relative">
                    {props.children}
                </div>
            </Comp>
        );
    },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
