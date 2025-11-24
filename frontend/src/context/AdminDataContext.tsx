import React, { createContext, useContext, useState, useCallback } from 'react';
import { adminFetchUsers, adminFetchOrders, fetchProducts, adminFetchOrderStats, adminFetchTopProducts } from '../services/api';
import { useAuth } from './AuthContext';

interface AdminDataContextType {
  users: any[];
  orders: any[];
  products: any[];
  stats: any;
  topProducts: any[];
  loading: boolean;
  refreshAll: () => Promise<void>;
}

const AdminDataContext = createContext<AdminDataContextType>({
  users: [],
  orders: [],
  products: [],
  stats: {},
  topProducts: [],
  loading: false,
  refreshAll: async () => {},
});

export const useAdminDataContext = () => useContext(AdminDataContext);

export const AdminDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshAll = useCallback(async () => {
    if (!user || user.role !== 'admin') return;
    setLoading(true);
    try {
      const [usersRes, ordersRes, productsRes, statsRes, topProductsRes] = await Promise.all([
        adminFetchUsers(),
        adminFetchOrders(),
        fetchProducts(),
        adminFetchOrderStats(),
        adminFetchTopProducts()
      ]);
      setUsers(usersRes.data);
      setOrders(ordersRes.data);
      setProducts(productsRes.data);
      setStats(statsRes.data);
      setTopProducts(topProductsRes.data);
    } finally {
      setLoading(false);
    }
  }, [user]);

  React.useEffect(() => {
    if (user && user.role === 'admin') {
      refreshAll();
    }
  }, [refreshAll, user]);

  return (
    <AdminDataContext.Provider value={{ users, orders, products, stats, topProducts, loading, refreshAll }}>
      {children}
    </AdminDataContext.Provider>
  );
}; 