import React, { useEffect, useState } from 'react';
import { getUserOrders } from '../services/api';
import Skeleton from '../components/Common/Skeleton';
import { useNavigate } from 'react-router-dom';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const UserOrders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getUserOrders().then(res => {
      setOrders(res.data);
      setLoading(false);
    });
  }, []);

  // sort orders by createdAt descending (newest first)
  const sortedOrders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="max-w-3xl mx-auto py-8 px-2 sm:px-0">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">My Orders</h1>
      {loading ? (
        <Skeleton variant="list" />
      ) : sortedOrders.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No orders found.</div>
      ) : (
        <div className="flex flex-col gap-4">
          {sortedOrders.map(order => (
            <div
              key={order._id}
              className="bg-gray-50 rounded-xl shadow-md border border-gray-400 p-5 flex flex-col justify-between min-h-[80px] ring-1 ring-gray-100 cursor-pointer"
              onClick={() => navigate(`/orders/${order._id}`)}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500">Order ID: <span className="font-mono text-sm text-gray-800 ml-1">{order._id.slice(-8).toUpperCase()}</span></span>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColors[order.status] || 'bg-gray-100 text-gray-700'}`}>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div>
                  <div className="text-xs text-gray-500">Placed on</div>
                  <div className="text-sm text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">Total</div>
                  <div className="text-sm text-gray-900 font-semibold">₹{order.total}</div>
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <div className="text-xs text-gray-500">Items: <span className="font-medium text-gray-700">{order.items.length}</span></div>
                {order.deliveryDate && <div className="text-xs text-green-700">Delivered: {new Date(order.deliveryDate).toLocaleDateString()}</div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserOrders; 