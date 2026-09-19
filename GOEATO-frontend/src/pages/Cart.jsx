import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import Button from '../components/Button.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { IconArrowRight, IconBasket, IconClose } from '../components/icons.jsx';
import { DEFAULT_IMAGES, PRICING, TOAST_DURATIONS } from '../config/constants.js';

export default function Cart() {
  const { items, setQty, remove, total, clear } = useCart();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const deliveryFee = total > PRICING.FREE_DELIVERY_THRESHOLD ? 0 : PRICING.DELIVERY_FEE;
  const platformFee = items.length > 0 ? PRICING.PLATFORM_FEE : 0;
  const taxes = Math.round(total * PRICING.TAX_RATE);
  const grandTotal = total + deliveryFee + platformFee + taxes;

  if (!items.length) {
    return (
      <div className="page">
        <EmptyState
          icon={<IconBasket size={26} />}
          title="Your basket is empty"
          description="Nothing here yet. Explore tonight's menu from local kitchens and add your first dish."
          action={
            <Button variant="primary" size="lg" to="/" iconRight={<IconArrowRight size={16} />}>
              Explore dishes
            </Button>
          }
        />
      </div>
    );
  }

  const handleClear = () => {
    clear();
    addToast('Cart cleared', 'info', TOAST_DURATIONS.MEDIUM);
  };

  return (
    <div className="page">
      <div className="section-title-wrap">
        <div>
          <h1 className="section-title">Your Order Cart</h1>
          <p className="section-subtitle">{items.length} unique items in your basket</p>
        </div>
        <button
          type="button"
          className="logout-btn"
          onClick={handleClear}
          title="Remove all items"
        >
          Clear Cart
        </button>
      </div>

      <div className="cart-layout">
        {/* Left Column: Cart Items List */}
        <div className="cart-items-card">
          {items.map((item) => {
            const id = item._id || item.id;
            return (
              <div key={id} className="cart-item-row">
                <div className="cart-item-info">
                  <img
                    src={item.img || DEFAULT_IMAGES.FOOD}
                    alt={item.name}
                    className="cart-item-img"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = DEFAULT_IMAGES.FOOD;
                    }}
                  />
                  <div>
                    <h4 className="cart-item-name">{item.name}</h4>
                    <span className="cart-item-unit-price">₹{item.price} each</span>
                  </div>
                </div>

                <div className="qty-stepper" role="group" aria-label={`Quantity controls for ${item.name}`}>
                  <button
                    type="button"
                    onClick={() => (item.qty === 1 ? remove(id) : setQty(id, item.qty - 1))}
                    aria-label={`Decrease quantity of ${item.name}, currently ${item.qty}`}
                    aria-describedby={`cart-qty-${id}`}
                  >
                    &minus;
                  </button>
                  <span id={`cart-qty-${id}`} aria-live="polite" aria-atomic="true">{item.qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty(id, item.qty + 1)}
                    aria-label={`Increase quantity of ${item.name}, currently ${item.qty}`}
                  >
                    +
                  </button>
                </div>

                <span className="cart-item-total">₹{item.price * item.qty}</span>

                <button
                  type="button"
                  className="toast-close"
                  style={{ color: 'var(--danger)' }}
                  onClick={() => remove(id)}
                  aria-label={`Remove ${item.name} from cart`}
                  title="Remove from cart"
                >
                  <IconClose size={16} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Right Column: Bill Summary Card */}
        <div className="bill-summary-card">
          <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '18px' }}>Bill Details</h3>

          <div className="bill-row">
            <span>Item Total</span>
            <span>₹{total}</span>
          </div>

          <div className="bill-row">
            <span>Delivery Fee</span>
            <span>{deliveryFee === 0 ? <strong style={{ color: 'var(--success)' }}>FREE</strong> : `₹${deliveryFee}`}</span>
          </div>

          <div className="bill-row">
            <span>Platform Fee</span>
            <span>₹{platformFee}</span>
          </div>

          <div className="bill-row">
            <span>Govt. Taxes & Fees (5%)</span>
            <span>₹{taxes}</span>
          </div>

          <div className="bill-total-row">
            <span>To Pay</span>
            <span>₹{grandTotal}</span>
          </div>

          {deliveryFee > 0 && (
            <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', fontSize: '12px', fontWeight: 700, padding: '8px 12px', borderRadius: '8px', marginTop: '16px' }}>
               Add items worth ₹{PRICING.FREE_DELIVERY_THRESHOLD - total} more for FREE Delivery!
            </div>
          )}

          <Button
            type="button"
            variant="primary"
            size="lg"
            block
            onClick={() => navigate('/checkout')}
            iconRight={<IconArrowRight size={16} />}
            style={{ marginTop: 18 }}
          >
            Proceed to checkout
          </Button>
        </div>
      </div>
    </div>
  );
}
