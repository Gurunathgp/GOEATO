import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { useAuth } from './context/AuthContext.jsx';
import ReceiptDock from './components/ReceiptDock.jsx';
import EmptyState from './components/EmptyState.jsx';
import Button from './components/Button.jsx';
import { SkeletonPlate } from './components/SkeletonLoader.jsx';
import { IconSearch } from './components/icons.jsx';

// Lazy load page components for better performance
const Home = lazy(() => import('./pages/Home.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const Signup = lazy(() => import('./pages/Signup.jsx'));
const Restaurants = lazy(() => import('./pages/Restaurants.jsx'));
const RestaurantDetail = lazy(() => import('./pages/RestaurantDetail.jsx'));
const Cart = lazy(() => import('./pages/Cart.jsx'));
const Checkout = lazy(() => import('./pages/Checkout.jsx'));
const Orders = lazy(() => import('./pages/Orders.jsx'));
const Admin = lazy(() => import('./pages/Admin.jsx'));

/** Reset scroll position on navigation (React Router does not do this itself). */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
}

// Loading component for Suspense fallback — shaped like the content it replaces.
function PageLoader() {
  return (
    <div className="page">
      <div className="dish-grid">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <SkeletonPlate key={n} ariaLabel="Loading page" />
        ))}
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="page">
      <EmptyState
        icon={<IconSearch size={26} />}
        title="This page isn't on the menu"
        description="The GoEato page you're looking for doesn't exist or has moved somewhere else."
        action={
          <Button variant="primary" to="/">
            Back to the menu
          </Button>
        }
      />
    </div>
  );
}

function Footer() {
  const { user, isAdmin } = useAuth();
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <h3>Go<span>Eato</span></h3>
          <p>
            Local kitchens, tonight's menu. Order from neighbourhood favourites and follow
            every step from the pan to your door.
          </p>
        </div>

        <div className="footer-links">
          <h4>Explore</h4>
          <Link to="/">Discover dishes</Link>
          <Link to="/restaurants">Partner kitchens</Link>
          <Link to="/cart">Your basket</Link>
        </div>

        <div className="footer-links">
          <h4>Account</h4>
          {user ? (
            <>
              <Link to="/orders">Track your orders</Link>
              {isAdmin && <Link to="/admin">Admin portal</Link>}
            </>
          ) : (
            <>
              <Link to="/login">Sign in</Link>
              <Link to="/signup">Create an account</Link>
            </>
          )}
        </div>

        <div className="footer-links">
          <h4>Support</h4>
          <a href="mailto:support@goeato.local">support@goeato.local</a>
          <a href="mailto:partners@goeato.local">Partner with us</a>
        </div>
      </div>

      <div className="footer-bottom">
        <span>&copy; {year} GoEato Technologies Pvt. Ltd. All rights reserved.</span>
        <span>Made in Bengaluru, India</span>
      </div>
    </footer>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="App">
        <Navbar />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/restaurants" element={<Restaurants />} />
            <Route path="/r/:id" element={<RestaurantDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <Footer />
        <ReceiptDock />
      </div>
    </Router>
  );
}

export default App;
