import { Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import PlaceholderPage from './pages/PlaceholderPage';
import AdminLayout from './layouts/AdminLayout';
import { useAdminAuth } from './hooks/useAdminAuth';
import { LoadingScreen } from './components/LoadingScreen';
import ProductsPage from './pages/ProductsPage';
import CategoriesPage from './pages/CategoriesPage';
import CustomersPage from './pages/CustomersPage';
import CustomerDetailPage from './pages/CustomerDetailPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import PaymentsPage from './pages/PaymentsPage';

function ProtectedRoute({ children, isAuthenticated }: { children: React.ReactNode, isAuthenticated: boolean }) {
    return isAuthenticated ? (
        <AdminLayout>{children}</AdminLayout>
    ) : (
        <Navigate to="/login" replace />
    );
}

function App() {
    const { isLoading, isAuthenticated } = useAdminAuth();

    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
                path="/"
                element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />}
            />
            <Route path="/dashboard" element={<ProtectedRoute isAuthenticated={isAuthenticated}><DashboardPage /></ProtectedRoute>} />
            <Route path="/products" element={<ProtectedRoute isAuthenticated={isAuthenticated}><ProductsPage /></ProtectedRoute>} />
            <Route path="/categories" element={<ProtectedRoute isAuthenticated={isAuthenticated}><CategoriesPage /></ProtectedRoute>} />
            <Route path="/customers" element={<ProtectedRoute isAuthenticated={isAuthenticated}><CustomersPage /></ProtectedRoute>} />
            <Route path="/customers/:id" element={<ProtectedRoute isAuthenticated={isAuthenticated}><CustomerDetailPage /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute isAuthenticated={isAuthenticated}><OrdersPage /></ProtectedRoute>} />
            <Route path="/orders/:id" element={<ProtectedRoute isAuthenticated={isAuthenticated}><OrderDetailPage /></ProtectedRoute>} />
            <Route path="/payments" element={<ProtectedRoute isAuthenticated={isAuthenticated}><PaymentsPage /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute isAuthenticated={isAuthenticated}><PlaceholderPage title="Settings" /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;
