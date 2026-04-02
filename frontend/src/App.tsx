import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';

function DashboardRouter() {
  const { user, logout } = useAuth();
  if (!user) return <Navigate to='/login' />;

  return (
    <div className='min-h-screen bg-gray-100 p-8 flex flex-col items-center justify-center'>
      <div className='bg-white p-8 rounded-lg shadow-md max-w-lg w-full text-center'>
        <h1 className='text-3xl font-bold text-gray-800 mb-2'>Welcome, {user.firstName || user.email}!</h1>
        <p className='text-gray-600 mb-6 flex flex-col items-center'>
          <span className='bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold mt-2 inline-block'>
            Role: {user.role}
          </span>
          {user.tenantId && <span className='text-sm mt-2 text-gray-500'>Tenant ID: {user.tenantId}</span>}
        </p>
        <p className='text-gray-500 mb-6 italic'>
          This is where your {user.role.replace('_', ' ')} Dashboard will go.
        </p>
        <button 
          onClick={logout}
          className='bg-red-600 text-white px-4 py-2 rounded font-medium hover:bg-red-700 transition'
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}

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
      <Route path='/' element={<ProtectedRoute><DashboardRouter /></ProtectedRoute>} />
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
