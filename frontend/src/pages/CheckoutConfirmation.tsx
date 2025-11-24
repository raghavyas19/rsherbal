import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import API from '../services/api';
import Skeleton from '../components/Common/Skeleton';

const CheckoutConfirmation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { order: initialOrder, utr, screenshot } = location.state || {};
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
  const [order, setOrder] = useState<any>(initialOrder);
  const [loading, setLoading] = useState(!initialOrder);

  useEffect(() => {
    // If we have an order id but not full product info, fetch it
    if (initialOrder && initialOrder._id) {
      API.get(`/api/orders/${initialOrder._id}`)
        .then(res => {
          setOrder(res.data);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [initialOrder]);

  if (loading) {
    return <Skeleton fullPage />;
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <div className="text-4xl mb-4">❌</div>
          <div className="text-lg font-semibold mb-2">No order found</div>
          <button onClick={() => navigate('/shop')} className="text-blue-600 underline">Go to Shop</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow max-w-xl w-full">
        <div className="flex flex-col items-center mb-6">
          <CheckCircle className="w-16 h-16 text-green-500 mb-2" />
          <h1 className="text-2xl font-bold mb-2">Order Placed Successfully!</h1>
          <div className="text-gray-600 mb-2">Thank you for your order. We will verify your payment and process your order soon.</div>
        </div>
        <div className="mb-6">
          <h2 className="font-semibold text-gray-900 mb-2">Order Details</h2>
          <div className="text-sm text-gray-700 space-y-1">
            <div><span className="font-medium">Order ID:</span> {order._id?.slice(-6)}</div>
            <div><span className="font-medium">Name:</span> {order.contact?.name}</div>
            <div><span className="font-medium">Phone:</span> {order.contact?.phone}</div>
            <div><span className="font-medium">Email:</span> {order.contact?.email}</div>
            <div><span className="font-medium">Address:</span> {order.address?.line1}, {order.address?.line2} {order.address?.city}, {order.address?.state} {order.address?.pincode}, {order.address?.country}</div>
            <div><span className="font-medium">UTR/Txn ID:</span> {utr || order.utrNumber}</div>
            <div>
              <span className="font-medium">Payment Screenshot:</span>
              {order.paymentScreenshot || screenshot ? (
                <img
                  // Prefer the authenticated proxy so the frontend doesn't expose provider URLs
                  src={order.paymentScreenshot ? `${backendUrl}/api/orders/${order._id}/screenshot` : screenshot ? URL.createObjectURL(screenshot) : ''}
                  alt="Payment Screenshot"
                  className="h-32 rounded border mt-2"
                />
              ) : <span className="text-gray-400">Not uploaded</span>}
            </div>
          </div>
        </div>
        <div className="mb-6">
          <h2 className="font-semibold text-gray-900 mb-2">Products</h2>
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
        <div className="flex justify-between items-center text-lg font-semibold">
          <span>Total</span>
          <span>₹{order.total?.toFixed(2)}</span>
        </div>
  <button onClick={() => navigate('/shop')} className="mt-8 w-full bg-rsherbal-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-rsherbal-600 transition-colors">Continue Shopping</button>
      </div>
    </div>
  );
};

export default CheckoutConfirmation; 