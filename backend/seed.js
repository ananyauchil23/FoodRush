const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Customer = require('./models/Customer');
const Restaurant = require('./models/Restaurant');
const Order = require('./models/Order');

const restaurants = [
  {
    name: 'Spice Garden',
    location: 'Koramangala, Bangalore',
    rating: 4.5,
    cuisine: 'North Indian',
    deliveryTime: '30-40 min',
    minOrder: 150,
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800',
    menu: [
      { name: 'Butter Chicken', price: 320, category: 'Main Course', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400', description: 'Creamy tomato-based chicken curry' },
      { name: 'Paneer Tikka', price: 260, category: 'Starters', image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400', description: 'Grilled cottage cheese with spices' },
      { name: 'Dal Makhani', price: 220, category: 'Main Course', image: 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=400', description: 'Slow-cooked black lentils in butter' },
      { name: 'Garlic Naan', price: 60, category: 'Bread', image: 'https://images.unsplash.com/photo-1628294895950-9805252327bc?w=400', description: 'Soft bread with garlic butter' },
      { name: 'Gulab Jamun', price: 120, category: 'Desserts', image: 'https://images.unsplash.com/photo-1666986571445-b7a4fe976eb5?w=400', description: 'Soft milk dumplings in sugar syrup' },
    ],
  },
  {
    name: 'The Burger Barn',
    location: 'Indiranagar, Bangalore',
    rating: 4.3,
    cuisine: 'American',
    deliveryTime: '20-30 min',
    minOrder: 200,
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800',
    menu: [
      { name: 'Classic Beef Burger', price: 280, category: 'Burgers', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', description: 'Juicy beef patty with fresh veggies' },
      { name: 'BBQ Chicken Burger', price: 260, category: 'Burgers', image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400', description: 'Smoky BBQ chicken with coleslaw' },
      { name: 'Loaded Fries', price: 160, category: 'Sides', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400', description: 'Crispy fries with cheese and jalapeños' },
      { name: 'Onion Rings', price: 120, category: 'Sides', image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=400', description: 'Golden crispy onion rings' },
      { name: 'Chocolate Shake', price: 180, category: 'Beverages', image: 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?w=400', description: 'Thick creamy chocolate milkshake' },
    ],
  },
  {
    name: 'Sakura Sushi',
    location: 'MG Road, Bangalore',
    rating: 4.7,
    cuisine: 'Japanese',
    deliveryTime: '40-50 min',
    minOrder: 300,
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800',
    menu: [
      { name: 'Dragon Roll', price: 480, category: 'Sushi Rolls', image: 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=400', description: 'Shrimp tempura topped with avocado' },
      { name: 'Salmon Nigiri (6pcs)', price: 420, category: 'Nigiri', image: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=400', description: 'Fresh Atlantic salmon on seasoned rice' },
      { name: 'Miso Soup', price: 120, category: 'Starters', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400', description: 'Traditional Japanese miso broth' },
      { name: 'Edamame', price: 140, category: 'Starters', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', description: 'Steamed salted soybeans' },
      { name: 'Matcha Ice Cream', price: 160, category: 'Desserts', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400', description: 'Japanese green tea flavored ice cream' },
    ],
  },
];

const customers = [
  { name: 'Arjun Sharma', email: 'arjun@example.com', password: 'password123', address: 'Koramangala, Bangalore', phone: '9876543210' },
  { name: 'Priya Patel', email: 'priya@example.com', password: 'password123', address: 'Indiranagar, Bangalore', phone: '9876543211' },
  { name: 'Rohan Mehta', email: 'rohan@example.com', password: 'password123', address: 'HSR Layout, Bangalore', phone: '9876543212' },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Customer.deleteMany({});
    await Restaurant.deleteMany({});
    await Order.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Insert restaurants
    const createdRestaurants = await Restaurant.insertMany(restaurants);
    console.log(`🍽️  Created ${createdRestaurants.length} restaurants`);

    // Insert customers (passwords auto-hashed via pre-save hook)
    const createdCustomers = [];
    for (const c of customers) {
      const customer = await Customer.create(c);
      createdCustomers.push(customer);
    }
    console.log(`👤 Created ${createdCustomers.length} customers`);

    // Create sample orders
    const statuses = ['Pending', 'Preparing', 'Out for Delivery', 'Delivered'];
    const orders = [
      {
        customer_id: createdCustomers[0]._id,
        restaurant_id: createdRestaurants[0]._id,
        restaurant_name: createdRestaurants[0].name,
        items: [
          { item_id: createdRestaurants[0].menu[0]._id, item_name: 'Butter Chicken', price: 320, quantity: 2 },
          { item_id: createdRestaurants[0].menu[3]._id, item_name: 'Garlic Naan', price: 60, quantity: 3 },
        ],
        total_amount: 820,
        status: 'Delivered',
        deliveryAddress: createdCustomers[0].address,
      },
      {
        customer_id: createdCustomers[0]._id,
        restaurant_id: createdRestaurants[1]._id,
        restaurant_name: createdRestaurants[1].name,
        items: [
          { item_id: createdRestaurants[1].menu[0]._id, item_name: 'Classic Beef Burger', price: 280, quantity: 1 },
          { item_id: createdRestaurants[1].menu[2]._id, item_name: 'Loaded Fries', price: 160, quantity: 1 },
        ],
        total_amount: 440,
        status: 'Preparing',
        deliveryAddress: createdCustomers[0].address,
      },
      {
        customer_id: createdCustomers[1]._id,
        restaurant_id: createdRestaurants[2]._id,
        restaurant_name: createdRestaurants[2].name,
        items: [
          { item_id: createdRestaurants[2].menu[0]._id, item_name: 'Dragon Roll', price: 480, quantity: 2 },
          { item_id: createdRestaurants[2].menu[2]._id, item_name: 'Miso Soup', price: 120, quantity: 2 },
        ],
        total_amount: 1200,
        status: 'Delivered',
        deliveryAddress: createdCustomers[1].address,
      },
      {
        customer_id: createdCustomers[1]._id,
        restaurant_id: createdRestaurants[0]._id,
        restaurant_name: createdRestaurants[0].name,
        items: [
          { item_id: createdRestaurants[0].menu[1]._id, item_name: 'Paneer Tikka', price: 260, quantity: 1 },
          { item_id: createdRestaurants[0].menu[4]._id, item_name: 'Gulab Jamun', price: 120, quantity: 2 },
        ],
        total_amount: 500,
        status: 'Pending',
        deliveryAddress: createdCustomers[1].address,
      },
      {
        customer_id: createdCustomers[2]._id,
        restaurant_id: createdRestaurants[1]._id,
        restaurant_name: createdRestaurants[1].name,
        items: [
          { item_id: createdRestaurants[1].menu[1]._id, item_name: 'BBQ Chicken Burger', price: 260, quantity: 2 },
          { item_id: createdRestaurants[1].menu[4]._id, item_name: 'Chocolate Shake', price: 180, quantity: 2 },
        ],
        total_amount: 880,
        status: 'Out for Delivery',
        deliveryAddress: createdCustomers[2].address,
      },
      {
        customer_id: createdCustomers[2]._id,
        restaurant_id: createdRestaurants[2]._id,
        restaurant_name: createdRestaurants[2].name,
        items: [
          { item_id: createdRestaurants[2].menu[1]._id, item_name: 'Salmon Nigiri (6pcs)', price: 420, quantity: 1 },
          { item_id: createdRestaurants[2].menu[3]._id, item_name: 'Edamame', price: 140, quantity: 1 },
          { item_id: createdRestaurants[2].menu[4]._id, item_name: 'Matcha Ice Cream', price: 160, quantity: 2 },
        ],
        total_amount: 880,
        status: 'Delivered',
        deliveryAddress: createdCustomers[2].address,
      },
    ];

    await Order.insertMany(orders);
    console.log(`📦 Created ${orders.length} orders`);

    console.log('\n✅ Seed complete!');
    console.log('\n🔑 Test Credentials:');
    console.log('  Email: arjun@example.com | Password: password123');
    console.log('  Email: priya@example.com | Password: password123');
    console.log('  Email: rohan@example.com | Password: password123');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
}

seed();
