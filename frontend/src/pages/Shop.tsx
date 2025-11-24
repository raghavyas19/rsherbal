import React, { useState, useEffect, useMemo } from 'react';
import { Filter, Grid, List } from 'lucide-react';
import ProductCard from '../components/Common/ProductCard';
import Skeleton from '../components/Common/Skeleton';
import { fetchProducts } from '../services/api';

const Shop: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [sortBy, setSortBy] = useState('name');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [categories, setCategories] = useState<string[]>(['All Products']);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    fetchProducts()
      .then(res => {
        setProducts(res.data);
        // Extract categories from products
        const cats = Array.from(new Set((res.data as any[]).map((p: any) => p.category as string)));
        setCategories(['All Products', ...cats]);
      })
      .catch(() => {
        // Leave products empty on error; UI will show no products after load
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;
    // Only show public products in shop
    filtered = filtered.filter(product => product.visibility === 'public');
    if (selectedCategory !== 'All Products') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });
    return filtered;
  }, [products, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Shop RS Herbal Products
          </h1>
          <p className="text-lg text-gray-600">
            Discover our complete collection of authentic herbal products for natural wellness
          </p>
        </div>
        {/* Filters and Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
          {/* Categories - Desktop */}
          <div className="hidden lg:flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-rsherbal-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-rsherbal-50 hover:text-rsherbal-600'
                } border border-gray-200`}
              >
                {category}
              </button>
            ))}
          </div>
          {/* Sort and View Controls */}
          <div className="flex items-center space-x-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rsherbal-500"
            >
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
        {/* Mobile Categories */}
        {showFilters && (
          <div className="lg:hidden mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200 animate-fade-in">
            <h3 className="font-medium text-gray-900 mb-3">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setShowFilters(false);
                  }}
                  className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-rsherbal-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-rsherbal-50 hover:text-rsherbal-600'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}
        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredAndSortedProducts.length} product
            {filteredAndSortedProducts.length !== 1 ? 's' : ''}
            {selectedCategory !== 'All Products' && (
              <span> in "{selectedCategory}"</span>
            )}
          </p>
        </div>
        {/* Products Grid/List */}
        {loading ? (
          // Show skeletons while loading
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className={viewMode === 'list' ? 'w-full' : ''}>
                <Skeleton variant="card" />
              </div>
            ))}
          </div>
        ) : filteredAndSortedProducts.length > 0 ? (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }>
            {filteredAndSortedProducts.map((product) => (
              <div key={product._id || product.id} className={viewMode === 'list' ? 'w-full' : ''}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🌿</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-600">
              Try adjusting your filters or browse all products
            </p>
            
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;