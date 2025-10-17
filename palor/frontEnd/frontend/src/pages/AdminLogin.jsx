import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;

    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/api/v1/users/login', form, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      const data = response.data;
      
      // Check if user is admin
      if (data.message.user.role !== 'admin') {
        setError('Access denied. Admin privileges required.');
        return;
      }

      // Store admin token
      localStorage.setItem('adminToken', data.message.accessToken);
      localStorage.setItem('adminUser', JSON.stringify(data.message.user));
      
      // Navigate to admin dashboard
      navigate('/admin/dashboard');

    } catch (err) {
      console.error('Admin login error:', err);
      
      if (err.response) {
        const errorMessage = err.response.data?.message || 
                            err.response.data?.error || 
                            `Login failed (${err.response.status})`;
        setError(errorMessage);
      } else if (err.request) {
        setError('Network error. Please check if the backend server is running.');
      } else {
        setError(err.message || 'An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-pink-100 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-pink-800">
            Admin Portal
          </h2>
          <p className="mt-2 text-center text-sm text-pink-600">
            Sign in to access the admin dashboard
          </p>
        </div>

        <form className="mt-8 space-y-6 bg-white p-8 rounded shadow" onSubmit={handleSubmit}>
          {error && <div className="text-sm text-red-600 bg-red-100 p-2 rounded">{error}</div>}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Admin Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                disabled={loading}
                className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                placeholder="Enter admin email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                disabled={loading}
                className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                placeholder="Enter password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white transition-colors ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-pink-600 hover:bg-pink-700 active:bg-pink-800'
              }`}
            >
              {loading ? 'Signing in...' : 'Sign in to Admin Portal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;