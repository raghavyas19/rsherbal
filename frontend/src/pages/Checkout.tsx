import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CreditCard, Lock, ChevronLeft } from 'lucide-react';
import { placeOrder } from '../services/api';
import { useCart } from '../context/CartContext';
import { CartItem } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import QRCode from 'react-qr-code';

interface CheckoutForm {
  email: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  landmark?: string;
}

const CHECKOUT_FORM_KEY = 'ayur_checkout_form';

// Indian states and union territories (names used as values)
const INDIAN_STATES: string[] = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  // Union Territories
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry'
];

const Checkout: React.FC = () => {
  const { state } = useCart();
  const { user } = useAuth();
  const [form, setForm] = useState<CheckoutForm>(() => {
    const saved = localStorage.getItem(CHECKOUT_FORM_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return {
      email: '',
      name: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      phone: '',
      landmark: ''
    };
  });
  const [discountCode, setDiscountCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [saveAddress, setSaveAddress] = useState(false);
  const [utr, setUtr] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [upiStep, setUpiStep] = useState(false);

  // Prefill name and phone from user if available and not already set
  useEffect(() => {
    if (user && (!form.name && !form.phone)) {
      setForm(prev => ({
        ...prev,
        name: user.name || '',
        phone: user.mobile || ''
      }));
    }
  }, [user]);

  // Persist form to localStorage on every change
  useEffect(() => {
    localStorage.setItem(CHECKOUT_FORM_KEY, JSON.stringify(form));
  }, [form]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('email', form.email);
      formData.append('name', form.name);
      formData.append('phone', form.phone);
      formData.append('address', form.address);
      formData.append('city', form.city);
      formData.append('state', form.state);
      formData.append('zipCode', form.zipCode);
      formData.append('landmark', form.landmark || '');
      formData.append('utrNumber', utr);
      if (screenshot) formData.append('paymentScreenshot', screenshot);
      // items and total are still calculated on backend from cart
      await placeOrder(formData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/orders');
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Order failed');
    } finally {
      setIsProcessing(false);
    }
  };

  // Delivery fee logic
  const deliveryFee = state.total < 499 ? 50 : 0;
  const freeDeliveryThreshold = 499;

  // UPI link generation
  const upiId = '7300183411@ybl';
  const payeeName = 'Raghav Vyas';
  const upiAmount = (state.total + deliveryFee).toFixed(2);
  const upiNote = `Order from ${form.name || 'Customer'}`;
  const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${upiAmount}&cu=INR&tn=${encodeURIComponent(upiNote)}`;

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setScreenshot(e.target.files[0]);
    }
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No items in cart</h2>
          <Link to="/shop" className="text-rsherbal-600 hover:text-rsherbal-700">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-5">
          <Link
            to="/cart"
            className="inline-flex items-center space-x-2 text-rsherbal-600 hover:text-rsherbal-700 mb-4"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Cart</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </div>


        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="space-y-6">
            <div className="bg-white p-3rounded-lg shadow-sm">
              {/* Discount Code Field in grid to match First Name width */}
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <label htmlFor="discountCode" className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Code
                  </label>
                  <input
                    type="text"
                    id="discountCode"
                    name="discountCode"
                    value={discountCode}
                    onChange={e => setDiscountCode(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rsherbal-500"
                    placeholder="Enter code (optional)"
                  />
                </div>
                <div></div>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>

              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rsherbal-500"
                  />
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rsherbal-500"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={form.phone}
                    onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rsherbal-500"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipping Address</h2>

              <div className="space-y-4">
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    required
                    value={form.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rsherbal-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      required
                      value={form.city}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rsherbal-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <select
                      id="state"
                      name="state"
                      required
                      value={form.state}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rsherbal-500"
                    >
                      <option value="">Select State</option>
                      {INDIAN_STATES.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
                    Pincode
                  </label>
                  <input
                    type="text"
                    id="pincode"
                    name="zipCode"
                    required
                    value={form.zipCode}
                    onChange={e => {
                      // Only allow numbers
                      const value = e.target.value.replace(/\D/g, '');
                      setForm(prev => ({ ...prev, zipCode: value }));
                    }}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rsherbal-500"
                    placeholder="Enter 6-digit pincode"
                  />
                  {/* Landmark (optional) field */}
                  <div className="mt-4">
                    <label htmlFor="landmark" className="block text-sm font-medium text-gray-700 mb-1">
                      Landmark (optional)
                    </label>
                    <input
                      type="text"
                      id="landmark"
                      name="landmark"
                      value={form.landmark}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rsherbal-500"
                      placeholder="Nearby landmark, building, etc. (optional)"
                    />
                  </div>
                  {/* Save Address Checkbox */}
                  <div className="py-6 flex items-center">
                    <input
                      type="checkbox"
                      id="saveAddress"
                      name="saveAddress"
                      checked={saveAddress}
                      onChange={e => setSaveAddress(e.target.checked)}
                      className="form-checkbox h-5 w-5 text-rsherbal-500 rounded focus:ring-rsherbal-500"
                    />
                    <label htmlFor="saveAddress" className="ml-2 text-sm font-medium text-gray-700 select-none cursor-pointer">
                      Save this address for future orders
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm sticky top-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {state.items.map((item: CartItem) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-sm text-gray-600">₹{(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{state.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span>{deliveryFee === 0 ? 'Free' : `₹${deliveryFee}`}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>₹{(state.total + deliveryFee).toFixed(2)}</span>
                </div>
                <div className="pt-2">
                  {deliveryFee === 0 ? (
                    <span className="text-green-600 font-medium">You have free delivery!</span>
                  ) : (
                    <span className="text-orange-600 font-medium">Add items worth ₹{(freeDeliveryThreshold - state.total).toFixed(2)} more for free delivery!</span>
                  )}
                </div>
              </div>
              <div className='py-3'>
                {error && <div className="text-red-600 mt-2">{error}</div>}
                {success && <div className="text-green-600 mt-2">Order placed successfully!</div>}

                <button
                  type="button"
                  className="w-full bg-rsherbal-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-rsherbal-600 transition-colors"
                  onClick={() => navigate('/checkout/payment', { state: { form } })}
                >
                  Proceed to Payment
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;