import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  return (
    <header className="navbar">
      <Link to="/" className="logo-wrap">
        <div className="logo-badge">G</div>
        <div className="logo-text">Go<span>Eato</span></div>
      </Link>

      <nav className="nav-links">
        <NavLink to="/" end className={({ isActive }) => `nav-link nav-link-discover ${isActive ? 'active' : ''}`}>
          Discover
        </NavLink>
        <NavLink to="/restaurants" className={({ isActive }) => `nav-link nav-link-restaurants ${isActive ? 'active' : ''}`}>
          Restaurants
        </NavLink>

        <Link to="/cart" className="cart-nav-link">
          <span>Basket</span>
          {count > 0 && <span className="cart-badge">{count}</span>}
        </Link>

        {user ? (
          <>
            <NavLink to="/orders" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              My Orders
            </NavLink>
            {isAdmin && (
              <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Admin Portal
              </NavLink>
            )}
            <div className="user-pill">
              <span>{user.name.split(' ')[0]}</span>
              {isAdmin && <span className="user-role-badge">Admin</span>}
            </div>
            <button
              className="logout-btn"
              onClick={() => {
                logout();
                navigate('/');
              }}
            >
              Sign out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">
              Sign in
            </Link>
            <Link to="/signup" className="search-btn" style={{ padding: '8px 18px' }}>
              Sign up
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
