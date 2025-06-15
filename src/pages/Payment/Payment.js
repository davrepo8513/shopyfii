import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  CreditCard, 
  Smartphone, 
  Building, 
  Wallet,
  Shield,
  Lock,

  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { 
  createOrder, 
 
  setPaymentStatus 
} from '../../store/slices/orderSlice';
import { clearCart } from '../../store/slices/cartSlice';
import './Payment.css';

const Payment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { items, totalAmount } = useSelector(state => state.cart);
  const { shippingAddress, billingAddress } = useSelector(state => state.order);
  
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [showCardNumber, setShowCardNumber] = useState(false);
  const [showCVV, setShowCVV] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  
  const [cardForm, setCardForm] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardholderName: '',
    saveCard: false
  });
  
  const [upiForm, setUpiForm] = useState({
    upiId: ''
  });
  
  const [netBankingForm, setNetBankingForm] = useState({
    bank: ''
  });

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: <CreditCard size={24} />,
      description: 'Visa, Mastercard, RuPay'
    },
    {
      id: 'upi',
      name: 'UPI',
      icon: <Smartphone size={24} />,
      description: 'Google Pay, PhonePe, Paytm'
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      icon: <Building size={24} />,
      description: 'All major banks'
    },
    {
      id: 'wallet',
      name: 'Digital Wallet',
      icon: <Wallet size={24} />,
      description: 'Paytm, Amazon Pay'
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      icon: <Building size={24} />,
      description: 'Pay when you receive'
    }
  ];

  const banks = [
    'State Bank of India',
    'HDFC Bank',
    'ICICI Bank',
    'Axis Bank',
    'Kotak Mahindra Bank',
    'Punjab National Bank',
    'Bank of Baroda',
    'Canara Bank'
  ];

  useEffect(() => {
    if (items.length === 0) {
      navigate('/products');
    }
  }, [items, navigate]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const handleCardFormChange = (field, value) => {
    if (field === 'cardNumber') {
      value = formatCardNumber(value);
      if (value.replace(/\s/g, '').length > 16) return;
    } else if (field === 'cvv') {
      value = value.replace(/[^0-9]/g, '').slice(0, 4);
    } else if (field === 'expiryMonth') {
      value = value.replace(/[^0-9]/g, '').slice(0, 2);
      if (parseInt(value) > 12) value = '12';
    } else if (field === 'expiryYear') {
      value = value.replace(/[^0-9]/g, '').slice(0, 4);
    }
    
    setCardForm(prev => ({ ...prev, [field]: value }));
  };

  const validateCardForm = () => {
    const { cardNumber, expiryMonth, expiryYear, cvv, cardholderName } = cardForm;
    const cleanCardNumber = cardNumber.replace(/\s/g, '');
    
    if (cleanCardNumber.length < 13 || cleanCardNumber.length > 19) {
      return 'Please enter a valid card number';
    }
    
    if (!expiryMonth || !expiryYear || parseInt(expiryMonth) < 1 || parseInt(expiryMonth) > 12) {
      return 'Please enter a valid expiry date';
    }
    
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const expYear = parseInt(expiryYear);
    const expMonth = parseInt(expiryMonth);
    
    if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
      return 'Card has expired';
    }
    
    if (cvv.length < 3 || cvv.length > 4) {
      return 'Please enter a valid CVV';
    }
    
    if (!cardholderName.trim()) {
      return 'Please enter cardholder name';
    }
    
    return null;
  };

  const validateUPIForm = () => {
    const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
    if (!upiRegex.test(upiForm.upiId)) {
      return 'Please enter a valid UPI ID';
    }
    return null;
  };

  const validateNetBankingForm = () => {
    if (!netBankingForm.bank) {
      return 'Please select a bank';
    }
    return null;
  };

  const validatePaymentForm = () => {
    switch (selectedPaymentMethod) {
      case 'card':
        return validateCardForm();
      case 'upi':
        return validateUPIForm();
      case 'netbanking':
        return validateNetBankingForm();
      case 'wallet':
      case 'cod':
        return null;
      default:
        return 'Please select a payment method';
    }
  };

  const simulatePaymentProcessing = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate payment success/failure (90% success rate)
        if (Math.random() > 0.1) {
          resolve({ success: true, transactionId: 'TXN' + Date.now() });
        } else {
          reject(new Error('Payment failed. Please try again.'));
        }
      }, 3000);
    });
  };

  const handlePayment = async () => {
    const validationError = validatePaymentForm();
    if (validationError) {
      setPaymentError(validationError);
      return;
    }

    setIsProcessing(true);
    setPaymentError('');
    dispatch(setPaymentStatus('processing'));

    try {
      // Simulate payment processing
      const paymentResult = await simulatePaymentProcessing();
      
      // Create order in database
      const orderData = {
        items: items,
        totalAmount: totalAmount,
        customerInfo: {
          shipping: shippingAddress,
          billing: billingAddress
        },
        paymentInfo: {
          method: selectedPaymentMethod,
          transactionId: paymentResult.transactionId,
          status: 'completed'
        }
      };

      await dispatch(createOrder(orderData)).unwrap();
      
      // Clear cart and redirect to success page
      dispatch(clearCart());
      dispatch(setPaymentStatus('success'));
      navigate('/payment-success');
      
    } catch (error) {
      setPaymentError(error.message || 'Payment failed. Please try again.');
      dispatch(setPaymentStatus('failed'));
    } finally {
      setIsProcessing(false);
    }
  };

  const getCardType = (number) => {
    const cleanNumber = number.replace(/\s/g, '');
    if (cleanNumber.startsWith('4')) return 'visa';
    if (cleanNumber.startsWith('5') || cleanNumber.startsWith('2')) return 'mastercard';
    if (cleanNumber.startsWith('6')) return 'rupay';
    return 'card';
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="payment-page">
      <div className="container">
        {/* Header */}
        <div className="payment-header">
          <button className="back-btn" onClick={() => navigate('/checkout')}>
            <ArrowLeft size={20} />
            Back to Checkout
          </button>
          <h1>Payment</h1>
          <div className="security-badge">
            <Shield size={16} />
            <span>Secure Payment</span>
          </div>
        </div>

        <div className="payment-content">
          {/* Payment Methods */}
          <div className="payment-main">
            <div className="payment-methods">
              <h2>Choose Payment Method</h2>
              
              <div className="methods-grid">
                {paymentMethods.map(method => (
                  <label key={method.id} className="payment-method">
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={selectedPaymentMethod === method.id}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    />
                    <div className="method-content">
                      <div className="method-icon">{method.icon}</div>
                      <div className="method-info">
                        <h3>{method.name}</h3>
                        <p>{method.description}</p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Payment Forms */}
            <div className="payment-form">
              {selectedPaymentMethod === 'card' && (
                <div className="card-form">
                  <h3>Card Details</h3>
                  
                  <div className="form-group">
                    <label>Card Number *</label>
                    <div className="card-input-container">
                      <input
                        type={showCardNumber ? 'text' : 'password'}
                        value={cardForm.cardNumber}
                        onChange={(e) => handleCardFormChange('cardNumber', e.target.value)}
                        placeholder="1234 5678 9012 3456"
                        className="card-number-input"
                      />
                      <button
                        type="button"
                        className="toggle-visibility"
                        onClick={() => setShowCardNumber(!showCardNumber)}
                      >
                        {showCardNumber ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <div className={`card-type ${getCardType(cardForm.cardNumber)}`}>
                        <CreditCard size={20} />
                      </div>
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Expiry Month *</label>
                      <input
                        type="text"
                        value={cardForm.expiryMonth}
                        onChange={(e) => handleCardFormChange('expiryMonth', e.target.value)}
                        placeholder="MM"
                        maxLength="2"
                      />
                    </div>
                    <div className="form-group">
                      <label>Expiry Year *</label>
                      <input
                        type="text"
                        value={cardForm.expiryYear}
                        onChange={(e) => handleCardFormChange('expiryYear', e.target.value)}
                        placeholder="YYYY"
                        maxLength="4"
                      />
                    </div>
                    <div className="form-group">
                      <label>CVV *</label>
                      <div className="cvv-input-container">
                        <input
                          type={showCVV ? 'text' : 'password'}
                          value={cardForm.cvv}
                          onChange={(e) => handleCardFormChange('cvv', e.target.value)}
                          placeholder="123"
                          maxLength="4"
                        />
                        <button
                          type="button"
                          className="toggle-visibility"
                          onClick={() => setShowCVV(!showCVV)}
                        >
                          {showCVV ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Cardholder Name *</label>
                    <input
                      type="text"
                      value={cardForm.cardholderName}
                      onChange={(e) => handleCardFormChange('cardholderName', e.target.value)}
                      placeholder="Name as on card"
                    />
                  </div>
                  
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={cardForm.saveCard}
                      onChange={(e) => handleCardFormChange('saveCard', e.target.checked)}
                    />
                    <span>Save card for future payments</span>
                  </label>
                </div>
              )}

              {selectedPaymentMethod === 'upi' && (
                <div className="upi-form">
                  <h3>UPI Payment</h3>
                  <div className="form-group">
                    <label>UPI ID *</label>
                    <input
                      type="text"
                      value={upiForm.upiId}
                      onChange={(e) => setUpiForm({ upiId: e.target.value })}
                      placeholder="yourname@paytm"
                    />
                  </div>
                  <div className="upi-apps">
                    <p>Popular UPI Apps:</p>
                    <div className="app-icons">
                      <div className="app-icon">GPay</div>
                      <div className="app-icon">PhonePe</div>
                      <div className="app-icon">Paytm</div>
                      <div className="app-icon">BHIM</div>
                    </div>
                  </div>
                </div>
              )}

              {selectedPaymentMethod === 'netbanking' && (
                <div className="netbanking-form">
                  <h3>Net Banking</h3>
                  <div className="form-group">
                    <label>Select Bank *</label>
                    <select
                      value={netBankingForm.bank}
                      onChange={(e) => setNetBankingForm({ bank: e.target.value })}
                    >
                      <option value="">Choose your bank</option>
                      {banks.map(bank => (
                        <option key={bank} value={bank}>{bank}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {selectedPaymentMethod === 'wallet' && (
                <div className="wallet-form">
                  <h3>Digital Wallet</h3>
                  <p>You will be redirected to your wallet app to complete the payment.</p>
                  <div className="wallet-options">
                    <div className="wallet-option">Paytm Wallet</div>
                    <div className="wallet-option">Amazon Pay</div>
                    <div className="wallet-option">Mobikwik</div>
                  </div>
                </div>
              )}

              {selectedPaymentMethod === 'cod' && (
                <div className="cod-form">
                  <h3>Cash on Delivery</h3>
                  <div className="cod-info">
                    <p>Pay when your order is delivered to your doorstep.</p>
                    <ul>
                      <li>Cash payment only</li>
                      <li>Exact change preferred</li>
                      <li>Additional ₹50 COD charges may apply</li>
                    </ul>
                  </div>
                </div>
              )}

              {paymentError && (
                <div className="payment-error">
                  <AlertCircle size={16} />
                  <span>{paymentError}</span>
                </div>
              )}

              <div className="security-info">
                <Lock size={16} />
                <span>Your payment information is encrypted and secure</span>
              </div>

              <button 
                className="pay-button"
                onClick={handlePayment}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <div className="spinner"></div>
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <Shield size={20} />
                    Pay {formatPrice(totalAmount)}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="payment-summary">
            <h3>Order Summary</h3>
            
            <div className="summary-items">
              {items.slice(0, 3).map(item => (
                <div key={item.cartItemId} className="summary-item">
                  <img src={item.image} alt={item.name} />
                  <div className="item-info">
                    <h4>{item.name}</h4>
                    <p>Size: {item.size} | Qty: {item.quantity}</p>
                  </div>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
              {items.length > 3 && (
                <div className="more-items">
                  +{items.length - 3} more items
                </div>
              )}
            </div>
            
            <div className="summary-total">
              <div className="total-row">
                <span>Subtotal</span>
                <span>{formatPrice(totalAmount)}</span>
              </div>
              <div className="total-row">
                <span>Shipping</span>
                <span>FREE</span>
              </div>
              {selectedPaymentMethod === 'cod' && (
                <div className="total-row">
                  <span>COD Charges</span>
                  <span>{formatPrice(50)}</span>
                </div>
              )}
              <div className="total-row final">
                <span>Total</span>
                <span>{formatPrice(totalAmount + (selectedPaymentMethod === 'cod' ? 50 : 0))}</span>
              </div>
            </div>

            <div className="delivery-info">
              <h4>Delivery Address</h4>
              <div className="address">
                <p>{shippingAddress?.firstName} {shippingAddress?.lastName}</p>
                <p>{shippingAddress?.address}</p>
                <p>{shippingAddress?.city}, {shippingAddress?.state} {shippingAddress?.pincode}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;