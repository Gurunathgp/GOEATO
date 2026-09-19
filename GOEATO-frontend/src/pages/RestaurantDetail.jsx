import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import FoodCard from '../components/FoodCard.jsx';
import Button from '../components/Button.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { SkeletonCard, SkeletonGrid } from '../components/SkeletonLoader.jsx';
import { IconArrowRight, IconClock, IconPin, IconStar, IconStore } from '../components/icons.jsx';
import api from '../api/client';
import { DEFAULT_IMAGES } from '../config/constants.js';

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
        <SkeletonCard height="240px" style={{ marginBottom: '32px', borderRadius: 'var(--radius-lg)' }} />
        <SkeletonGrid count={3} />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="page">
        <EmptyState
          icon={<IconStore size={26} />}
          title="Kitchen not found"
          description="The kitchen you are looking for might have closed or moved."
          action={
            <Button variant="ink" to="/restaurants" iconRight={<IconArrowRight size={15} />}>
              All kitchens
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="page">
      {/* Restaurant Header Banner */}
      <div
        className="hero-banner"
        style={{
          background: `linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.85)), url(${data.image || DEFAULT_IMAGES.RESTAURANT_HERO}) center/cover no-repeat`,
          color: '#fff',
        }}
      >
        <div className="hero-content">
          <Link to="/restaurants" style={{ color: 'var(--border-primary)', fontSize: '13px', fontWeight: 700, display: 'inline-block', marginBottom: '12px' }}>
            &larr; All Restaurants
          </Link>
          <h1 style={{ color: '#fff', marginBottom: '8px' }}>{data.name}</h1>
          <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: '16px', marginBottom: '16px' }}>
            {data.cuisine} &middot; <IconPin size={13} /> {data.location}
          </p>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span className="rest-rating-badge" style={{ position: 'static' }}>
              <IconStar size={12} />
              {data.rating || 4.5}
            </span>
            <span className="delivery-time-pill" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}>
              <IconClock size={13} />
              25-35 mins delivery
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
        <EmptyState
          compact
          icon={<IconStore size={24} />}
          title="Menu coming soon"
          description="No dishes have been added to this kitchen's menu yet. Check back shortly."
        />
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
