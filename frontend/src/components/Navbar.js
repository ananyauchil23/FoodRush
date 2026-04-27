import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🍜</span>
          <span className="logo-text">FoodRush</span>
        </Link>

        <div className="navbar-links">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
            Home
          </Link>
          {user && (
            <Link
              to="/orders"
              className={`nav-link ${isActive('/orders') ? 'active' : ''}`}
            >
              My Orders
            </Link>
          )}
        </div>

        <div className="navbar-actions">
          {user && (
            <Link to="/cart" className="cart-btn">
              <span className="cart-icon">🛒</span>
              Cart
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
          )}

          {user ? (
            <div className="user-menu">
              <span className="user-avatar">{user.name[0].toUpperCase()}</span>
              <span className="user-name">{user.name.split(' ')[0]}</span>
              <button onClick={handleLogout} className="btn btn-ghost logout-btn">
                Sign out
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-outline">
                Sign in
              </Link>
              <Link to="/signup" className="btn btn-primary">
                Join Free
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
