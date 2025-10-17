import React from 'react';
import { useNavigate } from 'react-router-dom';

const ServiceCard = ({ 
  service, 
  onBookNow, 
  showBookButton = true, 
  className = "",
  imageHeight = "h-48"
}) => {
  const navigate = useNavigate();
  const {
    _id,
    name,
    description,
    price,
    duration,
    category,
    image,
    isActive = true,
    availableFor = "all",
    prerequisites,
    aftercare,
    tags = []
  } = service;

  const handleBooking = () => {
    try {
      // Check if user is logged in
      const token = localStorage.getItem('token');
      
      if (!token) {
        // Redirect to login with return URL
        navigate('/login', { 
          state: { 
            returnUrl: `/booking/${_id}`,
            message: 'Please login to book an appointment' 
          }
        });
        return;
      }

      // If custom onBookNow function is provided, use it
      if (onBookNow && typeof onBookNow === 'function') {
        onBookNow(service);
      } else {
        // Default behavior: navigate to booking page
        navigate(`/booking/${_id}`);
      }
    } catch (error) {
      console.error('Error in handleBooking:', error);
      // Fallback: try direct navigation
      window.location.href = `/booking/${_id}`;
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 ${className}`}>
      {/* Service Image */}
      <div className={`relative ${imageHeight} overflow-hidden`}>
        <img
          src={image || '/placeholder-service.jpg'}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = '/placeholder-service.jpg';
          }}
        />
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-pink-500 text-white px-2 py-1 rounded-full text-xs font-medium capitalize">
            {category}
          </span>
        </div>
        
        {/* Active Status */}
        {!isActive && (
          <div className="absolute top-3 right-3">
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Unavailable
            </span>
          </div>
        )}
        
        {/* Available For Badge */}
        {availableFor !== 'all' && (
          <div className="absolute bottom-3 left-3">
            <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium capitalize">
              {availableFor} Only
            </span>
          </div>
        )}
      </div>

      {/* Service Details */}
      <div className="p-4">
        {/* Service Name and Price */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 flex-1 mr-2">
            {name}
          </h3>
          <div className="text-right">
            <span className="text-xl font-bold text-pink-600">
              ${price}
            </span>
          </div>
        </div>

        {/* Duration */}
        <div className="flex items-center text-gray-600 mb-2">
          <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm">{duration} minutes</span>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {description}
        </p>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="text-gray-500 text-xs">
                +{tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Prerequisites Warning */}
        {prerequisites && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-2 mb-3">
            <div className="flex">
              <svg className="h-4 w-4 text-yellow-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.081 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="text-xs text-yellow-700">Prerequisites required</p>
            </div>
          </div>
        )}

        {/* Book Now Button */}
        {showBookButton && (
          <button
            onClick={handleBooking}
            disabled={!isActive}
            className={`w-full py-2 px-4 rounded-md font-medium transition-colors duration-200 ${
              isActive
                ? 'bg-pink-600 hover:bg-pink-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isActive ? 'Book Now' : 'Currently Unavailable'}
          </button>
        )}
      </div>

      {/* Aftercare Info (Hidden by default, can be expanded) */}
      {aftercare && (
        <div className="border-t border-gray-100">
          <details className="p-4">
            <summary className="text-sm font-medium text-gray-700 cursor-pointer hover:text-pink-600">
              Aftercare Instructions
            </summary>
            <p className="text-xs text-gray-600 mt-2">
              {aftercare}
            </p>
          </details>
        </div>
      )}
    </div>
  );
};

export default ServiceCard;