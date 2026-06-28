import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../utils/axios';
import ProductCard from '../../components/ProductCard/ProductCard';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const keyword  = searchParams.get('keyword')  || '';
  const category = searchParams.get('category') || '';
  const sort     = searchParams.get('sort')     || '';
  const page     = parseInt(searchParams.get('page') || '1');
  const limit    = 12;

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit };
      if (keyword)  params.keyword  = keyword;
      if (category) params.category = category;
      if (sort)     params.sort     = sort;
      const { data } = await api.get('/products', { params });
      setProducts(data.products);
      setTotal(data.total);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [keyword, category, sort, page]);

  useEffect(() => {
    api.get('/categories').then(r => setCategories(r.data));
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const setCategory = (catId) => {
    const p = new URLSearchParams();
    if (catId)   p.set('category', catId);
    if (keyword) p.set('keyword', keyword);
    if (sort)    p.set('sort', sort);
    setSearchParams(p);
  };

  const setSort = (sortVal) => {
    const p = new URLSearchParams();
    if (category) p.set('category', category);
    if (keyword)  p.set('keyword', keyword);
    if (sortVal)  p.set('sort', sortVal);
    setSearchParams(p);
  };

  const pages = Math.ceil(total / limit);

  return (
    <div className="products-page container">
      <div className="products-layout">
        <aside className="filters-sidebar">
          <div className="filter-section">
            <h3 className="filter-title">Categories</h3>
            <button
              className={`filter-item ${!category ? 'active' : ''}`}
              onClick={() => setCategory('')}
            >
              All Categories
            </button>
            {categories.map(c => (
              <button
                key={c._id}
                className={`filter-item ${category === c._id ? 'active' : ''}`}
                onClick={() => setCategory(c._id)}
              >
                {c.name}
              </button>
            ))}
          </div>

          <div className="filter-section">
            <h3 className="filter-title">Sort By</h3>
            {[
              { value: '',           label: 'Newest First' },
              { value: 'price_asc',  label: 'Price: Low to High' },
              { value: 'price_desc', label: 'Price: High to Low' },
              { value: 'rating',     label: 'Top Rated' },
            ].map(opt => (
              <button
                key={opt.value}
                className={`filter-item ${sort === opt.value ? 'active' : ''}`}
                onClick={() => setSort(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </aside>

        <div className="products-main">
          <div className="products-header">
            <div>
              <h1 className="page-title">
                {keyword ? `Results for "${keyword}"` : 'All Products'}
              </h1>
              <p className="text-muted">{total} products found</p>
            </div>
          </div>

          {loading ? (
            <div className="spinner" />
          ) : products.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: 60 }}>🔍</div>
              <h3>No products found</h3>
              <p>Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <div className="products-grid-main">
              {products.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          )}

          {pages > 1 && (
            <div className="pagination">
              {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  className={`page-btn ${page === p ? 'active' : ''}`}
                  onClick={() => {
                    const sp = new URLSearchParams();
                    if (category) sp.set('category', category);
                    if (keyword)  sp.set('keyword', keyword);
                    if (sort)     sp.set('sort', sort);
                    sp.set('page', String(p));
                    setSearchParams(sp);
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;