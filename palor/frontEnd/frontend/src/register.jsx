import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    phone: ''
    // role will always be 'customer' - removed from form
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!form.firstname.trim() || !form.lastname.trim()) return 'First and last name are required';
    if (!form.email.trim()) return 'Email is required';
    // basic email regex
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Email is invalid';
    if (!form.password || form.password.length < 6) return 'Password should be at least 6 characters';
    // Password strength validation to match backend
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(form.password)) {
      return 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character (@$!%*?&)';
    }
    if (!form.phone.trim()) return 'Phone is required';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event bubbling
    
    // Prevent multiple submissions
    if (loading) return;
    
    setError('');
    setSuccess('');

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/v1/users/signup', {
        ...form,
        role: 'customer' // Always set role as customer for public registration
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 second timeout
      });

      // Axios automatically parses JSON and throws on error status codes
      const data = response.data;
      setSuccess(data?.message || 'Registration successful');
      
      // Clear password for security
      setForm(prev => ({ ...prev, password: '' }));
      
      // Redirect to login page using React Router
      setTimeout(() => {
        navigate('/login');
      }, 1200);

    } catch (err) {
      console.error('Registration error:', err);
      
      if (err.response) {
        // Server responded with error status
        const errorMessage = err.response.data?.message || 
                            err.response.data?.error || 
                            `Registration failed (${err.response.status})`;
        setError(errorMessage);
      } else if (err.request) {
        // Network error - request was made but no response received
        setError('Network error. Please check if the backend server is running.');
      } else {
        // Something else happened
        setError(err.message || 'An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-pink-100 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4 text-center text-pink-800">Create an account</h2>

        {error && <div className="mb-4 text-sm text-red-700 bg-red-100 p-2 rounded">{error}</div>}
        {success && <div className="mb-4 text-sm text-green-700 bg-green-100 p-2 rounded">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-3" noValidate>
          <div className="flex gap-2">
            <input
              name="firstname"
              value={form.firstname}
              onChange={handleChange}
              placeholder="First name"
              className="w-1/2 px-3 py-2 border rounded"
              disabled={loading}
            />
            <input
              name="lastname"
              value={form.lastname}
              onChange={handleChange}
              placeholder="Last name"
              className="w-1/2 px-3 py-2 border rounded"
              disabled={loading}
            />
          </div>

          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full px-3 py-2 border rounded"
            disabled={loading}
          />

          <div>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full px-3 py-2 border rounded"
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Password must contain: uppercase, lowercase, number & special character (@$!%*?&)
            </p>
          </div>

          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone (include country code)"
            className="w-full px-3 py-2 border rounded"
            disabled={loading}
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded text-white transition-colors ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
            }`}
            onClick={(e) => {
              if (loading) {
                e.preventDefault();
                e.stopPropagation();
              }
            }}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account? <Link to="/login" className="text-blue-600 hover:text-blue-800">Login</Link>
        </p>
      </div>
    </div>
  );
}
