import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import Button from '../components/Button.jsx';
import { IconAlert } from '../components/icons.jsx';

const Signup = () => {
  const { signup } = useAuth();
  const { addToast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await signup(name, email, password);
      addToast(`Account created! Welcome to GoEato, ${user.name}!`, 'success');
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create account';
      setError(msg);
      addToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="auth-box">
        <h2>Create an Account</h2>
        <p>Join GoEato for lightning-fast food delivery and exclusive offers.</p>

        {error && (
          <div className="alert alert-error" role="alert" style={{ marginBottom: 16 }}>
            <span className="alert-icon"><IconAlert size={16} /></span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={submit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="e.g. Priya Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="priya@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password (at least 6 characters)</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
          </div>

          <Button type="submit" variant="primary" size="lg" block loading={loading} style={{ marginTop: 10 }}>
            {loading ? 'Creating account...' : 'Create account'}
          </Button>
        </form>

        <p style={{ marginTop: 24, textAlign: 'center', fontSize: 14 }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
