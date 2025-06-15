import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { X, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { 
  closeCart, 
  removeFromCart, 
  updateQuantity, 
  clearCart 
} from '../../store/slices/cartSlice';
import './Cart.css';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalQuantity, totalAmount, isOpen } = useSelector(state => state.cart);

  const handleClose = () => {
    dispatch(closeCart());
  };

  const handleRemoveItem = (cartItemId) => {
    dispatch(removeFromCart(cartItemId));
  };

  const handleUpdateQuantity = (cartItemId, newQuantity) => {
    if (newQuantity > 0) {
      dispatch(updateQuantity({ cartItemId, quantity: newQuantity }));
    }
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleProceedToPayment = () => {
    dispatch(closeCart());
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    dispatch(closeCart());
    navigate('/products');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  if (!isOpen) return null;

  return (
    <div className="cart-overlay">
      <div className="cart-sidebar">
        <div className="cart-header">
          <div className="cart-title">
            <ShoppingBag size={20} />
            <span>My Cart ({totalQuantity})</span>
          </div>
          <button className="cart-close-btn" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        <div className="cart-content">
          {items.length === 0 ? (
            <div className="empty-cart">
              <ShoppingBag size={48} color="#ccc" />
              <h3>Your cart is empty</h3>
              <p>Add some products to get started</p>
              <button className="continue-shopping-btn" onClick={handleContinueShopping}>
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {items.map((item) => (
                  <div key={item.cartItemId} className="cart-item">
                    <div className="item-image">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        onError={(e) => {
                          e.target.src = '/assets/placeholder-shoe.jpg';
                        }}
                      />
                    </div>
                    
                    <div className="item-details">
                      <h4 className="item-name">{item.name}</h4>
                      <p className="item-brand">{item.brand}</p>
                      <div className="item-variants">
                        <span className="variant">Size: {item.size}</span>
                        <span className="variant">Color: {item.color}</span>
                      </div>
                      
                      <div className="item-price">
                        <span className="current-price">{formatPrice(item.price)}</span>
                        {item.originalPrice && item.originalPrice > item.price && (
                          <span className="original-price">{formatPrice(item.originalPrice)}</span>
                        )}
                      </div>
                    </div>

                    <div className="item-actions">
                      <button 
                        className="remove-btn"
                        onClick={() => handleRemoveItem(item.cartItemId)}
                      >
                        <X size={16} />
                      </button>
                      
                      <div className="quantity-controls">
                        <button 
                          className="quantity-btn"
                          onClick={() => handleUpdateQuantity(item.cartItemId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="quantity">{item.quantity}</span>
                        <button 
                          className="quantity-btn"
                          onClick={() => handleUpdateQuantity(item.cartItemId, item.quantity + 1)}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-summary">
                <div className="summary-row">
                  <span>Subtotal ({totalQuantity} items)</span>
                  <span className="summary-price">{formatPrice(totalAmount)}</span>
                </div>
                
                <div className="summary-row">
                  <span>Shipping</span>
                  <span className="free-shipping">FREE</span>
                </div>
                
                <div className="summary-row total">
                  <span>Total</span>
                  <span className="summary-price">{formatPrice(totalAmount)}</span>
                </div>

                <div className="cart-actions">
                  <button 
                    className="proceed-btn"
                    onClick={handleProceedToPayment}
                  >
                    Proceed to Payment
                    <ArrowRight size={16} />
                  </button>
                  
                  <button 
                    className="continue-btn"
                    onClick={handleContinueShopping}
                  >
                    Continue Shopping
                  </button>
                  
                  <button 
                    className="clear-cart-btn"
                    onClick={handleClearCart}
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;