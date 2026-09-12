import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import api from '../api/client';

export default function Checkout() {
  const { items, total, clear } = useCart();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [addressType, setAddressType] = useState('Home');
  const [address, setAddress] = useState('');
  const [instructions, setInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');

  const deliveryFee = total > 400 ? 0 : 35;
  const platformFee = items.length > 0 ? 5 : 0;
  const taxes = Math.round(total * 0.05);
  const grandTotal = total + deliveryFee + platformFee + taxes;

  if (!items.length) {
    return (
      <div className="page">
        <div className="auth-box" style={{ textAlign: 'center' }}>
          <h2>No items to checkout</h2>
          <p>Your cart is currently empty.</p>
          <Link to="/" className="checkout-btn" style={{ textDecoration: 'none', display: 'inline-block' }}>
            Go to Menu
          </Link>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');

    if (!address.trim()) {
      setError('Please provide a delivery address');
      return;
    }

    setPlacing(true);
    try {
      const fullAddress = `${addressType}: ${address.trim()}${instructions ? ` (Note: ${instructions.trim()})` : ''}`;
      const payload = {
        address: fullAddress,
        paymentMethod,
        items: items.map((i) => ({
          foodItemId: i._id || i.id,
          quantity: i.qty,
        })),
      };

      const { data } = await api.post('/api/orders', payload);
      clear();
      addToast('Order placed successfully! Tracking your delivery...', 'success', 4000);
      navigate(`/orders?placed=${data._id}`);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to place order. Please check login or item availability.';
      setError(msg);
      addToast(msg, 'error');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="page" style={{ maxWidth: '880px' }}>
      <div className="section-title-wrap">
        <div>
          <h1 className="section-title">Delivery & Payment</h1>
          <p className="section-subtitle">Confirm your address and complete your order</p>
        </div>
      </div>

      <form onSubmit={handlePlaceOrder} className="cart-layout">
        {/* Left: Address and Payment Details */}
        <div>
          {/* Address Section */}
          <div className="cart-items-card" style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>1. Delivery Address</h3>

            <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
              {['Home', 'Work', 'Other'].map((type) => (
                <button
                  key={type}
                  type="button"
                  className={`chip ${addressType === type ? 'active' : ''}`}
                  onClick={() => setAddressType(type)}
                >
                  📍 {type}
                </button>
              ))}
            </div>

            <div className="form-group">
              <label>Complete House / Flat / Street Address *</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Flat 302, Green Glen Layout, Bellandur, Bengaluru"
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Delivery Instructions / Landmark (Optional)</label>
              <input
                type="text"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="e.g. Ring the bell twice / Leave with security"
              />
            </div>
          </div>

          {/* Payment Section */}
          <div className="cart-items-card">
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>2. Payment Mode</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 16px',
                  border: `2px solid ${paymentMethod === 'cod' ? 'var(--primary)' : 'var(--border-color)'}`,
                  borderRadius: '12px',
                  cursor: 'pointer',
                  background: paymentMethod === 'cod' ? 'var(--primary-light)' : '#fff',
                }}
              >
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                />
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>Cash on Delivery (COD)</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Pay cash or UPI at the doorstep upon arrival</div>
                </div>
              </label>

              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 16px',
                  border: `2px solid ${paymentMethod === 'upi' ? 'var(--primary)' : 'var(--border-color)'}`,
                  borderRadius: '12px',
                  cursor: 'pointer',
                  background: paymentMethod === 'upi' ? 'var(--primary-light)' : '#fff',
                }}
              >
                <input
                  type="radio"
                  name="payment"
                  value="upi"
                  checked={paymentMethod === 'upi'}
                  onChange={() => setPaymentMethod('upi')}
                />
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>Instant UPI (GPay / PhonePe / Paytm)</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Zero transaction fees, instant confirmation</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right: Order Summary Breakdown */}
        <div className="bill-summary-card">
          <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Order Summary</h3>

          <div style={{ maxHeight: '180px', overflowY: 'auto', marginBottom: 16, borderBottom: '1px solid var(--border-subtle)' }}>
            {items.map((i) => (
              <div key={i._id || i.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
                <span>{i.name} &times; {i.qty}</span>
                <span style={{ fontWeight: 700 }}>₹{i.price * i.qty}</span>
              </div>
            ))}
          </div>

          <div className="bill-row">
            <span>Subtotal</span>
            <span>₹{total}</span>
          </div>
          <div className="bill-row">
            <span>Delivery Fee</span>
            <span>{deliveryFee === 0 ? <strong style={{ color: '#16A34A' }}>FREE</strong> : `₹${deliveryFee}`}</span>
          </div>
          <div className="bill-row">
            <span>Taxes & Charges</span>
            <span>₹{taxes + platformFee}</span>
          </div>

          <div className="bill-total-row">
            <span>Total Amount</span>
            <span>₹{grandTotal}</span>
          </div>

          {error && (
            <div style={{ color: '#DC2626', fontSize: 13, fontWeight: 600, marginTop: 12 }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="checkout-btn"
            disabled={placing}
          >
            {placing ? 'Placing Order...' : `Place Order (₹${grandTotal})`}
          </button>
        </div>
      </form>
    </div>
  );
}
