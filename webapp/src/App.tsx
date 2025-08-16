import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/DashboardPage';
import { ProtectedRoute } from './components/common/auth/ProtectedRoute';

function App() {
    return (
        <div className="min-h-screen bg-gray-100">
			<Routes>
				<Route path='/login' element={<LoginPage />} />

				<Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />

				<Route path='/' element={<Navigate to='/dashboard' replace />} />
			</Routes>
        </div>
    )
}

export default App;