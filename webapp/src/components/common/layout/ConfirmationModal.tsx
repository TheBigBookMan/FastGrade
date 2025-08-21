import { ReactNode } from "react";
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
    if (!isOpen) return null;

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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentVariant.iconBg}`}>
                        <MdWarning className={`w-6 h-6 ${currentVariant.icon}`} />
                    </div>
                    <h2 className="text-xl font-bold text-secondary-900">{title}</h2>
                </div>
                
                <div className="mb-6">
                    <p className="text-secondary-600">
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
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;