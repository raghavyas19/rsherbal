import React from 'react';
import { BarChart2, Users, ShoppingBag, DollarSign, RotateCcw } from 'lucide-react';
import { useAdminDataContext } from '../../context/AdminDataContext';

const AdminAnalytics: React.FC = () => {
  const { refreshAll, loading } = useAdminDataContext();

  if (loading) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">View store analytics and trends</p>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center">
          <DollarSign className="w-8 h-8 text-green-500 mr-4" />
          <div>
            <p className="text-sm text-gray-600">Total Sales</p>
            <p className="text-2xl font-bold text-gray-900">--</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center">
          <ShoppingBag className="w-8 h-8 text-blue-500 mr-4" />
          <div>
            <p className="text-sm text-gray-600">Total Orders</p>
            <p className="text-2xl font-bold text-gray-900">--</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center">
          <Users className="w-8 h-8 text-purple-500 mr-4" />
          <div>
            <p className="text-sm text-gray-600">Total Users</p>
            <p className="text-2xl font-bold text-gray-900">--</p>
          </div>
        </div>
      </div>
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 mt-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Sales & User Trends</h2>
        <div className="h-64 flex items-center justify-center text-gray-400">
          {/* Placeholder for chart */}
          <BarChart2 className="w-16 h-16" />
          <span className="ml-4">Charts coming soon...</span>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics; 