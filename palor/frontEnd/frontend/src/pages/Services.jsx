import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ServiceCard, Loader, SkeletonLoader, Footer } from '../components';

const Services = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    availableFor: '',
    minPrice: '',
    maxPrice: '',
    search: ''
  });
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'

  // Fetch services from API
  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching services...');
      
      const response = await axios.get('http://localhost:8000/api/v1/services');
      console.log('Services response:', response.data);
      
      // Handle the response structure from getAllServices
      const servicesData = response.data.message?.services || response.data.data?.services || response.data.data || [];
      console.log('Services data:', servicesData);
      
      setServices(servicesData);
    } catch (error) {
      console.error('Error fetching services:', error);
      setError(error.response?.data?.message || 'Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
    
    // Auto-refresh every 30 seconds to pick up new services
    const interval = setInterval(fetchServices, 30000);
    return () => clearInterval(interval);
  }, []);

  // Filter services based on filters
  const filteredServices = services.filter(service => {
    if (!service.isActive) return false; // Only show active services
    
    if (filters.category && service.category !== filters.category) return false;
    if (filters.availableFor && service.availableFor !== filters.availableFor && service.availableFor !== 'all') return false;
    if (filters.minPrice && service.price < parseFloat(filters.minPrice)) return false;
    if (filters.maxPrice && service.price > parseFloat(filters.maxPrice)) return false;
    if (filters.search && !service.name.toLowerCase().includes(filters.search.toLowerCase()) && 
        !service.description.toLowerCase().includes(filters.search.toLowerCase())) return false;
    
    return true;
  });

  // Handle booking
  const handleBooking = (service) => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    
    if (!token) {
      // Redirect to login with return URL
      navigate('/login', { 
        state: { 
          returnUrl: `/booking/${service._id}`,
          message: 'Please login to book an appointment' 
        }
      });
      return;
    }

    // Navigate to booking page
    navigate(`/booking/${service._id}`);
  };

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      category: '',
      availableFor: '',
      minPrice: '',
      maxPrice: '',
      search: ''
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="h-10 bg-gray-300 rounded w-64 animate-pulse mb-4"></div>
            <div className="h-6 bg-gray-300 rounded w-96 animate-pulse"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({length: 6}).map((_, i) => (
              <SkeletonLoader key={i} card={true} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Services</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchServices}
            className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h1>
          <p className="text-lg text-gray-600">
            Discover our range of professional beauty services designed to make you look and feel your best.
          </p>
        </div>

        {/* Filters and View Toggle */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Filter Services</h3>
            
            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">View:</span>
              <button
                onClick={() => setViewMode('cards')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  viewMode === 'cards' 
                    ? 'bg-pink-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Cards
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  viewMode === 'table' 
                    ? 'bg-pink-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Table
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div>
              <input
                type="text"
                placeholder="Search services..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                <option value="eyelashes">Eyelashes</option>
                <option value="waxing">Waxing</option>
                <option value="facial">Facial</option>
                <option value="heena">Heena</option>
                <option value="threading">Threading</option>
              </select>
            </div>

            {/* Available For Filter */}
            <div>
              <select
                value={filters.availableFor}
                onChange={(e) => handleFilterChange('availableFor', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="">For Everyone</option>
                <option value="men">Men Only</option>
                <option value="women">Women Only</option>
              </select>
            </div>

            {/* Price Range */}
            <div>
              <input
                type="number"
                placeholder="Min Price"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            <div>
              <input
                type="number"
                placeholder="Max Price"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Clear Filters */}
          <div className="mt-4 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Showing {filteredServices.length} of {services.length} services
            </p>
            <button
              onClick={clearFilters}
              className="text-sm text-pink-600 hover:text-pink-700 font-medium"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Services Display */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Services Found</h3>
            <p className="text-gray-600 mb-4">
              {services.length === 0 
                ? "No services are currently available." 
                : "Try adjusting your filters to find what you're looking for."
              }
            </p>
            {services.length > 0 && (
              <button
                onClick={clearFilters}
                className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <>
            {viewMode === 'cards' ? (
              /* Card View */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {filteredServices.map(service => (
                  <ServiceCard 
                    key={service._id}
                    service={service}
                    onBookNow={handleBooking}
                    showBookButton={true}
                    className="hover:scale-105 transition-transform duration-200"
                  />
                ))}
              </div>
            ) : (
              /* Table View */
              <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-12">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Service
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Duration
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Available For
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredServices.map(service => (
                        <tr key={service._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <img 
                                className="h-12 w-12 rounded-lg object-cover mr-4" 
                                src={service.image} 
                                alt={service.name}
                                onError={(e) => {
                                  e.target.src = '/placeholder-service.svg';
                                }}
                              />
                              <div>
                                <div className="text-sm font-medium text-gray-900">{service.name}</div>
                                <div className="text-sm text-gray-500 truncate max-w-xs">{service.description}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                              {service.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {service.duration} min
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            ${service.price}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 capitalize">
                              {service.availableFor}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleBooking(service)}
                              className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
                            >
                              Book Now
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* Service Count and Refresh */}
        <div className="flex justify-between items-center py-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Total: {services.length} services • Active: {services.filter(s => s.isActive).length}
          </p>
          <button
            onClick={fetchServices}
            className="text-sm text-pink-600 hover:text-pink-700 font-medium flex items-center space-x-1"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Services;