import React, { memo } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { DEFAULT_IMAGES, TOAST_DURATIONS } from '../config/constants.js';
import { IconMinus, IconPlus } from './icons.jsx';

/**
 * FoodCard component that displays a food item with add to cart functionality
 * @param {Object} item - The food item to display
 * @param {string} item._id - The ID of the food item
 * @param {string} item.name - The name of the food item
 * @param {number} item.price - The price of the food item
 * @param {string} item.img - The image URL of the food item
 * @param {string} item.category - The category of the food item
 * @param {boolean} item.veg - Whether the item is vegetarian
 * @param {boolean} item.available - Whether the item is available
 * @param {string} item.description - The description of the food item
 * @param {string} item.restaurantId - The ID of the restaurant
 * @returns {JSX.Element} The rendered food card component
 */
const FoodCard = memo(({ item }) => {
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
      addToast('You can order from one restaurant at a time. Clear your cart to add this dish.', 'info', TOAST_DURATIONS.MEDIUM);
      return;
    }
    add(item, 1);
    addToast(`Added "${item.name}" to cart`, 'success', TOAST_DURATIONS.SHORT);
  };

  return (
    <div className="food-card-modern">
      <div className="card-img-wrap">
        <img
          src={item.img || DEFAULT_IMAGES.FOOD}
          alt={item.name}
          loading="lazy"
          decoding="async"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = DEFAULT_IMAGES.FOOD;
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
            <div className="qty-stepper" role="group" aria-label="Quantity controls">
              <button
                type="button"
                onClick={() => (currentQty === 1 ? remove(id) : setQty(id, currentQty - 1))}
                aria-label={`Decrease quantity of ${item.name}, currently ${currentQty}`}
                aria-describedby={`qty-${id}`}
              >
                <IconMinus size={15} />
              </button>
              <span id={`qty-${id}`} aria-live="polite" aria-atomic="true">{currentQty}</span>
              <button
                type="button"
                onClick={() => setQty(id, currentQty + 1)}
                aria-label={`Increase quantity of ${item.name}, currently ${currentQty}`}
              >
                <IconPlus size={15} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="add-action-btn"
              onClick={handleAdd}
              aria-label={`Add ${item.name} to cart, price ₹${item.price}`}
            >
              <IconPlus size={14} />
              ADD
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

export default FoodCard;
