import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="footer-inner">
      <div className="footer-brand">
        <span className="footer-logo">🛒 FreshMart</span>
        <p>Your daily grocery destination. Fresh produce, great prices, delivered to your door.</p>
      </div>
      <div className="footer-links">
        <h4>Shop</h4>
        <Link to="/products">All Products</Link>
        <Link to="/products?category=vegetables">Vegetables</Link>
        <Link to="/products?category=fruits">Fruits</Link>
        <Link to="/products?category=dairy">Dairy</Link>
      </div>
      <div className="footer-links">
        <h4>Account</h4>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
        <Link to="/orders">My Orders</Link>
        <Link to="/cart">Cart</Link>
      </div>
      <div className="footer-links">
        <h4>Help</h4>
        <a href="#!">Contact Us</a>
        <a href="#!">FAQs</a>
        <a href="#!">Return Policy</a>
        <a href="#!">Privacy Policy</a>
      </div>
    </div>
    <div className="footer-bottom">
      <p>© {new Date().getFullYear()} FreshMart. All rights reserved.</p>
      <p>🔒 Secure payments via Razorpay & Stripe</p>
    </div>
  </footer>
);

export default Footer;
