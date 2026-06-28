import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './ProductCard.css';

const Stars = ({ rating }) => (
  <div className="stars">
    {[1,2,3,4,5].map(s => (
      <span key={s} className={s <= Math.round(rating) ? 'star filled' : 'star'}>★</span>
    ))}
  </div>
);

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const discount = product.discountPrice && product.discountPrice > 0
    ? Math.round((1 - product.discountPrice / product.price) * 100) : 0;

  return (
    <div className="product-card">
      <Link to={`/products/${product._id}`} className="product-img-wrap">
        {discount > 0 && <span className="discount-badge">-{discount}%</span>}
        {product.images?.[0] ? (
          <img src={product.images[0]} alt={product.name} className="product-img" loading="lazy" />
        ) : (
          <div className="product-img-placeholder">🛒</div>
        )}
      </Link>
      <div className="product-info">
        <span className="product-category">{product.category?.name}</span>
        <Link to={`/products/${product._id}`} className="product-name">{product.name}</Link>
        <div className="product-meta">
          <Stars rating={product.rating} />
          <span className="product-reviews">({product.numReviews})</span>
        </div>
        <div className="product-unit">{product.unit}</div>
        <div className="product-footer">
          <div className="product-price">
            {discount > 0 ? (
              <>
                <span className="price-current">₹{product.discountPrice}</span>
                <span className="price-original">₹{product.price}</span>
              </>
            ) : (
              <span className="price-current">₹{product.price}</span>
            )}
          </div>
          {product.stock > 0 ? (
            <button className="add-to-cart-btn" onClick={() => addToCart(product)}>
              + Add
            </button>
          ) : (
            <span className="out-of-stock">Out of stock</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
