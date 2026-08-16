import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      navigate('/queue');
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-teal-600 rounded-card flex items-center justify-center text-cream font-bold text-lg">
            C
          </div>
          <h1 className="mt-4 text-2xl font-bold text-charcoal">Sign in</h1>
          <p className="mt-2 text-taupe">Welcome back to Clearshot</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-100 border border-red-200 rounded-card text-red-700 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-taupe/20 rounded-card text-charcoal placeholder-taupe focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-taupe/20 rounded-card text-charcoal placeholder-taupe focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-teal-600 text-cream rounded-card font-semibold hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        {/* Sign up link */}
        <div className="text-center text-sm text-taupe">
          Don't have an account?{' '}
          <Link to="/signup" className="text-teal-600 font-semibold hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};
