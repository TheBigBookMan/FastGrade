import { NavLink } from 'react-router-dom';

const navigationItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Comments', path: '/comments' },
    { name: 'Categories', path: '/categories' },
    { name: 'Rubrics', path: '/rubrics' },
    { name: 'Feedback', path: '/feedback' },
];

const Navigation = () => {
    return (
        <nav className="hidden md:flex space-x-8">
            {navigationItems.map((item) => (
                <NavLink
                    key={item.name}
                    to={item.path}
                    className={({ isActive }) =>
                        `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            isActive
                                ? 'text-primary-600 bg-primary-50 border-b-2 border-primary-600'
                                : 'text-secondary-600 hover:text-primary-600 hover:bg-primary-50'
                        }`
                    }
                >
                    {item.name}
                </NavLink>
            ))}
        </nav>
    );
};

export default Navigation;