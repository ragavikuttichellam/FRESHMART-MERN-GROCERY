import { useState, useEffect } from 'react';
import api from '../../utils/axios';
import AdminLayout from '../../components/AdminLayout';
import toast from 'react-hot-toast';

const EMPTY = { name: '', description: '', price: '', discountPrice: '', category: '', unit: 'kg', stock: '', brand: '', isFeatured: false, images: [] };

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [imgUrl, setImgUrl] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/products', { params: { page, limit: 10, keyword: search || undefined } });
      setProducts(data.products);
      setTotal(data.total);
    } finally { setLoading(false); }
  };

  useEffect(() => { api.get('/categories').then(r => setCategories(r.data)); }, []);
  useEffect(() => { fetchProducts(); }, [page, search]);

  const openAdd = () => { setEditing(null); setForm(EMPTY); setImgUrl(''); setShowModal(true); };
  const openEdit = (p) => {
    setEditing(p._id);
    setForm({ ...p, category: p.category?._id || p.category, discountPrice: p.discountPrice || '', images: p.images || [] });
    setImgUrl('');
    setShowModal(true);
  };

  const addImageUrl = () => {
    if (!imgUrl.trim()) return toast.error('URL enter பண்ணுங்க');
    if (!imgUrl.startsWith('http')) return toast.error('Valid URL போடுங்க');
    setForm(f => ({ ...f, images: [...f.images, imgUrl.trim()] }));
    setImgUrl('');
    toast.success('Image added!');
  };

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const { data } = await api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setForm(f => ({ ...f, images: [...f.images, data.url] }));
      toast.success('Image uploaded!');
    } catch { toast.error('Upload failed - URL option use பண்ணுங்க'); }
    finally { setUploading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, price: Number(form.price), discountPrice: Number(form.discountPrice) || 0, stock: Number(form.stock) };
      if (editing) await api.put(`/products/${editing}`, payload);
      else await api.post('/products', payload);
      toast.success(editing ? 'Product updated!' : 'Product created!');
      setShowModal(false);
      fetchProducts();
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try { await api.delete(`/products/${id}`); toast.success('Deleted'); fetchProducts(); }
    catch { toast.error('Delete failed'); }
  };

  const f = (k) => ({ value: form[k], onChange: e => setForm(p => ({ ...p, [k]: e.target.value })) });
  const pages = Math.ceil(total / 10);

  const QUICK_IMAGES = [
    { label: '🍅 Tomato', url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500' },
    { label: '🧅 Onion', url: 'https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=500' },
    { label: '🥬 Spinach', url: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500' },
    { label: '🥕 Carrot', url: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500' },
    { label: '🫑 Capsicum', url: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=500' },
    { label: '🥭 Mango', url: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=500' },
    { label: '🍌 Banana', url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500' },
    { label: '🍉 Watermelon', url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500' },
    { label: '🍎 Apple', url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500' },
    { label: '🍇 Grapes', url: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=500' },
    { label: '🥛 Milk', url: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500' },
    { label: '🧀 Paneer', url: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500' },
    { label: '🫙 Curd', url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500' },
    { label: '🧈 Butter', url: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500' },
    { label: '🌾 Rice', url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500' },
    { label: '🫘 Dal', url: 'https://images.unsplash.com/photo-1585996953721-8f3f6fcd2a30?w=500' },
    { label: '🌾 Atta', url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500' },
    { label: '🍊 Juice', url: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=500' },
    { label: '🥥 Coconut', url: 'https://images.unsplash.com/photo-1550461716-dbf266b2a8a7?w=500' },
    { label: '🍞 Bread', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500' },
    { label: '🥚 Eggs', url: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=500' },
    { label: '🍗 Chicken', url: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500' },
    { label: '🍟 Chips', url: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500' },
  ];

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-page-header">
          <h1 className="page-title">Products</h1>
          <button className="btn btn-primary" onClick={openAdd}>+ Add Product</button>
        </div>

        <div className="admin-toolbar">
          <input className="form-input" placeholder="Search products..." value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }} style={{ maxWidth: 280 }} />
          <span className="text-muted">{total} products</span>
        </div>

        {loading ? <div className="spinner" /> : (
          <div className="card">
            <table className="admin-table">
              <thead>
                <tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Featured</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p._id}>
                    <td><div className="product-thumb">{p.images?.[0] ? <img src={p.images[0]} alt={p.name} /> : '🛒'}</div></td>
                    <td><strong>{p.name}</strong></td>
                    <td><span className="badge badge-gray">{p.category?.name || '—'}</span></td>
                    <td>{p.discountPrice > 0 ? <><span style={{ color: 'var(--primary)', fontWeight: 700 }}>₹{p.discountPrice}</span> <s style={{ fontSize: 12 }}>₹{p.price}</s></> : `₹${p.price}`}</td>
                    <td><span className={`badge ${p.stock < 5 ? 'badge-red' : p.stock < 20 ? 'badge-yellow' : 'badge-green'}`}>{p.stock}</span></td>
                    <td>{p.isFeatured ? '⭐' : '—'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-outline btn-sm" onClick={() => openEdit(p)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {pages > 1 && (
              <div className="pagination" style={{ padding: 16 }}>
                {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                  <button key={p} className={`page-btn ${page === p ? 'active' : ''}`} onClick={() => setPage(p)}>{p}</button>
                ))}
              </div>
            )}
          </div>
        )}

        {showModal && (
          <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
            <div className="modal">
              <div className="modal-header">
                <h2>{editing ? 'Edit Product' : 'Add New Product'}</h2>
                <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
              </div>
              <form onSubmit={handleSubmit} className="modal-body">
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Name *</label>
                    <input className="form-input" required {...f('name')} placeholder="Product name" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Category *</label>
                    <select className="form-input form-select" required value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                      <option value="">Select category</option>
                      {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Description *</label>
                  <textarea className="form-input" rows={3} required {...f('description')} placeholder="Product description..." />
                </div>

                <div className="grid-3">
                  <div className="form-group">
                    <label className="form-label">Price (₹) *</label>
                    <input className="form-input" type="number" required min="0" {...f('price')} placeholder="100" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Discount Price (₹)</label>
                    <input className="form-input" type="number" min="0" {...f('discountPrice')} placeholder="80" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Stock *</label>
                    <input className="form-input" type="number" required min="0" {...f('stock')} placeholder="100" />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Unit</label>
                    <select className="form-input form-select" value={form.unit} onChange={e => setForm(p => ({ ...p, unit: e.target.value }))}>
                      {['kg','g','litre','ml','piece','pack','dozen','bundle','500g','100g','5kg','400g','500ml'].map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Brand</label>
                    <input className="form-input" {...f('brand')} placeholder="Brand name" />
                  </div>
                </div>

                {/* ── IMAGE SECTION ── */}
                <div className="form-group">
                  <label className="form-label">Product Images</label>

                  {/* Preview added images */}
                  {form.images.length > 0 && (
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
                      {form.images.map((img, i) => (
                        <div key={i} style={{ position: 'relative' }}>
                          <img src={img} alt="" style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 8, border: '2px solid var(--primary)' }} />
                          <button type="button"
                            onClick={() => setForm(f => ({ ...f, images: f.images.filter((_, j) => j !== i) }))}
                            style={{ position: 'absolute', top: -6, right: -6, width: 20, height: 20, border: 'none', borderRadius: '50%', background: 'red', color: 'white', cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* URL paste option */}
                  <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                    <input
                      className="form-input"
                      placeholder="🔗 Image URL paste பண்ணுங்க (https://...)"
                      value={imgUrl}
                      onChange={e => setImgUrl(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addImageUrl())}
                    />
                    <button type="button" className="btn btn-primary btn-sm" onClick={addImageUrl}>+ Add</button>
                  </div>

                  {/* Quick Pick */}
                  <div style={{ marginBottom: 12 }}>
                    <p style={{ fontSize: 12, color: 'var(--gray-400)', marginBottom: 6 }}>⚡ Quick Pick — click பண்ணினாலே add ஆகும்:</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {QUICK_IMAGES.map(s => (
                        <button key={s.label} type="button"
                          onClick={() => { setForm(f => ({ ...f, images: [...f.images, s.url] })); toast.success('Added!'); }}
                          style={{ padding: '3px 10px', fontSize: 12, borderRadius: 20, border: '1.5px solid var(--gray-200)', cursor: 'pointer', background: 'white', color: 'var(--gray-700)' }}>
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* File upload (Cloudinary) */}
                  <div className="image-upload-area">
                    <label className="upload-btn">
                      {uploading ? '⏳' : '📁 Upload'}
                      <input type="file" accept="image/*" onChange={handleImage} style={{ display: 'none' }} />
                    </label>
                    <span style={{ fontSize: 12, color: 'var(--gray-400)', alignSelf: 'center' }}>← Cloudinary setup தேவை</span>
                  </div>
                </div>

                <div className="form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                    <input type="checkbox" checked={form.isFeatured}
                      onChange={e => setForm(p => ({ ...p, isFeatured: e.target.checked }))}
                      style={{ width: 18, height: 18 }} />
                    <span className="form-label" style={{ margin: 0 }}>⭐ Featured product (shown on homepage)</span>
                  </label>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? 'Saving...' : editing ? 'Update Product' : 'Create Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminProducts;