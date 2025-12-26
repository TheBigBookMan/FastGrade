interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    color?: 'primary' | 'secondary' | 'white';
    text?: string;
    showText?: boolean;
    className?: string;
}

const LoadingSpinner = ({ 
    size = 'md', 
    color = 'primary', 
    text = 'Loading...',
    showText = false,
    className = ''
}: LoadingSpinnerProps) => {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12',
        xl: 'h-16 w-16'
    };

    const colorClasses = {
        primary: 'border-primary-600',
        secondary: 'border-secondary-600',
        white: 'border-white'
    };

    return (
        <div className={`flex flex-col items-center justify-center space-y-2 ${className}`}>
            <div 
                className={`animate-spin rounded-full border-b-2 ${sizeClasses[size]} ${colorClasses[color]}`}
            />
            
            {showText && (
                <p className="text-secondary-600 text-sm font-medium">
                    {text}
                </p>
            )}
        </div>
    );
};

export default LoadingSpinner;