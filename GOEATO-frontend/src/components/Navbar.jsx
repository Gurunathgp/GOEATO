import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import Button from './Button.jsx';
import {
  IconBasket,
  IconClose,
  IconCrown,
  IconLogout,
  IconMenu,
  IconPin,
  IconStore,
  IconTicket,
  IconUser,
} from './icons.jsx';

/**
 * Navbar component that displays the main navigation menu.
 *
 * Includes authentication state handling, the basket badge, and a mobile drawer.
 * Below 768px the horizontal links are replaced by a toggleable drawer so that
 * Discover/Restaurants/Orders/Admin stay reachable on small screens.
 *
 * @returns {JSX.Element} The rendered navbar component
 */
const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  // Close the drawer whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Escape closes the drawer for keyboard users.
  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate('/');
  };

  const navLinkClass = ({ isActive }) => `nav-link ${isActive ? 'active' : ''}`;
  const drawerLinkClass = ({ isActive }) => `nav-drawer-link ${isActive ? 'active' : ''}`;

  return (
    <header className="navbar">
      <Link to="/" className="logo-wrap">
        <div className="logo-badge">G</div>
        <div className="logo-text">Go<span>Eato</span></div>
      </Link>

      <nav className="nav-links" aria-label="Main navigation">
        <NavLink to="/" end className={navLinkClass}>
          Discover
        </NavLink>
        <NavLink to="/restaurants" className={navLinkClass}>
          Restaurants
        </NavLink>

        {user && (
          <NavLink to="/orders" className={navLinkClass}>
            My Orders
          </NavLink>
        )}
        {isAdmin && (
          <NavLink to="/admin" className={navLinkClass}>
            Admin Portal
          </NavLink>
        )}

        {user ? (
          <>
            <div className="user-pill" role="status" aria-label={`Logged in as ${user.name}`}>
              <span>{user.name.split(' ')[0]}</span>
              {isAdmin && <span className="user-role-badge">Admin</span>}
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout} aria-label="Sign out of your account">
              Sign out
            </Button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">
              Sign in
            </Link>
            <Button variant="primary" size="sm" to="/signup">
              Sign up
            </Button>
          </>
        )}
      </nav>

      <div className="nav-actions">
        <Link to="/cart" className="cart-nav-link" aria-label={`Basket, ${count} items`}>
          <IconBasket size={16} />
          <span className="cart-nav-label">Basket</span>
          {count > 0 && (
            <span className="cart-badge" aria-live="polite" aria-atomic="true">
              {count}
            </span>
          )}
        </Link>

        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <IconClose size={20} /> : <IconMenu size={20} />}
        </button>
      </div>

      {open && (
        <div className="nav-drawer" id="mobile-nav">
          <NavLink to="/" end className={drawerLinkClass} onClick={() => setOpen(false)}>
            <span>Discover</span>
            <IconStore size={17} />
          </NavLink>
          <NavLink to="/restaurants" className={drawerLinkClass} onClick={() => setOpen(false)}>
            <span>Restaurants</span>
            <IconPin size={17} />
          </NavLink>
          <NavLink to="/cart" className={drawerLinkClass} onClick={() => setOpen(false)}>
            <span>Basket{count > 0 ? ` (${count})` : ''}</span>
            <IconBasket size={17} />
          </NavLink>

          {user && (
            <NavLink to="/orders" className={drawerLinkClass} onClick={() => setOpen(false)}>
              <span>My Orders</span>
              <IconTicket size={17} />
            </NavLink>
          )}
          {isAdmin && (
            <NavLink to="/admin" className={drawerLinkClass} onClick={() => setOpen(false)}>
              <span>Admin Portal</span>
              <IconCrown size={17} />
            </NavLink>
          )}

          <div className="nav-drawer-sep" />

          {user ? (
            <>
              <div className="nav-drawer-identity">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <IconUser size={16} />
                  {user.name}
                </span>
                {isAdmin && <span className="user-role-badge">Admin</span>}
              </div>
              <div className="nav-drawer-actions">
                <Button variant="ghost" block icon={<IconLogout size={16} />} onClick={handleLogout}>
                  Sign out
                </Button>
              </div>
            </>
          ) : (
            <div className="nav-drawer-actions">
              <Button variant="ghost" block to="/login">
                Sign in
              </Button>
              <Button variant="primary" block to="/signup">
                Create account
              </Button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default React.memo(Navbar);
