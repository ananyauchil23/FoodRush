const Restaurant = require('../models/Restaurant');

// GET /api/restaurants — Fetch all restaurants
const getAllRestaurants = async (req, res) => {
  try {
    const { search } = req.query;
    const filter = search
      ? { name: { $regex: search, $options: 'i' } }
      : {};

    const restaurants = await Restaurant.find(filter).select('-menu');
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/restaurants/:id — Fetch single restaurant with menu
const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/restaurants/:id/menu?maxPrice=200&category=Starters
// Filter menu items under a price and by category
const getFilteredMenu = async (req, res) => {
  try {
    const { maxPrice, category } = req.query;
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    let menu = restaurant.menu;

    if (maxPrice) {
      menu = menu.filter((item) => item.price <= Number(maxPrice));
    }
    if (category) {
      menu = menu.filter(
        (item) => item.category.toLowerCase() === category.toLowerCase()
      );
    }

    res.json({ restaurant: restaurant.name, menu });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAllRestaurants, getRestaurantById, getFilteredMenu };
