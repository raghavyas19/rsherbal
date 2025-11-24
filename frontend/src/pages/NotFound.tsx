import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NotFound: React.FC = () => {
  const { user } = useAuth();
  if (user && user.role === 'admin') {
    const lastValid = sessionStorage.getItem('lastValidAdminRoute') || '/admin';
    return <Navigate to={lastValid} replace />;
  }
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center py-16">
  <h1 className="text-5xl font-bold text-rsherbal-600 mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
      <p className="text-gray-600 mb-6">Sorry, the page you are looking for does not exist.</p>
  <Link to="/" className="px-6 py-3 bg-rsherbal-600 text-white rounded-lg font-medium hover:bg-rsherbal-700 transition-colors">Go to Home</Link>
    </div>
  );
};

export default NotFound; 