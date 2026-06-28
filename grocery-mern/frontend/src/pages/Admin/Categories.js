
import { useState, useEffect } from 'react';
import api from '../../utils/axios';
import AdminLayout from '../../components/AdminLayout';
import toast from 'react-hot-toast';

const EMPTY = { name: '', description: '', image: '' };

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imgTab, setImgTab] = useState('url');

  const fetchCats = () => {
    setLoading(true);
    api.get('/categories').then(r => setCategories(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchCats(); }, []);

  const openAdd = () => { setEditing(null); setForm(EMPTY); setImgTab('url'); setShowModal(true); };
  const openEdit = (c) => {
    setEditing(c._id);
    setForm({ name: c.name, description: c.description || '', image: c.image || '' });
    setImgTab('url');
    setShowModal(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const { data } = await api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setForm(f => ({ ...f, image: data.url }));
      toast.success('Image uploaded!');
    } catch {
      toast.error('Upload failed - Use Image URL instead.');
    } finally { setUploading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) await api.put(`/categories/${editing}`, form);
      else await api.post('/categories', form);
      toast.success(editing ? 'Category updated!' : 'Category created!');
      setShowModal(false);
      fetchCats();
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try { await api.delete(`/categories/${id}`); toast.success('Deleted'); fetchCats(); }
    catch { toast.error('Delete failed'); }
  };

  const SAMPLE_IMAGES = [
    { label: 'Vegetables', url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400' },
    { label: 'Fruits', url: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400' },
    { label: 'Dairy', url: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400' },
    { label: 'Bakery', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400' },
    { label: 'Beverages', url: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400' },
    { label: 'Snacks', url: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400' },
    { label: 'Grains', url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400' },
    { label: 'Meat', url: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400' },
  ];

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-page-header">
          <h1 className="page-title">Categories</h1>
          <button className="btn btn-primary" onClick={openAdd}>+ Add Category</button>
        </div>

        {loading ? <div className="spinner" /> : (
          <div className="categories-admin-grid">
            {categories.map(cat => (
              <div key={cat._id} className="cat-admin-card">
                <div className="cat-admin-img">
                  {cat.image ? <img src={cat.image} alt={cat.name} onError={e => { e.target.style.display='none'; }} /> : null}
                  <span style={{ display: cat.image ? 'none' : 'flex', fontSize: 28, alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>🏷️</span>
                </div>
                <div className="cat-admin-info">
                  <strong>{cat.name}</strong>
                  <p>{cat.description || 'No description'}</p>
                  <span className="text-muted" style={{ fontSize: 12 }}>/{cat.slug}</span>
                </div>
                <div className="cat-admin-actions">
                  <button className="btn btn-outline btn-sm" onClick={() => openEdit(cat)}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(cat._id)}>Delete</button>
                </div>
              </div>
            ))}
            <button className="cat-add-card" onClick={openAdd}>
              <span style={{ fontSize: 32 }}>+</span>
              <span>Add Category</span>
            </button>
          </div>
        )}

        {showModal && (
          <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
            <div className="modal" style={{ maxWidth: 520 }}>
              <div className="modal-header">
                <h2>{editing ? 'Edit Category' : 'New Category'}</h2>
                <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
              </div>
              <form onSubmit={handleSubmit} className="modal-body">
                <div className="form-group">
                  <label className="form-label">Category Name *</label>
                  <input className="form-input" required value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Vegetables" />
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-input" rows={2} value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Short description..." />
                </div>

                <div className="form-group">
                  <label className="form-label">Category Image</label>

                  <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                    <button type="button" onClick={() => setImgTab('url')}
                      style={{ padding: '6px 16px', borderRadius: 6, border: '1.5px solid var(--primary)', fontSize: 13, cursor: 'pointer', fontWeight: 600, background: imgTab === 'url' ? 'var(--primary)' : 'white', color: imgTab === 'url' ? 'white' : 'var(--primary)' }}>
                      🔗 Paste URL
                    </button>
                    <button type="button" onClick={() => setImgTab('upload')}
                      style={{ padding: '6px 16px', borderRadius: 6, border: '1.5px solid var(--primary)', fontSize: 13, cursor: 'pointer', fontWeight: 600, background: imgTab === 'upload' ? 'var(--primary)' : 'white', color: imgTab === 'upload' ? 'white' : 'var(--primary)' }}>
                      📁 Upload File
                    </button>
                  </div>

                  {imgTab === 'url' && (
                    <div>
                      <input className="form-input" placeholder="https://images.unsplash.com/..."
                        value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} />
                      <div style={{ marginTop: 12 }}>
                        <p style={{ fontSize: 12, color: 'var(--gray-400)', marginBottom: 8 }}>⚡ Quick Pick:</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                          {SAMPLE_IMAGES.map(s => (
                            <button key={s.label} type="button" onClick={() => setForm(f => ({ ...f, image: s.url }))}
                              style={{ padding: '4px 12px', fontSize: 12, borderRadius: 20, border: '1.5px solid var(--gray-200)', cursor: 'pointer', background: form.image === s.url ? 'var(--primary)' : 'white', color: form.image === s.url ? 'white' : 'var(--gray-600)', fontWeight: 500 }}>
                              {s.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {imgTab === 'upload' && (
                    <div>
                      <label className="upload-btn" style={{ width: '100%', height: 80, fontSize: 14 }}>
                        {uploading ? '⏳ Uploading...' : '📁 Click to Upload Image'}
                        <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} disabled={uploading} />
                      </label>
                      <p style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 6 }}>⚠️ Cloudinary setup தேவை</p>
                    </div>
                  )}

                  {form.image && (
                    <div style={{ marginTop: 12, position: 'relative', display: 'inline-block' }}>
                      <img src={form.image} alt="Preview"
                        style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 10, border: '2px solid var(--primary)' }} />
                      <button type="button" onClick={() => setForm(f => ({ ...f, image: '' }))}
                        style={{ position: 'absolute', top: -8, right: -8, width: 22, height: 22, border: 'none', borderRadius: '50%', background: 'red', color: 'white', cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                    </div>
                  )}
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? 'Saving...' : editing ? 'Update Category' : 'Create Category'}
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

export default AdminCategories;
