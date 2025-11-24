import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAdminDataContext } from '../../context/AdminDataContext';
import Skeleton from '../../components/Common/Skeleton';
import { ArrowLeft } from 'lucide-react';

const AdminUserDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { users, orders, loading } = useAdminDataContext();

  if (loading) return <Skeleton variant="card" className="p-8" />;

  const user = users.find(u => u._id === id || u.id === id);
  if (!user) return <div className="p-8">User not found</div>;

  const userOrders = orders.filter((o: any) => {
    const uid = o.user && (o.user._id || o.user.id || o.user);
    return uid === user._id || uid === user.id;
  });

  const totalSpent = userOrders.reduce((sum: number, o: any) => sum + (o.total || 0), 0);

  const formatDate = (s?: string) => s ? new Date(s).toLocaleDateString() : '-';

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-6 mt-6">
      <button onClick={() => navigate(-1)} className="mb-4 flex items-center text-blue-600 hover:underline">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back
      </button>

      <h1 className="text-2xl font-bold mb-2">{user.name || 'User'}</h1>
      <div className="text-sm text-gray-600 mb-6">{user.email || '-'} • {user.mobile || '-'}</div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded">
          <div className="text-xs text-gray-500">Joined</div>
          <div className="font-medium">{formatDate(user.createdAt)}</div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Orders ({userOrders.length})</h2>
        {userOrders.length === 0 ? (
          <div className="text-sm text-gray-500">This user hasn't placed any orders yet.</div>
        ) : (
          <div className="space-y-3">
            {userOrders.map((o: any) => (
              <div key={o._id} className="p-3 border border-gray-100 rounded-lg flex items-center justify-between hover:bg-gray-50">
                <div>
                  <button
                    onClick={() => navigate(`/admin/orders/${o._id}`)}
                    className="text-sm font-medium text-blue-600 hover:underline"
                  >
                    #{o._id?.slice(-8).toUpperCase()}
                  </button>
                  <div className="text-xs text-gray-600">{new Date(o.createdAt).toLocaleDateString()}</div>
                </div>
                <div className="text-sm font-medium">₹{(o.total || 0).toFixed(2)}</div>
              </div>
            ))}
            <div className="text-right text-sm text-gray-700">Total spent: <span className="font-semibold">₹{totalSpent.toFixed(2)}</span></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUserDetail;
