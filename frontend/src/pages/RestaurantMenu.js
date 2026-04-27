import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRestaurant } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './RestaurantMenu.css';

const RestaurantMenu = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart, cartItems } = useCart();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [addedItems, setAddedItems] = useState({});

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const { data } = await getRestaurant(id);
        setRestaurant(data);
      } catch {
        setError('Failed to load restaurant menu.');
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurant();
  }, [id]);

  const categories = restaurant
    ? ['All', ...new Set(restaurant.menu.map((i) => i.category))]
    : [];

  const filteredMenu =
    activeCategory === 'All'
      ? restaurant?.menu || []
      : restaurant?.menu.filter((i) => i.category === activeCategory) || [];

  const getItemQuantity = (itemId) => {
    const cartItem = cartItems.find((i) => i._id === itemId);
    return cartItem?.quantity || 0;
  };

  const handleAddToCart = (item) => {
    if (!user) {
      navigate('/login');
      return;
    }
    addToCart(item, restaurant);
    setAddedItems((prev) => ({ ...prev, [item._id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [item._id]: false }));
    }, 1000);
  };

  if (loading) {
    return (
      <div className="page-wrapper loading-center">
        <div className="spinner" />
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="page-wrapper">
        <div className="container" style={{ paddingTop: 40 }}>
          <div className="alert alert-error">{error || 'Restaurant not found'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      {/* Restaurant Hero */}
      <div className="menu-hero">
        <div className="menu-hero-image-wrapper">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="menu-hero-image"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800';
            }}
          />
          <div className="menu-hero-overlay" />
        </div>
        <div className="container menu-hero-content">
          <button onClick={() => navigate(-1)} className="back-btn">
            ← Back
          </button>
          <div className="menu-hero-info">
            <span className="cuisine-badge">{restaurant.cuisine}</span>
            <h1 className="menu-hero-title">{restaurant.name}</h1>
            <p className="menu-hero-location">📍 {restaurant.location}</p>
            <div className="menu-hero-meta">
              <div className="meta-chip">⭐ {restaurant.rating?.toFixed(1)}</div>
              <div className="meta-chip">⏱ {restaurant.deliveryTime}</div>
              <div className="meta-chip">🛒 Min ₹{restaurant.minOrder}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="container menu-section">
        {/* Category Tabs */}
        <div className="category-tabs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`category-tab ${activeCategory === cat ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Items */}
        <div className="menu-grid">
          {filteredMenu.map((item) => {
            const qty = getItemQuantity(item._id);
            const justAdded = addedItems[item._id];
            return (
              <div key={item._id} className="menu-item-card">
                <div className="menu-item-image-wrapper">
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400'}
                    alt={item.name}
                    className="menu-item-image"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400';
                    }}
                  />
                  {qty > 0 && <div className="in-cart-badge">{qty} in cart</div>}
                </div>
                <div className="menu-item-info">
                  <div className="menu-item-category">{item.category}</div>
                  <h3 className="menu-item-name">{item.name}</h3>
                  {item.description && (
                    <p className="menu-item-desc">{item.description}</p>
                  )}
                  <div className="menu-item-footer">
                    <span className="menu-item-price">₹{item.price}</span>
                    <button
                      onClick={() => handleAddToCart(item)}
                      className={`add-btn ${justAdded ? 'added' : ''}`}
                    >
                      {justAdded ? '✓ Added!' : qty > 0 ? `Add more` : '+ Add'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredMenu.length === 0 && (
          <div className="empty-state">
            <div className="empty-emoji">🍽️</div>
            <h3>No items in this category</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantMenu;
