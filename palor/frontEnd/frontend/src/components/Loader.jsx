import React from 'react';

const Loader = ({ 
  size = 'medium', 
  color = 'pink', 
  type = 'spinner',
  text = '',
  fullScreen = false,
  className = ''
}) => {
  // Size configurations
  const sizeClasses = {
    small: 'h-6 w-6',
    medium: 'h-12 w-12',
    large: 'h-16 w-16',
    xlarge: 'h-24 w-24'
  };

  // Color configurations
  const colorClasses = {
    pink: 'border-pink-600',
    blue: 'border-blue-600',
    green: 'border-green-600',
    purple: 'border-purple-600',
    gray: 'border-gray-600',
    white: 'border-white'
  };

  // Spinner component
  const Spinner = () => (
    <div
      className={`animate-spin rounded-full border-4 border-gray-200 ${colorClasses[color]} border-t-transparent ${sizeClasses[size]} ${className}`}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );

  // Dots loader component
  const Dots = () => (
    <div className={`flex space-x-1 ${className}`} role="status" aria-label="Loading">
      <div className={`w-2 h-2 bg-${color}-600 rounded-full animate-bounce`}></div>
      <div className={`w-2 h-2 bg-${color}-600 rounded-full animate-bounce`} style={{ animationDelay: '0.1s' }}></div>
      <div className={`w-2 h-2 bg-${color}-600 rounded-full animate-bounce`} style={{ animationDelay: '0.2s' }}></div>
      <span className="sr-only">Loading...</span>
    </div>
  );

  // Pulse loader component
  const Pulse = () => (
    <div className={`flex space-x-1 ${className}`} role="status" aria-label="Loading">
      <div className={`w-3 h-3 bg-${color}-600 rounded-full animate-pulse`}></div>
      <div className={`w-3 h-3 bg-${color}-600 rounded-full animate-pulse`} style={{ animationDelay: '0.2s' }}></div>
      <div className={`w-3 h-3 bg-${color}-600 rounded-full animate-pulse`} style={{ animationDelay: '0.4s' }}></div>
      <span className="sr-only">Loading...</span>
    </div>
  );

  // Bars loader component
  const Bars = () => (
    <div className={`flex items-end space-x-1 ${className}`} role="status" aria-label="Loading">
      <div className={`w-1 h-4 bg-${color}-600 animate-pulse`}></div>
      <div className={`w-1 h-6 bg-${color}-600 animate-pulse`} style={{ animationDelay: '0.1s' }}></div>
      <div className={`w-1 h-4 bg-${color}-600 animate-pulse`} style={{ animationDelay: '0.2s' }}></div>
      <div className={`w-1 h-6 bg-${color}-600 animate-pulse`} style={{ animationDelay: '0.3s' }}></div>
      <div className={`w-1 h-4 bg-${color}-600 animate-pulse`} style={{ animationDelay: '0.4s' }}></div>
      <span className="sr-only">Loading...</span>
    </div>
  );

  // Ring loader component
  const Ring = () => (
    <div className={`relative ${sizeClasses[size]} ${className}`} role="status" aria-label="Loading">
      <div className={`absolute inset-0 rounded-full border-4 border-gray-200`}></div>
      <div className={`absolute inset-0 rounded-full border-4 border-transparent ${colorClasses[color]} border-t-current animate-spin`}></div>
      <span className="sr-only">Loading...</span>
    </div>
  );

  // Select loader type
  const renderLoader = () => {
    switch (type) {
      case 'dots':
        return <Dots />;
      case 'pulse':
        return <Pulse />;
      case 'bars':
        return <Bars />;
      case 'ring':
        return <Ring />;
      case 'spinner':
      default:
        return <Spinner />;
    }
  };

  // Content wrapper
  const content = (
    <div className="flex flex-col items-center justify-center space-y-2">
      {renderLoader()}
      {text && (
        <p className="text-gray-600 text-sm font-medium animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  // Full screen overlay
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return content;
};

// Skeleton loader for content placeholders
export const SkeletonLoader = ({ 
  lines = 3, 
  className = '',
  avatar = false,
  card = false 
}) => {
  if (card) {
    return (
      <div className={`bg-white rounded-lg shadow-md overflow-hidden animate-pulse ${className}`}>
        <div className="h-48 bg-gray-300"></div>
        <div className="p-4 space-y-3">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-3 bg-gray-300 rounded w-full"></div>
          <div className="h-3 bg-gray-300 rounded w-2/3"></div>
          <div className="h-8 bg-gray-300 rounded w-full mt-4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`animate-pulse ${className}`}>
      {avatar && (
        <div className="flex items-center space-x-3 mb-4">
          <div className="rounded-full bg-gray-300 h-10 w-10"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-3 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      )}
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`h-4 bg-gray-300 rounded ${
              index === lines - 1 ? 'w-2/3' : 'w-full'
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

// Table skeleton loader
export const TableSkeleton = ({ rows = 5, columns = 4, className = '' }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {Array.from({ length: columns }).map((_, index) => (
                <th key={index} className="px-6 py-3">
                  <div className="h-4 bg-gray-300 rounded"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex}>
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <td key={colIndex} className="px-6 py-4">
                    <div className="h-4 bg-gray-300 rounded"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

Loader.propTypes = {
  size: ['small', 'medium', 'large', 'xlarge'],
  color: ['pink', 'blue', 'green', 'purple', 'gray', 'white'],
  type: ['spinner', 'dots', 'pulse', 'bars', 'ring'],
  text: 'string',
  fullScreen: 'boolean',
  className: 'string'
};

SkeletonLoader.propTypes = {
  lines: 'number',
  className: 'string',
  avatar: 'boolean',
  card: 'boolean'
};

TableSkeleton.propTypes = {
  rows: 'number',
  columns: 'number',
  className: 'string'
};

export default Loader;