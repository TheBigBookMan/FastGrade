import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/DashboardPage';
import { ProtectedRoute } from './components/common/auth/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import CommentsPage from './pages/CommentsPage';
import CategoriesPage from './pages/CategoriesPage';
import RubricsPage from './pages/RubricsPage';
import FeedbackPage from './pages/FeedbackPage';
import SettingsPage from './pages/SettingsPage';

function App() {
    return (
		<AuthProvider>
			<div className="min-h-screen bg-gray-100">
				<Routes>
					<Route path='/login' element={<LoginPage />} />

					<Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
					<Route path="/comments" element={<ProtectedRoute><CommentsPage /></ProtectedRoute>} />
					<Route path="/categories" element={<ProtectedRoute><CategoriesPage /></ProtectedRoute>} />
					<Route path="/rubrics" element={<ProtectedRoute><RubricsPage /></ProtectedRoute>} />
					<Route path="/feedback" element={<ProtectedRoute><FeedbackPage /></ProtectedRoute>} />
					<Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

					<Route path='/' element={<Navigate to='/dashboard' replace />} />
				</Routes>
			</div>
		</AuthProvider>
    )
}

export default App;