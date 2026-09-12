import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import FoodCard from '../components/FoodCard.jsx';
import api from '../api/client';

const DEFAULT_REST_IMG = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80';

export default function RestaurantDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get(`/api/restaurants/${id}`)
      .then(({ data }) => setData(data))
      .catch(() => setError('Unable to load this restaurant.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="page">
        <div className="skeleton-card" style={{ height: '240px', marginBottom: '32px' }} />
        <div className="dish-grid">
          {[1, 2, 3].map((n) => (
            <div key={n} className="skeleton-card" />
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="page">
        <div className="admin-order-card" style={{ textAlign: 'center', padding: '48px 20px', flexDirection: 'column' }}>
          <h3>Restaurant not found</h3>
          <p style={{ color: '#64748B', marginBottom: '16px' }}>The kitchen you are looking for might have closed or moved.</p>
          <Link to="/restaurants" className="chip active">Back to Restaurants</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      {/* Restaurant Header Banner */}
      <div
        className="hero-banner"
        style={{
          background: `linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.85)), url(${data.image || DEFAULT_REST_IMG}) center/cover no-repeat`,
          color: '#fff',
        }}
      >
        <div className="hero-content">
          <Link to="/restaurants" style={{ color: '#FFD8C7', fontSize: '13px', fontWeight: 700, display: 'inline-block', marginBottom: '12px' }}>
            &larr; All Restaurants
          </Link>
          <h1 style={{ color: '#fff', marginBottom: '8px' }}>{data.name}</h1>
          <p style={{ color: '#E2E8F0', fontSize: '16px', marginBottom: '16px' }}>
            {data.cuisine} • 📍 {data.location}
          </p>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span className="rest-rating-badge" style={{ position: 'static' }}>★ {data.rating || 4.5}</span>
            <span className="delivery-time-pill" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}>
              ⚡ 25-35 mins delivery
            </span>
          </div>
        </div>
      </div>

      {error && <p className="error" style={{ marginBottom: 16 }}>{error}</p>}

      <div className="section-title-wrap">
        <h2 className="section-title">Menu Offerings</h2>
        <span className="section-subtitle">{data.menu?.length || 0} items</span>
      </div>

      {!data.menu || data.menu.length === 0 ? (
        <div className="admin-order-card">
          <p style={{ color: '#64748B' }}>No dishes have been added to this kitchen menu yet.</p>
        </div>
      ) : (
        <div className="dish-grid">
          {data.menu.map((m) => (
            <FoodCard key={m._id || m.id} item={m} />
          ))}
        </div>
      )}
    </div>
  );
}
