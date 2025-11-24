import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart: React.FC = () => {
  const { state, addOrUpdateCartBackend, removeCartItemBackend } = useCart();
  const items = state.items;
  const itemCount = state.itemCount;
  const total = state.total;

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeCartItemBackend(id);
    } else {
      addOrUpdateCartBackend(id, quantity);
    }
  };

  const removeItem = (id: string) => {
    removeCartItemBackend(id);
  };

  if (!items || items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center px-6 py-3 bg-rsherbal-600 text-white font-medium rounded-lg hover:bg-rsherbal-700 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        <div className="bg-white rounded-lg shadow-sm">
          {/* Cart Items */}
          <div className="divide-y divide-gray-200">
            {items.map((item: any) => (
              <div key={item.id} className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Product Image */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                  />
                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {item.name}
                    </h3>
                    <div className="text-sm text-gray-600">₹{item.price.toFixed(2)}</div>
                  </div>
                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-3 flex-shrink-0">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-3 py-1 bg-gray-100 rounded-lg min-w-[50px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  {/* Price and Remove */}
                  <div className="flex items-center justify-between sm:justify-end space-x-4 flex-shrink-0">
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Cart Summary */}
          <div className="border-t border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-medium text-gray-900">
                Subtotal ({itemCount} items)
              </span>
              <span className="text-2xl font-bold text-gray-900">
                ₹{total.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center mb-6 text-sm text-gray-600">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between items-center mb-6 text-lg font-semibold border-t pt-4">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/shop"
                className="flex-1 text-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Continue Shopping
              </Link>
              <Link
                to="/checkout"
                className="flex-1 text-center px-6 py-3 bg-rsherbal-600 text-white font-medium rounded-lg hover:bg-rsherbal-700 transition-colors"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
        {/* Trust Badges */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm">✓</span>
              </div>
              <span className="text-sm text-gray-600">Secure Checkout</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm">✓</span>
              </div>
              <span className="text-sm text-gray-600">Free Shipping over ₹4150</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 text-sm">✓</span>
              </div>
              <span className="text-sm text-gray-600">Easy Returns</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;