import React from 'react';
import { CreditCard, DollarSign, TrendingUp, Calendar, RotateCcw } from 'lucide-react';
import { useAdminDataContext } from '../../context/AdminDataContext';

const AdminPayments: React.FC = () => {
  const { orders, refreshAll, loading } = useAdminDataContext();

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const completedPayments = orders.filter(o => o.paymentStatus === 'paid').length;
  const pendingPayments = orders.filter(o => o.paymentStatus === 'pending').length;

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) return null;

  return (
    <div className="space-y-6">
      {/* Header + Refresh */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-600">Monitor UPI/manual payment transactions</p>
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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₹{totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{completedPayments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <Calendar className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{pendingPayments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {((completedPayments / orders.length) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payments Table - Desktop */}
      <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent UPI/Manual Payments</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UTR</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Screenshot</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders && orders.length > 0 ? orders.map((order: any, idx: number) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{idx + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{order._id?.slice(-6)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.contact?.name || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">₹{order.total?.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.utrNumber || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {order.paymentScreenshot ? (
                      <a href={`${backendUrl}/api/orders/${order._id}/screenshot`} target="_blank" rel="noopener noreferrer">
                        <img src={`${backendUrl}/api/orders/${order._id}/screenshot`} alt="Screenshot" className="h-10 rounded border" />
                      </a>
                    ) : <span className="text-gray-400">-</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{order.paymentStatus?.toUpperCase() || '-'}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-'}</td>
                </tr>
              )) : (
                <tr><td colSpan={7} className="text-center py-8 text-gray-400">No payments found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payments Cards - Mobile */}
      <div className="md:hidden space-y-4">
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💳</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No payments found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900">Order #{order._id?.slice(-6)}</span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.paymentStatus || 'pending')}`}>{order.paymentStatus?.toUpperCase() || 'Pending'}</span>
              </div>
              <div className="text-sm text-gray-700">Customer: <span className="font-medium">{order.contact?.name || '-'}</span></div>
              <div className="text-sm text-gray-700">Amount: <span className="font-medium">₹{order.total?.toFixed(2)}</span></div>
              <div className="text-sm text-gray-700">UTR: <span className="font-medium">{order.utrNumber || '-'}</span></div>
              <div className="text-sm text-gray-700">Date: <span className="font-medium">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-'}</span></div>
            </div>
          ))
        )}
      </div>

      
    </div>
  );
};

export default AdminPayments;