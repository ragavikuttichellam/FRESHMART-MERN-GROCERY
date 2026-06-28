import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/axios';
import toast from 'react-hot-toast';
import './Checkout.css';

const Checkout = () => {
  const { cartItems, itemsPrice, shippingPrice, taxPrice, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1=Address, 2=Payment
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [address, setAddress] = useState({
    name: user?.name || '', phone: '', street: '', city: '', state: '', pincode: ''
  });

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (!address.name || !address.phone || !address.street || !address.city || !address.pincode)
      return toast.error('Please fill all address fields');
    setStep(2);
  };

  const placeOrder = async (paymentResult = null) => {
    setLoading(true);
    try {
      const orderData = {
        items: cartItems.map(i => ({
          product: i._id, name: i.name,
          image: i.images?.[0] || '',
          price: i.discountPrice || i.price,
          quantity: i.quantity
        })),
        shippingAddress: address,
        paymentMethod,
        itemsPrice, shippingPrice, taxPrice, totalPrice,
        ...(paymentResult && { paymentResult, isPaid: true })
      };
      const { data } = await api.post('/orders', orderData);
      if (paymentResult) await api.put(`/orders/${data._id}/pay`, paymentResult);
      clearCart();
      toast.success('Order placed successfully! 🎉');
      navigate(`/orders/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally { setLoading(false); }
  };

  const handleRazorpay = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/payment/razorpay/create', { amount: totalPrice });
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'FreshMart',
        description: 'Grocery Order',
        order_id: data.orderId,
        handler: async (response) => {
          try {
            await api.post('/payment/razorpay/verify', response);
            await placeOrder({ id: response.razorpay_payment_id, status: 'paid', update_time: new Date().toISOString() });
          } catch { toast.error('Payment verification failed'); }
        },
        prefill: { name: user?.name, email: user?.email, contact: address.phone },
        theme: { color: '#1a7a4a' }
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error('Failed to initiate payment');
    } finally { setLoading(false); }
  };

  const handlePayment = async () => {
    if (paymentMethod === 'cod') await placeOrder();
    else if (paymentMethod === 'razorpay') await handleRazorpay();
    else toast.info('Stripe integration: add @stripe/react-stripe-js');
  };

  return (
    <div className="checkout-page container">
      <h1 className="page-title">Checkout</h1>

      {/* Steps */}
      <div className="checkout-steps">
        {['Shipping Address', 'Payment'].map((s, i) => (
          <div key={i} className={`step ${step === i + 1 ? 'active' : step > i + 1 ? 'done' : ''}`}>
            <div className="step-num">{step > i + 1 ? '✓' : i + 1}</div>
            <span>{s}</span>
          </div>
        ))}
      </div>

      <div className="checkout-layout">
        <div className="checkout-main">
          {/* Step 1: Address */}
          {step === 1 && (
            <div className="checkout-card">
              <h2>Delivery Address</h2>
              <form onSubmit={handleAddressSubmit}>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input className="form-input" value={address.name} onChange={e => setAddress(a => ({ ...a, name: e.target.value }))} required placeholder="John Doe" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone *</label>
                    <input className="form-input" value={address.phone} onChange={e => setAddress(a => ({ ...a, phone: e.target.value }))} required placeholder="+91 98765 43210" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Street Address *</label>
                  <input className="form-input" value={address.street} onChange={e => setAddress(a => ({ ...a, street: e.target.value }))} required placeholder="House No, Street, Area" />
                </div>
                <div className="grid-3">
                  <div className="form-group">
                    <label className="form-label">City *</label>
                    <input className="form-input" value={address.city} onChange={e => setAddress(a => ({ ...a, city: e.target.value }))} required placeholder="Chennai" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">State</label>
                    <input className="form-input" value={address.state} onChange={e => setAddress(a => ({ ...a, state: e.target.value }))} placeholder="Tamil Nadu" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Pincode *</label>
                    <input className="form-input" value={address.pincode} onChange={e => setAddress(a => ({ ...a, pincode: e.target.value }))} required placeholder="600001" />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary btn-lg">Continue to Payment →</button>
              </form>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="checkout-card">
              <h2>Payment Method</h2>
              <div className="payment-options">
                {[
                  { value: 'razorpay', label: 'Razorpay', icon: '💳', desc: 'UPI, Cards, Net Banking' },
                  { value: 'stripe', label: 'Stripe', icon: '🌐', desc: 'International Cards' },
                  { value: 'cod', label: 'Cash on Delivery', icon: '💵', desc: 'Pay when delivered' },
                ].map(opt => (
                  <label key={opt.value} className={`payment-option ${paymentMethod === opt.value ? 'selected' : ''}`}>
                    <input type="radio" name="payment" value={opt.value} checked={paymentMethod === opt.value} onChange={() => setPaymentMethod(opt.value)} />
                    <span className="pay-icon">{opt.icon}</span>
                    <div>
                      <strong>{opt.label}</strong>
                      <p>{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>

              {paymentMethod === 'razorpay' && (
                <div className="payment-note">
                  📌 You'll be redirected to Razorpay's secure payment page. Add <code>https://checkout.razorpay.com/v1/checkout.js</code> to your index.html.
                </div>
              )}

              <div className="checkout-btns">
                <button className="btn btn-outline" onClick={() => setStep(1)}>← Back</button>
                <button className="btn btn-primary btn-lg" onClick={handlePayment} disabled={loading}>
                  {loading ? 'Processing...' : `Place Order • ₹${totalPrice.toFixed(2)}`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="checkout-summary">
          <h2>Order Summary</h2>
          <div className="summary-items">
            {cartItems.map(item => (
              <div key={item._id} className="summary-item">
                <span className="summary-item-qty">{item.quantity}×</span>
                <span className="summary-item-name">{item.name}</span>
                <span className="summary-item-price">₹{((item.discountPrice || item.price) * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <hr />
          <div className="summary-row"><span>Subtotal</span><span>₹{itemsPrice.toFixed(2)}</span></div>
          <div className="summary-row"><span>Shipping</span><span>{shippingPrice === 0 ? <span className="text-primary">FREE</span> : `₹${shippingPrice}`}</span></div>
          <div className="summary-row"><span>Tax (5%)</span><span>₹{taxPrice.toFixed(2)}</span></div>
          <hr />
          <div className="summary-total"><strong>Total</strong><strong>₹{totalPrice.toFixed(2)}</strong></div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
