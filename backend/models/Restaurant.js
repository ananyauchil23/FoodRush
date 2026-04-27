const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String, default: '' },
  description: { type: String, default: '' },
});

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true },
    rating: { type: Number, default: 4.0, min: 1, max: 5 },
    image: { type: String, default: '' },
    cuisine: { type: String, default: 'Multi-cuisine' },
    deliveryTime: { type: String, default: '30-45 min' },
    minOrder: { type: Number, default: 100 },
    menu: [menuItemSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Restaurant', restaurantSchema);
