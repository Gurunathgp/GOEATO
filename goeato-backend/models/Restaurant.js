const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
  cuisine: { type: String, required: true, trim: true },
  image: { type: String, default: '' },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  menu: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem' }],
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', restaurantSchema);