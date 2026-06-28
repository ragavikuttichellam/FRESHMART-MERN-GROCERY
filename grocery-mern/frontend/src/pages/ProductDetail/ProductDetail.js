import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../utils/axios';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(r => setProduct(r.data))
      .catch(() => toast.error('Product not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, qty);
  };

  const handleReview = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post(`/products/${id}/reviews`, review);
      toast.success('Review submitted!');
      const r = await api.get(`/products/${id}`);
      setProduct(r.data);
      setReview({ rating: 5, comment: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally { setSubmitting(false); }
  };

  if (loading) return <div className="spinner" />;
  if (!product) return <div className="container" style={{ padding: 40 }}>Product not found.</div>;

  const discount = product.discountPrice > 0 ? Math.round((1 - product.discountPrice / product.price) * 100) : 0;

  return (
    <div className="product-detail container">
      <div className="detail-layout">
        {/* Images */}
        <div className="detail-images">
          <div className="main-image">
            {product.images?.[activeImg] ? (
              <img src={product.images[activeImg]} alt={product.name} />
            ) : (
              <div className="img-placeholder">🛒</div>
            )}
            {discount > 0 && <span className="detail-badge">-{discount}%</span>}
          </div>
          {product.images?.length > 1 && (
            <div className="image-thumbs">
              {product.images.map((img, i) => (
                <img key={i} src={img} alt="" className={`thumb ${activeImg === i ? 'active' : ''}`} onClick={() => setActiveImg(i)} />
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="detail-info">
          <span className="detail-category">{product.category?.name}</span>
          <h1 className="detail-name">{product.name}</h1>
          <div className="detail-rating">
            {[1,2,3,4,5].map(s => <span key={s} className={s <= Math.round(product.rating) ? 'star filled' : 'star'}>★</span>)}
            <span className="text-muted ml-1">({product.numReviews} reviews)</span>
          </div>

          <div className="detail-price">
            {discount > 0 ? (
              <>
                <span className="price-big">₹{product.discountPrice}</span>
                <span className="price-strike">₹{product.price}</span>
                <span className="badge badge-red">{discount}% OFF</span>
              </>
            ) : (
              <span className="price-big">₹{product.price}</span>
            )}
          </div>

          <p className="detail-desc">{product.description}</p>

          <div className="detail-meta">
            <div><strong>Unit:</strong> {product.unit}</div>
            {product.brand && <div><strong>Brand:</strong> {product.brand}</div>}
            <div>
              <strong>Availability:</strong>{' '}
              {product.stock > 0
                ? <span className="text-primary">In Stock ({product.stock} available)</span>
                : <span className="text-danger">Out of Stock</span>}
            </div>
          </div>

          {product.stock > 0 && (
            <div className="detail-actions">
              <div className="qty-control">
                <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                <span>{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))}>+</button>
              </div>
              <button className="btn btn-primary btn-lg" onClick={handleAddToCart}>
                🛒 Add to Cart
              </button>
            </div>
          )}

          <div className="detail-perks">
            <span>🚚 Free delivery above ₹499</span>
            <span>🔄 7-day return</span>
            <span>🔒 Secure checkout</span>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="reviews-section">
        <h2 className="section-title">Customer Reviews</h2>

        {product.reviews?.length === 0 && (
          <p className="text-muted">No reviews yet. Be the first to review!</p>
        )}

        <div className="reviews-list">
          {product.reviews?.map((r, i) => (
            <div key={i} className="review-card">
              <div className="review-header">
                <div className="review-avatar">{r.name?.charAt(0).toUpperCase()}</div>
                <div>
                  <strong>{r.name}</strong>
                  <div>{[1,2,3,4,5].map(s => <span key={s} className={s <= r.rating ? 'star filled' : 'star'}>★</span>)}</div>
                </div>
                <span className="text-muted" style={{ marginLeft: 'auto', fontSize: 13 }}>
                  {new Date(r.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="review-comment">{r.comment}</p>
            </div>
          ))}
        </div>

        {user && (
          <form className="review-form" onSubmit={handleReview}>
            <h3>Write a Review</h3>
            <div className="form-group">
              <label className="form-label">Rating</label>
              <select className="form-input form-select" value={review.rating} onChange={e => setReview(r => ({ ...r, rating: Number(e.target.value) }))}>
                {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Stars</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Comment</label>
              <textarea className="form-input" rows={4} value={review.comment} onChange={e => setReview(r => ({ ...r, comment: e.target.value }))} required placeholder="Share your experience..." />
            </div>
            <button className="btn btn-primary" type="submit" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
