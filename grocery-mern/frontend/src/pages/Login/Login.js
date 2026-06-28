import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import './Auth.css';

export const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(form.email, form.password);
    if (res.success) { toast.success('Welcome back!'); navigate('/'); }
    else toast.error(res.message);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">🛒 FreshMart</div>
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Sign in to your account</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" className="form-input" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required placeholder="you@example.com" />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" className="form-input" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required placeholder="••••••••" />
          </div>
          <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="auth-switch">Don't have an account? <Link to="/register">Sign up</Link></p>
      </div>
    </div>
  );
};

export const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
    const res = await register(form.name, form.email, form.password, form.phone);
    if (res.success) { toast.success('Account created!'); navigate('/'); }
    else toast.error(res.message);
  };

  const f = (k) => ({ value: form[k], onChange: e => setForm(p => ({ ...p, [k]: e.target.value })) });

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">🛒 FreshMart</div>
        <h1 className="auth-title">Create account</h1>
        <p className="auth-subtitle">Start shopping fresh groceries</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group"><label className="form-label">Full Name</label><input type="text" className="form-input" required placeholder="John Doe" {...f('name')} /></div>
          <div className="form-group"><label className="form-label">Email</label><input type="email" className="form-input" required placeholder="you@example.com" {...f('email')} /></div>
          <div className="form-group"><label className="form-label">Phone</label><input type="tel" className="form-input" placeholder="+91 98765 43210" {...f('phone')} /></div>
          <div className="form-group"><label className="form-label">Password</label><input type="password" className="form-input" required minLength={6} placeholder="Min. 6 characters" {...f('password')} /></div>
          <div className="form-group"><label className="form-label">Confirm Password</label><input type="password" className="form-input" required placeholder="Repeat password" {...f('confirm')} /></div>
          <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
      </div>
    </div>
  );
};
export default Login;