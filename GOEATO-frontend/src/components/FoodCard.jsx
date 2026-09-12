import React from 'react';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

const DEFAULT_FOOD_IMG = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';

const FoodCard = ({ item }) => {
  const { items, add, setQty, remove } = useCart();
  const { addToast } = useToast();

  const id = item._id || item.id;
  const cartItem = items.find((p) => (p._id || p.id) === id);
  const currentQty = cartItem ? cartItem.qty : 0;
  const isAvailable = item.available !== false;

  const handleAdd = () => {
    if (!isAvailable) return;
    const hasAnotherRestaurant = items.some(
      (cartItem) => cartItem.restaurantId && item.restaurantId && cartItem.restaurantId !== item.restaurantId
    );
    if (hasAnotherRestaurant) {
      addToast('You can order from one restaurant at a time. Clear your cart to add this dish.', 'info');
      return;
    }
    add(item, 1);
    addToast(`Added "${item.name}" to cart`, 'success', 2500);
  };

  return (
    <div className="food-card-modern">
      <div className="card-img-wrap">
        <img
          src={item.img || DEFAULT_FOOD_IMG}
          alt={item.name}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = DEFAULT_FOOD_IMG;
          }}
        />
        <div className="card-diet-badge" title={item.veg !== false ? 'Vegetarian' : 'Non-Vegetarian'}>
          <div className={`diet-icon ${item.veg !== false ? 'veg' : 'nonveg'}`} />
        </div>
        {item.category && <span className="card-category-tag">{item.category}</span>}
      </div>

      <div className="card-body">
        <div className="card-header-row">
          <h3 className="card-title">{item.name}</h3>
        </div>

        <p className="card-desc">
          {item.description || `${item.category} prepared fresh with authentic ingredients.`}
        </p>

        <div className="card-footer">
          <span className="card-price">₹{item.price}</span>

          {!isAvailable ? (
            <span className="status-badge status-cancelled">Sold Out</span>
          ) : currentQty > 0 ? (
            <div className="qty-stepper">
              <button
                type="button"
                onClick={() => (currentQty === 1 ? remove(id) : setQty(id, currentQty - 1))}
                aria-label="Decrease quantity"
              >
                &minus;
              </button>
              <span>{currentQty}</span>
              <button
                type="button"
                onClick={() => setQty(id, currentQty + 1)}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          ) : (
            <button type="button" className="add-action-btn" onClick={handleAdd}>
              + ADD
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
