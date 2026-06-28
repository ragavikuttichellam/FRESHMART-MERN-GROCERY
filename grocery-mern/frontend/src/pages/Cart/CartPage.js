import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import './CartPage.css';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, itemsPrice, shippingPrice, taxPrice, totalPrice, cartCount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (cartItems.length === 0) return (
    <div className="container" style={{ padding: '60px 20px' }}>
      <div className="empty-state">
        <div style={{ fontSize: 80 }}>🛒</div>
        <h3>Your cart is empty</h3>
        <p>Add some fresh products to get started!</p>
        <Link to="/products" className="btn btn-primary btn-lg">Start Shopping</Link>
      </div>
    </div>
  );

  return (
    <div className="cart-page container">
      <h1 className="page-title">Shopping Cart <span>({cartCount} items)</span></h1>
      <div className="cart-layout">
        {/* Items */}
        <div className="cart-items">
          {cartItems.map(item => (
            <div className="cart-item" key={item._id}>
              <div className="cart-item-img">
                {item.images?.[0] ? (
                  <img src={item.images[0]} alt={item.name} />
                ) : <span>🛒</span>}
              </div>
              <div className="cart-item-info">
                <Link to={`/products/${item._id}`} className="cart-item-name">{item.name}</Link>
                <span className="cart-item-unit">{item.unit}</span>
                <div className="cart-item-price">₹{item.discountPrice || item.price} each</div>
              </div>
              <div className="cart-item-qty">
                <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>−</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
              </div>
              <div className="cart-item-total">
                ₹{((item.discountPrice || item.price) * item.quantity).toFixed(2)}
              </div>
              <button className="cart-remove" onClick={() => removeFromCart(item._id)} title="Remove">
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="cart-summary">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Subtotal ({cartCount} items)</span>
            <span>₹{itemsPrice.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span className={shippingPrice === 0 ? 'text-primary' : ''}>
              {shippingPrice === 0 ? 'FREE' : `₹${shippingPrice}`}
            </span>
          </div>
          <div className="summary-row">
            <span>Tax (5%)</span>
            <span>₹{taxPrice.toFixed(2)}</span>
          </div>
          {itemsPrice < 499 && (
            <div className="free-shipping-note">
              Add ₹{(499 - itemsPrice).toFixed(2)} more for free shipping!
            </div>
          )}
          <hr />
          <div className="summary-total">
            <strong>Total</strong>
            <strong>₹{totalPrice.toFixed(2)}</strong>
          </div>
          <button
            className="btn btn-primary btn-lg btn-block"
            onClick={() => user ? navigate('/checkout') : navigate('/login?redirect=checkout')}
          >
            {user ? 'Proceed to Checkout →' : 'Login to Checkout →'}
          </button>
          <Link to="/products" className="btn btn-outline btn-block" style={{ marginTop: 10 }}>
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
