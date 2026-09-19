import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { PRICING } from '../config/constants.js';
import { IconArrowRight, IconBasket, IconSparkle, IconTicket } from './icons.jsx';

// Routes where the dock would fight with the page's own basket UI.
const HIDDEN_ROUTES = ['/cart', '/checkout', '/orders', '/admin', '/login', '/signup'];

/**
 * Sticky "receipt" basket dock.
 *
 * A physical-receipt styled summary that unfurls once the basket is non-empty,
 * showing live item count, running total and a free-delivery progress stripe.
 * This is the app's signature conversion affordance and keeps the basket one tap
 * away on mobile, where the top navbar is cramped.
 *
 * @returns {JSX.Element|null} The dock, or null when it should stay hidden.
 */
export default function ReceiptDock() {
  const { count, total } = useCart();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const onHiddenRoute = HIDDEN_ROUTES.some((route) => pathname.startsWith(route));
  const visible = count > 0 && !onHiddenRoute;

  // Reserve page space while the dock is on screen so it never covers content.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('has-receipt-dock', visible);
    return () => root.classList.remove('has-receipt-dock');
  }, [visible]);

  if (!visible) return null;

  const remaining = Math.max(0, PRICING.FREE_DELIVERY_THRESHOLD - total);
  const progress = Math.min(100, Math.round((total / PRICING.FREE_DELIVERY_THRESHOLD) * 100));

  return (
    <aside className="receipt-dock" aria-label="Basket summary">
      <span className="receipt-dock-perf" aria-hidden="true" />

      <div className="receipt-dock-inner">
        <div className="receipt-dock-meta">
          <span className="receipt-dock-eyebrow">
            <IconTicket size={13} />
            Your basket
          </span>
          <span className="receipt-dock-count" aria-live="polite" aria-atomic="true">
            {count} {count === 1 ? 'item' : 'items'} · <strong>₹{total}</strong>
          </span>
        </div>

        <div className="receipt-dock-progress">
          <span className="receipt-dock-progress-track">
            <span className="receipt-dock-progress-fill" style={{ width: `${progress}%` }} />
          </span>
          <span className="receipt-dock-progress-label">
            {remaining > 0 ? (
              <>Add ₹{remaining} more for free delivery</>
            ) : (
              <>
                Free delivery unlocked <IconSparkle size={13} />
              </>
            )}
          </span>
        </div>

        <button type="button" className="receipt-dock-btn" onClick={() => navigate('/cart')}>
          <IconBasket size={16} />
          Review basket
          <IconArrowRight size={15} />
        </button>
      </div>
    </aside>
  );
}
