import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../utils/axios';
import './Orders.css';

const statusBadge = (s) => {
  const m = { pending: 'badge-yellow', processing: 'badge-blue', shipped: 'badge-blue', delivered: 'badge-green', cancelled: 'badge-red' };
  return <span className={`badge ${m[s] || 'badge-gray'}`}>{s?.toUpperCase()}</span>;
};

const STEPS = ['pending', 'processing', 'shipped', 'delivered'];

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/${id}`).then(r => setOrder(r.data)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="spinner" />;
  if (!order) return <div className="container" style={{ padding: 40 }}>Order not found.</div>;

  const stepIdx = STEPS.indexOf(order.orderStatus);

  return (
    <div className="orders-page container">
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <Link to="/orders" className="btn btn-outline btn-sm">← Back</Link>
        <h1 className="page-title" style={{ margin: 0 }}>Order #{order._id.slice(-8).toUpperCase()}</h1>
        {statusBadge(order.orderStatus)}
      </div>

      {/* Tracker */}
      {order.orderStatus !== 'cancelled' && (
        <div className="order-tracker">
          {STEPS.map((s, i) => (
            <div key={s} className={`tracker-step ${i <= stepIdx ? 'done' : ''}`}>
              <div className="tracker-dot">{i < stepIdx ? '✓' : i === stepIdx ? '●' : ''}</div>
              <span>{s.charAt(0).toUpperCase() + s.slice(1)}</span>
              {i < STEPS.length - 1 && <div className={`tracker-line ${i < stepIdx ? 'done' : ''}`} />}
            </div>
          ))}
        </div>
      )}

      <div className="order-detail-layout">
        <div>
          {/* Items */}
          <div className="checkout-card">
            <h2>Order Items</h2>
            {order.items.map((item, i) => (
              <div key={i} className="order-detail-item">
                <div className="order-detail-img">
                  {item.image ? <img src={item.image} alt={item.name} /> : <span>🛒</span>}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{item.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--gray-400)' }}>Qty: {item.quantity}</div>
                </div>
                <div style={{ fontWeight: 700 }}>₹{(item.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>

          {/* Shipping */}
          <div className="checkout-card" style={{ marginTop: 16 }}>
            <h2>Delivery Address</h2>
            <p><strong>{order.shippingAddress?.name}</strong></p>
            <p>{order.shippingAddress?.street}</p>
            <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
            <p>📱 {order.shippingAddress?.phone}</p>
          </div>
        </div>

        {/* Summary */}
        <div>
          <div className="checkout-card">
            <h2>Payment Summary</h2>
            <div className="summary-row"><span>Subtotal</span><span>₹{order.itemsPrice?.toFixed(2)}</span></div>
            <div className="summary-row"><span>Shipping</span><span>{order.shippingPrice === 0 ? 'FREE' : `₹${order.shippingPrice}`}</span></div>
            <div className="summary-row"><span>Tax</span><span>₹{order.taxPrice?.toFixed(2)}</span></div>
            <hr style={{ border: 'none', borderTop: '1px solid var(--gray-100)', margin: '10px 0' }} />
            <div className="summary-total"><strong>Total</strong><strong>₹{order.totalPrice?.toFixed(2)}</strong></div>
            <div style={{ marginTop: 16 }}>
              <div className="summary-row">
                <span>Payment Method</span>
                <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>{order.paymentMethod}</span>
              </div>
              <div className="summary-row">
                <span>Payment Status</span>
                <span>{order.isPaid
                  ? <span className="badge badge-green">Paid ✓</span>
                  : <span className="badge badge-yellow">Pending</span>}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
