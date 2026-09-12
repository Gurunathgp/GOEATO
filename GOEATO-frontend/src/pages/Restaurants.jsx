import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';

const DEFAULT_REST_IMG = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80';

export default function Restaurants() {
  const [list, setList] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    api
      .get('/api/restaurants', { params: { limit: 50, search: search || undefined } })
      .then(({ data }) => {
        if (alive) setList(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (alive) setError('Unable to load restaurants. Please try again.');
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [search]);

  return (
    <div className="page">
      <div className="section-title-wrap">
        <div>
          <h1 className="section-title">Partner Kitchens & Restaurants</h1>
          <p className="section-subtitle">Freshly prepared and delivered from the best spots near you</p>
        </div>
      </div>

      <div className="filter-bar">
        <div className="search-box" style={{ width: '100%', maxWidth: '480px' }}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by restaurant name or cuisine..."
          />
          {search && (
            <button
              type="button"
              className="toast-close"
              onClick={() => setSearch('')}
              style={{ marginRight: 8 }}
            >
              &times;
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="admin-order-card" style={{ borderLeft: '4px solid #EF4444' }}>
          <p style={{ color: '#DC2626' }}>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="restaurant-grid">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="skeleton-card" />
          ))}
        </div>
      ) : list.length === 0 ? (
        <div className="admin-order-card" style={{ textAlign: 'center', padding: '48px 20px', flexDirection: 'column' }}>
          <h3>No restaurants found</h3>
          <p style={{ color: '#64748B' }}>Try another search term or seed demo restaurants with <code>npm run seed</code>.</p>
        </div>
      ) : (
        <div className="restaurant-grid">
          {list.map((r) => (
            <Link to={`/r/${r._id}`} key={r._id} className="restaurant-card">
              <div className="rest-img-wrap">
                <img
                  src={r.image || DEFAULT_REST_IMG}
                  alt={r.name}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = DEFAULT_REST_IMG;
                  }}
                />
                <span className="rest-rating-badge">★ {r.rating || 4.5}</span>
              </div>
              <div className="rest-body">
                <h3 className="rest-name">{r.name}</h3>
                <p className="rest-cuisine">{r.cuisine}</p>
                <div className="rest-meta">
                  <span className="delivery-time-pill">25-35 mins</span>
                  <span>📍 {r.location}</span>
                  <span>• {r.menu?.length || 0} items</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
