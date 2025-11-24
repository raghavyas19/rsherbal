import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Shield, Truck, Award, ArrowRight } from 'lucide-react';
import ProductCard from '../components/Common/ProductCard';
import { products, testimonials } from '../data/mockData';

const Home: React.FC = () => {
  const featuredProducts = products.slice(0, 4);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  useEffect(() => {
    // No custom event needed; just rely on localStorage and state
  }, []);

  useEffect(() => {
    if (localStorage.getItem('showLoginSuccess')) {
      setShowSuccessPopup(true);
      localStorage.removeItem('showLoginSuccess');
      setTimeout(() => setShowSuccessPopup(false), 8000);
    }
    if (localStorage.getItem('showLogoutSuccess')) {
      setShowLogoutPopup(true);
      localStorage.removeItem('showLogoutSuccess');
      setTimeout(() => setShowLogoutPopup(false), 8000);
    }
    // Listen for storage changes (multi-tab)
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'showLogoutSuccess' && e.newValue === '1') {
        setShowLogoutPopup(true);
        localStorage.removeItem('showLogoutSuccess');
        setTimeout(() => setShowLogoutPopup(false), 8000);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen">
      {showSuccessPopup && (
        <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          <span>Login successful! Welcome back.</span>
          <button onClick={() => setShowSuccessPopup(false)} className="ml-2 text-white hover:text-gray-200 text-lg font-bold">&times;</button>
        </div>
      )}
      {showLogoutPopup && (
        <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-50 bg-gray-700 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          <span>Logged out successfully.</span>
          <button onClick={() => setShowLogoutPopup(false)} className="ml-2 text-white hover:text-gray-200 text-lg font-bold">&times;</button>
        </div>
      )}
      {/* Hero Section */}
  <section className="relative bg-gradient-to-r from-rsherbal-50 to-earth-50 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-slide-up">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Ancient Wisdom
                <span className="block text-rsherbal-600">Modern Wellness</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Discover the power of authentic RS Herbal products crafted with 
                time-honored traditions and pure, natural ingredients for your 
                holistic well-being.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/shop"
                  className="inline-flex items-center justify-center px-8 py-4 bg-rsherbal-600 text-white text-lg font-medium rounded-xl hover:bg-rsherbal-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Shop Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <button className="inline-flex items-center justify-center px-8 py-4 border-2 border-rsherbal-600 text-rsherbal-600 text-lg font-medium rounded-xl hover:bg-rsherbal-600 hover:text-white transition-all duration-200">
                  Learn More
                </button>
              </div>
            </div>
            <div className="relative animate-fade-in">
              <img
                src="https://images.pexels.com/photos/4021840/pexels-photo-4021840.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="RS Herbal products and herbs"
                className="w-full h-[500px] object-cover rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-rsherbal-100 rounded-full mb-4 group-hover:bg-rsherbal-200 transition-colors">
                <Shield className="w-8 h-8 text-rsherbal-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">100% Natural</h3>
              <p className="text-xs text-gray-600">Pure & authentic ingredients</p>
            </div>
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-rsherbal-100 rounded-full mb-4 group-hover:bg-rsherbal-200 transition-colors">
                <Award className="w-8 h-8 text-rsherbal-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Certified Quality</h3>
              <p className="text-xs text-gray-600">Lab tested & approved</p>
            </div>
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-rsherbal-100 rounded-full mb-4 group-hover:bg-rsherbal-200 transition-colors">
                <Truck className="w-8 h-8 text-rsherbal-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Free Shipping</h3>
              <p className="text-xs text-gray-600">On orders over ₹4150</p>
            </div>
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-rsherbal-100 rounded-full mb-4 group-hover:bg-rsherbal-200 transition-colors">
                <Star className="w-8 h-8 text-rsherbal-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">5-Star Rated</h3>
              <p className="text-xs text-gray-600">Trusted by thousands</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our most popular RS Herbal products, carefully selected 
              for their quality and effectiveness.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="text-center">
            <Link
              to="/shop"
              className="inline-flex items-center px-8 py-4 bg-rsherbal-600 text-white text-lg font-medium rounded-xl hover:bg-rsherbal-700 transition-colors shadow-lg hover:shadow-xl"
            >
              View All Products
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600">
              Real stories from people who transformed their wellness journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
              >
                <div className="flex items-center mb-4">
                  {renderStars(testimonial.rating)}
                </div>
                <blockquote className="text-gray-700 mb-6 italic">
                  "{testimonial.text}"
                </blockquote>
                <div className="flex items-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonial.name}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

  {/* About Section */}
  <section className="py-20 bg-gradient-to-r from-rsherbal-50 to-earth-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                The Ancient Science of RS Herbal
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                RS Herbal, rooted in traditional knowledge, is a time-honored approach to 
                natural healing that emphasizes balance between mind, body, and spirit. 
                Our products are carefully crafted using traditional formulations 
                and the finest natural ingredients.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Each product is designed to support your unique constitution and 
                help you achieve optimal health through the wisdom of nature.
              </p>
              <button className="inline-flex items-center px-6 py-3 bg-rsherbal-600 text-white font-medium rounded-lg hover:bg-rsherbal-700 transition-colors">
                Learn More About RS Herbal
                <ArrowRight className="ml-2 w-4 h-4" />
              </button>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/4021762/pexels-photo-4021762.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Traditional RS Herbal herbs and spices"
                className="w-full h-[400px] object-cover rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;