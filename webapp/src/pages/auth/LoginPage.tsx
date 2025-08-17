import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/common/layout/Button';
import Input from '../../components/common/layout/Input';
import { 
    MdEmail, 
    MdLock, 
    MdVisibility, 
    MdVisibilityOff,
    MdCheckCircle 
} from 'react-icons/md';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            const from = location.state?.from?.pathname || '/dashboard';
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, location]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await login(email, password);
            // Redirect will happen automatically via useEffect
        } catch (err) {
            console.error('Login failed:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left side - Background with gradient */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 via-primary-500 to-primary-800 relative">
                <div className="absolute inset-0 bg-black opacity-20"></div>
                <div className="relative z-10 flex flex-col justify-center items-center text-white px-12">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold mb-4">FastGrade</h1>
                        <p className="text-xl text-primary-100 mb-8">
                            Streamline your grading process with intelligent feedback
                        </p>
                        <div className="space-y-4 text-left">
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
                                    <MdCheckCircle className="w-4 h-4" />
                                </div>
                                <span>Create reusable comment templates</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
                                    <MdCheckCircle className="w-4 h-4" />
                                </div>
                                <span>Organize feedback by categories</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
                                    <MdCheckCircle className="w-4 h-4" />
                                </div>
                                <span>Save time with smart shortcuts</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right side - Login form */}
            <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    {/* Mobile logo */}
                    <div className="lg:hidden text-center">
                        <h1 className="text-3xl font-bold text-primary-600">FastGrade</h1>
                    </div>

                    <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-secondary-900">
                            Welcome
                        </h2>
                        <p className="mt-2 text-center text-sm text-secondary-600">
                            Sign in to your account to continue
                        </p>
                        <p className="mt-1 text-center text-xs text-primary-500">
                            (Any email/password will work for now)
                        </p>
                    </div>
                    
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                label="Email address"
                                placeholder="Enter your email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                leftIcon={<MdEmail className="w-5 h-5" />}
                                fullWidth
                            />
                            
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                label="Password"
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                leftIcon={<MdLock />}
                                rightIcon={showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                                onRightIconClick={() => setShowPassword(!showPassword)}
                                fullWidth
                            />
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            fullWidth
                            isLoading={isLoading}
                        >
                            Sign in
                        </Button>

                        <div className="text-center">
                            <p className="text-xs text-secondary-500">
                                By signing in, you agree to our Terms of Service and Privacy Policy
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;