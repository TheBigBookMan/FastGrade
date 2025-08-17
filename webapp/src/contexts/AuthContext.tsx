import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
    id: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>({
        id: 'cmefbpxze000069dq75m7jc7m',
        email: 'test@test.com'
    });

    const login = async (email: string, password: string) => {
        // Hardcoded login - accept any email/password for now
        console.log('Logging in with:', { email, password });
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Set hardcoded user
        setUser({
            id: 'cmefbpxze000069dq75m7jc7m',
            email: 'test@test.com'
        });
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};