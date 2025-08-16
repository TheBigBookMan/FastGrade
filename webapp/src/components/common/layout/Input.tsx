import { InputHTMLAttributes, ReactNode, useState } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    onRightIconClick?: () => void;
    fullWidth?: boolean;
}

const Input = ({ 
    label, 
    error, 
    leftIcon, 
    rightIcon, 
    onRightIconClick,
    fullWidth = false,
    className = '',
    id,
    ...props 
}: InputProps) => {
    const [isFocused, setIsFocused] = useState(false);
    
    const baseClasses = "appearance-none relative block w-full py-3 border placeholder-secondary-500 text-secondary-900 rounded-lg focus:outline-none focus:ring-2 focus:z-10 sm:text-sm transition-colors bg-white";
    
    const stateClasses = error 
        ? "border-error-300 focus:ring-error-500 focus:border-error-500" 
        : isFocused 
            ? "border-primary-500 focus:ring-primary-500 focus:border-primary-500"
            : "border-secondary-300 focus:ring-primary-500 focus:border-primary-500";
    
    const paddingClasses = leftIcon ? "pl-10" : "pl-3";
    const rightPaddingClasses = rightIcon ? "pr-12" : "pr-3";
    const widthClass = fullWidth ? "w-full" : "";
    
    const classes = `${baseClasses} ${stateClasses} ${paddingClasses} ${rightPaddingClasses} ${widthClass} ${className}`;

    return (
        <div className={fullWidth ? "w-full" : ""}>
            {label && (
                <label htmlFor={id} className="block text-sm font-medium text-secondary-700 mb-1">
                    {label}
                </label>
            )}
            
            <div className="relative">
                {leftIcon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <div className="h-5 w-5 text-secondary-400">
                            {leftIcon}
                        </div>
                    </div>
                )}
                
                <input
                    id={id}
                    className={classes}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    {...props}
                />
                
                {rightIcon && (
                    <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={onRightIconClick}
                    >
                        <div className="h-5 w-5 text-secondary-400 hover:text-secondary-600">
                            {rightIcon}
                        </div>
                    </button>
                )}
            </div>
            
            {error && (
                <p className="mt-1 text-sm text-error-600">
                    {error}
                </p>
            )}
        </div>
    );
};

export default Input;