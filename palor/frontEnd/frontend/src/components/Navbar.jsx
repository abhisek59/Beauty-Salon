import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Check authentication status
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        // Clear invalid data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setUser(null);
      }
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  }, [location.pathname]); // Re-check when location changes

  // Handle logout
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        // Call logout API
        await axios.post('http://localhost:8000/api/v1/users/logout', {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Clear local storage regardless of API call result
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setIsLoggedIn(false);
      setUser(null);
      navigate('/');
    }
  };

  // Dynamic navigation items based on auth status
  const getNavItems = () => {
    const baseItems = [
      { name: 'Home', path: '/' },
      { name: 'Services', path: '/services' },
      { name: 'About Us', path: '/about' },
      { name: 'Contact', path: '/contact' }
    ];

    if (isLoggedIn) {
      return [
        ...baseItems,
        { name: 'My Appointments', path: '/my-appointments' }
      ];
    } else {
      return [
        ...baseItems,
        { name: 'Login', path: '/login' },
        { name: 'Register', path: '/register' }
      ];
    }
  };

  const navItems = getNavItems();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-gradient-to-r from-pink-100 to-pink-200 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <Link 
              to="/" 
              className="text-2xl font-bold text-pink-600 hover:text-pink-700 transition-colors duration-200"
            >
              ✨ Sunshine Threading
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {/* Navigation Links */}
              <div className="flex items-baseline space-x-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      isActive(item.path)
                        ? 'bg-pink-300 text-pink-800'
                        : 'text-pink-700 hover:bg-pink-200 hover:text-pink-800'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* User Profile & Logout */}
              {isLoggedIn && user && (
                <div className="flex items-center space-x-3 ml-6 pl-6 border-l border-pink-300">
                  {/* User Avatar & Name */}
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {(user.firstname || user.fullName || user.username || 'U').charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-pink-700 font-medium text-sm">
                      {user.firstname 
                        ? `${user.firstname} ${user.lastname || ''}`.trim()
                        : user.fullName || user.username || 'User'
                      }
                    </span>
                  </div>
                  
                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="px-3 py-2 rounded-md text-sm font-medium text-pink-700 hover:bg-pink-200 hover:text-pink-800 transition-colors duration-200"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="bg-pink-200 inline-flex items-center justify-center p-2 rounded-md text-pink-700 hover:text-pink-800 hover:bg-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors duration-200"
            >
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-pink-150">
            {/* Navigation Links */}
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                  isActive(item.path)
                    ? 'bg-pink-300 text-pink-800'
                    : 'text-pink-700 hover:bg-pink-200 hover:text-pink-800'
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Mobile User Profile & Logout */}
            {isLoggedIn && user && (
              <div className="border-t border-pink-300 pt-3 mt-3">
                {/* User Info */}
                <div className="flex items-center px-3 py-2 mb-2">
                  <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-medium">
                      {(user.firstname || user.fullName || user.username || 'U').charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="text-pink-800 font-medium">
                      {user.firstname 
                        ? `${user.firstname} ${user.lastname || ''}`.trim()
                        : user.fullName || user.username || 'User'
                      }
                    </div>
                    <div className="text-pink-600 text-sm">{user.email}</div>
                  </div>
                </div>
                
                {/* Logout Button */}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-pink-700 hover:bg-pink-200 hover:text-pink-800 transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;