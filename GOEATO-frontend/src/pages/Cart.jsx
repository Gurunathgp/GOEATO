import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

const DEFAULT_FOOD_IMG = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80';

export default function Cart() {
  const { items, setQty, remove, total, clear } = useCart();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const deliveryFee = total > 400 ? 0 : 35;
  const platformFee = items.length > 0 ? 5 : 0;
  const taxes = Math.round(total * 0.05);
  const grandTotal = total + deliveryFee + platformFee + taxes;

  if (!items.length) {
    return (
      <div className="page">
        <div className="auth-box" style={{ textAlign: 'center', maxWidth: '520px' }}>
          <div style={{ fontSize: '56px', marginBottom: '16px' }}>🛒</div>
          <h2>Your Cart is Empty</h2>
          <p>You haven't added any delicious dishes yet. Explore our top-rated menus and satisfy your cravings!</p>
          <Link to="/" className="checkout-btn" style={{ textDecoration: 'none', display: 'inline-block' }}>
            Explore Dishes
          </Link>
        </div>
      </div>
    );
  }

  const handleClear = () => {
    clear();
    addToast('Cart cleared', 'info');
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
                    src={item.img || DEFAULT_FOOD_IMG}
                    alt={item.name}
                    className="cart-item-img"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = DEFAULT_FOOD_IMG;
                    }}
                  />
                  <div>
                    <h4 className="cart-item-name">{item.name}</h4>
                    <span className="cart-item-unit-price">₹{item.price} each</span>
                  </div>
                </div>

                <div className="qty-stepper">
                  <button
                    type="button"
                    onClick={() => (item.qty === 1 ? remove(id) : setQty(id, item.qty - 1))}
                    aria-label="Decrease quantity"
                  >
                    &minus;
                  </button>
                  <span>{item.qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty(id, item.qty + 1)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <span className="cart-item-total">₹{item.price * item.qty}</span>

                <button
                  type="button"
                  className="toast-close"
                  style={{ color: '#EF4444' }}
                  onClick={() => remove(id)}
                  title="Remove from cart"
                >
                  &times;
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
            <span>{deliveryFee === 0 ? <strong style={{ color: '#16A34A' }}>FREE</strong> : `₹${deliveryFee}`}</span>
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
            <div style={{ background: '#FFF3EB', color: '#FF5200', fontSize: '12px', fontWeight: 700, padding: '8px 12px', borderRadius: '8px', marginTop: '16px' }}>
              💡 Add items worth ₹{400 - total} more for FREE Delivery!
            </div>
          )}

          <button
            type="button"
            className="checkout-btn"
            onClick={() => navigate('/checkout')}
          >
            Proceed to Checkout &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
