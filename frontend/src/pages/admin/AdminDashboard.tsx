import React, { useEffect, useState } from 'react';
import { 
  Users, 
  ShoppingBag, 
  DollarSign, 
  Package, 
  TrendingUp, 
  TrendingDown,
  Eye,
  RotateCcw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAdminDataContext } from '../../context/AdminDataContext';

const AdminDashboard: React.FC = () => {
  const { users, stats, orders, topProducts, loading, refreshAll } = useAdminDataContext();
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'confirmed':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return null;

  // Only count users with role !== 'admin'
  const nonAdminUsers = users.filter((u: any) => u.role !== 'admin');
  const statCards = [
    {
      title: 'Total Revenue',
      value: `₹${(stats?.totalRevenue || 0).toFixed(2)}`,
      change: '+12.5%',
      changeType: 'increase' as const,
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders?.toString() || '0',
      change: '+8.2%',
      changeType: 'increase' as const,
      icon: ShoppingBag,
      color: 'bg-blue-500'
    },
    {
      title: 'Total Users',
      value: nonAdminUsers.length.toString(),
      change: '+15.3%',
      changeType: 'increase' as const,
      icon: Users,
      color: 'bg-purple-500'
    },
    {
      title: 'Total Products',
      value: topProducts.length.toString(),
      change: '-2.1%',
      changeType: 'decrease' as const,
      icon: Package,
      color: 'bg-orange-500'
    }
  ];

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-4">
      {/* Header + Refresh */}
      <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your store.</p>
        </div>
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <button
            onClick={refreshAll}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 hover:bg-blue-200 transition"
            title="Refresh"
          >
            <RotateCcw className="w-6 h-6 text-blue-600" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              {stat.changeType === 'increase' ? (
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${
                stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </span>
              <span className="text-sm text-gray-500 ml-1">from last month</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            <button className="text-rsherbal-600 hover:text-rsherbal-700 text-sm font-medium" onClick={() => navigate('/admin/orders')}>
              View All
            </button>
          </div>
          
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <span className="font-medium text-gray-900">#{order._id?.slice(-6)}</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{order.user?.name || 'User'}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">₹{order.total?.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ''}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Top Products</h2>
            <button className="text-rsherbal-600 hover:text-rsherbal-700 text-sm font-medium" onClick={() => navigate('/admin/products')}>
              View All
            </button>
          </div>
          
          <div className="space-y-4">
            {topProducts.map((product) => (
              <div key={product._id} className="flex items-center space-x-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-12 h-12 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-600">{product.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">₹{product.price}</p>
                  <div className="flex items-center space-x-1">
                    <Eye className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500">{product.reviewCount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors" onClick={() => navigate('/admin/products')}>
            <Package className="w-6 h-6 text-rsherbal-600 mb-2" />
            <h3 className="font-medium text-gray-900">Add New Product</h3>
            <p className="text-sm text-gray-600">Add a new product to your inventory</p>
          </button>
          
          <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors" onClick={() => navigate('/admin/orders')}>
            <ShoppingBag className="w-6 h-6 text-rsherbal-600 mb-2" />
            <h3 className="font-medium text-gray-900">Process Orders</h3>
            <p className="text-sm text-gray-600">Review and update order statuses</p>
          </button>
          
          <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors" onClick={() => navigate('/admin/users')}>
            <Users className="w-6 h-6 text-rsherbal-600 mb-2" />
            <h3 className="font-medium text-gray-900">View Customers</h3>
            <p className="text-sm text-gray-600">Manage customer accounts</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;