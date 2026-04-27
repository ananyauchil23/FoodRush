const express = require('express');
const router = express.Router();
const {
  getAllRestaurants,
  getRestaurantById,
  getFilteredMenu,
} = require('../controllers/restaurantController');

router.get('/', getAllRestaurants);
router.get('/:id', getRestaurantById);
router.get('/:id/menu', getFilteredMenu);

module.exports = router;
