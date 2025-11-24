import React, { useState } from 'react';
import { Search, Filter, Eye, Package, Truck, CheckCircle, RotateCcw, Trash2 } from 'lucide-react';
import { adminUpdateOrderStatus, adminDeleteOrder } from '../../services/api';
import { useAdminDataContext } from '../../context/AdminDataContext';
import { useNavigate } from 'react-router-dom';

const AdminOrders: React.FC = () => {
  const { orders, loading, refreshAll } = useAdminDataContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const navigate = useNavigate();
  const [showCourierModal, setShowCourierModal] = useState(false);
  const [courierOrderId, setCourierOrderId] = useState<string | null>(null);
  const [courierName, setCourierName] = useState('');
  const [trackingId, setTrackingId] = useState('');
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [deliveryOrderId, setDeliveryOrderId] = useState<string | null>(null);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [showCancelledModal, setShowCancelledModal] = useState(false);
  const [cancelledOrderId, setCancelledOrderId] = useState<string | null>(null);
  const [cancelledDate, setCancelledDate] = useState('');

  const filteredOrders = orders.filter(order => {
    const matchesSearch = (order._id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (order.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    if (newStatus === 'shipped') {
      setCourierOrderId(orderId);
      setPendingStatus(newStatus);
      setShowCourierModal(true);
      return;
    }
    if (newStatus === 'delivered') {
      setDeliveryOrderId(orderId);
      setPendingStatus(newStatus);
      setShowDeliveryModal(true);
      return;
    }
    if (newStatus === 'cancelled') {
      setCancelledOrderId(orderId);
      setPendingStatus(newStatus);
      setShowCancelledModal(true);
      setCancelledDate(new Date().toISOString().split('T')[0]);
      return;
    }
    setIsUpdating(true);
    try {
      await adminUpdateOrderStatus(orderId, { status: newStatus });
      refreshAll();
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCourierConfirm = async () => {
    if (!courierOrderId) return;
    setIsUpdating(true);
    try {
      await adminUpdateOrderStatus(courierOrderId, {
        status: pendingStatus,
        courierName,
        trackingId
      });
      setShowCourierModal(false);
      setCourierOrderId(null);
      setCourierName('');
      setTrackingId('');
      setPendingStatus(null);
      refreshAll();
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCourierCancel = () => {
    setShowCourierModal(false);
    setCourierOrderId(null);
    setCourierName('');
    setTrackingId('');
    setPendingStatus(null);
  };

  const handleDeliveryConfirm = async () => {
    if (!deliveryOrderId || !deliveryDate) return;
    setIsUpdating(true);
    try {
      await adminUpdateOrderStatus(deliveryOrderId, {
        status: pendingStatus,
        deliveryDate
      });
      setShowDeliveryModal(false);
      setDeliveryOrderId(null);
      setDeliveryDate('');
      setPendingStatus(null);
      refreshAll();
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeliveryCancel = () => {
    setShowDeliveryModal(false);
    setDeliveryOrderId(null);
    setDeliveryDate('');
    setPendingStatus(null);
  };

  const handleCancelledConfirm = async () => {
    if (!cancelledOrderId || !cancelledDate) return;
    setIsUpdating(true);
    try {
      await adminUpdateOrderStatus(cancelledOrderId, {
        status: pendingStatus,
        cancelledDate
      });
      setShowCancelledModal(false);
      setCancelledOrderId(null);
      setCancelledDate('');
      setPendingStatus(null);
      refreshAll();
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelledCancel = () => {
    setShowCancelledModal(false);
    setCancelledOrderId(null);
    setCancelledDate('');
    setPendingStatus(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800';
      case 'confirmed':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // status icons are rendered inline where needed

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const shippedOrders = orders.filter(order => order.status === 'shipped').length;
  const deliveredOrders = orders.filter(order => order.status === 'delivered').length;
  const confirmedOrders = orders.filter(order => order.status === 'confirmed').length;
  const cancelledOrders = orders.filter(order => order.status === 'cancelled').length;

  if (loading) return null;

  return (
    <div className="space-y-6">
      {/* Header + Refresh */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600">Manage customer orders and track fulfillment</p>
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
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-xs text-gray-600 truncate">Total Revenue</p>
              <p className="text-lg font-bold text-gray-900 truncate max-w-[10rem]">₹{totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <Package className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{pendingOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <Truck className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Shipped</p>
              <p className="text-2xl font-bold text-gray-900">{shippedOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Delivered</p>
              <p className="text-2xl font-bold text-gray-900">{deliveredOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-indigo-100 rounded-full">
              <Filter className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Confirmed</p>
              <p className="text-2xl font-bold text-gray-900">{confirmedOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-full">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Cancelled</p>
              <p className="text-2xl font-bold text-gray-900">{cancelledOrders}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search orders by ID or customer name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rsherbal-500"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rsherbal-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table - Desktop */}
      <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-2 py-3" />
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order, idx) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{idx + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => navigate(`/admin/orders/${order._id}`)}
                      className="text-sm font-medium text-blue-600 hover:underline focus:outline-none"
                      title="View Order Details"
                    >
                      {order._id?.slice(-8).toUpperCase()}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{order.user?.name || 'User'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {order.items?.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0)} items
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ₹{order.total?.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                        className={`text-xs font-medium rounded-full px-2 py-1 border-0 focus:ring-2 focus:ring-rsherbal-500 ${getStatusColor(order.status)}`}
                        disabled={isUpdating}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDate(order.createdAt)}</div>
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end">
                      <button
                        onClick={() => {
                          if (!confirm('Are you sure you want to delete this order?')) return;
                          (async () => {
                            try {
                              await adminDeleteOrder(order._id);
                            } catch (err) {
                              // ignore or show toast
                            }
                            refreshAll();
                          })();
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Order"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Orders Cards - Mobile */}
      <div className="md:hidden space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900">Order #{order._id?.slice(-8).toUpperCase()}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>{order.status}</span>
              </div>
              <div className="text-sm text-gray-700">Customer: <span className="font-medium">{order.user?.name || 'User'}</span></div>
              <div className="text-sm text-gray-700">Items: <span className="font-medium">{order.items?.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0)}</span></div>
              <div className="text-sm text-gray-700">Total: <span className="font-medium">₹{order.total?.toFixed(2)}</span></div>
              <div className="text-sm text-gray-700">Date: <span className="font-medium">{formatDate(order.createdAt)}</span></div>
              <div className="flex items-center space-x-2 mt-2">
                <select
                  value={order.status}
                  onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                  className={`text-xs font-medium rounded-full px-2 py-1 border-0 focus:ring-2 focus:ring-rsherbal-500 ${getStatusColor(order.status)}`}
                  disabled={isUpdating}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <button
                  onClick={() => navigate(`/admin/orders/${order._id}`)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="View Details"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (!confirm('Are you sure you want to delete this order?')) return;
                    (async () => {
                      try {
                        await adminDeleteOrder(order._id);
                      } catch (err) {
                        // ignore or show toast
                      }
                      refreshAll();
                    })();
                  }}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete Order"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Courier Modal */}
      {showCourierModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
            <h2 className="text-lg font-bold mb-4">Enter Courier Details</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Courier Name</label>
              <input
                type="text"
                value={courierName}
                onChange={e => setCourierName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rsherbal-500"
                placeholder="e.g. Delhivery, Blue Dart"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tracking ID</label>
              <input
                type="text"
                value={trackingId}
                onChange={e => setTrackingId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rsherbal-500"
                placeholder="Tracking Number"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCourierCancel}
                className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                disabled={isUpdating}
              >Cancel</button>
              <button
                onClick={handleCourierConfirm}
                className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 flex items-center"
                disabled={isUpdating || !courierName || !trackingId}
              >
                {isUpdating ? 'Saving...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delivery Modal */}
      {showDeliveryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
            <h2 className="text-lg font-bold mb-4">Enter Delivery Date</h2>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Date</label>
              <input
                type="date"
                value={deliveryDate}
                onChange={e => setDeliveryDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rsherbal-500"
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleDeliveryCancel}
                className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                disabled={isUpdating}
              >Cancel</button>
              <button
                onClick={handleDeliveryConfirm}
                className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 flex items-center"
                disabled={isUpdating || !deliveryDate}
              >
                {isUpdating ? 'Saving...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancelled Modal */}
      {showCancelledModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
            <h2 className="text-lg font-bold mb-4">Enter Cancelled Date</h2>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Cancelled Date</label>
              <input
                type="date"
                value={cancelledDate}
                onChange={e => setCancelledDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rsherbal-500"
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelledCancel}
                className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                disabled={isUpdating}
              >Cancel</button>
              <button
                onClick={handleCancelledConfirm}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 flex items-center"
                disabled={isUpdating || !cancelledDate}
              >
                {isUpdating ? 'Saving...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;