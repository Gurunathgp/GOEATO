import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { DEFAULT_IMAGES, PAGINATION, DEBOUNCE_DELAYS } from '../config/constants.js';
import { useDebounce } from '../hooks/index.js';
import Button from '../components/Button.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { SkeletonRestaurantGrid } from '../components/SkeletonLoader.jsx';
import { IconAlert, IconClock, IconClose, IconPin, IconSearch, IconStar } from '../components/icons.jsx';

export default function Restaurants() {
  const [list, setList] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const debouncedSearch = useDebounce(search, DEBOUNCE_DELAYS.SEARCH);

  useEffect(() => {
    let alive = true;

    // Debounced + loading-reset: typing shows skeletons instead of stale results,
    // and one request goes out per pause rather than one per keystroke.
    setLoading(true);
    setError('');

    api
      .get('/api/restaurants', {
        params: { limit: PAGINATION.DEFAULT_LIMIT, search: debouncedSearch || undefined },
      })
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
  }, [debouncedSearch]);

  return (
    <div className="page">
      <div className="section-title-wrap">
        <div>
          <h1 className="section-title">Partner Kitchens & Restaurants</h1>
          <p className="section-subtitle">Freshly prepared and delivered from the best spots near you</p>
        </div>
      </div>

      <div className="filter-bar">
        <div className="field-search" style={{ width: '100%', maxWidth: '480px' }}>
          <IconSearch size={17} className="field-search-icon" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by restaurant name or cuisine..."
            aria-label="Search restaurants by name or cuisine"
          />
          {search && (
            <button
              type="button"
              className="toast-close"
              onClick={() => setSearch('')}
              aria-label="Clear restaurant search"
            >
              <IconClose size={16} />
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="alert alert-error" role="alert" style={{ marginBottom: 20 }}>
          <span className="alert-icon"><IconAlert size={16} /></span>
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <SkeletonRestaurantGrid count={4} />
      ) : list.length === 0 ? (
        <EmptyState
          icon={<IconSearch size={26} />}
          title="No kitchens found"
          description="Try another neighbourhood or cuisine. You can also load demo kitchens with npm run seed."
          action={
            <Button variant="ink" onClick={() => setSearch('')}>
              Clear search
            </Button>
          }
        />
      ) : (
        <div className="restaurant-grid">
          {list.map((r) => (
            <Link to={`/r/${r._id}`} key={r._id} className="restaurant-card">
              <div className="rest-img-wrap">
                <img
                  src={r.image || DEFAULT_IMAGES.RESTAURANT}
                  alt={r.name}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = DEFAULT_IMAGES.RESTAURANT;
                  }}
                />
                <span className="rest-rating-badge">
                  <IconStar size={12} />
                  {r.rating || 4.5}
                </span>
              </div>
              <div className="rest-body">
                <h3 className="rest-name">{r.name}</h3>
                <p className="rest-cuisine">{r.cuisine}</p>
                <div className="rest-meta">
                  <span className="delivery-time-pill">
                    <IconClock size={12} />
                    25-35 mins
                  </span>
                  <span className="rest-location">
                    <IconPin size={12} />
                    {r.location}
                  </span>
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
