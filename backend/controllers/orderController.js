const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');

// POST /api/orders — Place a new order
const placeOrder = async (req, res) => {
  try {
    const { restaurant_id, items, deliveryAddress } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }

    const restaurant = await Restaurant.findById(restaurant_id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const total_amount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order = await Order.create({
      customer_id: req.user._id,
      restaurant_id,
      restaurant_name: restaurant.name,
      items,
      total_amount,
      deliveryAddress: deliveryAddress || req.user.address,
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/orders/:userId — Get orders by customer_id
const getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.find({ customer_id: req.params.userId })
      .populate('restaurant_id', 'name image location')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/orders — Get all orders (admin), with optional status filter
const getAllOrders = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};

    const orders = await Order.find(filter)
      .populate('customer_id', 'name email')
      .populate('restaurant_id', 'name location')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/orders/revenue — Aggregate total revenue using $group
const getRevenueStats = async (req, res) => {
  try {
    const stats = await Order.aggregate([
      {
        $group: {
          _id: '$restaurant_name',
          totalRevenue: { $sum: '$total_amount' },
          orderCount: { $sum: 1 },
          avgOrderValue: { $avg: '$total_amount' },
        },
      },
      { $sort: { totalRevenue: -1 } },
    ]);

    const overall = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$total_amount' },
          totalOrders: { $sum: 1 },
        },
      },
    ]);

    res.json({ byRestaurant: stats, overall: overall[0] || {} });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { placeOrder, getOrdersByUser, getAllOrders, getRevenueStats };
