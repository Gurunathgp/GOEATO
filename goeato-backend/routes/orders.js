const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const FoodItem = require('../models/FoodItem');
const { auth, adminAuth } = require('../middleware/auth');
const { getIo, emitToUser } = require('../src/socket');
const { calculateOrderPricing } = require('../src/orderPricing');

const ORDER_STATUSES = ['pending', 'placed', 'preparing', 'delivering', 'delivered', 'cancelled'];
const MAX_ORDER_ITEMS = 50;
const STATUS_TRANSITIONS = {
  pending: ['placed', 'cancelled'],
  placed: ['preparing', 'cancelled'],
  preparing: ['delivering', 'cancelled'],
  delivering: ['delivered', 'cancelled'],
  delivered: [],
  cancelled: [],
};

// Place an order (authenticated users only) - total is recalculated server-side
router.post('/', auth, async (req, res) => {
  try {
    const { items, address = '', paymentMethod = 'cod' } = req.body;
    if (!Array.isArray(items) || items.length === 0 || items.length > MAX_ORDER_ITEMS) {
      return res.status(400).json({ message: 'Items array is required' });
    }
    if (typeof address !== 'string' || !address.trim() || address.length > 300) {
      return res.status(400).json({ message: 'A delivery address up to 300 characters is required' });
    }
    if (!['cod', 'card', 'upi'].includes(paymentMethod)) {
      return res.status(400).json({ message: 'Invalid payment method' });
    }

    const requested = new Map();
    for (const it of items) {
      const foodItemId = it.foodItemId || it.id;
      const quantity = Number(it.quantity);
      if (!foodItemId) return res.status(400).json({ message: 'Each item needs foodItemId' });
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
        return res.status(400).json({ message: 'Quantity must be an integer from 1 to 99' });
      }
      requested.set(String(foodItemId), (requested.get(String(foodItemId)) || 0) + quantity);
    }

    const ids = [...requested.keys()];
    if (!ids.every((id) => /^[a-f\d]{24}$/i.test(id))) {
      return res.status(400).json({ message: 'Invalid food item id' });
    }
    const foods = await FoodItem.find({ _id: { $in: ids }, available: { $ne: false } });
    if (foods.length !== ids.length) return res.status(400).json({ message: 'One or more items are unavailable' });

    const restaurantIds = new Set(foods.map((food) => String(food.restaurantId)));
    if (restaurantIds.size !== 1) {
      return res.status(400).json({ message: 'Items from different restaurants must be ordered separately' });
    }

    let subtotal = 0;
    const orderItems = foods.map((food) => {
      const quantity = requested.get(String(food._id));
      subtotal += food.price * quantity;
      return { foodItemId: food._id, quantity, price: food.price };
    });
    const pricing = calculateOrderPricing(subtotal);

    const order = new Order({
      userId: req.user.id,
      restaurantId: foods[0].restaurantId,
      items: orderItems,
      ...pricing,
      address: address.trim(),
      paymentMethod,
      status: 'placed',
    });
    const newOrder = await order.save();
    const populatedOrder = await Order.findById(newOrder._id).populate('items.foodItemId');
    
    emitToUser(req.user.id, 'orderUpdate', { order: populatedOrder });
    const io = getIo();
    if (io) io.to('admins').emit('orderUpdate', { userId: req.user.id, order: populatedOrder });
    
    res.status(201).json(populatedOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get user's orders (authenticated users only) with pagination
router.get('/', auth, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit || '20', 10)));
    const orders = await Order.find({ userId: req.user.id })
      .populate('items.foodItemId')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    res.json({ data: orders, page, limit });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: list all orders (must be before /:id)
router.get('/admin/all', adminAuth, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit || '20', 10)));
    const filter = {};
    if (req.query.status && ORDER_STATUSES.includes(req.query.status)) filter.status = req.query.status;
    const orders = await Order.find(filter)
      .populate('items.foodItemId')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    res.json({ data: orders, page, limit });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single order (owner or admin)
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.foodItemId');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update order status (admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    if (!ORDER_STATUSES.includes(status)) {
      return res.status(400).json({ message: `Status must be one of: ${ORDER_STATUSES.join(', ')}` });
    }
    const currentOrder = await Order.findById(req.params.id);
    if (!currentOrder) return res.status(404).json({ message: 'Order not found' });
    if (!STATUS_TRANSITIONS[currentOrder.status].includes(status)) {
      return res.status(400).json({ message: `Cannot change an order from ${currentOrder.status} to ${status}` });
    }
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true }).populate('items.foodItemId');
    
    emitToUser(order.userId.toString(), 'orderUpdate', { order });
    const io = getIo();
    if (io) io.to('admins').emit('orderUpdate', { userId: order.userId.toString(), order });
    
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
