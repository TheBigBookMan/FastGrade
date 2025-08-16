import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../contexts/AuthContext';
import Button from '../../Button';
import { MdLogout, MdPerson, MdSettings, MdKeyboardArrowDown, MdFeedback } from 'react-icons/md';

const UserMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
        setIsOpen(false);
    };

    const handleSettings = () => {
        navigate('/settings');
        setIsOpen(false);
    };

    const handleFeedback = () => {
        navigate('/feedback');
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-secondary-700 hover:bg-secondary-100 transition-colors"
            >
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <MdPerson className="w-4 h-4 text-primary-600" />
                </div>
                <span className="hidden sm:block text-sm font-medium">
                    {user?.email}
                </span>
                <MdKeyboardArrowDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setIsOpen(false)}
                    />
                    
                    {/* Dropdown */}
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-secondary-200 py-1 z-20">
                        <div className="px-4 py-2 border-b border-secondary-100">
                            <p className="text-sm font-medium text-secondary-900">
                                {user?.email}
                            </p>
                        </div>
                        
                        <button
                            onClick={handleSettings}
                            className="w-full flex items-center px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50 transition-colors"
                        >
                            <MdSettings className="w-4 h-4 mr-2" />
                            Settings
                        </button>

                        <button
                            onClick={handleFeedback}
                            className="w-full flex items-center px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50 transition-colors"
                        >
                            <MdFeedback className="w-4 h-4 mr-2" />
                            Feedback
                        </button>
                        
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center px-4 py-2 text-sm text-error-600 hover:bg-error-50 transition-colors"
                        >
                            <MdLogout className="w-4 h-4 mr-2" />
                            Logout
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default UserMenu;