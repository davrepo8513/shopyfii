import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  CreditCard, 
  Truck, 
  Shield,
  Edit,
} from 'lucide-react';
import { setShippingAddress, setBillingAddress } from '../../store/slices/orderSlice';
import './Checkout.css';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalAmount } = useSelector(state => state.cart);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState('standard');
  
  const [shippingForm, setShippingForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India'
  });
  
  const [billingForm, setBillingForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India'
  });

  const shippingMethods = [
    {
      id: 'standard',
      name: 'Standard Delivery',
      description: '5-7 business days',
      price: 0,
      icon: <Truck size={20} />
    },
    {
      id: 'express',
      name: 'Express Delivery',
      description: '2-3 business days',
      price: 99,
      icon: <Truck size={20} />
    },
    {
      id: 'overnight',
      name: 'Overnight Delivery',
      description: 'Next business day',
      price: 199,
      icon: <Truck size={20} />
    }
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleShippingFormChange = (field, value) => {
    setShippingForm(prev => ({ ...prev, [field]: value }));
  };

  const handleBillingFormChange = (field, value) => {
    setBillingForm(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return shippingForm.firstName && shippingForm.lastName && 
               shippingForm.email && shippingForm.phone && 
               shippingForm.address && shippingForm.city && 
               shippingForm.state && shippingForm.pincode;
      case 2:
        return selectedShippingMethod;
      case 3:
        return sameAsShipping || (
          billingForm.firstName && billingForm.lastName && 
          billingForm.email && billingForm.phone && 
          billingForm.address && billingForm.city && 
          billingForm.state && billingForm.pincode
        );
      default:
        return false;
    }
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep === 1) {
        dispatch(setShippingAddress(shippingForm));
      } else if (currentStep === 3) {
        dispatch(setBillingAddress(sameAsShipping ? shippingForm : billingForm));
      }
      
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
      } else {
        // Proceed to payment
        navigate('/payment');
      }
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getShippingCost = () => {
    const method = shippingMethods.find(m => m.id === selectedShippingMethod);
    return method ? method.price : 0;
  };

  const getTotalWithShipping = () => {
    return totalAmount + getShippingCost();
  };

  if (items.length === 0) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="empty-checkout">
            <h2>Your cart is empty</h2>
            <p>Add some products to proceed with checkout</p>
            <button 
              className="continue-shopping-btn"
              onClick={() => navigate('/products')}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        {/* Header */}
        <div className="checkout-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
            Back
          </button>
          <h1>Checkout</h1>
        </div>

        {/* Progress Steps */}
        <div className="checkout-progress">
          <div className={`progress-step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
            <div className="step-number">1</div>
            <span>Shipping</span>
          </div>
          <div className={`progress-step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
            <div className="step-number">2</div>
            <span>Delivery</span>
          </div>
          <div className={`progress-step ${currentStep >= 3 ? 'active' : ''} ${currentStep > 3 ? 'completed' : ''}`}>
            <div className="step-number">3</div>
            <span>Billing</span>
          </div>
          <div className={`progress-step ${currentStep >= 4 ? 'active' : ''}`}>
            <div className="step-number">4</div>
            <span>Review</span>
          </div>
        </div>

        <div className="checkout-content">
          {/* Main Content */}
          <div className="checkout-main">
            {/* Step 1: Shipping Address */}
            {currentStep === 1 && (
              <div className="checkout-step">
                <div className="step-header">
                  <MapPin size={24} />
                  <h2>Shipping Address</h2>
                </div>
                
                <form className="address-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>First Name *</label>
                      <input
                        type="text"
                        value={shippingForm.firstName}
                        onChange={(e) => handleShippingFormChange('firstName', e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Last Name *</label>
                      <input
                        type="text"
                        value={shippingForm.lastName}
                        onChange={(e) => handleShippingFormChange('lastName', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Email *</label>
                      <input
                        type="email"
                        value={shippingForm.email}
                        onChange={(e) => handleShippingFormChange('email', e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone *</label>
                      <input
                        type="tel"
                        value={shippingForm.phone}
                        onChange={(e) => handleShippingFormChange('phone', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Address *</label>
                    <input
                      type="text"
                      value={shippingForm.address}
                      onChange={(e) => handleShippingFormChange('address', e.target.value)}
                      placeholder="Street address, apartment, suite, etc."
                      required
                    />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>City *</label>
                      <input
                        type="text"
                        value={shippingForm.city}
                        onChange={(e) => handleShippingFormChange('city', e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>State *</label>
                      <input
                        type="text"
                        value={shippingForm.state}
                        onChange={(e) => handleShippingFormChange('state', e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>PIN Code *</label>
                      <input
                        type="text"
                        value={shippingForm.pincode}
                        onChange={(e) => handleShippingFormChange('pincode', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* Step 2: Shipping Method */}
            {currentStep === 2 && (
              <div className="checkout-step">
                <div className="step-header">
                  <Truck size={24} />
                  <h2>Delivery Method</h2>
                </div>
                
                <div className="shipping-methods">
                  {shippingMethods.map(method => (
                    <label key={method.id} className="shipping-method">
                      <input
                        type="radio"
                        name="shipping"
                        value={method.id}
                        checked={selectedShippingMethod === method.id}
                        onChange={(e) => setSelectedShippingMethod(e.target.value)}
                      />
                      <div className="method-info">
                        <div className="method-header">
                          {method.icon}
                          <span className="method-name">{method.name}</span>
                          <span className="method-price">
                            {method.price === 0 ? 'FREE' : formatPrice(method.price)}
                          </span>
                        </div>
                        <p className="method-description">{method.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Billing Address */}
            {currentStep === 3 && (
              <div className="checkout-step">
                <div className="step-header">
                  <CreditCard size={24} />
                  <h2>Billing Address</h2>
                </div>
                
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={sameAsShipping}
                    onChange={(e) => setSameAsShipping(e.target.checked)}
                  />
                  <span>Same as shipping address</span>
                </label>
                
                {!sameAsShipping && (
                  <form className="address-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label>First Name *</label>
                        <input
                          type="text"
                          value={billingForm.firstName}
                          onChange={(e) => handleBillingFormChange('firstName', e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Last Name *</label>
                        <input
                          type="text"
                          value={billingForm.lastName}
                          onChange={(e) => handleBillingFormChange('lastName', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label>Email *</label>
                        <input
                          type="email"
                          value={billingForm.email}
                          onChange={(e) => handleBillingFormChange('email', e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Phone *</label>
                        <input
                          type="tel"
                          value={billingForm.phone}
                          onChange={(e) => handleBillingFormChange('phone', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label>Address *</label>
                      <input
                        type="text"
                        value={billingForm.address}
                        onChange={(e) => handleBillingFormChange('address', e.target.value)}
                        placeholder="Street address, apartment, suite, etc."
                        required
                      />
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label>City *</label>
                        <input
                          type="text"
                          value={billingForm.city}
                          onChange={(e) => handleBillingFormChange('city', e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>State *</label>
                        <input
                          type="text"
                          value={billingForm.state}
                          onChange={(e) => handleBillingFormChange('state', e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>PIN Code *</label>
                        <input
                          type="text"
                          value={billingForm.pincode}
                          onChange={(e) => handleBillingFormChange('pincode', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Step 4: Review Order */}
            {currentStep === 4 && (
              <div className="checkout-step">
                <div className="step-header">
                  <Shield size={24} />
                  <h2>Review Your Order</h2>
                </div>
                
                <div className="order-review">
                  <div className="review-section">
                    <h3>Shipping Address</h3>
                    <div className="address-display">
                      <p>{shippingForm.firstName} {shippingForm.lastName}</p>
                      <p>{shippingForm.address}</p>
                      <p>{shippingForm.city}, {shippingForm.state} {shippingForm.pincode}</p>
                      <p>{shippingForm.phone}</p>
                    </div>
                    <button className="edit-btn" onClick={() => setCurrentStep(1)}>
                      <Edit size={16} />
                      Edit
                    </button>
                  </div>
                  
                  <div className="review-section">
                    <h3>Delivery Method</h3>
                    <div className="method-display">
                      {shippingMethods.find(m => m.id === selectedShippingMethod) && (
                        <>
                          <p>{shippingMethods.find(m => m.id === selectedShippingMethod).name}</p>
                          <p>{shippingMethods.find(m => m.id === selectedShippingMethod).description}</p>
                        </>
                      )}
                    </div>
                    <button className="edit-btn" onClick={() => setCurrentStep(2)}>
                      <Edit size={16} />
                      Edit
                    </button>
                  </div>
                  
                  <div className="review-section">
                    <h3>Billing Address</h3>
                    <div className="address-display">
                      {sameAsShipping ? (
                        <>
                          <p>{shippingForm.firstName} {shippingForm.lastName}</p>
                          <p>{shippingForm.address}</p>
                          <p>{shippingForm.city}, {shippingForm.state} {shippingForm.pincode}</p>
                          <p>{shippingForm.phone}</p>
                        </>
                      ) : (
                        <>
                          <p>{billingForm.firstName} {billingForm.lastName}</p>
                          <p>{billingForm.address}</p>
                          <p>{billingForm.city}, {billingForm.state} {billingForm.pincode}</p>
                          <p>{billingForm.phone}</p>
                        </>
                      )}
                    </div>
                    <button className="edit-btn" onClick={() => setCurrentStep(3)}>
                      <Edit size={16} />
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="checkout-navigation">
              {currentStep > 1 && (
                <button className="nav-btn secondary" onClick={handlePrevStep}>
                  Previous
                </button>
              )}
              <button 
                className="nav-btn primary"
                onClick={handleNextStep}
                disabled={!validateStep(currentStep)}
              >
                {currentStep === 4 ? 'Proceed to Payment' : 'Continue'}
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="order-summary">
            <h3>Order Summary</h3>
            
            <div className="summary-items">
              {items.map(item => (
                <div key={item.cartItemId} className="summary-item">
                  <img src={item.image} alt={item.name} />
                  <div className="item-details">
                    <h4>{item.name}</h4>
                    <p>Size: {item.size}, Color: {item.color}</p>
                    <p>Qty: {item.quantity}</p>
                  </div>
                  <span className="item-price">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            
            <div className="summary-totals">
              <div className="total-row">
                <span>Subtotal</span>
                <span>{formatPrice(totalAmount)}</span>
              </div>
              <div className="total-row">
                <span>Shipping</span>
                <span>{getShippingCost() === 0 ? 'FREE' : formatPrice(getShippingCost())}</span>
              </div>
              <div className="total-row total">
                <span>Total</span>
                <span>{formatPrice(getTotalWithShipping())}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;