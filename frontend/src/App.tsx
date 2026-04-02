
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import Tenants from './pages/Tenants';
import Users from './pages/Users';
import Debtors from './pages/Debtors';
import DebtorProfile from './pages/DebtorProfile';
import Campaigns from './pages/Campaigns';
import Payments from './pages/Payments';
import Agents from './pages/Agents';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div className='flex h-screen items-center justify-center'>Loading...</div>;
  return isAuthenticated ? <>{children}</> : <Navigate to='/login' replace />;
}

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div className='flex h-screen items-center justify-center'>Loading...</div>;

  return (
    <Routes>
      <Route path='/login' element={isAuthenticated ? <Navigate to='/' replace /> : <Login />} />
      <Route path='/' element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<DashboardHome />} />
        <Route path='tenants' element={<Tenants />} />
        <Route path='campaigns' element={<Campaigns />} />
        <Route path='payments' element={<Payments />} />
        <Route path='agents' element={<Agents />} />
        <Route path='users' element={<Users />} />
        <Route path='debtors' element={<Debtors />} />
        <Route path='debtors/:id' element={<DebtorProfile />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}
