import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  ShoppingCart, 
  User, 
  Heart, 
  Menu, 
  X,
  MapPin,
  ChevronDown
} from 'lucide-react';
import { toggleCart } from '../../store/slices/cartSlice';
import { setSearchQuery, applyFilters } from '../../store/slices/productsSlice';
import { logout } from '../../store/slices/userSlice';
import './Header.css';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  // const categories = ['Running', 'Basketball', 'Lifestyle', 'Casual', 'Skateboarding', 'Training'];
  
  const { totalQuantity } = useSelector(state => state.cart);
  const { totalItems: wishlistCount } = useSelector(state => state.wishlist);
  const { isAuthenticated, user } = useSelector(state => state.user || {});

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      dispatch(setSearchQuery(searchInput.trim()));
      dispatch(applyFilters());
      navigate('/products');
    }
  };

  const handleCartClick = () => {
    dispatch(toggleCart());
  };

  const handleLogout = () => {
    dispatch(logout());
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const categories = [
    'Running',
    'Basketball',
    'Lifestyle',
    'Casual',
    'Skateboarding',
    'Football',
    'Tennis'
  ];

  return (
    <header className="header">
      {/* Top Bar */}
      <div className="header-top">
        <div className="container">
          <div className="header-top-content">
            <div className="location">
              <MapPin size={16} />
              <span>Deliver to Mumbai 400001</span>
            </div>
            <div className="header-top-links">
              <Link to="/seller">Become a Seller</Link>
              <Link to="/more">More</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="header-main">
        <div className="container">
          <div className="header-content">
            {/* Logo */}
            <Link to="/" className="logo">
              <span className="logo-text">Shopyfi</span>
              <span className="logo-subtitle">Explore <span className="plus">Plus</span></span>
            </Link>

            {/* Search Bar */}
            <form className="search-form" onSubmit={handleSearch}>
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search for products, brands and more"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="search-input"
                />
                <button type="submit" className="search-button">
                  <Search size={20} />
                </button>
              </div>
            </form>

            {/* Header Actions */}
            <div className="header-actions">
              {/* User Account */}
              <div className="header-action user-menu">
                <button 
                  className="header-action-btn btn"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  <User size={20} />
                  <span>{isAuthenticated ? user?.name || 'Account' : 'Login'}</span>
                  <ChevronDown size={16} />
                </button>
                
                {isUserMenuOpen && (
                  <div className="user-dropdown">
                    {isAuthenticated ? (
                      <>
                        <Link to="/profile" className="dropdown-item">My Profile</Link>
                        <Link to="/orders" className="dropdown-item">Orders</Link>
                        <Link to="/wishlist" className="dropdown-item">Wishlist</Link>
                        <Link to="/rewards" className="dropdown-item">Rewards</Link>
                        <Link to="/gift-cards" className="dropdown-item">Gift Cards</Link>
                        <button className="dropdown-item logout-btn" onClick={handleLogout}>Logout</button>
                      </>
                    ) : (
                      <>
                        <Link to="/login" className="dropdown-item">Login</Link>
                        <Link to="/signup" className="dropdown-item">Sign Up</Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Wishlist */}
              <Link to="/wishlist" className="header-action">
                <div className="header-action-btn">
                  <Heart size={20} />
                  <span>Wishlist</span>
                  {wishlistCount > 0 && (
                    <span className="badge">{wishlistCount}</span>
                  )}
                </div>
              </Link>

              {/* Cart */}
              <button className="header-action" onClick={handleCartClick}>
                <div className="header-action-btn">
                  <ShoppingCart size={20} />
                  <span>Cart</span>
                  {totalQuantity > 0 && (
                    <span className="badge">{totalQuantity}</span>
                  )}
                </div>
              </button>

              {/* Mobile Menu Toggle */}
              <button 
                className="mobile-menu-toggle"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="header-nav">
        <div className="container">
          <div className="nav-content">
            <div className="nav-categories">
              {categories.map(category => (
                <Link 
                  key={category}
                  to={`/category/${category.toLowerCase()}`}
                  className="nav-category"
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-content">
            <div className="mobile-search">
              <form onSubmit={handleSearch}>
                <div className="search-container">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                  <button type="submit">
                    <Search size={20} />
                  </button>
                </div>
              </form>
            </div>
            
            <div className="mobile-nav">
              {categories.map(category => (
                <Link 
                  key={category}
                  to={`/category/${category.toLowerCase()}`}
                  className="mobile-nav-item"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;