import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const NavbarSimple = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      console.log('Navbar: Checking auth status...');
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      console.log('Token:', token ? 'EXISTS' : 'NOT FOUND');
      console.log('UserData:', userData ? 'EXISTS' : 'NOT FOUND');
      
      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          console.log('Parsed User:', parsedUser);
          setUser(parsedUser);
          setIsLoggedIn(true);
        } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setIsLoggedIn(false);
          setUser(null);
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    // Check on component mount and location change
    checkAuth();

    // Listen for storage events (when localStorage changes in other tabs)
    window.addEventListener('storage', checkAuth);
    
    // Listen for custom auth events (for same-tab updates)
    window.addEventListener('authStateChanged', checkAuth);
    
    // Cleanup listeners
    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('authStateChanged', checkAuth);
    };
  }, [location.pathname]);

  console.log('Navbar Render - isLoggedIn:', isLoggedIn, 'user:', user);

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
              {/* Basic Navigation */}
              <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium text-pink-700 hover:bg-pink-200">
                Home
              </Link>
              <Link to="/services" className="px-3 py-2 rounded-md text-sm font-medium text-pink-700 hover:bg-pink-200">
                Services
              </Link>
              <Link to="/reviews" className="px-3 py-2 rounded-md text-sm font-medium text-pink-700 hover:bg-pink-200">
                Reviews
              </Link>
              
              {/* Conditional Navigation */}
              {isLoggedIn ? (
                <>
                  <Link to="/my-appointments" className="px-3 py-2 rounded-md text-sm font-medium text-pink-700 hover:bg-pink-200">
                    My Appointments
                  </Link>
                  <div className="flex items-center space-x-3 ml-6 pl-6 border-l border-pink-300">
                    <span className="text-pink-700 font-medium text-sm">
                      Welcome, {user?.firstname || user?.username || 'User'}!
                    </span>
                    <button
                      onClick={() => {
                        localStorage.clear();
                        setIsLoggedIn(false);
                        setUser(null);
                        // Dispatch custom event to notify other components
                        window.dispatchEvent(new Event('authStateChanged'));
                        window.location.href = '/';
                      }}
                      className="px-3 py-2 rounded-md text-sm font-medium text-pink-700 hover:bg-pink-200"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login" className="px-3 py-2 rounded-md text-sm font-medium text-pink-700 hover:bg-pink-200">
                    Login
                  </Link>
                  <Link to="/register" className="px-3 py-2 rounded-md text-sm font-medium text-pink-700 hover:bg-pink-200">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="bg-pink-200 inline-flex items-center justify-center p-2 rounded-md text-pink-700 hover:text-pink-800 hover:bg-pink-300"
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-pink-150">
            <Link to="/" className="block px-3 py-2 text-pink-700">Home</Link>
            <Link to="/services" className="block px-3 py-2 text-pink-700">Services</Link>
            <Link to="/reviews" className="block px-3 py-2 text-pink-700">Reviews</Link>
            
            {isLoggedIn ? (
              <>
                <Link to="/my-appointments" className="block px-3 py-2 text-pink-700">My Appointments</Link>
                <div className="border-t pt-3">
                  <p className="px-3 py-2 text-pink-800">Welcome, {user?.firstname || user?.username || 'User'}!</p>
                  <button
                    onClick={() => {
                      localStorage.clear();
                      setIsLoggedIn(false);
                      setUser(null);
                      setIsMenuOpen(false);
                      // Dispatch custom event to notify other components
                      window.dispatchEvent(new Event('authStateChanged'));
                      window.location.href = '/';
                    }}
                    className="block w-full text-left px-3 py-2 text-pink-700"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-3 py-2 text-pink-700">Login</Link>
                <Link to="/register" className="block px-3 py-2 text-pink-700">Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavbarSimple;