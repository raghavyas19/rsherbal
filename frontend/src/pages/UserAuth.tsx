import React from 'react';
import { Link } from 'react-router-dom';

const UserAuthPlaceholder: React.FC = () => {
  const backend = import.meta.env.VITE_BACKEND_URL || '';
  const googleUrl = `${backend.replace(/\/$/, '')}/api/auth/google`;

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-lg w-full bg-white rounded shadow p-6 text-center">
        <h2 className="text-xl font-semibold mb-4">Sign in</h2>
        <p className="mb-4 text-sm text-gray-600">Sign in with your Google account</p>
        <div className="flex flex-col gap-3">
          <a href={googleUrl} className="inline-flex items-center justify-center gap-3 px-4 py-2 bg-gray-100 border rounded hover:bg-gray-50">
            <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" className="w-5 h-5" />
            <span>Sign in with Google</span>
          </a>
          <Link to="/" className="text-rsherbal-600 hover:underline">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default UserAuthPlaceholder;