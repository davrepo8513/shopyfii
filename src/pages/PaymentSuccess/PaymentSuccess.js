import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Package, Truck, Home, ShoppingBag } from 'lucide-react';
import { clearCurrentOrder } from '../../store/slices/orderSlice';
import './PaymentSuccess.css';

const PaymentSuccess = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentOrder } = useSelector(state => state.order);

  useEffect(() => {
    if (!currentOrder) {
      navigate('/');
    }
  }, [currentOrder, navigate]);

  const handleContinueShopping = () => {
    dispatch(clearCurrentOrder());
    navigate('/products');
  };

  const handleGoHome = () => {
    dispatch(clearCurrentOrder());
    navigate('/');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  if (!currentOrder) {
    return null;
  }

  return (
    <div className="payment-success-page">
      <div className="container">
        <div className="success-content">
          {/* Success Header */}
          <div className="success-header">
            <div className="success-icon">
              <CheckCircle size={64} />
            </div>
            <h1>Payment Successful!</h1>
            <p>Thank you for your order. Your payment has been processed successfully.</p>
          </div>

          {/* Order Details */}
          <div className="order-details">
            <div className="order-info">
              <h2>Order Information</h2>
              <div className="info-grid">
                <div className="info-item">
                  <span className="label">Order ID:</span>
                  <span className="value">#{currentOrder.orderId}</span>
                </div>
                <div className="info-item">
                  <span className="label">Transaction ID:</span>
                  <span className="value">{currentOrder.paymentInfo?.transactionId}</span>
                </div>
                <div className="info-item">
                  <span className="label">Payment Method:</span>
                  <span className="value">
                    {currentOrder.paymentInfo?.method === 'card' && 'Credit/Debit Card'}
                    {currentOrder.paymentInfo?.method === 'upi' && 'UPI'}
                    {currentOrder.paymentInfo?.method === 'netbanking' && 'Net Banking'}
                    {currentOrder.paymentInfo?.method === 'wallet' && 'Digital Wallet'}
                    {currentOrder.paymentInfo?.method === 'cod' && 'Cash on Delivery'}
                  </span>
                </div>
                <div className="info-item">
                  <span className="label">Total Amount:</span>
                  <span className="value amount">{formatPrice(currentOrder.totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="order-items">
              <h3>Items Ordered</h3>
              <div className="items-list">
                {currentOrder.items.map(item => (
                  <div key={item.cartItemId} className="order-item">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      onError={(e) => {
                        e.target.src = '/assets/placeholder-shoe.jpg';
                      }}
                    />
                    <div className="item-details">
                      <h4>{item.name}</h4>
                      <p>{item.brand}</p>
                      <div className="item-specs">
                        <span>Size: {item.size}</span>
                        <span>Color: {item.color}</span>
                        <span>Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <div className="item-price">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Information */}
            <div className="delivery-info">
              <h3>Delivery Information</h3>
              <div className="delivery-address">
                <div className="address-details">
                  <p className="recipient-name">
                    {currentOrder.customerInfo?.shipping?.firstName} {currentOrder.customerInfo?.shipping?.lastName}
                  </p>
                  <p>{currentOrder.customerInfo?.shipping?.address}</p>
                  <p>
                    {currentOrder.customerInfo?.shipping?.city}, {currentOrder.customerInfo?.shipping?.state} {currentOrder.customerInfo?.shipping?.pincode}
                  </p>
                  <p>{currentOrder.customerInfo?.shipping?.phone}</p>
                </div>
              </div>
              
              <div className="delivery-timeline">
                <div className="timeline-item active">
                  <div className="timeline-icon">
                    <CheckCircle size={20} />
                  </div>
                  <div className="timeline-content">
                    <h4>Order Confirmed</h4>
                    <p>Your order has been placed successfully</p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-icon">
                    <Package size={20} />
                  </div>
                  <div className="timeline-content">
                    <h4>Processing</h4>
                    <p>Your order is being prepared</p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-icon">
                    <Truck size={20} />
                  </div>
                  <div className="timeline-content">
                    <h4>Shipped</h4>
                    <p>Your order is on the way</p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-icon">
                    <Home size={20} />
                  </div>
                  <div className="timeline-content">
                    <h4>Delivered</h4>
                    <p>Order delivered to your address</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="next-steps">
            <h3>What's Next?</h3>
            <div className="steps-grid">
              <div className="step-card">
                <div className="step-icon">
                  <Package size={32} />
                </div>
                <h4>Order Processing</h4>
                <p>We'll start preparing your order within 24 hours</p>
              </div>
              <div className="step-card">
                <div className="step-icon">
                  <Truck size={32} />
                </div>
                <h4>Shipping Updates</h4>
                <p>You'll receive tracking information via email and SMS</p>
              </div>
              <div className="step-card">
                <div className="step-icon">
                  <Home size={32} />
                </div>
                <h4>Delivery</h4>
                <p>Your order will be delivered within 5-7 business days</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button className="btn primary" onClick={handleContinueShopping}>
              <ShoppingBag size={20} />
              Continue Shopping
            </button>
            <button className="btn secondary" onClick={handleGoHome}>
              <Home size={20} />
              Go to Home
            </button>
          </div>

          {/* Support Info */}
          <div className="support-info">
            <h4>Need Help?</h4>
            <p>
              If you have any questions about your order, please contact our customer support team.
            </p>
            <div className="support-contacts">
              <span>📧 support@shopyfi.com</span>
              <span>📞 1800-123-4567</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;