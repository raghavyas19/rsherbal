import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Minus, Plus, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { motion } from 'framer-motion';

// Define the Product interface
interface Product {
  id?: string;
  _id?: string;
  name: string;
  price: number;
  image: string;
  originalPrice?: number;
  inStock: boolean;
  category: string;
  rating: number;
  reviewCount: number;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { state, addOrUpdateCartBackend, removeCartItemBackend } = useCart();
  const [showSuccess, setShowSuccess] = useState(false);

  // Check if this product is in the cart (by _id)
  const cartItem = state.items.find(item => item.id === (product._id || product.id));
  const quantity = cartItem?.quantity || 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await addOrUpdateCartBackend((product._id || product.id)!, 1);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 1500);
  };

  const handleIncreaseQuantity = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await addOrUpdateCartBackend((product._id || product.id)!, quantity + 1);
  };

  const handleDecreaseQuantity = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantity > 1) {
      await addOrUpdateCartBackend((product._id || product.id)!, quantity - 1);
    } else if (quantity === 1) {
      await removeCartItemBackend((product._id || product.id)!);
    }
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating)
          ? 'text-yellow-400 fill-current'
          : 'text-gray-300'
          }`}
      />
    ));
  };

  return (
    <motion.div
      className="relative group h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.03, boxShadow: '0 8px 32px rgba(34,197,94,0.08)' }}
      whileTap={{ scale: 0.98 }}
    >
      <Link to={`/product/${product._id || product.id}`} className="h-full">
        <motion.div
          className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group-hover:-translate-y-1 h-full flex flex-col min-h-[420px]"
          whileHover={{ y: -4 }}
        >
          {/* Image */}
          <div className="relative overflow-hidden w-full aspect-[3/4] bg-gray-100 rounded">
            <motion.img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.3 }}
            />
            {product.originalPrice && (
              <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                Sale
              </div>
            )}
            {!product.inStock && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <span className="text-white font-medium">Out of Stock</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4 flex flex-col flex-1">
            <div className="mb-2">
              <span className="text-xs text-rsherbal-600 font-medium uppercase tracking-wide">
                {product.category}
              </span>
            </div>

            <h3
              className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-rsherbal-600 transition-colors min-h-[3.5rem]"
              style={{
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 2
              }}
            >
              {product.name}
            </h3>

            <div className="flex items-center mb-3">
              <div className="flex items-center space-x-1">
                {renderStars(product.rating)}
              </div>
              <span className="ml-2 text-sm text-gray-600">
                ({product.reviewCount})
              </span>
            </div>

            {/* Price Section */}
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
              {product.originalPrice && (
                <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
              )}
            </div>

            {/* Action Buttons Section */}
            <div className="mt-auto">
              {quantity > 0 ? (
                <motion.div layout className="w-full">
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.18 }}
                    className="flex items-stretch rounded-lg overflow-hidden border border-gray-200"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDecreaseQuantity(e); }}
                      aria-label="Decrease quantity"
                      className="flex-1 flex items-center justify-center bg-gray-300 hover:bg-gray-200 px-3 py-2 text-gray-700"
                    >
                      <Minus className="w-4 h-4" />
                    </button>

                    <div className="flex-1 flex items-center justify-center bg-white px-3 py-2 border-l border-r border-gray-100 text-gray-900 font-medium">
                      {quantity}
                    </div>

                    <button
                      onClick={(e) => { e.stopPropagation(); handleIncreaseQuantity(e); }}
                      aria-label="Increase quantity"
                      className="flex-1 flex items-center justify-center bg-rsherbal-400 hover:bg-rsherbal-500 text-white px-3 py-2"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.button
                  layout
                  onClick={handleAddToCart}
                  className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${showSuccess
                    ? 'bg-green-500 text-white'
                    : 'bg-rsherbal-500 text-white hover:bg-rsherbal-600'
                    }`}
                  whileTap={{ scale: 0.97 }}
                >
                  {showSuccess ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <ShoppingCart className="w-4 h-4" />
                  )}
                  <span>{showSuccess ? 'Added!' : 'Add to Cart'}</span>
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;