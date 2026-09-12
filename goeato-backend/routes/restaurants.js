const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');
const FoodItem = require('../models/FoodItem');
const { adminAuth } = require('../middleware/auth');

function safeSearchPattern(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Get all restaurants with search + pagination
router.get('/', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit || '20', 10)));
    const filter = {};
    if (typeof req.query.search === 'string' && req.query.search.trim()) {
      const search = safeSearchPattern(req.query.search.trim().slice(0, 80));
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { cuisine: { $regex: search, $options: 'i' } },
      ];
    }
    if (typeof req.query.cuisine === 'string' && req.query.cuisine.trim()) {
      filter.cuisine = { $regex: safeSearchPattern(req.query.cuisine.trim().slice(0, 80)), $options: 'i' };
    }
    const restaurants = await Restaurant.find(filter)
      .populate('menu')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single restaurant
router.get('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).populate('menu');
    if (!restaurant) throw new Error('Restaurant not found');
    res.json(restaurant);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

// Add a new restaurant (admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const { name, location, cuisine, image = '', rating = 0 } = req.body;
    if (!name || !location || !cuisine) {
      return res.status(400).json({ message: 'name, location, cuisine are required' });
    }
    const restaurant = new Restaurant({ name, location, cuisine, image, rating });
    const newRestaurant = await restaurant.save();
    res.status(201).json(newRestaurant);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a restaurant (admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const allowed = (({ name, location, cuisine, image, rating }) => ({
      name, location, cuisine, image, rating,
    }))(req.body);
    Object.keys(allowed).forEach((k) => allowed[k] === undefined && delete allowed[k]);
    const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, allowed, { new: true, runValidators: true });
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
    res.json(restaurant);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Add a food item to a restaurant's menu (admin only)
router.post('/:id/menu', adminAuth, async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) throw new Error('Restaurant not found');

    if (!req.body.name || req.body.price == null || !req.body.img || !req.body.category) {
      return res.status(400).json({ message: 'name, price, img, and category are required' });
    }
    const foodItem = new FoodItem({
      name: req.body.name,
      price: req.body.price,
      img: req.body.img,
      category: req.body.category,
      veg: req.body.veg,
      description: req.body.description,
      available: req.body.available,
      restaurantId: req.params.id,
    });
    const newFoodItem = await foodItem.save();

    restaurant.menu.push(newFoodItem._id);
    await restaurant.save();

    res.status(201).json(newFoodItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a restaurant (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
    if (!restaurant) throw new Error('Restaurant not found');
    // Optionally, delete associated food items
    await FoodItem.deleteMany({ restaurantId: req.params.id });
    res.json({ message: 'Restaurant deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
