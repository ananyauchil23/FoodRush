import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserOrders } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Orders.css';

const STATUS_STEPS = ['Pending', 'Preparing', 'Out for Delivery', 'Delivered'];

const StatusTracker = ({ status }) => {
  const currentStep = STATUS_STEPS.indexOf(status);
  return (
    <div className="status-tracker">
      {STATUS_STEPS.map((step, i) => (
        <div key={step} className="tracker-step-wrapper">
          <div className={`tracker-step ${i <= currentStep ? 'done' : ''} ${i === currentStep ? 'current' : ''}`}>
            <div className="tracker-dot">
              {i <= currentStep ? '✓' : i + 1}
            </div>
            <span className="tracker-label">{step}</span>
          </div>
          {i < STATUS_STEPS.length - 1 && (
            <div className={`tracker-line ${i < currentStep ? 'done' : ''}`} />
          )}
        </div>
      ))}
    </div>
  );
};

const Orders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) { navigate('/login'); return; }

    const fetchOrders = async () => {
      try {
        const { data } = await getUserOrders(user._id);
        setOrders(data);
      } catch {
        setError('Failed to load your orders.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user, navigate]);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="page-wrapper loading-center">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="container orders-page">
        <div className="orders-header">
          <h1 className="orders-title">My Orders</h1>
          <span className="orders-count">{orders.length} orders</span>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {orders.length === 0 ? (
          <div className="empty-orders animate-fade-up">
            <div className="empty-emoji">📦</div>
            <h2>No orders yet</h2>
            <p>Your order history will appear here</p>
            <Link to="/" className="btn btn-primary" style={{ marginTop: 20 }}>
              Order Now
            </Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order, idx) => (
              <div
                key={order._id}
                className="order-card animate-fade-up"
                style={{ animationDelay: `${idx * 0.07}s` }}
              >
                {/* Order Header */}
                <div className="order-card-header">
                  <div className="order-restaurant">
                    <span className="order-restaurant-icon">🍽️</span>
                    <div>
                      <h3 className="order-restaurant-name">{order.restaurant_name}</h3>
                      <span className="order-date">{formatDate(order.createdAt)}</span>
                    </div>
                  </div>
                  <div className={`order-status-badge status-${order.status.replace(/ /g, '-')}`}>
                    {order.status}
                  </div>
                </div>

                {/* Status Tracker */}
                <StatusTracker status={order.status} />

                {/* Items */}
                <div className="order-items">
                  {order.items.map((item, i) => (
                    <div key={i} className="order-item-row">
                      <span className="order-item-qty">{item.quantity}×</span>
                      <span className="order-item-name">{item.item_name}</span>
                      <span className="order-item-price">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="order-card-footer">
                  <div className="order-total-section">
                    <span className="order-total-label">Total paid</span>
                    <span className="order-total-amount">₹{order.total_amount}</span>
                  </div>
                  {order.deliveryAddress && (
                    <div className="order-address">
                      📍 {order.deliveryAddress}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
