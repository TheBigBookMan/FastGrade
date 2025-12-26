import OrgLogo from './OrgLogo.tsx';
import Navigation from './Navigation.tsx';
import UserMenu from './UserMenu.tsx';
import { MdMenu, MdClose } from 'react-icons/md';
import { useState } from 'react';

const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navigationItems = [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Comments', path: '/comments' },
        { name: 'Categories', path: '/categories' },
        { name: 'Attachments', path: '/attachments' },
        { name: 'Feedback', path: '/feedback' },
    ];

    return (
        <header className="bg-white shadow-sm border-b border-secondary-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <OrgLogo />
                    
                    {/* Desktop Navigation */}
                    <Navigation />
                    
                    {/* User Menu */}
                    <UserMenu />
                    
                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 rounded-md text-secondary-400 hover:text-secondary-500 hover:bg-secondary-100"
                    >
                        {isMobileMenuOpen ? (
                            <MdClose className="w-6 h-6" />
                        ) : (
                            <MdMenu className="w-6 h-6" />
                        )}
                    </button>
                </div>
                
                {/* Mobile Navigation */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t border-secondary-200 py-4">
                        <nav className="space-y-2">
                            {navigationItems.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.path}
                                    className="block px-3 py-2 rounded-md text-base font-medium text-secondary-700 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {item.name}
                                </a>
                            ))}
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;