const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  item_id: { type: mongoose.Schema.Types.ObjectId },
  item_name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const orderSchema = new mongoose.Schema(
  {
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },
    restaurant_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
    },
    restaurant_name: { type: String, required: true },
    items: [orderItemSchema],
    total_amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['Pending', 'Preparing', 'Out for Delivery', 'Delivered'],
      default: 'Pending',
    },
    deliveryAddress: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
