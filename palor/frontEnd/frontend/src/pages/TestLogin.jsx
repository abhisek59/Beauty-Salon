import React, { useState } from 'react';
import axios from 'axios';

const TestLogin = () => {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('Password123!');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setResult('');
    try {
      const response = await axios.post('http://localhost:8000/api/v1/users/login', {
        email,
        password
      });

      console.log('Login Response:', response.data);

      if (response.data.sucess) {
        const { user, accessToken, refreshToken } = response.data.message;
        
        localStorage.setItem('token', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));
        
        setResult(`✅ Login successful! User: ${user.firstname} ${user.lastname}`);
        
        // Force navbar to update
        window.dispatchEvent(new Event('storage'));
      }
    } catch (error) {
      console.error('Login error:', error);
      setResult(`❌ Login failed: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setResult('🚪 Logged out successfully');
    window.dispatchEvent(new Event('storage'));
  };

  const checkStorage = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    setResult(`Token: ${token ? 'EXISTS' : 'NOT FOUND'}\nUser: ${user ? JSON.parse(user).firstname : 'NOT FOUND'}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">🧪 Navbar Test</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div className="space-y-2">
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Logging in...' : '🔑 Test Login'}
            </button>
            
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
            >
              🚪 Test Logout
            </button>
            
            <button
              onClick={checkStorage}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
            >
              🔍 Check Storage
            </button>
          </div>
        </div>
        
        {result && (
          <div className="mt-6 p-4 bg-gray-100 rounded-md">
            <pre className="text-sm whitespace-pre-wrap">{result}</pre>
          </div>
        )}
        
        <div className="mt-6 text-sm text-gray-600">
          <p><strong>Instructions:</strong></p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Click "Test Login" to log in</li>
            <li>Watch the navbar change to show your name</li>
            <li>Click "Test Logout" to log out</li>
            <li>Watch the navbar return to Login/Register</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default TestLogin;