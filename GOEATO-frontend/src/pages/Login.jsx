import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import Button from '../components/Button.jsx';
import { IconAlert, IconCrown, IconUser } from '../components/icons.jsx';

const Login = () => {
  const { login } = useAuth();
  const { addToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      addToast(`Welcome back, ${user.name}!`, 'success');
      const returnTo = location.state?.from;
      navigate(user.role === 'admin' ? '/admin' : returnTo || '/');
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid email or password';
      setError(msg);
      addToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (e, p) => {
    setEmail(e);
    setPassword(p);
  };

  return (
    <div className="page">
      <div className="auth-box">
        <h2>Welcome Back</h2>
        <p>Sign in to track orders, manage your cart, and reorder favorites.</p>

        {error && (
          <div className="alert alert-error" role="alert" style={{ marginBottom: 16 }}>
            <span className="alert-icon"><IconAlert size={16} /></span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={submit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" variant="primary" size="lg" block loading={loading} style={{ marginTop: 10 }}>
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        {/* Quick Demo Credentials */}
        <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Quick Demo Logins:
          </span>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button
              type="button"
              className="chip"
              style={{ flex: 1, fontSize: 12, padding: '6px' }}
              onClick={() => fillDemo('user@goeato.local', 'User123!')}
            >
               <IconUser size={15} /> Customer
            </button>
            <button
              type="button"
              className="chip"
              style={{ flex: 1, fontSize: 12, padding: '6px' }}
              onClick={() => fillDemo('admin@goeato.local', 'Admin123!')}
            >
               <IconCrown size={15} /> Admin
            </button>
          </div>
        </div>

        <p style={{ marginTop: 20, textAlign: 'center', fontSize: 14 }}>
          Don't have an account? <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: 700 }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
