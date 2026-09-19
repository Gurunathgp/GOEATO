import React, { useEffect, useState, useMemo } from 'react';
import FoodCard from '../components/FoodCard.jsx';
import Button from '../components/Button.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { SkeletonGrid } from '../components/SkeletonLoader.jsx';
import {
  IconAlert,
  IconArrowRight,
  IconClock,
  IconClose,
  IconFlame,
  IconSearch,
  IconSparkle,
  IconStar,
  IconStore,
  IconTarget,
} from '../components/icons.jsx';
import api from '../api/client';
import { useDebounce } from '../hooks/index.js';
import { FOOD_CATEGORIES, DEBOUNCE_DELAYS } from '../config/constants.js';

const Home = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [vegOnly, setVegOnly] = useState(false);
  const [error, setError] = useState('');
  const debouncedSearch = useDebounce(search, DEBOUNCE_DELAYS.SEARCH);

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
      if (debouncedSearch.trim()) {
        const query = debouncedSearch.toLowerCase();
        const matchesName = item.name?.toLowerCase().includes(query);
        const matchesCat = item.category?.toLowerCase().includes(query);
        const matchesDesc = item.description?.toLowerCase().includes(query);
        if (!matchesName && !matchesCat && !matchesDesc) return false;
      }
      return true;
    });
  }, [items, vegOnly, selectedCategory, debouncedSearch]);

  return (
    <div className="page">
      {/* Hero Banner */}
      <section className="hero-banner">
        {/* Floating food decorations */}
        <span className="hero-icon-deco"><IconFlame size={54} /></span>
        <span className="hero-icon-deco"><IconSparkle size={40} /></span>
        <span className="hero-icon-deco"><IconStar size={46} /></span>

        <div className="hero-content">
          <div className="hero-tag"><IconClock size={13} />Fast delivery in 30 mins</div>
          <h1>
            Your next favourite meal is <span>closer than you think.</span>
          </h1>
          <p className="hero-subtitle">
            A hand-picked local menu, designed around what you feel like eating right now.
          </p>

          <div className="search-box" role="search">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search dishes, cuisines, or ingredients..."
              aria-label="Search dishes, cuisines, or ingredients"
              aria-describedby="search-help"
            />
            <span id="search-help" style={{ display: 'none' }}>Type to search through available dishes</span>
            {search && (
              <button
                type="button"
                className="toast-close"
                onClick={() => setSearch('')}
                style={{ marginRight: 8 }}
                aria-label="Clear search input"
              >
                <IconClose size={16} />
              </button>
            )}
            <button
              type="button"
              className="search-btn"
              onClick={() =>
                document.getElementById('menu-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }
              aria-label="Jump to the full dish list"
            >
              Browse menu
            </button>
          </div>
        </div>
      </section>

      {/* Trust Stats */}
      <section className="trust-stats-bar">
        <div className="trust-stat">
          <div className="trust-stat-icon"><IconStore size={17} /></div>
          <div>
            <strong>500+</strong>
            <span>Partner Kitchens</span>
          </div>
        </div>
        <div className="trust-stat">
          <div className="trust-stat-icon"><IconClock size={17} /></div>
          <div>
            <strong>30 Min</strong>
            <span>Avg. Delivery</span>
          </div>
        </div>
        <div className="trust-stat">
          <div className="trust-stat-icon"><IconStar size={17} /></div>
          <div>
            <strong>4.8 Rating</strong>
            <span>Customer Love</span>
          </div>
        </div>
        <div className="trust-stat">
          <div className="trust-stat-icon"><IconTarget size={17} /></div>
          <div>
            <strong>99.2%</strong>
            <span>On-Time Delivery</span>
          </div>
        </div>
      </section>

      {/* Filter and Category Pills */}
      <section className="filter-bar">
        <div className="category-chips">
          {FOOD_CATEGORIES.map((cat) => (
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
            aria-label="Filter vegetarian items only"
          />
          <div className="diet-icon veg" />
          <span>Veg Only</span>
        </label>
      </section>

      {/* Error state */}
      {error && (
        <div className="alert alert-error" role="alert" style={{ marginBottom: 20 }}>
          <span className="alert-icon"><IconAlert size={16} /></span>
          <span>{error}</span>
        </div>
      )}

      {/* Dish Catalog Grid */}
      <div className="section-title-wrap" id="menu-results">
        <h2 className="section-title">
          {selectedCategory === 'All' ? 'Crave-worthy right now' : `${selectedCategory}, your way`}
        </h2>
        <span className="section-subtitle">
          {!loading && `${filteredItems.length} dishes on today’s menu`}
        </span>
      </div>

      {loading ? (
        <SkeletonGrid count={6} />
      ) : filteredItems.length === 0 ? (
        <EmptyState
          icon={<IconSearch size={26} />}
          title="No dishes match your filter"
          description="Try a different keyword, or clear the filters to see tonight's full menu."
          action={
            <Button
              variant="ink"
              iconRight={<IconArrowRight size={15} />}
              onClick={() => {
                setSearch('');
                setSelectedCategory('All');
                setVegOnly(false);
              }}
            >
              Reset filters
            </Button>
          }
        />
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
