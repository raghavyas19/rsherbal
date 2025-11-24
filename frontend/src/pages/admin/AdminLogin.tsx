import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const AdminLogin: React.FC = () => {
  const { user, login } = useAuth();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // If already logged in as admin, redirect to admin dashboard
  React.useEffect(() => {
    if (user && user.role === 'admin') {
      navigate('/admin', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await adminLogin({ id, password });
      if (res.status === 200) {
        // Set frontend auth to admin
        login({ id: 'admin', mobile: '', role: 'admin', name: 'Administrator' } as any);
        navigate('/admin', { replace: true });
      } else {
        setError('Login failed');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
  <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg ring-1 ring-gray-100">
        <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">ID</label>
            <input
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="Enter admin id"
              aria-label="Admin ID"
              className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-rsherbal-500 focus:border-rsherbal-500 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Enter password"
              aria-label="Admin password"
              className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-rsherbal-500 focus:border-rsherbal-500 transition"
            />
          </div>
          {error && <div className="text-sm text-red-600">{error}</div>}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 bg-rsherbal-600 text-white rounded hover:bg-rsherbal-700"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
