import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/axios';
import AdminLayout from '../../components/AdminLayout';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/orders', { params: { page, limit: 15, status: filterStatus || undefined } });
      setOrders(data.orders);
      setTotal(data.total);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, [page, filterStatus]);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      toast.success(`Order marked as ${status}`);
      fetchOrders();
    } catch { toast.error('Update failed'); }
  };

  const pages = Math.ceil(total / 15);

  const badgeClass = (s) => ({ pending: 'badge-yellow', processing: 'badge-blue', shipped: 'badge-blue', delivered: 'badge-green', cancelled: 'badge-red' }[s] || 'badge-gray');

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-page-header">
          <h1 className="page-title">Orders</h1>
          <span className="text-muted">{total} total orders</span>
        </div>

        <div className="admin-toolbar">
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button className={`btn btn-sm ${!filterStatus ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilterStatus('')}>All</button>
            {STATUS_OPTIONS.map(s => (
              <button key={s} className={`btn btn-sm ${filterStatus === s ? 'btn-primary' : 'btn-outline'}`} onClick={() => { setFilterStatus(s); setPage(1); }}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {loading ? <div className="spinner" /> : (
          <div className="card">
            <table className="admin-table">
              <thead>
                <tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th><th>Update</th></tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o._id}>
                    <td><Link to={`/orders/${o._id}`} style={{ fontFamily: 'monospace', color: 'var(--primary)', fontWeight: 600 }}>#{o._id.slice(-8).toUpperCase()}</Link></td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{o.user?.name || 'N/A'}</div>
                      <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>{o.user?.email}</div>
                    </td>
                    <td>{o.items?.length} item(s)</td>
                    <td><strong>₹{o.totalPrice?.toFixed(2)}</strong></td>
                    <td>
                      <div style={{ textTransform: 'capitalize', fontSize: 13 }}>{o.paymentMethod}</div>
                      {o.isPaid ? <span className="badge badge-green" style={{ fontSize: 11 }}>Paid</span> : <span className="badge badge-yellow" style={{ fontSize: 11 }}>Unpaid</span>}
                    </td>
                    <td><span className={`badge ${badgeClass(o.orderStatus)}`}>{o.orderStatus}</span></td>
                    <td style={{ fontSize: 13, color: 'var(--gray-400)' }}>{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                    <td>
                      <select
                        className="form-input form-select"
                        style={{ padding: '6px 28px 6px 10px', fontSize: 13, minWidth: 120 }}
                        value={o.orderStatus}
                        onChange={e => updateStatus(o._id, e.target.value)}
                      >
                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                      </select>
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
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
