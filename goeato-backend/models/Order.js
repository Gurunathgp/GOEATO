const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true, index: true },
  items: [
    {
      foodItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem', required: true },
      quantity: { type: Number, required: true, default: 1, min: 1 },
      price: { type: Number, required: true, min: 0 },
    },
  ],
  subtotal: { type: Number, required: true, min: 0 },
  deliveryFee: { type: Number, required: true, min: 0 },
  platformFee: { type: Number, required: true, min: 0 },
  tax: { type: Number, required: true, min: 0 },
  total: { type: Number, required: true, min: 0 },
  address: { type: String, default: '', maxlength: 300 },
  paymentMethod: { type: String, enum: ['cod', 'card', 'upi'], default: 'cod' },
  status: {
    type: String,
    enum: ['pending', 'placed', 'preparing', 'delivering', 'delivered', 'cancelled'],
    default: 'placed',
  },
  estimatedDelivery: { type: String, default: '25-35 mins' },
}, { timestamps: true });

orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ restaurantId: 1, createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
