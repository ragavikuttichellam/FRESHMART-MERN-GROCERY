import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/axios';
import './Orders.css';

const statusBadge = (status) => {
  const map = { pending: 'badge-yellow', processing: 'badge-blue', shipped: 'badge-blue', delivered: 'badge-green', cancelled: 'badge-red' };
  return <span className={`badge ${map[status] || 'badge-gray'}`}>{status}</span>;
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/myorders')
      .then(r => setOrders(r.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner" />;

  return (
    <div className="orders-page container">
      <h1 className="page-title">My Orders</h1>
      {orders.length === 0 ? (
        <div className="empty-state">
          <div style={{ fontSize: 64 }}>📦</div>
          <h3>No orders yet</h3>
          <p>Start shopping to place your first order!</p>
          <Link to="/products" className="btn btn-primary">Shop Now</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order._id} className="order-card">
              <div className="order-card-header">
                <div>
                  <div className="order-id">Order #{order._id.slice(-8).toUpperCase()}</div>
                  <div className="order-date">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                </div>
                <div className="order-badges">
                  {statusBadge(order.orderStatus)}
                  {order.isPaid
                    ? <span className="badge badge-green">Paid</span>
                    : <span className="badge badge-yellow">Unpaid</span>}
                </div>
              </div>
              <div className="order-items-preview">
                {order.items?.slice(0, 3).map((item, i) => (
                  <div key={i} className="order-item-thumb">
                    {item.image ? <img src={item.image} alt={item.name} /> : <span>🛒</span>}
                  </div>
                ))}
                {order.items?.length > 3 && <div className="order-more">+{order.items.length - 3} more</div>}
              </div>
              <div className="order-card-footer">
                <div className="order-total"><strong>₹{order.totalPrice.toFixed(2)}</strong> • {order.items?.length} item(s)</div>
                <Link to={`/orders/${order._id}`} className="btn btn-outline btn-sm">View Details</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
