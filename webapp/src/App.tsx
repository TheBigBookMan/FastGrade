import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/DashboardPage';
import { ProtectedRoute } from './components/common/auth/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';

function App() {
    return (
		<AuthProvider>
			<div className="min-h-screen bg-gray-100">
				<Routes>
					<Route path='/login' element={<LoginPage />} />

					<Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />

					<Route path='/' element={<Navigate to='/dashboard' replace />} />
				</Routes>
			</div>
		</AuthProvider>
    )
}

export default App;