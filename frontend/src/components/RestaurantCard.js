import { useNavigate } from 'react-router-dom';
import './RestaurantCard.css';

const RestaurantCard = ({ restaurant }) => {
  const navigate = useNavigate();

  const renderStars = (rating) => {
    return '★'.repeat(Math.floor(rating)) + (rating % 1 >= 0.5 ? '½' : '');
  };

  return (
    <div
      className="restaurant-card"
      onClick={() => navigate(`/restaurant/${restaurant._id}`)}
    >
      <div className="restaurant-image-wrapper">
        <img
          src={restaurant.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800'}
          alt={restaurant.name}
          className="restaurant-image"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800';
          }}
        />
        <div className="cuisine-tag">{restaurant.cuisine}</div>
      </div>

      <div className="restaurant-info">
        <div className="restaurant-header">
          <h3 className="restaurant-name">{restaurant.name}</h3>
          <div className="rating-pill">
            <span className="star">★</span>
            <span>{restaurant.rating?.toFixed(1)}</span>
          </div>
        </div>

        <p className="restaurant-location">
          <span>📍</span> {restaurant.location}
        </p>

        <div className="restaurant-meta">
          <span className="meta-item">
            <span>⏱</span> {restaurant.deliveryTime}
          </span>
          <span className="meta-dot" />
          <span className="meta-item">
            <span>🛒</span> Min ₹{restaurant.minOrder}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
