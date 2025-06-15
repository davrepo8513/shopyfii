import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  Star, 
  ShoppingCart, 
  Truck, 
  RotateCcw, 
  Shield,
  Plus,
  Minus
} from 'lucide-react';
import { addToCart } from '../../store/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../../store/slices/wishlistSlice';
import { fetchProductById } from '../../store/slices/productsSlice';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentProduct, loading } = useSelector(state => state.products);
  const { items: wishlistItems } = useSelector(state => state.wishlist);
  
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (currentProduct) {
      setSelectedColor(currentProduct.colors?.[0] || '');
      setSelectedSize('');
      setQuantity(1);
      setSelectedImageIndex(0);
    }
  }, [currentProduct]);

  const isInWishlist = wishlistItems.some(item => item.id === currentProduct?.id);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }

    const cartItem = {
      id: currentProduct.id,
      name: currentProduct.name,
      brand: currentProduct.brand,
      price: currentProduct.price,
      originalPrice: currentProduct.originalPrice,
      image: currentProduct.images[0],
      size: selectedSize,
      color: selectedColor,
      quantity: quantity
    };

    dispatch(addToCart(cartItem));
  };

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      dispatch(removeFromWishlist(currentProduct.id));
    } else {
      dispatch(addToWishlist(currentProduct));
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: currentProduct.name,
          text: `Check out this ${currentProduct.brand} ${currentProduct.name}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const calculateDiscount = () => {
    if (currentProduct?.originalPrice && currentProduct?.price) {
      return Math.round(((currentProduct.originalPrice - currentProduct.price) / currentProduct.originalPrice) * 100);
    }
    return 0;
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={16}
        fill={index < Math.floor(rating) ? '#ffc107' : 'none'}
        color={index < Math.floor(rating) ? '#ffc107' : '#e0e0e0'}
      />
    ));
  };

  if (loading) {
    return (
      <div className="product-detail-page">
        <div className="container">
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading product details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentProduct) {
    return (
      <div className="product-detail-page">
        <div className="container">
          <div className="not-found">
            <h2>Product not found</h2>
            <p>The product you're looking for doesn't exist.</p>
            <button className="btn btn-primary" onClick={() => navigate('/products')}>
              Browse Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
            Back
          </button>
          <span className="breadcrumb-text">
            Home / Products / {currentProduct.category} / {currentProduct.name}
          </span>
        </div>

        <div className="product-detail">
          {/* Product Images */}
          <div className="product-images">
            <div className="main-image">
              <img 
                src={currentProduct.images?.[selectedImageIndex] || currentProduct.image} 
                alt={currentProduct.name}
                onError={(e) => {
                  e.target.src = '/assets/placeholder-shoe.jpg';
                }}
              />
              {currentProduct.discount && (
                <div className="discount-badge">
                  -{calculateDiscount()}% OFF
                </div>
              )}
            </div>
            
            {currentProduct.images && currentProduct.images.length > 1 && (
              <div className="image-thumbnails">
                {currentProduct.images.map((image, index) => (
                  <button
                    key={index}
                    className={`thumbnail ${index === selectedImageIndex ? 'active' : ''}`}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <img src={image} alt={`${currentProduct.name} ${index + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="product-info">
            <div className="product-header">
              <div className="brand-name">
                <span className="brand">{currentProduct.brand}</span>
                <h1 className="product-name">{currentProduct.name}</h1>
              </div>
              
              <div className="product-actions">
                <button 
                  className={`wishlist-btn ${isInWishlist ? 'active' : ''}`}
                  onClick={handleWishlistToggle}
                >
                  <Heart size={20} fill={isInWishlist ? '#ff6161' : 'none'} />
                </button>
                <button className="share-btn" onClick={handleShare}>
                  <Share2 size={20} />
                </button>
              </div>
            </div>

            {/* Rating */}
            <div className="product-rating">
              <div className="stars">
                {renderStars(currentProduct.rating)}
              </div>
              <span className="rating-text">
                {currentProduct.rating} ({currentProduct.reviews || 0} reviews)
              </span>
            </div>

            {/* Pricing */}
            <div className="product-pricing">
              <span className="current-price">{formatPrice(currentProduct.price)}</span>
              {currentProduct.originalPrice && currentProduct.originalPrice > currentProduct.price && (
                <>
                  <span className="original-price">{formatPrice(currentProduct.originalPrice)}</span>
                  <span className="discount-text">({calculateDiscount()}% OFF)</span>
                </>
              )}
            </div>

            {/* Description */}
            <div className="product-description">
              <p>{currentProduct.description}</p>
            </div>

            {/* Color Selection */}
            {currentProduct.colors && currentProduct.colors.length > 0 && (
              <div className="color-selection">
                <h3>Color: <span className="selected-value">{selectedColor}</span></h3>
                <div className="color-options">
                  {currentProduct.colors.map(color => (
                    <button
                      key={color}
                      className={`color-option ${selectedColor === color ? 'active' : ''}`}
                      style={{ backgroundColor: color.toLowerCase() }}
                      onClick={() => setSelectedColor(color)}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {currentProduct.sizes && currentProduct.sizes.length > 0 && (
              <div className="size-selection">
                <div className="size-header">
                  <h3>Size: {selectedSize && <span className="selected-value">{selectedSize}</span>}</h3>
                  <button 
                    className="size-guide-btn"
                    onClick={() => setShowSizeGuide(!showSizeGuide)}
                  >
                    Size Guide
                  </button>
                </div>
                <div className="size-options">
                  {currentProduct.sizes.map(size => (
                    <button
                      key={size}
                      className={`size-option ${selectedSize === size ? 'active' : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {showSizeGuide && (
                  <div className="size-guide">
                    <h4>Size Guide</h4>
                    <table>
                      <thead>
                        <tr>
                          <th>US Size</th>
                          <th>UK Size</th>
                          <th>EU Size</th>
                          <th>Foot Length (cm)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr><td>6</td><td>5.5</td><td>39</td><td>24.5</td></tr>
                        <tr><td>7</td><td>6.5</td><td>40</td><td>25.5</td></tr>
                        <tr><td>8</td><td>7.5</td><td>41</td><td>26.5</td></tr>
                        <tr><td>9</td><td>8.5</td><td>42</td><td>27.5</td></tr>
                        <tr><td>10</td><td>9.5</td><td>43</td><td>28.5</td></tr>
                        <tr><td>11</td><td>10.5</td><td>44</td><td>29.5</td></tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Quantity Selection */}
            <div className="quantity-selection">
              <h3>Quantity:</h3>
              <div className="quantity-controls">
                <button 
                  className="quantity-btn"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus size={16} />
                </button>
                <span className="quantity-value">{quantity}</span>
                <button 
                  className="quantity-btn"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="add-to-cart-section">
              <button 
                className="add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={!selectedSize}
              >
                <ShoppingCart size={20} />
                Add to Cart
              </button>
              <p className="cart-note">
                {!selectedSize && 'Please select a size to continue'}
              </p>
            </div>

            {/* Features */}
            <div className="product-features">
              <div className="feature">
                <Truck size={20} />
                <div>
                  <h4>Free Delivery</h4>
                  <p>Free shipping on orders above ₹999</p>
                </div>
              </div>
              <div className="feature">
                <RotateCcw size={20} />
                <div>
                  <h4>Easy Returns</h4>
                  <p>30-day return policy</p>
                </div>
              </div>
              <div className="feature">
                <Shield size={20} />
                <div>
                  <h4>Authentic Product</h4>
                  <p>100% genuine products</p>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="product-details">
              <h3>Product Details</h3>
              <ul>
                <li><strong>Brand:</strong> {currentProduct.brand}</li>
                <li><strong>Category:</strong> {currentProduct.category}</li>
                <li><strong>Material:</strong> {currentProduct.material || 'Premium synthetic'}</li>
                <li><strong>Care Instructions:</strong> Clean with damp cloth</li>
                <li><strong>Country of Origin:</strong> India</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="reviews-section">
          <h2>Customer Reviews</h2>
          <div className="reviews-summary">
            <div className="rating-overview">
              <div className="average-rating">
                <span className="rating-number">{currentProduct.rating}</span>
                <div className="stars">
                  {renderStars(currentProduct.rating)}
                </div>
                <p>{currentProduct.reviews || 0} reviews</p>
              </div>
            </div>
          </div>
          
          <div className="reviews-list">
            {/* Sample reviews - in real app, these would come from API */}
            <div className="review">
              <div className="review-header">
                <div className="reviewer-info">
                  <span className="reviewer-name">John D.</span>
                  <div className="stars">
                    {renderStars(5)}
                  </div>
                </div>
                <span className="review-date">2 weeks ago</span>
              </div>
              <p className="review-text">
                Excellent quality shoes! Very comfortable and stylish. 
                Perfect fit and great value for money. Highly recommended!
              </p>
            </div>
            
            <div className="review">
              <div className="review-header">
                <div className="reviewer-info">
                  <span className="reviewer-name">Sarah M.</span>
                  <div className="stars">
                    {renderStars(4)}
                  </div>
                </div>
                <span className="review-date">1 month ago</span>
              </div>
              <p className="review-text">
                Good quality product. Delivery was fast and packaging was excellent. 
                The shoes are comfortable but took a few days to break in.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;