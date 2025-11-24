// import React from 'react';
import { Suspense, lazy, useEffect, useRef, useLayoutEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
// Lazy-loaded pages to reduce main bundle size
const Home = lazy(() => import('./pages/Home'));
const Shop = lazy(() => import('./pages/Shop'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Contact = lazy(() => import('./pages/Contact'));
const SignIn = lazy(() => import('./pages/UserAuth'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminAddProduct = lazy(() => import('./pages/admin/AdminAddProduct'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminUserDetail = lazy(() => import('./pages/admin/AdminUserDetail'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminPayments = lazy(() => import('./pages/admin/AdminPayments'));
const AdminReviews = lazy(() => import('./pages/admin/AdminReviews'));
const AdminAnalytics = lazy(() => import('./pages/admin/AdminAnalytics'));
const About = lazy(() => import('./pages/About'));
const Profile = lazy(() => import('./pages/Profile'));
const NotFound = lazy(() => import('./pages/NotFound'));
const AuthCallback = lazy(() => import('./pages/AuthCallback'));
const PaymentPage = lazy(() => import('./pages/CheckoutPayment'));
const CheckoutConfirmation = lazy(() => import('./pages/CheckoutConfirmation'));
const UserOrders = lazy(() => import('./pages/UserOrders'));
const UserOrderDetail = lazy(() => import('./pages/UserOrderDetail'));
const AdminOrderDetail = lazy(() => import('./pages/admin/AdminOrderDetail'));
const AdminRedirect = lazy(() => import('./pages/admin/AdminRedirect'));
// import FAQ from './pages/FAQ';
import AnimatedPage from './components/Common/AnimatedPage';
import AdminProtectedRoute from './components/Common/AdminProtectedRoute';
import UserProtectedRoute from './components/Common/UserProtectedRoute';
import AdminBlocker from './components/Common/AdminBlocker';
import Skeleton from './components/Common/Skeleton';
// (NotFound, AdminRedirect, AuthCallback, AdminOrderDetail, PaymentPage, CheckoutConfirmation,
// UserOrders and UserOrderDetail are lazy-loaded above)
import { AdminDataProvider } from './context/AdminDataContext';
 

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <DynamicAnimatePresence>
      <Routes location={location} key={location.pathname}>
  <Route path="/auth/callback" element={<AnimatedPage><AuthCallback /></AnimatedPage>} />
        <Route element={<AdminBlocker />}>
          <Route path="/" element={<AnimatedPage><Home /></AnimatedPage>} />
          <Route path="/shop" element={<AnimatedPage><Shop /></AnimatedPage>} />
          <Route path="/product/:id" element={<AnimatedPage><ProductDetail /></AnimatedPage>} />
          <Route element={<UserProtectedRoute />}>
            <Route path="/cart" element={<AnimatedPage><Cart /></AnimatedPage>} />
            <Route path="/checkout" element={<AnimatedPage><Checkout /></AnimatedPage>} />
            <Route path="/checkout/payment" element={<AnimatedPage><PaymentPage /></AnimatedPage>} />
              <Route path="/checkout/confirmation" element={<AnimatedPage><CheckoutConfirmation /></AnimatedPage>} />
              <Route path="/profile" element={<AnimatedPage><Profile /></AnimatedPage>} />
              <Route path="/orders" element={<AnimatedPage><UserOrders /></AnimatedPage>} />
              <Route path="/orders/:id" element={<AnimatedPage><UserOrderDetail /></AnimatedPage>} />
          </Route>
          <Route path="/contact" element={<AnimatedPage><Contact /></AnimatedPage>} />
          <Route path="/about" element={<AnimatedPage><About /></AnimatedPage>} />
          <Route path="/user/auth" element={<AnimatedPage><SignIn /></AnimatedPage>} />
        </Route>
        
  {/* Catch-all for frontend (non-admin) routes - show 404 */}
  <Route path="*" element={<AnimatedPage><NotFound /></AnimatedPage>} />
      </Routes>
    </DynamicAnimatePresence>
  );
}

// Dynamically load AnimatePresence from framer-motion so it's only fetched when used.
function DynamicAnimatePresence({ children }: { children: React.ReactNode }) {
  const [AP, setAP] = (useState as any)(null);

  useEffect(() => {
    let mounted = true;
    import('framer-motion').then(mod => {
      if (mounted) setAP(() => mod.AnimatePresence);
    }).catch(() => {});
    return () => { mounted = false; };
  }, []);

  if (!AP) {
    // fallback while AnimatePresence loads
    return <>{children}</>;
  }

  const AnimatePresence = AP;
  return <AnimatePresence mode="wait">{children}</AnimatePresence>;
}

// Scroll restoration: save scroll position per pathname and restore when navigating back
function ScrollRestoration() {
  const location = useLocation();
  // Use pathname + search so different filter/query states keep separate positions
  const key = `${location.pathname}${location.search}`;
  const positionsRef = useRef<Record<string, { x: number; y: number }>>({});

  // Load persisted positions from sessionStorage once
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('rs_scroll_positions');
      if (raw) {
        positionsRef.current = JSON.parse(raw) || {};
      }
    } catch (e) {
      // ignore parse errors
    }

    const beforeUnload = () => {
      try { sessionStorage.setItem('rs_scroll_positions', JSON.stringify(positionsRef.current)); } catch {}
    };
    window.addEventListener('beforeunload', beforeUnload);
    return () => window.removeEventListener('beforeunload', beforeUnload);
  }, []);

  // Restore (or scroll to top) on navigation and save previous position when leaving
  useLayoutEffect(() => {
    const pos = positionsRef.current[key];
    if (pos) {
      try {
        window.scrollTo({ top: pos.y, left: pos.x, behavior: 'smooth' });
      } catch (e) {
        window.scrollTo(pos.x, pos.y);
      }
    } else {
      try {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      } catch (e) {
        window.scrollTo(0, 0);
      }
    }

    return () => {
      // Save current position for this key
      positionsRef.current[key] = { x: window.scrollX, y: window.scrollY };
      try { sessionStorage.setItem('rs_scroll_positions', JSON.stringify(positionsRef.current)); } catch {}
    };
  }, [key]);

  return null;
}

function App() {
  return (
    <AdminDataProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-white flex flex-col">
            <Routes>
              {/* Admin Routes */}
              <Route
                path="/admin/login"
                element={
                  <Suspense fallback={<Skeleton className="p-8" />}>
                    <AdminLogin />
                  </Suspense>
                }
              />

              <Route
                path="/admin"
                element={<AdminProtectedRoute />}
              >
                <Route
                  element={
                    <Suspense fallback={<Skeleton className="p-8" />}>
                      <AdminLayout />
                    </Suspense>
                  }
                >
                  <Route index element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="products/add" element={<AdminAddProduct />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="users/:id" element={<AdminUserDetail />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="orders/:orderid" element={<AdminOrderDetail />} />
                  <Route path="payments" element={<AdminPayments />} />
                  <Route path="reviews" element={<AdminReviews />} />
                  <Route path="analytics" element={<AdminAnalytics />} />
                  <Route path="*" element={<AdminRedirect />} />
                </Route>
              </Route>

              <Route
                path="/*"
                element={
                  <>
                    <Header />
                    <main className="flex-1">
                      <Suspense fallback={<Skeleton className="p-8" />}>
                        <ScrollRestoration />
                        <AnimatedRoutes />
                      </Suspense>
                    </main>
                    <Footer />
                  </>
                }
              />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AdminDataProvider>
  );
}

export default App;