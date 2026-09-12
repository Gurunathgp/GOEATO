const express = require('express');
const router = express.Router();
const FoodItem = require('../models/FoodItem');
const Restaurant = require('../models/Restaurant');
const mongoose = require('mongoose');
const { adminAuth } = require('../middleware/auth');

function safeSearchPattern(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

router.get('/', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit || '50', 10)));
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.veg === 'true') filter.veg = true;
    if (req.query.veg === 'false') filter.veg = false;
    if (typeof req.query.search === 'string' && req.query.search.trim()) {
      filter.name = { $regex: safeSearchPattern(req.query.search.trim().slice(0, 80)), $options: 'i' };
    }
    if (req.query.restaurantId) {
      if (!mongoose.isValidObjectId(req.query.restaurantId)) return res.status(400).json({ message: 'Invalid restaurant id' });
      filter.restaurantId = req.query.restaurantId;
    }
    const foodItems = await FoodItem.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    res.json(foodItems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.post('/', adminAuth, async (req, res) => {
  const { name, price, img, category, restaurantId, veg = true, description = '', available = true } = req.body;
  if (!name || price == null || !img || !category || !restaurantId) {
    return res.status(400).json({ message: 'Fields name, price, img, category, restaurantId are required' });
  }

  const foodItem = new FoodItem({ name, price, img, category, restaurantId, veg, description, available });

  try {
    if (!mongoose.isValidObjectId(restaurantId) || !await Restaurant.exists({ _id: restaurantId })) {
      return res.status(400).json({ message: 'Restaurant not found' });
    }
    const newFoodItem = await foodItem.save();
    await Restaurant.findByIdAndUpdate(restaurantId, { $addToSet: { menu: newFoodItem._id } });
    res.status(201).json(newFoodItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


router.put('/:id', adminAuth, async (req, res) => {
  try {
    const allowed = (({ name, price, img, category, veg, description, available }) => ({
      name, price, img, category, veg, description, available,
    }))(req.body);
    Object.keys(allowed).forEach((k) => allowed[k] === undefined && delete allowed[k]);
    const updatedItem = await FoodItem.findByIdAndUpdate(req.params.id, allowed, { new: true, runValidators: true });
    if (!updatedItem) return res.status(404).json({ message: 'Food item not found' });
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const deletedItem = await FoodItem.findByIdAndDelete(req.params.id);
    if (!deletedItem) return res.status(404).json({ message: 'Food item not found' });
    await Restaurant.findByIdAndUpdate(deletedItem.restaurantId, { $pull: { menu: deletedItem._id } });
    res.json({ message: 'Food item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/:id/toggle-availability', adminAuth, async (req, res) => {
  try {
    const item = await FoodItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Food item not found' });
    item.available = !item.available;
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
