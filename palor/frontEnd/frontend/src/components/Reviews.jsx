import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingReviews, setFetchingReviews] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 5,
    comment: '',
    service: ''
  });

  // Fetch reviews from backend
  const fetchReviews = async () => {
    try {
      setFetchingReviews(true);
      const response = await axios.get('http://localhost:8000/api/v1/reviews/public');
      
      if (response.data.success) {
        setReviews(response.data.message.reviews || []);
      } else {
        // Fallback to sample data if API fails
        setReviews(sampleReviews);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      // Fallback to sample data
      setReviews(sampleReviews);
    } finally {
      setFetchingReviews(false);
    }
  };

  // Sample reviews (fallback data)
  const sampleReviews = [
    {
      id: 1,
      name: 'Sarah Johnson',
      rating: 5,
      comment: 'Amazing threading service! Very precise and professional. The salon is clean and the staff is friendly.',
      service: 'Eyebrow Threading',
      date: '2024-10-08'
    },
    {
      id: 2,
      name: 'Maria Garcia',
      rating: 5,
      comment: 'Best threading experience I\'ve had! The results were perfect and it didn\'t hurt at all.',
      service: 'Full Face Threading',
      date: '2024-10-05'
    },
    {
      id: 3,
      name: 'Jennifer Lee',
      rating: 4,
      comment: 'Great service and reasonable prices. Will definitely come back!',
      service: 'Eyebrow Threading',
      date: '2024-10-03'
    }
  ];

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/api/v1/reviews/create', formData);
      
      if (response.data.success) {
        alert('Thank you for your review! It has been submitted and will be published after approval.');
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          rating: 5,
          comment: '',
          service: ''
        });
        
        setShowForm(false);
        
        // Refresh reviews
        fetchReviews();
      } else {
        alert('Error submitting review. Please try again.');
      }
      
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Error submitting review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={`text-lg ${index < rating ? 'text-yellow-500' : 'text-gray-300'}`}>
        ★
      </span>
    ));
  };

  const services = [
    'Eyebrow Threading',
    'Full Face Threading',
    'Upper Lip Threading',
    'Chin Threading',
    'Forehead Threading',
    'Other'
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-pink-800 mb-4">Customer Reviews</h2>
        <p className="text-gray-600 mb-6">See what our clients say about their experience</p>
        
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          {showForm ? 'Cancel' : 'Write a Review'}
        </button>
      </div>

      {/* Review Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Share Your Experience</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Enter your name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">
                  Service Received
                </label>
                <select
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="">Select a service</option>
                  {services.map(service => (
                    <option key={service} value={service}>{service}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
                  Rating *
                </label>
                <select
                  id="rating"
                  name="rating"
                  value={formData.rating}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value={5}>5 Stars - Excellent</option>
                  <option value={4}>4 Stars - Very Good</option>
                  <option value={3}>3 Stars - Good</option>
                  <option value={2}>2 Stars - Fair</option>
                  <option value={1}>1 Star - Poor</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                Your Review *
              </label>
              <textarea
                id="comment"
                name="comment"
                value={formData.comment}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Tell us about your experience..."
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-2 rounded-lg font-semibold ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-pink-600 hover:bg-pink-700'
                } text-white transition-colors`}
              >
                {loading ? 'Submitting...' : 'Submit Review'}
              </button>
              
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews Display */}
      {fetchingReviews ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
          <span className="ml-2 text-gray-600">Loading reviews...</span>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map(review => (
            <div key={review._id || review.id} className="bg-white rounded-lg shadow-md p-6 border">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-gray-900">{review.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex">{renderStars(review.rating)}</div>
                    <span className="text-sm text-gray-500">({review.rating}/5)</span>
                  </div>
                  {review.service && (
                    <span className="inline-block bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded-full mt-2">
                      {review.service}
                    </span>
                  )}
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(review.createdAt || review.date).toLocaleDateString()}
                </span>
              </div>
              
              <p className="text-gray-700 leading-relaxed">{review.comment}</p>
            </div>
          ))}
          
          {reviews.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No reviews yet. Be the first to share your experience!</p>
            </div>
          )}
        </div>
      )}

      {/* Statistics */}
      <div className="mt-12 bg-pink-50 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-pink-800 mb-4 text-center">Our Customer Satisfaction</h3>
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-pink-600">{reviews.length}</div>
            <div className="text-gray-600">Total Reviews</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-pink-600">
              {reviews.length ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : '0'}
            </div>
            <div className="text-gray-600">Average Rating</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-pink-600">
              {reviews.filter(r => r.rating >= 4).length}
            </div>
            <div className="text-gray-600">4+ Star Reviews</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews;