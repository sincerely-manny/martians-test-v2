import { forwardRef } from 'react';
import cn from '@/lib/cn';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => (
    <input
        type={type}
        className={cn(
            'flex h-10 w-full origin-left scale-[97%] rounded-3xl border-0 bg-white bg-opacity-20 px-3 py-2 font-mono text-sm outline-dashed outline-1 outline-offset-0 outline-slate-500 backdrop-blur-3xl transition-all duration-300 ease-elastic file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-inherit placeholder:opacity-60 hover:scale-100 focus:scale-100 focus:bg-opacity-30 focus:outline-offset-8 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:animate-shake-x aria-invalid:outline-red-700',
            className,
        )}
        ref={ref}
        aria-invalid={props['aria-invalid'] || !!props['aria-errormessage']}
        {...props}
    />
));
Input.displayName = 'Input';

export { Input };
