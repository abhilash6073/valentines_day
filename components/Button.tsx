import { ButtonHTMLAttributes, ReactNode, forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'yes' | 'no';
    children: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ variant = 'yes', className, children, ...props }, ref) => {
    const baseStyles = "px-8 py-3 rounded-full font-bold text-lg transition-all transform hover:scale-105 active:scale-95 shadow-lg";

    const variants = {
        yes: "bg-green-500 hover:bg-green-600 text-white shadow-green-200",
        no: "bg-romantic-500 hover:bg-romantic-600 text-white shadow-rose-200",
    };

    return (
        <button
            ref={ref}
            className={twMerge(baseStyles, variants[variant], className)}
            {...props}
        >
            {children}
        </button>
    );
});

Button.displayName = 'Button';

export default Button;
