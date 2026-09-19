import React from 'react';

/**
 * Reusable skeleton loader components.
 *
 * Every variant accepts `style` so callers can pass spacing without the prop
 * being silently dropped (previously only height/width/className were read).
 */

export function SkeletonCard({ height = '200px', width = '100%', className = '', style }) {
  return (
    <div
      className={`skeleton-card ${className}`.trim()}
      style={{ height, width, ...style }}
      role="status"
      aria-label="Loading content"
    >
      <div className="skeleton-pulse" />
    </div>
  );
}

/**
 * Card-shaped skeleton that mirrors the real FoodCard / restaurant card layout
 * (media block, two text lines, price + action row) so loading never looks like
 * a broken card.
 */
export function SkeletonPlate({ ariaLabel = 'Loading content' }) {
  return (
    <div className="skeleton-card" role="status" aria-label={ariaLabel}>
      <div className="skeleton-plate">
        <div className="skeleton-plate-media" />
        <div className="skeleton-plate-line" />
        <div className="skeleton-plate-line short" />
        <div className="skeleton-plate-row">
          <div className="skeleton-plate-line" style={{ width: '58px', margin: 0 }} />
          <div className="skeleton-button" style={{ width: '82px', height: '34px' }} />
        </div>
      </div>
    </div>
  );
}

export function SkeletonText({ lines = 3, width = '100%', style }) {
  return (
    <div className="skeleton-text" style={{ width, ...style }} role="status" aria-label="Loading text">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton-line"
          style={{
            width: i === lines - 1 ? '60%' : '100%',
            height: '16px',
            marginBottom: i < lines - 1 ? '8px' : '0',
          }}
        />
      ))}
    </div>
  );
}

export function SkeletonButton({ width = '120px', height = '40px', style }) {
  return (
    <div
      className="skeleton-button"
      style={{ width, height, ...style }}
      role="status"
      aria-label="Loading button"
    />
  );
}

export function SkeletonImage({ width = '100%', height = '200px', style }) {
  return (
    <div
      className="skeleton-image"
      style={{ width, height, ...style }}
      role="status"
      aria-label="Loading image"
    />
  );
}

export function SkeletonGrid({ count = 6, className = '' }) {
  return (
    <div className={`dish-grid ${className}`.trim()}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonPlate key={i} ariaLabel="Loading dish" />
      ))}
    </div>
  );
}

export function SkeletonRestaurantGrid({ count = 4 }) {
  return (
    <div className="restaurant-grid">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonPlate key={i} ariaLabel="Loading restaurant" />
      ))}
    </div>
  );
}

export function PageLoadingSpinner() {
  return (
    <div className="page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div className="loading-spinner" role="status" aria-label="Loading page">
        <div className="spinner" />
      </div>
    </div>
  );
}
