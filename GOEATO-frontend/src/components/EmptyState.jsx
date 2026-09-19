import React from 'react';

/**
 * Shared empty/zero-data state.
 *
 * Previously this markup was copy-pasted across Home, Restaurants,
 * RestaurantDetail, Cart, Orders, the 404 route and the ErrorBoundary, each with
 * its own inline colours and an emoji illustration.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.icon - Illustration node (use components/icons.jsx).
 * @param {string} props.title - Short headline.
 * @param {React.ReactNode} [props.description] - Supporting sentence.
 * @param {React.ReactNode} [props.action] - Primary call to action.
 * @param {boolean} [props.compact=false] - Tighter padding for in-card usage.
 * @returns {JSX.Element} The rendered empty state.
 */
export default function EmptyState({ icon, title, description, action, compact = false }) {
  return (
    <div className={`empty-state ${compact ? 'empty-state-compact' : ''}`}>
      {icon && <div className="empty-state-art" aria-hidden="true">{icon}</div>}
      <h2 className="empty-state-title">{title}</h2>
      {description && <p className="empty-state-copy">{description}</p>}
      {action && <div className="empty-state-action">{action}</div>}
    </div>
  );
}
