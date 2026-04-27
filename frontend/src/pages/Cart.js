import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { placeOrder } from '../services/api';
import './Cart.css';

const Cart = () => {
  const { cartItems, restaurantInfo, updateQuantity, removeFromCart, clearCart, cartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const deliveryFee = cartTotal > 0 ? 40 : 0;
  const taxes = Math.round(cartTotal * 0.05);
  const grandTotal = cartTotal + deliveryFee + taxes;

  const handlePlaceOrder = async () => {
    if (!user) { navigate('/login'); return; }
    if (cartItems.length === 0) return;

    try {
      setPlacing(true);
      setError('');
      await placeOrder({
        restaurant_id: restaurantInfo._id,
        items: cartItems.map((i) => ({
          item_id: i._id,
          item_name: i.name,
          price: i.price,
          quantity: i.quantity,
        })),
        deliveryAddress: user.address,
      });
      setSuccess(true);
      clearCart();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Try again.');
    } finally {
      setPlacing(false);
    }
  };

  if (success) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <div className="success-screen animate-fade-up">
            <div className="success-icon">🎉</div>
            <h2 className="success-title">Order Placed!</h2>
            <p className="success-message">
              Your delicious food is on its way. Sit tight!
            </p>
            <div className="success-actions">
              <button onClick={() => navigate('/orders')} className="btn btn-primary">
                Track My Orders
              </button>
              <button onClick={() => navigate('/')} className="btn btn-outline">
                Order More
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <div className="empty-cart animate-fade-up">
            <div className="empty-cart-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Add some delicious items from our restaurants</p>
            <Link to="/" className="btn btn-primary" style={{ marginTop: 20 }}>
              Browse Restaurants
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="container cart-page">
        <h1 className="cart-title">Your Cart</h1>

        <div className="cart-layout">
          {/* Cart Items */}
          <div className="cart-items-section">
            {restaurantInfo && (
              <div className="cart-restaurant-info">
                <span className="restaurant-label">From</span>
                <span className="restaurant-name-tag">{restaurantInfo.name}</span>
              </div>
            )}

            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div key={item._id} className="cart-item animate-fade-up">
                  <div className="cart-item-image-wrapper">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200'}
                      alt={item.name}
                      className="cart-item-image"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200';
                      }}
                    />
                  </div>
                  <div className="cart-item-details">
                    <h3 className="cart-item-name">{item.name}</h3>
                    <p className="cart-item-price">₹{item.price} each</p>
                  </div>
                  <div className="cart-item-controls">
                    <div className="qty-control">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="qty-btn"
                      >
                        −
                      </button>
                      <span className="qty-value">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="qty-btn"
                      >
                        +
                      </button>
                    </div>
                    <div className="cart-item-subtotal">₹{item.price * item.quantity}</div>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="remove-btn"
                      title="Remove item"
                    >
                      🗑
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={clearCart} className="clear-cart-btn">
              Clear cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="order-summary">
            <div className="summary-card glass-card">
              <h2 className="summary-title">Order Summary</h2>

              <div className="summary-lines">
                <div className="summary-line">
                  <span>Subtotal ({cartItems.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span>₹{cartTotal}</span>
                </div>
                <div className="summary-line">
                  <span>Delivery fee</span>
                  <span>₹{deliveryFee}</span>
                </div>
                <div className="summary-line">
                  <span>Taxes & charges (5%)</span>
                  <span>₹{taxes}</span>
                </div>
                <div className="summary-divider" />
                <div className="summary-line total">
                  <span>Total</span>
                  <span>₹{grandTotal}</span>
                </div>
              </div>

              {user?.address && (
                <div className="delivery-address">
                  <span className="address-label">📍 Delivering to</span>
                  <span className="address-text">{user.address}</span>
                </div>
              )}

              {error && <div className="alert alert-error">{error}</div>}

              <button
                onClick={handlePlaceOrder}
                disabled={placing}
                className="place-order-btn"
              >
                {placing ? (
                  <>
                    <span className="btn-spinner" /> Placing Order...
                  </>
                ) : (
                  `Place Order · ₹${grandTotal}`
                )}
              </button>

              <p className="secure-note">🔒 Secure checkout · No hidden charges</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
