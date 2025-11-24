import React, { useState } from 'react';
import { Search, Trash2, Mail, Calendar, Filter, RotateCcw } from 'lucide-react';
import { useAdminDataContext } from '../../context/AdminDataContext';
import { adminDeleteUser } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const AdminUsers: React.FC = () => {
  const { users, loading, refreshAll } = useAdminDataContext();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'email' | 'joinDate'>('name');

  // Only show users with role !== 'admin'
  const nonAdminUsers = users.filter((u: any) => u.role !== 'admin');
  const filteredAndSortedUsers = nonAdminUsers
    .filter(user => 
      (user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        case 'email':
          return (a.email || '').localeCompare(b.email || '');
        case 'joinDate':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

  const handleDeleteUser = (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    (async () => {
      try {
        await adminDeleteUser(id);
      } catch (err) {
        // optionally show error
      }
      refreshAll();
    })();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) return null;

  return (
    <div className="space-y-6">
      {/* Header + Refresh */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600">Manage customer accounts and user data</p>
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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{nonAdminUsers.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">New This Month</p>
              <p className="text-2xl font-bold text-gray-900">
                {nonAdminUsers.filter(user => {
                  const joinDate = new Date(user.createdAt);
                  const now = new Date();
                  return joinDate.getMonth() === now.getMonth() && 
                         joinDate.getFullYear() === now.getFullYear();
                }).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <Filter className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">{nonAdminUsers.length}</p>
            </div>
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
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rsherbal-500"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'email' | 'joinDate')}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rsherbal-500"
            >
              <option value="name">Name</option>
              <option value="email">Email</option>
              <option value="joinDate">Join Date</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table - Desktop */}
      <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mobile No.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Join Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Visit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Order
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedUsers.map((user, idx) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{idx + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-rsherbal-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-rsherbal-600">
                            {(user.name || '').split(' ').map((n: string) => n[0]).join('')}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          <button
                            onClick={() => navigate(`/admin/users/${user._id}`)}
                            className="text-sm font-medium text-blue-600 hover:underline"
                          >
                            {user.name}
                          </button>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.mobile || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDate(user.createdAt)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.lastVisit ? formatDate(user.lastVisit) : '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.lastOrderDate ? formatDate(user.lastOrderDate) : '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => window.open(`mailto:${user.email}`)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Send Email"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredAndSortedUsers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        )}
      </div>

      {/* Users Cards - Mobile */}
      <div className="md:hidden space-y-4">
        {filteredAndSortedUsers.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        ) : (
          filteredAndSortedUsers.map((user) => (
            <div key={user._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col space-y-2">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-rsherbal-100 flex items-center justify-center">
                  <span className="text-sm font-medium text-rsherbal-600">{(user.name || '').split(' ').map((n: string) => n[0]).join('')}</span>
                </div>
                  <div>
                  <div className="font-semibold text-gray-900">
                    <button onClick={() => navigate(`/admin/users/${user._id}`)} className="text-base font-semibold text-blue-600 hover:underline">
                      {user.name}
                    </button>
                  </div>
                  <div className="text-xs text-gray-500">{user.mobile || '-'}</div>
                </div>
              </div>
              <div className="text-sm text-gray-700">Join Date: <span className="font-medium">{formatDate(user.createdAt)}</span></div>
              <div className="text-sm text-gray-700">Last Visit: <span className="font-medium">{user.lastVisit ? formatDate(user.lastVisit) : '-'}</span></div>
              <div className="text-sm text-gray-700">Last Order: <span className="font-medium">{user.lastOrderDate ? formatDate(user.lastOrderDate) : '-'}</span></div>
              <div className="flex items-center space-x-2 mt-2">
                <button
                  onClick={() => window.open(`mailto:${user.email}`)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Send Email"
                >
                  <Mail className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteUser(user._id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete User"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminUsers;