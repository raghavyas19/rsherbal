import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Leaf, ShoppingCart, Menu, X, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { state } = useCart();
  const { user, logout } = useAuth();
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => location.pathname === path;

  // Handle body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add('mobile-menu-open');
    } else {
      document.body.classList.remove('mobile-menu-open');
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('mobile-menu-open');
    };
  }, [isMobileMenuOpen]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setShowDropdown(false);
  }, [location.pathname]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/shop', label: 'Shop' },
    { path: '/about', label: 'About Us' },
    { path: '/faq', label: 'FAQ' },
    { path: '/contact', label: 'Contact' },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="flex items-center justify-center w-10 h-10 bg-rsherbal-500 rounded-full group-hover:bg-rsherbal-600 transition-colors">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">RS Herbal</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-rsherbal-600 ${
                  isActive(link.path) 
                    ? 'text-rsherbal-600 border-b-2 border-rsherbal-600 pb-1' 
                    : 'text-gray-700'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  className="flex items-center space-x-1 text-gray-700 hover:text-rsherbal-600 transition-colors"
                  onClick={() => setShowDropdown((v) => !v)}
                >
                  <User className="w-5 h-5" />
                  <span className="text-sm font-medium">{user.name ? user.name.split(' ')[0] : 'User'}</span>
                </button>
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</Link>
                    <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Orders</Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/user/auth"
                className="flex items-center space-x-1 text-gray-700 hover:text-rsherbal-600 transition-colors"
              >
                <User className="w-5 h-5" />
                <span className="text-sm font-medium">Sign In</span>
              </Link>
            )}
            <Link
              to="/cart"
              className="flex items-center space-x-1 text-gray-700 hover:text-rsherbal-600 transition-colors relative"
            >
              <ShoppingCart className="w-5 h-5" />
              {state.itemCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-rsherbal-500 text-white text-xs rounded-full flex items-center justify-center">
                  {state.itemCount}
                </span>
              )}
              <span className="text-sm font-medium">Cart</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-rsherbal-600 hover:bg-gray-100 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 animate-fade-in bg-white">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-base font-medium px-2 py-1 transition-colors ${
                    isActive(link.path) 
                      ? 'text-rsherbal-600' 
                      : 'text-gray-700 hover:text-rsherbal-600'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex items-center space-x-4 px-2 pt-2 border-t border-gray-200">
                {user ? (
                  <div className="relative" ref={dropdownRef}>
                    <button
                      className="flex items-center space-x-2 text-gray-700 hover:text-rsherbal-600 transition-colors"
                      onClick={() => setShowDropdown((v) => !v)}
                    >
                      <User className="w-5 h-5" />
                      <span>{user.name ? user.name.split(' ')[0] : 'User'}</span>
                    </button>
                    {showDropdown && (
                      <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
                        <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</Link>
                        <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Orders</Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to="/signin"
                    className="flex items-center space-x-2 text-gray-700 hover:text-rsherbal-600 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="w-5 h-5" />
                    <span>Sign In</span>
                  </Link>
                )}
                <Link
                  to="/cart"
                  className="flex items-center space-x-2 text-gray-700 hover:text-rsherbal-600 transition-colors relative"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {state.itemCount > 0 && (
                    <span className="absolute -top-1 -left-1 w-4 h-4 bg-rsherbal-500 text-white text-xs rounded-full flex items-center justify-center">
                      {state.itemCount}
                    </span>
                  )}
                  <span>Cart ({state.itemCount})</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;