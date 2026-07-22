import { useState, useEffect, useCallback } from 'react';
import { getRestaurants } from '../services/api';
import RestaurantCard from '../components/RestaurantCard';
import './Home.css';

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [error, setError] = useState('');

  const fetchRestaurants = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await getRestaurants(search);
      setRestaurants(data);
    } catch {
      setError('Failed to load restaurants. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  const handleClear = () => {
    setSearchInput('');
    setSearch('');
  };

  return (
    <div className="page-wrapper">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg-shapes">
          <div className="shape shape-1" />
          <div className="shape shape-2" />
          <div className="shape shape-3" />
        </div>
        <div className="container hero-content">
          <div className="hero-text animate-fade-up">
            <div className="hero-eyebrow">🚀 Fastest delivery in town</div>
            <h1 className="hero-title">
              Hungry? <br />
              <span className="hero-highlight">We've got you</span> covered.
            </h1>
            <p className="hero-subtitle">
              Discover restaurants, explore menus, and get your food delivered fast!!.
            </p>
          </div>

          <div className="search-bar animate-fade-up">
            <form onSubmit={handleSearch}>
              <div className="search-inner">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Search for restaurants..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="search-input"
                />
                {searchInput && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="search-clear"
                  >
                    ✕
                  </button>
                )}
                <button type="submit" className="search-submit">
                  Search
                </button>
              </div>
            </form>
          </div>

          <div className="hero-stats animate-fade-up">
            <div className="stat">
              <span className="stat-value">50+</span>
              <span className="stat-label">Restaurants</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-value">30min</span>
              <span className="stat-label">Avg. Delivery</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-value">10k+</span>
              <span className="stat-label">Happy Customers</span>
            </div>
          </div>
        </div>
      </section>

      {/* Restaurants Section */}
      <section className="restaurants-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              {search ? `Results for "${search}"` : 'All Restaurants'}
            </h2>
            {restaurants.length > 0 && (
              <span className="section-count">{restaurants.length} places</span>
            )}
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          {loading ? (
            <div className="loading-center">
              <div className="spinner" />
            </div>
          ) : restaurants.length === 0 ? (
            <div className="empty-state">
              <div className="empty-emoji">🍽️</div>
              <h3>No restaurants found</h3>
              <p>Try a different search term.</p>
              {search && (
                <button onClick={handleClear} className="btn btn-primary" style={{ marginTop: 16 }}>
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <div className="restaurants-grid">
              {restaurants.map((r, i) => (
                <div
                  key={r._id}
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <RestaurantCard restaurant={r} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
