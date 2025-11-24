import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAddProduct } from '../../services/api';
import { ArrowLeft } from 'lucide-react';
import { useAdminDataContext } from '../../context/AdminDataContext';

const CATEGORY_OPTIONS = [
  'Beauty',
  'Health',
  'Hair',
  'Skin',
  'Wellness',
  'Personal Care',
  'Supplements',
];
const UNIT_OPTIONS = ['pcs', 'ml', 'g', 'kg', 'pack', 'bottle', 'box'];

const AdminAddProduct: React.FC = () => {
  const navigate = useNavigate();
  const { refreshAll } = useAdminDataContext();
  const [form, setForm] = useState<any>({
    name: '',
    shortDescription: '',
    longDescription: '',
    price: '',
    originalPrice: '',
    image: '',
    images: [],
    category: '',
    quantity: '',
    unit: '',
    keyBenefits: [''],
    keyIngredients: [''],
    directionForUse: '',
    safetyInformation: '',
    technicalInformation: '',
    additionalInformation: '',
    inStock: true,
  });
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [mainImagePreview, setMainImagePreview] = useState<string>('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageLimitError, setImageLimitError] = useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const fileArr = Array.from(files);
    // Limit to 8 images
    if (imagePreviews.length + fileArr.length > 8) {
      setImageLimitError('You can upload up to 8 images only.');
      e.target.value = '';
      return;
    } else {
      setImageLimitError('');
    }
    const previews: string[] = [];
    let loaded = 0;
    fileArr.forEach((file, idx) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        previews[idx] = ev.target?.result as string;
        loaded++;
        if (loaded === fileArr.length) {
          setImagePreviews(prev => {
            const newPreviews = [...prev, ...previews];
            setForm((f: any) => ({ ...f, images: newPreviews, image: newPreviews[0] }));
            setMainImagePreview(newPreviews[0]);
            return newPreviews;
          });
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleRemoveImage = (idx: number) => {
    setImagePreviews(prev => {
      const newPreviews = prev.filter((_, i) => i !== idx);
      setForm((f: any) => ({ ...f, images: newPreviews, image: newPreviews[0] || '' }));
      setMainImagePreview(newPreviews[0] || '');
      return newPreviews;
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((f: any) => ({ ...f, [name]: type === 'number' ? Number(value) : value }));
  };

  const handleArrayChange = (field: string, idx: number, value: string) => {
    setForm((f: any) => {
      const arr = [...(f[field] || [])];
      arr[idx] = value;
      return { ...f, [field]: arr };
    });
  };

  const addArrayField = (field: string) => {
    setForm((f: any) => ({ ...f, [field]: [...(f[field] || []), ''] }));
  };

  const removeArrayField = (field: string, idx: number) => {
    setForm((f: any) => {
      const arr = [...(f[field] || [])];
      arr.splice(idx, 1);
      return { ...f, [field]: arr };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    // Validate required fields
    if (!form.name || !form.shortDescription || !form.price || !form.image || !form.category || !form.quantity || !form.unit) {
      setError('Please fill all required fields.');
      setLoading(false);
      return;
    }
    try {
      await adminAddProduct({
        ...form,
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
        quantity: Number(form.quantity),
        inStock: form.inStock === 'false' ? false : true,
      });
      await refreshAll();
      navigate('/admin/products');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add product');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate('/admin/products')}
          className="flex items-center space-x-2 text-rsherbal-600 hover:text-rsherbal-700 font-medium mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          <span>Back to Products</span>
        </button>
        <div className="bg-white rounded-lg shadow py-2">
          <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                <input name="name" value={form.name} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select name="category" value={form.category} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" required>
                  <option value="">Select Category</option>
                  {CATEGORY_OPTIONS.map(option => <option key={option} value={option}>{option}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Short Description *</label>
                <textarea name="shortDescription" value={form.shortDescription} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" required maxLength={120} />
                <div className="text-xs text-gray-400">Max 120 characters</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Long Description</label>
                <textarea name="longDescription" value={form.longDescription} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" rows={4} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                <input name="price" type="number" value={form.price} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" required min={1} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Original Price</label>
                <input name="originalPrice" type="number" value={form.originalPrice} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" min={1} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
                <input name="quantity" type="number" value={form.quantity} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" required min={1} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unit *</label>
                <select name="unit" value={form.unit} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" required>
                  <option value="">Select Unit</option>
                  {UNIT_OPTIONS.map(option => <option key={option} value={option}>{option}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Images *</label>
              {imagePreviews.length === 0 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-1/4 bg-rsherbal-600 text-white px-4 py-2 rounded hover:bg-rsherbal-700 transition-colors"
                >
                  Upload Images
                </button>
              )}
              {imagePreviews.length === 0 && (
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                  ref={fileInputRef}
                  required
                />
              )}
              {imagePreviews.length > 0 && (
                <div className="flex flex-wrap gap-4 items-center mb-2">
                  {imagePreviews.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={img}
                        alt={`Preview ${idx + 1}`}
                        className={`h-16 w-16 object-cover rounded border ${mainImagePreview === img ? 'ring-2 ring-rsherbal-500' : ''}`}
                        onClick={() => { setMainImagePreview(img); setForm((f: any) => ({ ...f, image: img })); }}
                      />
                      <span className="absolute bottom-1 left-1 bg-white bg-opacity-80 text-xs px-1 rounded">({idx + 1})</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-0 right-0 bg-white bg-opacity-80 rounded-full p-1 text-red-600 hover:bg-red-100 z-10"
                        title="Remove image"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  ))}
                  {imagePreviews.length < 8 && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="h-16 w-16 flex items-center justify-center border-2 border-dashed border-rsherbal-400 rounded text-rsherbal-600 hover:bg-rsherbal-50 transition-colors"
                      title="Add more images"
                    >
                      + Add More
                    </button>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                    ref={fileInputRef}
                  />
                </div>
              )}
              {imageLimitError && <div className="text-red-500 text-xs mb-2">{imageLimitError}</div>}
              {(mainImagePreview !== undefined && mainImagePreview !== null && mainImagePreview !== "") && (
                <div className="text-xs text-gray-500 mt-1">Click an image to set as main</div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Key Benefits</label>
                {form.keyBenefits.map((val: string, idx: number) => (
                  <div key={idx} className="flex items-center space-x-2 mb-1">
                    <input value={val} onChange={e => handleArrayChange('keyBenefits', idx, e.target.value)} className="flex-1 border border-gray-300 rounded-lg px-3 py-2" />
                    <button type="button" onClick={() => removeArrayField('keyBenefits', idx)} className="text-red-500">Remove</button>
                  </div>
                ))}
                <button type="button" onClick={() => addArrayField('keyBenefits')} className="text-rsherbal-600 text-xs mt-1">+ Add Benefit</button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Key Ingredients</label>
                {form.keyIngredients.map((val: string, idx: number) => (
                  <div key={idx} className="flex items-center space-x-2 mb-1">
                    <input value={val} onChange={e => handleArrayChange('keyIngredients', idx, e.target.value)} className="flex-1 border border-gray-300 rounded-lg px-3 py-2" />
                    <button type="button" onClick={() => removeArrayField('keyIngredients', idx)} className="text-red-500">Remove</button>
                  </div>
                ))}
                <button type="button" onClick={() => addArrayField('keyIngredients')} className="text-rsherbal-600 text-xs mt-1">+ Add Ingredient</button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Direction for Use</label>
                <textarea name="directionForUse" value={form.directionForUse} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" rows={2} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Safety Information</label>
                <textarea name="safetyInformation" value={form.safetyInformation} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" rows={2} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Technical Information</label>
                <textarea name="technicalInformation" value={form.technicalInformation} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" rows={2} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Information</label>
                <textarea name="additionalInformation" value={form.additionalInformation} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" rows={2} />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input type="checkbox" name="inStock" checked={form.inStock} onChange={e => setForm((f: any) => ({ ...f, inStock: e.target.checked }))} />
                <span>In Stock</span>
              </label>
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <div className="flex justify-end">
              <button type="submit" className="px-6 py-2 rounded-lg bg-rsherbal-600 text-white hover:bg-rsherbal-700" disabled={loading}>
                {loading ? 'Adding...' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminAddProduct; 