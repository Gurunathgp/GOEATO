import React, { useEffect, useState, useCallback } from 'react';
import api, { unwrapList } from '../api/client';
import { useSocketListener, useSocket } from '../context/SocketContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { ADMIN_TABS, ORDER_FILTERS, PAGINATION, TOAST_DURATIONS } from '../config/constants.js';
import { IconAlert, IconBox, IconPin } from '../components/icons.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { SkeletonCard } from '../components/SkeletonLoader.jsx';

export default function Admin() {
  const [activeTab, setActiveTab] = useState(ADMIN_TABS[0]);
  const [orders, setOrders] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [orderFilter, setOrderFilter] = useState(ORDER_FILTERS[0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form states
  const [restName, setRestName] = useState('');
  const [restLocation, setRestLocation] = useState('');
  const [restCuisine, setRestCuisine] = useState('');
  const [restImage, setRestImage] = useState('');

  // Food item form state
  const [dishName, setDishName] = useState('');
  const [dishPrice, setDishPrice] = useState('');
  const [dishImg, setDishImg] = useState('');
  const [dishCategory, setDishCategory] = useState('Main');
  const [dishVeg, setDishVeg] = useState(true);
  const [dishDesc, setDishDesc] = useState('');
  const [selectedRestId, setSelectedRestId] = useState('');

  const { isConnected } = useSocket();
  const { addToast } = useToast();

  const loadData = useCallback(async () => {
    try {
      const [ordersRes, foodsRes, restsRes] = await Promise.all([
        api.get(`/api/orders/admin/all?limit=${PAGINATION.MAX_LIMIT}`),
        api.get(`/api/food-items?limit=${PAGINATION.MAX_LIMIT}`),
        api.get(`/api/restaurants?limit=${PAGINATION.DEFAULT_LIMIT}`),
      ]);
      setOrders(unwrapList(ordersRes.data));
      setFoodItems(Array.isArray(foodsRes.data) ? foodsRes.data : []);
      setRestaurants(Array.isArray(restsRes.data) ? restsRes.data : []);
      if (restsRes.data?.length && !selectedRestId) {
        setSelectedRestId(restsRes.data[0]._id);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load admin data.');
    } finally {
      setLoading(false);
    }
  }, [selectedRestId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Live order updates via socket
  useSocketListener('orderUpdate', ({ order }) => {
    if (!order) return;
    setOrders((prev) => {
      const idx = prev.findIndex((o) => o._id === order._id);
      if (idx !== -1) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], ...order };
        return updated;
      }
      return [order, ...prev];
    });
    addToast(`New order activity for Order #${order._id.slice(-6)}`, 'info', TOAST_DURATIONS.MEDIUM);
  });

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const { data } = await api.put(`/api/orders/${orderId}`, { status: newStatus });
      setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, ...data } : o)));
      addToast(`Order #${orderId.slice(-6)} marked as ${newStatus}`, 'success', TOAST_DURATIONS.MEDIUM);
    } catch (err) {
      addToast(err.response?.data?.message || 'Status update failed', 'error', TOAST_DURATIONS.MEDIUM);
    }
  };

  const toggleItemAvailability = async (itemId) => {
    try {
      const { data } = await api.patch(`/api/food-items/${itemId}/toggle-availability`);
      setFoodItems((prev) => prev.map((item) => (item._id === itemId ? data : item)));
      addToast(`"${data.name}" is now ${data.available ? 'In Stock' : 'Sold Out'}`, 'info', TOAST_DURATIONS.MEDIUM);
    } catch (err) {
      addToast('Failed to update availability', 'error', TOAST_DURATIONS.MEDIUM);
    }
  };

  const handleCreateRestaurant = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/api/restaurants', {
        name: restName,
        location: restLocation,
        cuisine: restCuisine,
        image: restImage || undefined,
      });
      addToast(`Restaurant "${data.name}" created!`, 'success');
      setRestaurants((prev) => [data, ...prev]);
      setRestName('');
      setRestLocation('');
      setRestCuisine('');
      setRestImage('');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to create restaurant', 'error');
    }
  };

  const handleCreateDish = async (e) => {
    e.preventDefault();
    if (!selectedRestId) {
      addToast('Please choose a partner kitchen', 'error');
      return;
    }
    try {
      const { data } = await api.post('/api/food-items', {
        name: dishName,
        price: Number(dishPrice),
        img: dishImg,
        category: dishCategory,
        veg: dishVeg,
        description: dishDesc,
        restaurantId: selectedRestId,
      });
      addToast(`Dish "${data.name}" added to menu!`, 'success');
      setFoodItems((prev) => [data, ...prev]);
      setDishName('');
      setDishPrice('');
      setDishImg('');
      setDishDesc('');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to add dish', 'error');
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (orderFilter === ORDER_FILTERS[0]) return true;
    return o.status === orderFilter;
  });

  return (
    <div className="page">
      <div className="section-title-wrap">
        <div>
          <h1 className="section-title">Admin Management Portal</h1>
          <p className="section-subtitle">Manage incoming delivery orders, menus, and restaurants</p>
        </div>
        <div className="live-indicator">
          <div className="live-indicator-dot" style={{ background: isConnected ? 'var(--success)' : 'var(--warn)' }} />
          <span>{isConnected ? 'Real-time Sync Active' : 'Offline'}</span>
        </div>
      </div>

      {error && (
        <div className="alert alert-error" role="alert" style={{ marginBottom: 20 }}>
          <span className="alert-icon"><IconAlert size={16} /></span>
          <span>{error}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="admin-tabs">
        {ADMIN_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            className={`admin-tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'orders' && `Live Orders (${orders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled').length} active)`}
            {tab === 'inventory' && `Menu & Inventory (${foodItems.length})`}
            {tab === 'create' && '+ Add Kitchen / Dish'}
          </button>
        ))}
      </div>

      {/* Tab 1: Live Orders */}
      {activeTab === 'orders' && (
        <div>
          {/* Order Filter Pills */}
          <div className="category-chips" style={{ marginBottom: 20 }}>
            {ORDER_FILTERS.map((st) => (
              <button
                key={st}
                type="button"
                className={`chip ${orderFilter === st ? 'active' : ''}`}
                onClick={() => setOrderFilter(st)}
              >
                {st === ORDER_FILTERS[0] ? 'All Orders' : st}
              </button>
            ))}
          </div>

          {loading ? (
            <SkeletonCard height="200px" />
          ) : filteredOrders.length === 0 ? (
            <EmptyState
              compact
              icon={<IconBox size={24} />}
              title="No orders match this status"
              description="Try a different status filter to see other orders."
            />
          ) : (
            filteredOrders.map((order) => {
              const nextStatus =
                order.status === 'placed'
                  ? 'preparing'
                  : order.status === 'preparing'
                  ? 'delivering'
                  : order.status === 'delivering'
                  ? 'delivered'
                  : null;

              return (
                <div key={order._id} className="admin-order-card">
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 6 }}>
                      <strong style={{ fontSize: 16 }}>Order #{order._id.slice(-6).toUpperCase()}</strong>
                      <span className={`status-badge status-${order.status}`}>{order.status}</span>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                        {new Date(order.createdAt).toLocaleTimeString()}
                      </span>
                    </div>

                    <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 6 }}>
                      {(order.items || []).map((it, i) => (
                        <span key={i} style={{ marginRight: 12 }}>
                          {it.quantity} &times; {it.foodItemId?.name || 'Item'}
                        </span>
                      ))}
                    </div>

                    <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                       <IconPin size={13} /> {order.address || 'Address not specified'} •  ₹{order.total} ({order.paymentMethod || 'COD'})
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    {nextStatus && (
                      <button
                        type="button"
                        className="add-action-btn"
                        style={{ background: 'var(--primary)', color: '#fff', border: 'none' }}
                        onClick={() => updateOrderStatus(order._id, nextStatus)}
                      >
                        Advance to: {nextStatus} &rarr;
                      </button>
                    )}

                    {order.status !== 'delivered' && order.status !== 'cancelled' && (
                      <button
                        type="button"
                        className="logout-btn"
                        onClick={() => updateOrderStatus(order._id, 'cancelled')}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab 2: Menu & Inventory Control */}
      {activeTab === 'inventory' && (
        <div>
          <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>
            Toggle dish availability in real time. Items marked Sold Out cannot be added to customer carts.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
            {foodItems.map((item) => (
              <div
                key={item._id}
                className="cart-items-card"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  opacity: item.available !== false ? 1 : 0.6,
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div className={`diet-icon ${item.veg !== false ? 'veg' : 'nonveg'}`} />
                    <h4 style={{ fontSize: 15, fontWeight: 700 }}>{item.name}</h4>
                  </div>
                  <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>₹{item.price} • {item.category}</span>
                </div>

                <button
                  type="button"
                  className={item.available !== false ? 'chip active' : 'chip'}
                  style={{
                    background: item.available !== false ? 'var(--success)' : 'var(--danger)',
                    color: '#fff',
                    borderColor: 'transparent',
                    cursor: 'pointer',
                  }}
                  onClick={() => toggleItemAvailability(item._id)}
                >
                  {item.available !== false ? 'In Stock ✓' : 'Sold Out ✕'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Create Restaurant & Dish */}
      {activeTab === 'create' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
          {/* Add Restaurant Form */}
          <div className="cart-items-card">
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Add New Partner Kitchen</h3>
            <form onSubmit={handleCreateRestaurant}>
              <div className="form-group">
                <label>Kitchen Name *</label>
                <input
                  value={restName}
                  onChange={(e) => setRestName(e.target.value)}
                  placeholder="e.g. Royal Biryani & Kebabs"
                  required
                />
              </div>
              <div className="form-group">
                <label>Location / Area *</label>
                <input
                  value={restLocation}
                  onChange={(e) => setRestLocation(e.target.value)}
                  placeholder="e.g. Indiranagar, Bengaluru"
                  required
                />
              </div>
              <div className="form-group">
                <label>Cuisine Tags *</label>
                <input
                  value={restCuisine}
                  onChange={(e) => setRestCuisine(e.target.value)}
                  placeholder="e.g. Biryani, Mughlai, Kebabs"
                  required
                />
              </div>
              <div className="form-group">
                <label>Cover Photo URL</label>
                <input
                  value={restImage}
                  onChange={(e) => setRestImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
              <button type="submit" className="search-btn" style={{ width: '100%' }}>
                + Register Restaurant
              </button>
            </form>
          </div>

          {/* Add Dish Form */}
          <div className="cart-items-card">
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Add Dish to Kitchen Menu</h3>
            <form onSubmit={handleCreateDish}>
              <div className="form-group">
                <label>Select Partner Kitchen *</label>
                <select
                  value={selectedRestId}
                  onChange={(e) => setSelectedRestId(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                  required
                >
                  {restaurants.map((r) => (
                    <option key={r._id} value={r._id}>
                      {r.name} ({r.location})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Dish Name *</label>
                <input
                  value={dishName}
                  onChange={(e) => setDishName(e.target.value)}
                  placeholder="e.g. Hyderabadi Dum Biryani"
                  required
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label>Price (₹) *</label>
                  <input
                    type="number"
                    value={dishPrice}
                    onChange={(e) => setDishPrice(e.target.value)}
                    placeholder="250"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <input
                    value={dishCategory}
                    onChange={(e) => setDishCategory(e.target.value)}
                    placeholder="e.g. Biryani / Main"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Food Photo URL *</label>
                <input
                  value={dishImg}
                  onChange={(e) => setDishImg(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  required
                />
              </div>
              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={dishVeg}
                    onChange={(e) => setDishVeg(e.target.checked)}
                  />
                  <span>Is this dish Vegetarian?</span>
                </label>
              </div>
              <div className="form-group">
                <label>Short Description</label>
                <input
                  value={dishDesc}
                  onChange={(e) => setDishDesc(e.target.value)}
                  placeholder="Fragrant basmati rice layered with..."
                />
              </div>
              <button type="submit" className="search-btn" style={{ width: '100%' }}>
                + Add Dish to Menu
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
