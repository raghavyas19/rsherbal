import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, Filter, Star, RotateCcw, Copy } from 'lucide-react';
import { useAdminDataContext } from '../../context/AdminDataContext';
import { adminAddProduct, adminUpdateProduct, adminDeleteProduct } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const AdminProducts: React.FC = () => {
  const { products, loading, refreshAll } = useAdminDataContext();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [visibilityFilter, setVisibilityFilter] = useState('all');

  // Extract unique categories from products
  const categories = ['All Products', ...Array.from(new Set(products.map(p => p.category)))];

  const CATEGORY_OPTIONS = [
    'Beauty',
    'Health',
    'Hair',
    'Skin',
    'Wellness',
    'Personal Care',
    'Supplements',
  ];

  const [newProduct, setNewProduct] = useState<any>({
    name: '',
    price: 0,
    category: '',
    description: '',
    image: '',
    images: [],
    ingredients: [],
    benefits: [],
    howToUse: [],
    precautions: [],
    inStock: true,
    rating: 0,
    reviewCount: 0
  });

  const filteredProducts = products.filter(product => {
    const matchesSearch = (product.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.category || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All Products' || product.category === selectedCategory;
    const matchesVisibility = visibilityFilter === 'all' || product.visibility === visibilityFilter;
    return matchesSearch && matchesCategory && matchesVisibility;
  });

  const handleAddProduct = async () => {
    try {
      await adminAddProduct(newProduct);
    } catch (err) {
      // Optionally show error
    }
    setShowAddModal(false);
    refreshAll();
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setNewProduct(product);
    setShowAddModal(true);
  };

  const handleUpdateProduct = () => {
    if (!editingProduct) return;
    (async () => {
      try {
        await adminUpdateProduct(editingProduct._id, newProduct);
      } catch (err) {
        // optionally show error
      }
      setEditingProduct(null);
      setShowAddModal(false);
      refreshAll();
    })();
  };

  const handleDeleteProduct = (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    (async () => {
      try {
        await adminDeleteProduct(id);
      } catch (err) {
        // optionally show error
      }
      refreshAll();
    })();
  };

  const handleVisibilityChange = async (productId: string, newVisibility: string) => {
    await adminUpdateProduct(productId, { visibility: newVisibility });
    refreshAll();
  };

  const handleCopyLink = (productId: string) => {
    const url = `${window.location.origin}/product/${productId}`;
    navigator.clipboard.writeText(url);
    alert('Product link copied!');
  };

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

  if (loading || !Array.isArray(products)) return null;

  return (
    <div className="space-y-6">
      {/* Header + Refresh */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600">Manage your product inventory</p>
        </div>
        <div className="flex items-center space-x-2 mt-4 md:mt-0 w-full md:w-auto">
          {/* Left-side actions: Add Product then visibility filter */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigate('/admin/products/add')}
              className="inline-flex items-center space-x-2 bg-rsherbal-600 text-white px-4 py-2 rounded-lg hover:bg-rsherbal-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </button>

            <select
              value={visibilityFilter}
              onChange={e => setVisibilityFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rsherbal-500"
            >
              <option value="all">All</option>
              <option value="public">Public</option>
              <option value="hidden">Hidden</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Right-side: refresh */}
          <div className="ml-auto flex items-center">
            <button
              onClick={refreshAll}
              className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 hover:bg-blue-200 transition"
              title="Refresh"
            >
              <RotateCcw className="w-6 h-6 text-blue-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rsherbal-500"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rsherbal-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4">
        {filteredProducts.map((product) => (
          <div key={product._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden p-2 flex flex-col">
            <div className="relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-36 object-cover rounded"
              />
              <div className={`absolute top-1 right-1 px-1 py-0.5 rounded-full text-[10px] font-medium ${
                product.inStock 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </div>
            </div>
            <div className="mt-2 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-rsherbal-600 font-medium uppercase tracking-wide">
                  {product.category}
                </span>
                <h3 className="text-xs font-semibold text-gray-900 mt-1 mb-1 line-clamp-1">
                  {product.name}
                </h3>
                <div className="flex items-center mb-1">
                  <div className="flex items-center space-x-0.5">
                    {renderStars(product.rating)}
                  </div>
                  <span className="ml-1 text-[10px] text-gray-600">
                    ({product.reviewCount})
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-sm font-bold text-gray-900">
                  ₹{product.price}
                </span>
                <div className="flex items-center space-x-1">
                  {/* Visibility Dropdown */}
                  <select
                    value={product.visibility || 'public'}
                    onChange={e => handleVisibilityChange(product._id, e.target.value)}
                    className="border border-gray-300 rounded px-1 py-0.5 text-xs"
                  >
                    <option value="public">Public</option>
                    <option value="hidden">Hidden</option>
                    <option value="archived">Archived</option>
                  </select>
                  {/* Share Link Icon for Hidden */}
                  {product.visibility === 'hidden' && (
                    <button onClick={() => handleCopyLink(product._id)} title="Copy product link" className="ml-1 p-1 text-gray-500 hover:text-rsherbal-600">
                      <Copy className="w-3 h-3" />
                    </button>
                  )}
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  >
                    <Edit className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product._id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
              {/* Archived indicator */}
              {product.visibility === 'archived' && (
                <div className="text-xs text-red-500 mt-1">Archived (inactive)</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;