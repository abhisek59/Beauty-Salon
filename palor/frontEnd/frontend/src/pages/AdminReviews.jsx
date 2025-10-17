import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, approved, unapproved
  const [actionLoading, setActionLoading] = useState({});

  // Fetch all reviews for admin
  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        setLoading(false);
        return;
      }

      const queryParam = filter === 'all' ? '' : `?approved=${filter === 'approved'}`;
      const response = await axios.get(`http://localhost:8000/api/v1/reviews/admin/all${queryParam}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Reviews response:', response.data);

      if (response.data.success) {
        setReviews(response.data.message.reviews || []);
      } else {
        setError('Failed to fetch reviews');
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  // Approve or reject review
  const updateReviewStatus = async (reviewId, isApproved) => {
    try {
      setActionLoading(prev => ({ ...prev, [reviewId]: true }));
      
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
      const response = await axios.patch(
        `http://localhost:8000/api/v1/reviews/admin/${reviewId}/status`,
        { isApproved },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        // Update local state
        setReviews(prev => prev.map(review => 
          review._id === reviewId 
            ? { ...review, isApproved } 
            : review
        ));
        
        alert(`Review ${isApproved ? 'approved' : 'rejected'} successfully`);
      } else {
        alert('Failed to update review status');
      }
    } catch (err) {
      console.error('Error updating review:', err);
      alert('Error updating review status');
    } finally {
      setActionLoading(prev => ({ ...prev, [reviewId]: false }));
    }
  };

  // Delete review
  const deleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      return;
    }

    try {
      setActionLoading(prev => ({ ...prev, [reviewId]: true }));
      
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
      const response = await axios.delete(
        `http://localhost:8000/api/v1/reviews/admin/${reviewId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setReviews(prev => prev.filter(review => review._id !== reviewId));
        alert('Review deleted successfully');
      } else {
        alert('Failed to delete review');
      }
    } catch (err) {
      console.error('Error deleting review:', err);
      alert('Error deleting review');
    } finally {
      setActionLoading(prev => ({ ...prev, [reviewId]: false }));
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [filter]);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={`text-lg ${index < rating ? 'text-yellow-500' : 'text-gray-300'}`}>
        ★
      </span>
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
        <span className="ml-2">Loading reviews...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-lg font-bold text-red-800">Error Loading Reviews</h2>
          <p className="text-red-600">{error}</p>
          <button 
            onClick={fetchReviews}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Reviews Management</h1>
        
        {/* Filter Controls */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium ${
              filter === 'all' 
                ? 'bg-pink-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All Reviews
          </button>
          <button
            onClick={() => setFilter('unapproved')}
            className={`px-4 py-2 rounded-lg font-medium ${
              filter === 'unapproved' 
                ? 'bg-pink-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Pending Approval
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 rounded-lg font-medium ${
              filter === 'approved' 
                ? 'bg-pink-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Approved
          </button>
        </div>
      </div>
      
      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-blue-800">
          Found {reviews.length} reviews 
          {filter !== 'all' && ` (${filter})`}
        </p>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">
            {filter === 'all' ? 'No reviews found' : `No ${filter} reviews found`}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review._id} className="bg-white p-6 rounded-lg shadow border">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="font-semibold text-gray-900">{review.name}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      review.isApproved 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {review.isApproved ? 'Approved' : 'Pending Approval'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">{renderStars(review.rating)}</div>
                    <span className="text-sm text-gray-500">({review.rating}/5)</span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Email:</strong> {review.email}
                  </p>
                  
                  {review.service && (
                    <span className="inline-block bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded-full mb-2">
                      {review.service}
                    </span>
                  )}
                  
                  <p className="text-gray-700 leading-relaxed mt-3">{review.comment}</p>
                </div>
                
                <div className="text-sm text-gray-500 ml-4">
                  {new Date(review.createdAt).toLocaleDateString()}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t">
                {!review.isApproved && (
                  <button
                    onClick={() => updateReviewStatus(review._id, true)}
                    disabled={actionLoading[review._id]}
                    className={`px-4 py-2 text-sm font-medium rounded-lg ${
                      actionLoading[review._id]
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {actionLoading[review._id] ? 'Processing...' : 'Approve'}
                  </button>
                )}
                
                {review.isApproved && (
                  <button
                    onClick={() => updateReviewStatus(review._id, false)}
                    disabled={actionLoading[review._id]}
                    className={`px-4 py-2 text-sm font-medium rounded-lg ${
                      actionLoading[review._id]
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-yellow-600 text-white hover:bg-yellow-700'
                    }`}
                  >
                    {actionLoading[review._id] ? 'Processing...' : 'Unapprove'}
                  </button>
                )}
                
                <button
                  onClick={() => deleteReview(review._id)}
                  disabled={actionLoading[review._id]}
                  className={`px-4 py-2 text-sm font-medium rounded-lg ${
                    actionLoading[review._id]
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  {actionLoading[review._id] ? 'Processing...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReviews;