import { NavLink } from 'react-router-dom';

const navigationItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Comments', path: '/comments' },
    { name: 'Categories', path: '/categories' },
    { name: 'Rubrics', path: '/rubrics' },
];

export const Navigation = () => {
    return (
        <nav className="hidden md:flex bg-secondary-100 rounded-lg p-1">
            {navigationItems.map((item) => (
                <NavLink
                    key={item.name}
                    to={item.path}
                    className={({ isActive }) =>
                        `relative px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                            isActive
                                ? 'text-primary-600 bg-white shadow-sm ring-1 ring-primary-200'
                                : 'text-secondary-600 hover:text-primary-600 hover:bg-white/50'
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