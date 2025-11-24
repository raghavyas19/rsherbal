import React, { useState, useEffect, startTransition } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingBag, 
  CreditCard,
  Menu,
  X,
  Leaf,
  Star,
  BarChart2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Payments', href: '/admin/payments', icon: CreditCard },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Reviews', href: '/admin/reviews', icon: Star },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart2 },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  useEffect(() => {
    // List of valid admin route prefixes - store the current admin path as last valid if it starts with any
    const validRoutes = [
      '/admin',
      '/admin/products',
      '/admin/users',
      '/admin/orders',
      '/admin/payments',
      '/admin/reviews',
      '/admin/analytics',
    ];
    if (validRoutes.some(r => location.pathname.startsWith(r))) {
      sessionStorage.setItem('lastValidAdminRoute', location.pathname);
    }
  }, [location.pathname]);

  return (
    <div className="h-screen w-screen bg-gray-50 flex overflow-hidden">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => startTransition(() => setSidebarOpen(false))}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out flex flex-col h-screen` + (sidebarOpen ? ' translate-x-0' : ' -translate-x-full lg:translate-x-0')}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 bg-rsherbal-500 rounded-full">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">RS Herbal Admin</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 px-3 py-6 overflow-y-auto">
          <div className="space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'bg-rsherbal-100 text-rsherbal-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
                onClick={() => startTransition(() => setSidebarOpen(false))}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            ))}
          </div>
        </nav>

        {/* Logout Button at Bottom */}
        <div className="px-3 pb-6 mt-auto">
          <button
            onClick={() => startTransition(() => { logout(); navigate('/'); })}
            className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col h-screen ml-0 lg:ml-64">
        {/* Top bar */}
        <div className="z-10 bg-white shadow-sm border-b border-gray-200 sticky top-0 h-16 flex items-center justify-between px-4 sm:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Welcome to the admin panel
            </span>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;