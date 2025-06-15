import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Heart, Star, ShoppingCart, Minus, Plus, X } from 'lucide-react';
import { addToCart, removeFromCart, updateQuantity } from '../../store/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../../store/slices/wishlistSlice';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  
  const { items: wishlistItems } = useSelector(state => state.wishlist);
  const { items: cartItems } = useSelector(state => state.cart);
  const isInWishlist = wishlistItems.some(item => item.id === product.id);

  console.log('ProductCard', setSelectedSize);
  
  // Find if this product is in cart and get its quantity
  const cartItem = cartItems.find(item => 
    item.id === product.id && 
    item.size === selectedSize && 
    item.color === selectedColor
  );
  const isInCart = !!cartItem;
  const cartQuantity = cartItem?.quantity || 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const cartItem = {
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      size: selectedSize,
      color: selectedColor,
      quantity: 1
    };
    
    dispatch(addToCart(cartItem));
  };

  const handleRemoveItem = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(removeFromCart({
      id: product.id,
      size: selectedSize,
      color: selectedColor,
      isFromCart: false
    }));
  };

  const handleQuantityIncrease = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(updateQuantity({
      id: product.id,
      size: selectedSize,
      color: selectedColor,
      quantity: cartQuantity + 1
    }));
    handleAddToCart(e)
  };

  const handleQuantityDecrease = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleRemoveItem(e);
    if (cartQuantity > 1) {
      dispatch(updateQuantity({
        id: product.id,
        size: selectedSize,
        color: selectedColor,
        quantity: cartQuantity - 1
      }));
    } else if (cartQuantity === 1) {
      handleRemoveItem(e);
    }
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id));
    } else {
      dispatch(addToWishlist(product));
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} size={12} fill="#ffa500" color="#ffa500" />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" size={12} fill="#ffa500" color="#ffa500" style={{ clipPath: 'inset(0 50% 0 0)' }} />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} size={12} color="#ddd" />);
    }

    return stars;
  };

  return (
    <div 
      className="product-card"
    >
      <Link to={`/product/${product.id}`} className="product-link">
        <div className="product-image-container">
          <img 
            src={product.image} 
            alt={product.name}
            className="product-image"
            onError={(e) => {
              e.target.src = '/assets/placeholder-shoe.jpg';
            }}
          />
          
          {product.discount > 0 && (
            <div className="discount-badge">
              {product.discount}% OFF
            </div>
          )}
          
          <button 
            className={`wishlist-btn ${isInWishlist ? 'active' : ''}`}
            onClick={handleWishlistToggle}
          >
            <Heart size={16} fill={isInWishlist ? '#ff6161' : 'none'} />
          </button>
{/* 
          {isHovered && (
            <div className="quick-actions">
              <div className="size-selector d-none">
                <span className="selector-label">Size:</span>
                <div className="size-options">
                  {product.sizes.slice(0, 4).map(size => (
                    <button
                      key={size}
                      className={`size-option ${selectedSize === size ? 'active' : ''}`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedSize(size);
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              
              <button className="add-to-cart-btn" onClick={handleAddToCart}>
                <ShoppingCart size={16} />
                Add to Cart
              </button>
            </div>
          )} */}
        </div>

        <div className="product-info">
          <div className="product-brand">{product.brand}</div>
          <h3 className="product-name">{product.name}</h3>
          
          <div className="product-rating">
            <div className="stars">
              {renderStars(product.rating)}
            </div>
            <span className="rating-text">({product.reviews})</span>
          </div>

          <div className="product-pricing">
            <span className="current-price">{formatPrice(product.price)}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <>
                <span className="original-price">{formatPrice(product.originalPrice)}</span>
                <span className="discount-text">{product.discount}% off</span>
              </>
            )}
          </div>

          <div className="product-colors">
            {product.colors.slice(0, 3).map(color => (
              <div
                key={color}
                className={`color-option ${selectedColor === color ? 'active' : ''}`}
                style={{ backgroundColor: color.toLowerCase() }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedColor(color);
                }}
                title={color}
              />
            ))}
            {product.colors.length > 3 && (
              <span className="more-colors">+{product.colors.length - 3}</span>
            )}
          </div>
            <div className="d-flex justify-content-between align-items-center">
          {product.featured && (
            <div className="featured-badge">
              Bestseller
            </div>
          )}
          
          {isInCart ? (
            <div className="">
              <button 
                className="remove-btn"
                onClick={handleRemoveItem}
                title="Remove from cart"
              >
                <X size={16} />
              </button>
              
              <div className="quantity-controls">
                <button 
                  className="quantity-btn"
                  onClick={handleQuantityDecrease}
                  disabled={cartQuantity <= 1}
                >
                  <Minus size={14} />
                </button>
                <span className="quantity">{cartQuantity}</span>
                <button 
                  className="quantity-btn"
                  onClick={handleQuantityIncrease}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          ) : <button className="btn btn-sm btn-outline-secondary rounded-pill px-3 py-2 text-dark bg-white border border-gray-300 hover:text-primary hover:border-primary transition duration-300 ease-in-out btn:hover:bg-primary" type="button" data-bs-toggle="modal" data-bs-target="#exampleModalCenter" onClick={handleAddToCart}>
                <ShoppingCart size={16} />
              </button>}
        </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;