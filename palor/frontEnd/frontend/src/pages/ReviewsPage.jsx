import React from 'react';
import { Reviews } from '../components';

const ReviewsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-pink-800 text-center">Customer Reviews</h1>
          <p className="text-lg text-gray-600 text-center mt-2">
            Read what our customers say about their experience at Sunshine Threading
          </p>
        </div>
      </div>

      {/* Reviews Component */}
      <div className="py-8">
        <Reviews />
      </div>
    </div>
  );
};

export default ReviewsPage;