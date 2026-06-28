import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../utils/axios';
import ProductCard from '../../components/ProductCard/ProductCard';
import './Home.css';

const CATEGORIES_ICONS = {
  vegetables: '🥦', fruits: '🍎', dairy: '🥛', bakery: '🍞',
  meat: '🥩', beverages: '🧃', snacks: '🍿', grains: '🌾',
};

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([api.get('/products/featured'), api.get('/categories')])
      .then(([pRes, cRes]) => {
        setFeatured(pRes.data);
        setCategories(cRes.data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <span className="hero-tag">🌿 100% Fresh & Organic</span>
          <h1 className="hero-title">Fresh Groceries<br /><span>Delivered to You</span></h1>
          <p className="hero-subtitle">Shop from 500+ products. Free delivery above ₹499. Same day delivery available.</p>
          <div className="hero-actions">
            <Link to="/products" className="btn btn-primary btn-lg">Shop Now →</Link>
            <Link to="/products?featured=true" className="btn btn-outline btn-lg">View Deals</Link>
          </div>
          <div className="hero-stats">
            <div><strong>10K+</strong><span>Products</span></div>
            <div><strong>50K+</strong><span>Customers</span></div>
            <div><strong>4.8★</strong><span>Rating</span></div>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-img-placeholder">
            <span>🥦</span><span>🍎</span><span>🥕</span>
            <span>🍊</span><span>🥛</span><span>🧅</span>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="benefits">
        <div className="container">
          <div className="benefits-grid">
            {[
              { icon: '🚚', title: 'Free Delivery', desc: 'On orders above ₹499' },
              { icon: '🌿', title: '100% Fresh', desc: 'Farm to doorstep' },
              { icon: '🔄', title: 'Easy Returns', desc: '7-day return policy' },
              { icon: '🔒', title: 'Secure Payment', desc: 'Razorpay & Stripe' },
            ].map((b, i) => (
              <div className="benefit-item" key={i}>
                <span className="benefit-icon">{b.icon}</span>
                <div>
                  <strong>{b.title}</strong>
                  <p>{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="section container">
          <div className="section-header">
            <h2 className="section-title">Shop by Category</h2>
            <Link to="/products" className="see-all">See all →</Link>
          </div>
          <div className="categories-grid">
            {categories.slice(0, 8).map(cat => (
              <button
                key={cat._id}
                className="category-card"
                onClick={() => navigate(`/products?category=${cat._id}`)}
              >
                <span className="cat-icon">
                  {cat.image ? <img src={cat.image} alt={cat.name} /> : (CATEGORIES_ICONS[cat.slug] || '🛒')}
                </span>
                <span className="cat-name">{cat.name}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="section container">
        <div className="section-header">
          <h2 className="section-title">⭐ Featured Products</h2>
          <Link to="/products" className="see-all">View all →</Link>
        </div>
        {loading ? (
          <div className="spinner" />
        ) : (
          <div className="products-grid">
            {featured.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </section>

      {/* Promo Banner */}
      <section className="promo-banner container">
        <div className="promo-content">
          <h2>Get 20% off your first order!</h2>
          <p>Use code <strong>FRESH20</strong> at checkout. Valid for new customers.</p>
          <Link to="/register" className="btn btn-accent btn-lg">Get Started →</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
