import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import QRCode from 'react-qr-code';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { placeOrder } from '../services/api';
import { CheckCircle, X } from 'lucide-react';

const PaymentPage: React.FC = () => {
  const { state, dispatch } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  let form = location.state?.form;
  if (!form) {
    const saved = localStorage.getItem('ayur_checkout_form');
    if (saved) {
      try {
        form = JSON.parse(saved);
      } catch {}
    }
  }
  form = form || {};
  const [utr, setUtr] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotError, setScreenshotError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  

  // UPI details
  const upiId = '7300183411@ybl';
  const payeeName = 'Raghav Vyas';
  const upiAmount = state.total.toFixed(2);
  const upiNote = `Order from ${user?.name || 'Customer'}`;
  const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${upiAmount}&cu=INR&tn=${encodeURIComponent(upiNote)}`;

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScreenshotError(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const MAX = 5 * 1024 * 1024; // 5 MB backend limit
      if (file.size > MAX) {
        setScreenshot(null);
        setScreenshotError('File is too large. Maximum allowed size is 5 MB.');
        return;
      }
      setScreenshot(file);
    }
  };

  const isUtrValid = utr.length === 12 && /^\d+$/.test(utr);
  const canPlaceOrder = isUtrValid && !!screenshot && !isProcessing && !screenshotError;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setShowModal(true);
  };

  const confirmPlaceOrder = async () => {
    setIsProcessing(true);
    setShowModal(false);
    try {
      const formData = new FormData();
      formData.append('email', form.email || '');
      formData.append('name', form.name || '');
      formData.append('phone', form.phone || '');
      formData.append('address', form.address || '');
      formData.append('city', form.city || '');
      formData.append('state', form.state || '');
      formData.append('zipCode', form.zipCode || '');
      formData.append('landmark', form.landmark || '');
      formData.append('utrNumber', utr);
      if (screenshot) formData.append('paymentScreenshot', screenshot);
      // Place order (contact/address are assumed to be saved in backend from previous step)
  const res = await placeOrder(formData);
      dispatch({ type: 'CLEAR_CART' });
      localStorage.removeItem('ayur_checkout_form');
      localStorage.removeItem('ayur_cart');
      navigate('/checkout/confirmation', { state: { order: res.data, utr, screenshot } });
    } catch (err) {
      alert('Order failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 flex flex-col items-center">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-sm p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Complete Your Payment</h1>
        <form onSubmit={handlePlaceOrder} className="space-y-6">
          <div className="flex flex-col items-center gap-2">
            <QRCode value={upiLink} size={180} />
            <div className="mt-1 text-xs text-gray-500">Payee: <span className="font-semibold">Raghav Vyas</span> | UPI: <span className="font-semibold">7300183411@ybl</span></div>
            <div className="mt-1 text-xs text-gray-500">Amount: <span className="font-semibold">₹{upiAmount}</span></div>
            <div className="mt-1 text-xs text-gray-500">Note: <span className="font-semibold">{upiNote}</span></div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">UTR/Transaction ID</label>
            <input
              type="text"
              name="utr"
              value={utr}
              onChange={e => setUtr(e.target.value.replace(/\D/g, '').slice(0, 12))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rsherbal-500"
              placeholder="Enter 12-digit UTR/Transaction ID"
              maxLength={12}
              required
            />
            {!isUtrValid && utr.length > 0 && (
              <div className="text-xs text-red-600 mt-1">UTR must be exactly 12 digits</div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Payment Screenshot</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleScreenshotChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-rsherbal-50 file:text-rsherbal-700 hover:file:bg-rsherbal-100"
              required
            />
            {screenshotError && (
              <div className="text-xs text-red-600 mt-1">{screenshotError}</div>
            )}
            {screenshot && (
              <div className="mt-2">
                <img src={URL.createObjectURL(screenshot)} alt="Screenshot Preview" className="h-32 rounded border mx-auto" />
              </div>
            )}
          </div>
          <button
            type="submit"
            className={`w-full bg-rsherbal-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-rsherbal-600 transition-colors ${!canPlaceOrder ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!canPlaceOrder}
          >
            Place Order
          </button>
        </form>
      </div>
      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Confirm to place order?</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="mb-6 text-gray-700">Are you sure you want to place this order? This action cannot be undone.</div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
              >No</button>
              <button
                onClick={confirmPlaceOrder}
                className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 flex items-center"
                disabled={isProcessing}
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                {isProcessing ? 'Placing...' : 'Yes, Place Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPage; 