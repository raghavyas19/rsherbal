import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import Skeleton from '../components/Common/Skeleton';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const UserOrderDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/api/orders/${id}`)
      .then(res => {
        setOrder(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'pending':
        return 'We have received your order and payment details. We will confirm your order after verifying your payment.';
      case 'confirmed':
        return 'Your payment has been verified and your order is being prepared for shipment.';
      case 'shipped':
        return 'Your order has been shipped and is on its way to you.';
      case 'delivered':
        return 'Your order has been delivered. Thank you for shopping with us!';
      case 'cancelled':
        return 'This order has been cancelled. If you have questions, please contact support.';
      default:
        return '';
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-2 sm:px-0">
      <button className="mb-4 text-rsherbal-600 hover:underline" onClick={() => navigate(-1)}>&larr; Back to Orders</button>
      {loading ? (
        <Skeleton variant="card" fullPage />
      ) : !order ? (
        <div className="text-center py-12 text-gray-500">Order not found.</div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="font-mono text-lg text-gray-900">Order #{order._id.slice(-8).toUpperCase()}</div>
            <span className={`px-3 py-1 rounded text-sm font-semibold ${statusColors[order.status] || 'bg-gray-100 text-gray-700'}`}>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
          </div>
          <div className={
            `mb-4 text-sm rounded px-4 py-3 border border-gray-200 ` +
            (order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
             order.status === 'delivered' ? 'bg-green-100 text-green-800' :
             order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
             order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
             'bg-gray-300 text-gray-700')
          }>
            {getStatusMessage(order.status)}
          </div>
          <div className="mb-4">
            <div className="text-sm text-gray-500">Placed on</div>
            <div className="text-base text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</div>
          </div>
          <div className="mb-4">
            <div className="text-sm text-gray-500">Total Amount</div>
            <div className="text-lg text-gray-900 font-bold">₹{order.total}</div>
          </div>
          <div className="mb-4">
            <div className="text-sm text-gray-500">Items</div>
            <ul className="divide-y divide-gray-100">
              {order.items.map((item: any) => (
                <li key={item._id} className="py-2 flex items-center">
                  {item.productId?.images?.[0] && (
                    <img src={item.productId.images[0]} alt={item.productId.name} className="w-12 h-12 object-cover rounded mr-3 border" />
                  )}
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{item.productId?.name || 'Product'}</div>
                    <div className="text-xs text-gray-500">Qty: {item.quantity} &times; ₹{item.price}</div>
                  </div>
                  <div className="text-right font-semibold text-gray-900">₹{item.quantity * item.price}</div>
                </li>
              ))}
            </ul>
          </div>
          <div className="mb-4">
            <div className="text-sm text-gray-500">Delivery Address</div>
            <div className="text-base text-gray-900">
              {order.address?.line1}, {order.address?.line2 && `${order.address.line2}, `}{order.address?.city}, {order.address?.state} - {order.address?.pincode}, {order.address?.country}
            </div>
          </div>
          {order.deliveryDate && (
            <div className="mb-4">
              <div className="text-sm text-gray-500">Delivered On</div>
              <div className="text-base text-green-700 font-semibold">{new Date(order.deliveryDate).toLocaleDateString()}</div>
            </div>
          )}
          {order.courierName && order.trackingId && (
            <div className="mb-4">
              <div className="text-sm text-gray-500">Courier</div>
              <div className="text-base text-gray-900">{order.courierName} (Tracking ID: {order.trackingId})</div>
            </div>
          )}
          {order.utrNumber && order.paymentScreenshot && (
            <div className="mb-4">
              <div className="text-sm text-gray-500">Payment UTR</div>
              <div className="text-base text-gray-900">{order.utrNumber}</div>
              <div className="mt-2">
                <span className="text-sm text-gray-500">Payment Screenshot:</span>
                <img
                  src={
                    // Always use the authenticated proxy endpoint so frontend never exposes provider URL
                    `${import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_BASE_URL || ''}/api/orders/${order._id}/screenshot`
                  }
                  alt="Payment Screenshot"
                  className="w-40 h-auto rounded border mt-1"
                  onError={e => { e.currentTarget.style.display = 'none'; }}
                />
              </div>
            </div>
          )}
          <div className="mb-4">
            <div className="text-sm text-gray-500">Contact</div>
            <div className="text-base text-gray-900">{order.contact?.name} ({order.contact?.phone})</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserOrderDetail; 