import { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'error' | 'info';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    fullWidth?: boolean;
}

const Button = ({ 
    children, 
    variant = 'primary', 
    size = 'md', 
    isLoading = false,
    fullWidth = false,
    className = '',
    disabled,
    ...props 
}: ButtonProps) => {
    const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";
    
    const variantClasses = {
        primary: "text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 focus:ring-primary-500",
        secondary: "text-secondary-700 bg-white border border-secondary-300 hover:bg-secondary-50 hover:border-secondary-400 focus:ring-secondary-500",
        error: "text-white bg-gradient-to-r from-error-600 to-error-500 hover:from-error-700 hover:to-error-600 focus:ring-error-500",
        info: "text-white bg-gradient-to-r from-info-600 to-info-500 hover:from-info-700 hover:to-info-600 focus:ring-info-500",
    };
    
    const sizeClasses = {
        sm: "px-3 py-2 text-sm",
        md: "px-4 py-3 text-sm",
        lg: "px-6 py-4 text-base",
    };
    
    const widthClass = fullWidth ? "w-full" : "";
    
    const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`;

    return (
        <button 
            className={classes}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            )}
            {children}
        </button>
    );
}; 

export default Button;