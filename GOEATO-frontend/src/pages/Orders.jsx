import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api, { unwrapList } from '../api/client';
import { useSocketListener, useSocket } from '../context/SocketContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

const STEPS = [
  { key: 'placed', label: 'Order Placed', icon: '📝' },
  { key: 'preparing', label: 'Preparing', icon: '🍳' },
  { key: 'delivering', label: 'On The Way', icon: '🛵' },
  { key: 'delivered', label: 'Delivered', icon: '🎉' },
];

function getStepIndex(status) {
  if (status === 'pending') return 0;
  if (status === 'placed') return 0;
  if (status === 'preparing') return 1;
  if (status === 'delivering') return 2;
  if (status === 'delivered') return 3;
  return -1;
}

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const highlightId = searchParams.get('placed');

  const { isConnected } = useSocket();
  const { addToast } = useToast();

  const fetchOrders = useCallback(() => {
    api
      .get('/api/orders')
      .then(({ data }) => setOrders(unwrapList(data)))
      .catch(() => setError('Unable to load your orders. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Live real-time socket event handler
  useSocketListener('orderUpdate', ({ order }) => {
    if (!order) return;
    setOrders((prev) => {
      const idx = prev.findIndex((o) => o._id === order._id);
      if (idx !== -1) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], ...order };
        return updated;
      }
      return [order, ...prev];
    });

    addToast(`Order #${order._id.slice(-6)} is now ${order.status}!`, 'info', 4000);
  });

  if (loading) {
    return (
      <div className="page">
        <h1 className="section-title">My Orders</h1>
        <div style={{ marginTop: 24 }}>
          {[1, 2].map((n) => (
            <div key={n} className="skeleton-card" style={{ height: 200, marginBottom: 20 }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="section-title-wrap">
        <div>
          <h1 className="section-title">My Orders & Live Tracking</h1>
          <p className="section-subtitle">Real-time status updates for your food deliveries</p>
        </div>
        <div className="live-indicator" title={isConnected ? 'Real-time WebSocket connected' : 'Connecting to live updates...'}>
          <div className="live-indicator-dot" style={{ background: isConnected ? '#16A34A' : '#F59E0B' }} />
          <span>{isConnected ? 'Live Tracking Active' : 'Connecting...'}</span>
        </div>
      </div>

      {error && (
        <div className="admin-order-card" style={{ borderLeft: '4px solid #EF4444' }}>
          <p style={{ color: '#DC2626' }}>{error}</p>
        </div>
      )}

      {!orders.length ? (
        <div className="auth-box" style={{ textAlign: 'center', maxWidth: 520 }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>📦</div>
          <h2>No Orders Placed Yet</h2>
          <p>You haven't placed any orders yet. Discover delicious dishes and place your first order now!</p>
          <Link to="/" className="checkout-btn" style={{ textDecoration: 'none', display: 'inline-block' }}>
            Browse Menu
          </Link>
        </div>
      ) : (
        <div>
          {orders.map((order) => {
            const currentStep = getStepIndex(order.status);
            const isCancelled = order.status === 'cancelled';
            const isHighlighted = highlightId === order._id;

            return (
              <div
                key={order._id}
                className="order-card-modern"
                style={{
                  border: isHighlighted ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                  boxShadow: isHighlighted ? 'var(--shadow-primary)' : 'var(--shadow-sm)',
                }}
              >
                {/* Header Row */}
                <div className="order-top-bar">
                  <div className="order-id-group">
                    <span className="order-id">Order #{order._id.slice(-6).toUpperCase()}</span>
                    <span className={`status-badge status-${order.status}`}>{order.status}</span>
                  </div>

                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                    Placed on: {new Date(order.createdAt).toLocaleString()}
                  </div>
                </div>

                {/* Visual Order Stepper */}
                {isCancelled ? (
                  <div style={{ background: '#FEE2E2', color: '#991B1B', padding: '12px 16px', borderRadius: 8, fontWeight: 700, margin: '20px 0' }}>
                    ✕ This order has been cancelled.
                  </div>
                ) : (
                  <div className="order-stepper">
                    <div className="stepper-progress-line">
                      <div
                        className="stepper-progress-fill"
                        style={{
                          width: `${Math.max(0, (currentStep / (STEPS.length - 1)) * 100)}%`,
                        }}
                      />
                    </div>

                    {STEPS.map((step, idx) => {
                      const isCompleted = currentStep > idx || order.status === 'delivered';
                      const isActive = currentStep === idx && order.status !== 'delivered';

                      return (
                        <div
                          key={step.key}
                          className={`step-node ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}
                        >
                          <div className="step-circle">
                            {isCompleted ? '✓' : step.icon}
                          </div>
                          <span className="step-label">{step.label}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Details Breakdown */}
                <div className="order-details-grid">
                  <div>
                    <h4 style={{ fontSize: 14, fontWeight: 800, marginBottom: 8, color: 'var(--text-main)' }}>
                      Items Ordered
                    </h4>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                      {(order.items || []).map((it, i) => (
                        <li key={i} style={{ marginBottom: 4, color: 'var(--text-secondary)' }}>
                          <strong>{it.quantity} &times;</strong> {it.foodItemId?.name || 'Dish'}{' '}
                          <span style={{ color: 'var(--text-muted)' }}>(₹{it.price} each)</span>
                        </li>
                      ))}
                    </ul>

                    {order.address && (
                      <p style={{ marginTop: 12, fontSize: 13, color: 'var(--text-secondary)' }}>
                        <strong>📍 Delivery To:</strong> {order.address}
                      </p>
                    )}
                  </div>

                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Total Amount</span>
                      <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-main)' }}>
                        ₹{order.total}
                      </div>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        Mode: {order.paymentMethod || 'COD'}
                      </span>
                    </div>

                    {order.status !== 'delivered' && !isCancelled && (
                      <div style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 700 }}>
                        Estimated arrival: 25-35 mins
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
