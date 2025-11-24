import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import Skeleton from '../../components/Common/Skeleton';

const AdminOrderDetail: React.FC = () => {
  const { orderid } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [markingPaid, setMarkingPaid] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await API.get(`/api/admin/orders/${orderid}`);
        setOrder(res.data);
      } catch (err: any) {
        setError('Order not found');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderid]);

  const handleMarkPaid = async () => {
    setMarkingPaid(true);
    try {
      await API.patch(`/api/admin/orders/${orderid}/mark-paid`);
      setOrder((prev: any) => ({ ...prev, paymentStatus: 'paid' }));
    } catch (err) {
      alert('Failed to mark as paid');
    } finally {
      setMarkingPaid(false);
    }
  };

  if (loading) return <Skeleton variant="card" className="p-8" />;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!order) return null;

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-8 mt-6">
      <button onClick={() => navigate(-1)} className="mb-4 flex items-center text-blue-600 hover:underline">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Orders
      </button>
      <h1 className="text-2xl font-bold mb-4">Order #{order._id?.slice(-6)}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h2 className="font-semibold text-gray-900 mb-2">Contact Details</h2>
          <div className="text-gray-700 text-sm">
            <div><span className="font-medium">Name:</span> {order.contact?.name}</div>
            <div><span className="font-medium">Phone:</span> {order.contact?.phone}</div>
            <div><span className="font-medium">Email:</span> {order.contact?.email}</div>
          </div>
        </div>
        <div>
          <h2 className="font-semibold text-gray-900 mb-2">Shipping Address</h2>
          <div className="text-gray-700 text-sm">
            <div>{order.address?.line1}</div>
            {order.address?.line2 && <div>{order.address.line2}</div>}
            <div>{order.address?.city}, {order.address?.state} {order.address?.pincode}</div>
            <div>{order.address?.country}</div>
          </div>
        </div>
      </div>
      <div className="mb-6">
        <h2 className="font-semibold text-gray-900 mb-2">Order Items</h2>
        <div className="space-y-2">
          {order.items?.map((item: any, idx: number) => {
            const product = item.productId && typeof item.productId === 'object' ? item.productId : item.product;
            const productName = product?.name || 'Product';
            let productImage = '';
            if (product?.images) {
              if (Array.isArray(product.images) && product.images[0]) {
                productImage = product.images[0];
              } else if (typeof product.images === 'string') {
                productImage = product.images;
              }
            }
            return (
              <div key={idx} className="flex items-center bg-gray-50 rounded p-2 gap-4">
                {productImage && (
                  <img src={productImage} alt={productName} className="h-12 w-12 object-cover rounded" />
                )}
                <div className="flex-1">
                  <div className="font-medium">{productName}</div>
                  <div className="text-xs text-gray-500">Qty: {item.quantity}</div>
                </div>
                <div className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:space-x-8 space-y-4 md:space-y-0">
        <div>
          <h2 className="font-semibold text-gray-900 mb-2">Payment Details</h2>
            <div className="text-gray-700 text-sm">
            <div><span className="font-medium">Status:</span> <span className={order.paymentStatus === 'paid' ? 'text-green-600' : 'text-orange-600'}>{order.paymentStatus?.toUpperCase()}</span></div>
            <div><span className="font-medium">UTR/Txn ID:</span> {order.utrNumber || <span className="text-gray-400">Not provided</span>}</div>
            <div><span className="font-medium">Screenshot:</span> {order.paymentScreenshot ? (
              <a href={`${backendUrl}/api/orders/${order._id}/screenshot`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline ml-1">View</a>
            ) : <span className="text-gray-400">Not uploaded</span>}</div>
            {order.courierName && order.trackingId && (
              <div className="mt-4">
                <span className="font-medium">Courier:</span> {order.courierName}<br />
                <span className="font-medium">Tracking ID:</span> {order.trackingId}
              </div>
            )}
            {order.deliveryDate && (
              <div className="mt-2">
                <span className="font-medium">Delivery Date:</span> {new Date(order.deliveryDate).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
        <div>
          <h2 className="font-semibold text-gray-900 mb-2">Order Total</h2>
          <div className="text-2xl font-bold">₹{order.total?.toFixed(2)}</div>
        </div>
      </div>
      {order.paymentStatus !== 'paid' && (
        <button
          onClick={handleMarkPaid}
          className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center hover:bg-green-700 transition-colors"
          disabled={markingPaid}
        >
          <CheckCircle className="w-5 h-5 mr-2" />
          {markingPaid ? 'Marking as Paid...' : 'Mark as Paid'}
        </button>
      )}
    </div>
  );
};

export default AdminOrderDetail; 