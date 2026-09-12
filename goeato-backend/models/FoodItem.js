const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  img: { type: String, required: true },
  category: { type: String, required: true, trim: true },
  veg: { type: Boolean, default: true },
  description: { type: String, default: '', maxlength: 500 },
  available: { type: Boolean, default: true },
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true, index: true },
}, { collection: 'fooditems', timestamps: true });

foodItemSchema.index({ restaurantId: 1, category: 1, veg: 1 });
foodItemSchema.index({ name: 'text', category: 'text' });

module.exports = mongoose.model('FoodItem', foodItemSchema);
