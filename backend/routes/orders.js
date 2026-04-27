const express = require('express');
const router = express.Router();
const {
  placeOrder,
  getOrdersByUser,
  getAllOrders,
  getRevenueStats,
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

router.post('/', protect, placeOrder);
router.get('/revenue', getRevenueStats);
router.get('/all', getAllOrders);
router.get('/:userId', protect, getOrdersByUser);

module.exports = router;
