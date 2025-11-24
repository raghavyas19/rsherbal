import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminBlocker: React.FC = () => {
  const { user } = useAuth();
  if (user && user.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }
  return <Outlet />;
};

export default AdminBlocker; 