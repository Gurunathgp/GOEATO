import React, { useEffect, useState, useMemo } from 'react';
import FoodCard from '../components/FoodCard.jsx';
import api from '../api/client';

const CATEGORIES = ['All', 'Biryani', 'Starters', 'Breakfast', 'Pizza', 'Burgers', 'Main'];

const Home = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [vegOnly, setVegOnly] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    api
      .get('/api/food-items', { params: { limit: 100 } })
      .then(({ data }) => {
        if (alive && Array.isArray(data)) setItems(data);
      })
      .catch(() => {
        if (alive) setError('Unable to load dishes. Please check the backend server.');
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (vegOnly && item.veg === false) return false;
      if (selectedCategory !== 'All' && item.category?.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchesName = item.name?.toLowerCase().includes(query);
        const matchesCat = item.category?.toLowerCase().includes(query);
        const matchesDesc = item.description?.toLowerCase().includes(query);
        if (!matchesName && !matchesCat && !matchesDesc) return false;
      }
      return true;
    });
  }, [items, vegOnly, selectedCategory, search]);

  return (
    <div className="page">
      {/* Hero Banner */}
      <section className="hero-banner">
        {/* Floating food decorations */}
        <span className="hero-emoji-deco">🍕</span>
        <span className="hero-emoji-deco">🍔</span>
        <span className="hero-emoji-deco">🍜</span>

        <div className="hero-content">
          <div className="hero-tag">⚡ Fast Delivery in 30 Mins</div>
          <h1>
            Your next favourite meal is <span>closer than you think.</span>
          </h1>
          <p className="hero-subtitle">
            A hand-picked local menu, designed around what you feel like eating right now.
          </p>

          <div className="search-box">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search dishes, cuisines, or ingredients..."
              aria-label="Search dishes"
            />
            {search && (
              <button
                type="button"
                className="toast-close"
                onClick={() => setSearch('')}
                style={{ marginRight: 8 }}
                aria-label="Clear search"
              >
                &times;
              </button>
            )}
            <button type="button" className="search-btn">
              Browse menu
            </button>
          </div>
        </div>
      </section>

      {/* Trust Stats */}
      <section className="trust-stats-bar">
        <div className="trust-stat">
          <div className="trust-stat-icon">🏪</div>
          <div>
            <strong>500+</strong>
            <span>Partner Kitchens</span>
          </div>
        </div>
        <div className="trust-stat">
          <div className="trust-stat-icon">⚡</div>
          <div>
            <strong>30 Min</strong>
            <span>Avg. Delivery</span>
          </div>
        </div>
        <div className="trust-stat">
          <div className="trust-stat-icon">⭐</div>
          <div>
            <strong>4.8 Rating</strong>
            <span>Customer Love</span>
          </div>
        </div>
        <div className="trust-stat">
          <div className="trust-stat-icon">🎯</div>
          <div>
            <strong>99.2%</strong>
            <span>On-Time Delivery</span>
          </div>
        </div>
      </section>

      {/* Filter and Category Pills */}
      <section className="filter-bar">
        <div className="category-chips">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`chip ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <label className="veg-toggle">
          <input
            type="checkbox"
            checked={vegOnly}
            onChange={(e) => setVegOnly(e.target.checked)}
          />
          <div className="diet-icon veg" />
          <span>Veg Only</span>
        </label>
      </section>

      {/* Error state */}
      {error && (
        <div className="admin-order-card" style={{ borderLeft: '4px solid #EF4444' }}>
          <p style={{ color: '#DC2626', fontWeight: 600 }}>{error}</p>
        </div>
      )}

      {/* Dish Catalog Grid */}
      <div className="section-title-wrap">
        <h2 className="section-title">
          {selectedCategory === 'All' ? 'Crave-worthy right now' : `${selectedCategory}, your way`}
        </h2>
        <span className="section-subtitle">
          {!loading && `${filteredItems.length} dishes on today’s menu`}
        </span>
      </div>

      {loading ? (
        <div className="dish-grid">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="skeleton-card" />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="admin-order-card" style={{ textAlign: 'center', padding: '48px 20px', flexDirection: 'column' }}>
          <h3 style={{ marginBottom: 8 }}>No dishes match your filter</h3>
          <p style={{ color: '#64748B', marginBottom: 16 }}>Try searching with a different keyword or resetting filters.</p>
          <button
            type="button"
            className="chip active"
            onClick={() => {
              setSearch('');
              setSelectedCategory('All');
              setVegOnly(false);
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="dish-grid">
          {filteredItems.map((item) => (
            <FoodCard key={item._id || item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
