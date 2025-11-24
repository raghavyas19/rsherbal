import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProfile } from '../services/api';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    // Read short-lived auth_token cookie set by backend
    const getCookie = (name: string) => {
      const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
      return match ? decodeURIComponent(match[2]) : null;
    };

    const token = getCookie('auth_token');
    if (token) {
      // Store short-lived token for potential Authorization header usage
      localStorage.setItem('auth_token', token);
    }

    const params = new URLSearchParams(location.search);
    const next = params.get('next') || '/';

    // Fetch profile using cookie-backed auth (httpOnly token cookie). If successful, hydrate auth context.
    (async () => {
      try {
        const resp = await getProfile();
        const profile = resp.data;
        // Map to AuthContext user shape if necessary
        login({
          id: profile.id,
          mobile: profile.mobile ?? '',
          name: profile.name ?? '',
          gender: profile.gender ?? undefined,
          dob: profile.dob ?? undefined,
          role: profile.role ?? 'user',
        });

        // Clear temporary cookies client-side
        document.cookie = 'auth_token=; Max-Age=0; path=/;';
        document.cookie = 'auth_completed=; Max-Age=0; path=/;';
      } catch (err) {
        // Couldn't fetch profile — it's okay, still redirect
        console.warn('Could not fetch profile after auth callback', err);
      } finally {
        setTimeout(() => navigate(next), 200);
      }
    })();
  }, [location, login, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-6 bg-white rounded shadow">
        <h3 className="text-lg font-medium">Signing you in…</h3>
      </div>
    </div>
  );
};

export default AuthCallback;
