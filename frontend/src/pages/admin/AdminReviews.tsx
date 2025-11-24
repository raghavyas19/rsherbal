import React from 'react';
import { Star, CheckCircle, XCircle, Trash2, RotateCcw } from 'lucide-react';
import { useAdminDataContext } from '../../context/AdminDataContext';

const AdminReviews: React.FC = () => {
  const { refreshAll, loading } = useAdminDataContext();

  if (loading) return null;

  return (
    <div className="space-y-6">
      {/* Header + Refresh (replica) */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">Reviews</h1>
          <p className="text-gray-600">Manage product reviews submitted by customers</p>
        </div>
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <button
            onClick={refreshAll}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 hover:bg-blue-200 transition"
            title="Refresh"
          >
            <RotateCcw className="w-6 h-6 text-blue-600" />
          </button>
        </div>
      </div>
      {/* Reviews Table - Desktop */}
      <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Review</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Example row, replace with real data integration */}
            <tr>
              <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">Product Name</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-700">User Name</td>
              <td className="px-6 py-4 whitespace-nowrap text-yellow-500"><Star className="inline w-4 h-4" /> 5</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-700">Great product!</td>
              <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs">Pending</span></td>
              <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                <button className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"><CheckCircle className="w-4 h-4 mr-1" />Approve</button>
                <button className="inline-flex items-center px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"><XCircle className="w-4 h-4 mr-1" />Reject</button>
                <button className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"><Trash2 className="w-4 h-4 mr-1" />Delete</button>
              </td>
            </tr>
            {/* End example row */}
          </tbody>
        </table>
      </div>

      {/* Reviews Cards - Mobile */}
      <div className="md:hidden space-y-4">
        {/* Example card, replace with real data integration */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-900">Product Name</span>
            <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs">Pending</span>
          </div>
          <div className="text-sm text-gray-700">User: <span className="font-medium">User Name</span></div>
          <div className="flex items-center text-yellow-500 text-sm">Rating: <Star className="inline w-4 h-4 ml-1 mr-1" /> 5</div>
          <div className="text-sm text-gray-700">"Great product!"</div>
          <div className="flex items-center space-x-2 mt-2">
            <button className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"><CheckCircle className="w-4 h-4 mr-1" />Approve</button>
            <button className="inline-flex items-center px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"><XCircle className="w-4 h-4 mr-1" />Reject</button>
            <button className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"><Trash2 className="w-4 h-4 mr-1" />Delete</button>
          </div>
        </div>
        {/* End example card */}
      </div>
    </div>
  );
};

export default AdminReviews; 