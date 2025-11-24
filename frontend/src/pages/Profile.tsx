import React, { useEffect, useState } from 'react';
import { getProfile, updateProfile } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');

  useEffect(() => {
    getProfile().then(res => {
      setProfile(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  // populate editable fields when profile loads
  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setGender(profile.gender || '');
      setDob(profile.dob ? new Date(profile.dob).toISOString().slice(0, 10) : '');
    }
  }, [profile]);

  if (loading) return null;
  if (!profile) return <div className="min-h-screen flex items-center justify-center">Profile not found.</div>;

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload: any = { name, gender };
      if (dob) payload.dob = dob;
      const res = await updateProfile(payload);
      setProfile(res.data);
      // update auth context minimal fields
      login({ id: res.data.id, mobile: res.data.mobile || '', role: res.data.role || 'user', name: res.data.name } as any);
      setIsEditing(false);
      alert('Profile updated');
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Profile</h1>
        <div className="bg-white rounded-lg shadow-sm p-6 relative">
          <button aria-label={isEditing ? 'Close editor' : 'Edit profile'} onClick={() => setIsEditing(prev => !prev)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none">
            {/* pencil icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
              <path fillRule="evenodd" d="M2 15a1 1 0 011-1h3.586l9.707-9.707a4 4 0 015.657 5.657L12.243 20H8a1 1 0 01-1-1v-4.243L2 15z" clipRule="evenodd" opacity="0" />
            </svg>
          </button>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input value={name} onChange={e => setName(e.target.value)} disabled={!isEditing} className={`w-full px-3 py-2 border rounded-md ${isEditing ? 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-rsherbal-500 bg-white' : 'border-transparent bg-gray-50 text-gray-700'}`} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input value={profile.email || ''} disabled className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select value={gender} onChange={e => setGender(e.target.value)} disabled={!isEditing} className={`w-full px-3 py-2 border rounded-md ${isEditing ? 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-rsherbal-500 bg-white' : 'border-transparent bg-gray-50 text-gray-700'}`}>
                <option value="">Prefer not to say</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
              <input type="date" value={dob} onChange={e => setDob(e.target.value)} disabled={!isEditing} className={`w-full px-3 py-2 border rounded-md ${isEditing ? 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-rsherbal-500 bg-white' : 'border-transparent bg-gray-50 text-gray-700'}`} />
            </div>

            {isEditing && (
              <div className="flex justify-end space-x-2 mt-3">
                <button onClick={() => { setName(profile.name || ''); setGender(profile.gender || ''); setDob(profile.dob ? new Date(profile.dob).toISOString().slice(0,10) : ''); setIsEditing(false); }} className="px-4 py-2 rounded bg-gray-200 text-gray-700">Cancel</button>
                <button onClick={handleSave} disabled={saving} className="px-4 py-2 rounded bg-rsherbal-600 text-white hover:bg-rsherbal-700">{saving ? 'Saving...' : 'Save Changes'}</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 