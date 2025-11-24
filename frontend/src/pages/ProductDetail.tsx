import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Share2, ChevronLeft, Plus, Minus, Shield, Truck } from 'lucide-react';
import { fetchProduct } from '../services/api';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';
import Skeleton from '../components/Common/Skeleton';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { state, addOrUpdateCartBackend, removeCartItemBackend } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [localQuantity, setLocalQuantity] = useState(1);
  const [loading, setLoading] = useState<boolean>(true);
  // (removed rows wrapper) — layout will use the existing flow so rows aren't wrapped


  useEffect(() => {
    setLoading(true);
    if (id) {
      fetchProduct(id)
        .then(res => setProduct(res.data))
        .catch(() => setProduct(null))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [id]);
  if (loading) {
    return <Skeleton fullPage />;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
          <Link to="/shop" className="text-rsherbal-600 hover:text-rsherbal-700">
            ← Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  // Handle product visibility
  if (product.visibility === 'archived') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">This product is no longer available</h2>
          <p className="text-gray-600 mb-4">This product is archived and cannot be ordered.</p>
          <Link to="/shop" className="text-rsherbal-600 hover:text-rsherbal-700">
            ← Back to Shop
          </Link>
        </div>
      </div>
    );
  }
  // If not public or hidden, block access
  if (product.visibility !== 'public' && product.visibility !== 'hidden') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not available</h2>
          <Link to="/shop" className="text-rsherbal-600 hover:text-rsherbal-700">
            ← Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  // Check if this product is in the cart
  const cartItem = state.items.find(item => item.id === product._id);
  const cartQuantity = cartItem?.quantity || 0;

  // Defensive: always have at least one image to display
  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : product.image ? [product.image] : [];

  const handleAddToCart = async () => {
    await addOrUpdateCartBackend(product._id, localQuantity);
  };

  const handleIncreaseQuantity = async () => {
    await addOrUpdateCartBackend(product._id, cartQuantity + 1);
  };

  const handleDecreaseQuantity = async () => {
    if (cartQuantity > 1) {
      await addOrUpdateCartBackend(product._id, cartQuantity - 1);
    } else if (cartQuantity === 1) {
      await removeCartItemBackend(product._id);
      setLocalQuantity(1); // Reset local quantity for next add
    }
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${i < Math.floor(rating)
          ? 'text-yellow-400 fill-current'
          : 'text-gray-300'
          }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link to="/" className="hover:text-rsherbal-600">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-rsherbal-600">Shop</Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        {/* Back Button */}
        <Link
          to="/shop"
          className="inline-flex items-center space-x-2 text-rsherbal-600 hover:text-rsherbal-700 mb-8"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Shop</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4 }}
              className="aspect-square overflow-hidden rounded-2xl bg-gray-100"
            >
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </motion.div>

            {images.length > 1 && (
              <div className="flex space-x-4">
                {images.map((image: string, index: number) => (
                  <motion.button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === index
                      ? 'border-rsherbal-600'
                      : 'border-gray-200 hover:border-gray-300'
                      }`}
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <span className="text-sm text-rsherbal-600 font-medium uppercase tracking-wide">
                {product.category}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-1">
                {product.name}
              </h1>
            </div>
            {/* Short Description */}
            {product.shortDescription && (
              <p className="text-lg text-gray-700 mb-2 font-medium">{product.shortDescription}</p>
            )}

            {/* Price, Unit, Quantity */}
            <div className="flex items-center space-x-4 mb-6">
              <span className="text-xl text-gray-500 line-through">₹{product.originalPrice}</span>
              {product.originalPrice && (
                <span className="text-3xl font-bold text-gray-900">₹{product.price}</span>
              )}
              {/* moved product package size (e.g. 300 ml) next to the quantity selector below */}
              {!product.inStock && <span className="text-red-500 font-semibold ml-2">Out of Stock</span>}
            </div>
            {/* Quantity label + package size */}
            <div className="mb-3 flex items-center gap-2">
              <span className="text-base font-medium text-gray-900">Quantity: </span>
              <span className="text-base text-gray-600">{product.quantity} {product.unit}</span>
            </div>

            {/* Action area: Add to Cart button or inline counter when item present */}
            <motion.div layout className="w-full md:w-64">
              {cartQuantity > 0 ? (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18 }}
                  className="flex items-stretch rounded-xl overflow-hidden border border-gray-200"
                >
                  <button
                    onClick={handleDecreaseQuantity}
                    aria-label="Decrease quantity"
                    className="flex-1 flex items-center justify-center bg-gray-300 hover:bg-gray-200 px-4 py-3 text-gray-700"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <div className="flex-1 flex items-center justify-center bg-white px-4 py-3 border-l border-r border-gray-100 text-gray-900 font-medium">
                    {cartQuantity}
                  </div>

                  <button
                    onClick={handleIncreaseQuantity}
                    aria-label="Increase quantity"
                    className="flex-1 flex items-center justify-center bg-rsherbal-400 hover:bg-rsherbal-500 text-white px-4 py-3"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </motion.div>
              ) : (
                <motion.button
                  layout
                  onClick={() => handleAddToCart()}
                  disabled={!product.inStock}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18 }}
                  className={`w-full block mt-2 flex items-center justify-center space-x-2 bg-rsherbal-600 text-white py-4 px-6 rounded-xl font-medium hover:bg-rsherbal-500 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>{product.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
                </motion.button>
              )}
            </motion.div>
            {/* Rating */}
            <div className="flex items-center space-x-4 py-2">
              <div className="flex items-center space-x-1">
                {renderStars(product.rating)}
              </div>
              <span className="text-sm text-gray-600">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>
            <div className="flex space-x-4">
              <button className="flex items-center justify-center p-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                <Heart className="w-5 h-5" />
              </button>

              <button className="flex items-center justify-center p-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>

            </div>
            {/* Trust Badges */}
            <div className="flex items-center space-x-6 pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-rsherbal-600" />
                <span className="text-sm text-gray-600">100% Natural</span>
              </div>
              <div className="flex items-center space-x-2">
                <Truck className="w-5 h-5 text-rsherbal-600" />
                <span className="text-sm text-gray-600">Free Shipping</span>
              </div>
            </div>
          </div>

          {/* Long Description */}
          {product.longDescription && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">About this product</h3>
              <p className="text-gray-600 leading-relaxed">{product.longDescription}</p>
            </div>
          )}
          {/* Key Benefits */}
          {product.keyBenefits && product.keyBenefits.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Key Benefits</h3>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                {product.keyBenefits.map((b: string, i: number) => <li key={i}>{b}</li>)}
              </ul>
            </div>
          )}
          {/* Key Ingredients */}
          {product.keyIngredients && product.keyIngredients.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Key Ingredients</h3>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                {product.keyIngredients.map((i: string, idx: number) => <li key={idx}>{i}</li>)}
              </ul>
            </div>
          )}
          {/* Direction for Use */}
          {product.directionForUse && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Direction for Use</h3>
              <p className="text-gray-600">{product.directionForUse}</p>
            </div>
          )}
          {/* Safety Information */}
          {product.safetyInformation && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Safety Information</h3>
              <p className="text-gray-600">{product.safetyInformation}</p>
            </div>
          )}
          {/* Technical Information */}
          {product.technicalInformation && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Technical Information</h3>
              <p className="text-gray-600">{product.technicalInformation}</p>
            </div>
          )}
          {/* Additional Information */}
          {product.additionalInformation && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Additional Information</h3>
              <p className="text-gray-600">{product.additionalInformation}</p>
            </div>
          )}

        </div>
      </div>


    </div>
  );
};

export default ProductDetail;