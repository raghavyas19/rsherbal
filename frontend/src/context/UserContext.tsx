import React, { createContext, useContext, useState, useCallback } from 'react';
import { adminFetchUsers } from '../services/api';

interface UserContextType {
  users: any[];
  loading: boolean;
  refreshUsers: () => Promise<void>;
}

const UserContext = createContext<UserContextType>({
  users: [],
  loading: false,
  refreshUsers: async () => {},
});

export const useUserContext = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminFetchUsers();
      setUsers(res.data);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  React.useEffect(() => {
    refreshUsers();
  }, [refreshUsers]);

  return (
    <UserContext.Provider value={{ users, loading, refreshUsers }}>
      {children}
    </UserContext.Provider>
  );
}; 