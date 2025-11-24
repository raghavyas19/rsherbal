import React from 'react';
import { Navigate } from 'react-router-dom';

const lastValid = sessionStorage.getItem('lastValidAdminRoute') || '/admin';

const AdminRedirect: React.FC = () => <Navigate to={lastValid} replace />;

export default AdminRedirect; 