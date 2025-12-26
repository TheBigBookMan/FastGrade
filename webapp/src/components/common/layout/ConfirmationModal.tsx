import { ReactNode, useEffect, useState } from "react";
import Button from "./Button.tsx";
import { MdWarning } from "react-icons/md";

interface ConfirmationModalProps {
    isOpen: boolean;
    title: string;
    message: string | ReactNode;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
    onConfirm: () => void;
    onCancel: () => void;
    isLoading?: boolean;
}

const ConfirmationModal = ({ 
    isOpen, 
    title, 
    message, 
    confirmText = "Confirm", 
    cancelText = "Cancel",
    variant = 'danger',
    onConfirm, 
    onCancel,
    isLoading = false
}: ConfirmationModalProps) => {
    const [shouldRender, setShouldRender] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            // Start with hidden state, then animate in
            setIsAnimating(false);
            // Small delay to ensure DOM is ready, then animate in
            const timer = setTimeout(() => {
                setIsAnimating(true);
            }, 10);
            return () => clearTimeout(timer);
        } else {
            setIsAnimating(false);
            // Wait for exit animation to complete before removing from DOM
            const timer = setTimeout(() => {
                setShouldRender(false);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!shouldRender) return null;

    const variantClasses = {
        danger: {
            icon: "text-error-600",
            button: "bg-error-600 hover:bg-error-700 text-white",
            iconBg: "bg-error-100"
        },
        warning: {
            icon: "text-warning-600",
            button: "bg-warning-600 hover:bg-warning-700 text-white",
            iconBg: "bg-warning-100"
        },
        info: {
            icon: "text-info-600",
            button: "bg-info-600 hover:bg-info-700 text-white",
            iconBg: "bg-info-100"
        }
    };

    const currentVariant = variantClasses[variant];

    return (
        <div 
            className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ease-out ${
                isAnimating 
                    ? 'bg-black bg-opacity-50' 
                    : 'bg-black bg-opacity-0'
            }`}
            onClick={onCancel}
        >
            <div 
                className={`bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-2xl transition-all duration-300 ease-out transform ${
                    isAnimating 
                        ? 'opacity-100 scale-100 translate-y-0' 
                        : 'opacity-0 scale-95 -translate-y-8'
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentVariant.iconBg} transition-colors duration-200`}>
                        <MdWarning className={`w-6 h-6 ${currentVariant.icon}`} />
                    </div>
                    <h2 className="text-xl font-bold text-secondary-900">{title}</h2>
                </div>
                
                <div className="mb-6">
                    <p className="text-secondary-600 leading-relaxed">
                        {message}
                    </p>
                </div>
                
                <div className="flex gap-3">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onCancel}
                        disabled={isLoading}
                        fullWidth
                        className="transition-all duration-200 hover:scale-[1.02]"
                    >
                        {cancelText}
                    </Button>
                    <Button
                        type="button"
                        variant="error"
                        onClick={onConfirm}
                        disabled={isLoading}
                        isLoading={isLoading}
                        fullWidth
                        className="transition-all duration-200 hover:scale-[1.02]"
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;