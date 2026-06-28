import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import api from '../../utils/axios';
import AdminLayout from '../../components/AdminLayout';
import './Admin.css';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const StatCard = ({ icon, label, value, color, link }) => (
  <div className="stat-card">
    <div className="stat-icon" style={{ background: color + '20' }}>{icon}</div>
    <div className="stat-value">{value}</div>
    <div className="stat-label">{label}</div>
    {link && <Link to={link} style={{ fontSize: 12, color: 'var(--primary)', marginTop: 8, display: 'block' }}>View all →</Link>}
  </div>
);

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/orders/analytics'),
      api.get('/products', { params: { limit: 5 } }),
      api.get('/users'),
    ]).then(([a, p, u]) => {
      setAnalytics(a.data);
      setProducts(p.data.products);
      setUsers(u.data);
    }).finally(() => setLoading(false));
  }, []);

  const statusCount = (status) => analytics?.ordersByStatus?.find(o => o._id === status)?.count || 0;

  const chartData = analytics?.monthlyRevenue?.map(m => ({
    name: MONTHS[m._id.month - 1],
    revenue: Math.round(m.revenue),
    orders: m.orders,
  })) || [];

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-page-header">
          <h1 className="page-title">Dashboard</h1>
          <span className="text-muted">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>

        {loading ? <div className="spinner" /> : (
          <>
            {/* Stats */}
            <div className="stats-grid">
              <StatCard icon="₹" label="Total Revenue" value={`₹${analytics?.totalRevenue?.toLocaleString('en-IN') || 0}`} color="#1a7a4a" link="/admin/orders" />
              <StatCard icon="📦" label="Total Orders" value={analytics?.totalOrders || 0} color="#3b82f6" link="/admin/orders" />
              <StatCard icon="🥦" label="Total Products" value={products?.length || 0} color="#f59e0b" link="/admin/products" />
              <StatCard icon="👥" label="Total Users" value={users?.length || 0} color="#8b5cf6" link="/admin/users" />
            </div>

            {/* Order Status Summary */}
            <div className="grid-4" style={{ marginBottom: 28 }}>
              {[
                { label: 'Pending', count: statusCount('pending'), cls: 'badge-yellow' },
                { label: 'Processing', count: statusCount('processing'), cls: 'badge-blue' },
                { label: 'Shipped', count: statusCount('shipped'), cls: 'badge-blue' },
                { label: 'Delivered', count: statusCount('delivered'), cls: 'badge-green' },
              ].map(s => (
                <div key={s.label} style={{ background: 'white', borderRadius: 'var(--radius)', padding: 16, boxShadow: 'var(--shadow)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 14, color: 'var(--gray-600)' }}>{s.label}</span>
                  <span className={`badge ${s.cls}`}>{s.count}</span>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid-2" style={{ marginBottom: 28 }}>
              <div style={{ background: 'white', borderRadius: 'var(--radius)', padding: 24, boxShadow: 'var(--shadow)' }}>
                <h3 style={{ marginBottom: 20, fontSize: 15, fontWeight: 700 }}>Monthly Revenue</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(v) => [`₹${v}`, 'Revenue']} />
                    <Line type="monotone" dataKey="revenue" stroke="#1a7a4a" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div style={{ background: 'white', borderRadius: 'var(--radius)', padding: 24, boxShadow: 'var(--shadow)' }}>
                <h3 style={{ marginBottom: 20, fontSize: 15, fontWeight: 700 }}>Monthly Orders</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="orders" fill="#1a7a4a" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Orders */}
            <div style={{ background: 'white', borderRadius: 'var(--radius)', padding: 24, boxShadow: 'var(--shadow)', marginBottom: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700 }}>Recent Orders</h3>
                <Link to="/admin/orders" style={{ fontSize: 13, color: 'var(--primary)' }}>View all →</Link>
              </div>
              <table className="admin-table">
                <thead><tr><th>Order ID</th><th>Customer</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
                <tbody>
                  {analytics?.recentOrders?.map(o => (
                    <tr key={o._id}>
                      <td><Link to={`/orders/${o._id}`} style={{ fontFamily: 'monospace', color: 'var(--primary)' }}>#{o._id.slice(-8).toUpperCase()}</Link></td>
                      <td>{o.user?.name || 'N/A'}</td>
                      <td>₹{o.totalPrice?.toFixed(2)}</td>
                      <td><span className={`badge badge-${o.orderStatus === 'delivered' ? 'green' : o.orderStatus === 'cancelled' ? 'red' : 'yellow'}`}>{o.orderStatus}</span></td>
                      <td style={{ fontSize: 13, color: 'var(--gray-400)' }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Low Stock Alert */}
            {products.filter(p => p.stock < 5).length > 0 && (
              <div style={{ background: '#fef3c7', border: '1px solid #f59e0b', borderRadius: 'var(--radius)', padding: 16 }}>
                <strong>⚠️ Low Stock Alert:</strong>{' '}
                {products.filter(p => p.stock < 5).map(p => p.name).join(', ')} — please restock.
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
