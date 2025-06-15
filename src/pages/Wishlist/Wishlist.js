import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { removeFromWishlist, clearWishlist } from '../../store/slices/wishlistSlice';
import { addToCart } from '../../store/slices/cartSlice';
import './Wishlist.css';

const Wishlist = () => {
  const dispatch = useDispatch();
  const { items: wishlistItems } = useSelector(state => state.wishlist);

  const handleRemoveFromWishlist = (productId) => {
    dispatch(removeFromWishlist(productId));
  };

  const handleMoveToCart = (product) => {
    const cartItem = {
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      size: product.sizes?.[0] || 'M',
      color: product.colors?.[0] || 'Default',
      quantity: 1
    };
    
    dispatch(addToCart(cartItem));
    dispatch(removeFromWishlist(product.id));
  };

  const handleClearWishlist = () => {
    if (window.confirm('Are you sure you want to clear your wishlist?')) {
      dispatch(clearWishlist());
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="wishlist-page">
        <div className="container">
          <div className="wishlist-header">
            <h1>My Wishlist</h1>
          </div>
          
          <div className="empty-wishlist">
            <div className="empty-wishlist-icon">
              <Heart size={64} color="#ccc" />
            </div>
            <h2>Your wishlist is empty</h2>
            <p>Save your favorite items to your wishlist and shop them later.</p>
            <Link to="/products" className="btn btn-primary">
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="container">
        <div className="wishlist-header">
          <h1>My Wishlist ({wishlistItems.length} items)</h1>
          <button 
            className="clear-wishlist-btn"
            onClick={handleClearWishlist}
          >
            <Trash2 size={16} />
            Clear All
          </button>
        </div>

        <div className="wishlist-grid">
          {wishlistItems.map(product => (
            <div key={product.id} className="wishlist-item">
              <div className="wishlist-item-image">
                <Link to={`/product/${product.id}`}>
                  <img 
                    src={product.image} 
                    alt={product.name}
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop';
                    }}
                  />
                </Link>
                
                {product.discount > 0 && (
                  <div className="discount-badge">
                    {product.discount}% OFF
                  </div>
                )}
                
                <button 
                  className="remove-btn"
                  onClick={() => handleRemoveFromWishlist(product.id)}
                  title="Remove from wishlist"
                >
                  <Heart size={16} fill="#ff6161" color="#ff6161" />
                </button>
              </div>

              <div className="wishlist-item-info">
                <div className="brand">{product.brand}</div>
                <Link to={`/product/${product.id}`} className="product-name">
                  {product.name}
                </Link>
                
                <div className="pricing">
                  <span className="current-price">{formatPrice(product.price)}</span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <>
                      <span className="original-price">{formatPrice(product.originalPrice)}</span>
                      <span className="discount-text">{product.discount}% off</span>
                    </>
                  )}
                </div>

                <div className="product-colors">
                  {product.colors?.slice(0, 3).map(color => (
                    <div
                      key={color}
                      className="color-option"
                      style={{ backgroundColor: color.toLowerCase() }}
                      title={color}
                    />
                  ))}
                  {product.colors?.length > 3 && (
                    <span className="more-colors">+{product.colors.length - 3}</span>
                  )}
                </div>

                <div className="wishlist-actions">
                  <button 
                    className="move-to-cart-btn"
                    onClick={() => handleMoveToCart(product)}
                  >
                    <ShoppingCart size={16} />
                    Move to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="wishlist-footer">
          <div className="wishlist-summary">
            <p>Total items in wishlist: <strong>{wishlistItems.length}</strong></p>
            <p>Total value: <strong>
              {formatPrice(wishlistItems.reduce((total, item) => total + item.price, 0))}
            </strong></p>
          </div>
          
          <div className="wishlist-actions-footer">
            <Link to="/products" className="btn btn-secondary">
              Continue Shopping
            </Link>
            <button 
              className="btn btn-primary"
              onClick={() => {
                wishlistItems.forEach(product => handleMoveToCart(product));
              }}
            >
              Move All to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;