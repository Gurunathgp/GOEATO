import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Restaurants from './pages/Restaurants.jsx';
import RestaurantDetail from './pages/RestaurantDetail.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import Orders from './pages/Orders.jsx';
import Admin from './pages/Admin.jsx';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

function NotFound() {
  return (
    <div className="page" style={{ textAlign: 'center', paddingTop: '80px' }}>
      <div style={{ fontSize: '72px', marginBottom: '16px' }}>🍽️</div>
      <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>Page Not Found</h2>
      <p style={{ color: '#64748B', marginBottom: '24px' }}>The GoEato page you're looking for doesn't exist.</p>
      <Link to="/" className="checkout-btn" style={{ display: 'inline-block', textDecoration: 'none', maxWidth: '300px' }}>
        Back to Menu
      </Link>
    </div>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <h3>Go<span>Eato</span></h3>
          <p>
            Swift & delicious food delivery from your neighborhood's best restaurants.
            Order today and enjoy meals delivered piping hot.
          </p>
        </div>

        <div className="footer-links">
          <h4>Quick Links</h4>
          <Link to="/">Browse Menu</Link>
          <Link to="/restaurants">Restaurants</Link>
          <Link to="/cart">My Cart</Link>
          <Link to="/orders">Track Orders</Link>
        </div>

        <div className="footer-links">
          <h4>Company</h4>
          <a href="#">About GoEato</a>
          <a href="#">Partner With Us</a>
          <a href="#">Careers</a>
          <a href="#">Support</a>
        </div>

        <div className="footer-links">
          <h4>Legal</h4>
          <a href="#">Terms of Service</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Refund Policy</a>
        </div>
      </div>

      <div className="footer-bottom">
        <span>&copy; 2026 GoEato Technologies Pvt. Ltd. All rights reserved.</span>
        <span>Made with ❤️ in Bengaluru, India</span>
      </div>
    </footer>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
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
        <Footer />
      </div>
    </Router>
  );
}

export default App;
