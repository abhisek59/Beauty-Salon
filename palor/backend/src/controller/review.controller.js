import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Review } from "../models/review.model.js";

// Create a new review
const createReview = asyncHandler(async (req, res) => {
    const { name, email, rating, comment, service } = req.body;

    if (!name || !email || !rating || !comment) {
        throw new ApiError(400, "Name, email, rating, and comment are required");
    }

    if (rating < 1 || rating > 5) {
        throw new ApiError(400, "Rating must be between 1 and 5");
    }

    const review = await Review.create({
        name,
        email,
        rating,
        comment,
        service: service || '',
        userId: req.user?._id // Optional if user is logged in
    });

    return res.status(201).json(
        new ApiResponse(201, review, "Review submitted successfully. It will be published after approval.")
    );
});

// Get all approved reviews
const getPublicReviews = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, service } = req.query;

    const query = {
        isApproved: true,
        isPublished: true
    };

    if (service) {
        query.service = service;
    }

    const reviews = await Review.find(query)
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .select('-email -userId'); // Don't expose sensitive data

    const total = await Review.countDocuments(query);

    return res.status(200).json(
        new ApiResponse(200, {
            reviews,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalReviews: total,
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1
            }
        }, "Reviews retrieved successfully")
    );
});

// Admin: Get all reviews (including unapproved)
const getAllReviews = asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, approved, service } = req.query;

    const query = {};
    
    if (approved !== undefined) {
        query.isApproved = approved === 'true';
    }
    
    if (service) {
        query.service = service;
    }

    const reviews = await Review.find(query)
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

    const total = await Review.countDocuments(query);

    return res.status(200).json(
        new ApiResponse(200, {
            reviews,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalReviews: total,
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1
            }
        }, "All reviews retrieved successfully")
    );
});

// Admin: Approve/Reject review
const updateReviewStatus = asyncHandler(async (req, res) => {
    const { reviewId } = req.params;
    const { isApproved, isPublished } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) {
        throw new ApiError(404, "Review not found");
    }

    const updateData = {};
    if (isApproved !== undefined) updateData.isApproved = isApproved;
    if (isPublished !== undefined) updateData.isPublished = isPublished;

    const updatedReview = await Review.findByIdAndUpdate(
        reviewId,
        updateData,
        { new: true }
    );

    return res.status(200).json(
        new ApiResponse(200, updatedReview, "Review status updated successfully")
    );
});

// Admin: Delete review
const deleteReview = asyncHandler(async (req, res) => {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);
    if (!review) {
        throw new ApiError(404, "Review not found");
    }

    await Review.findByIdAndDelete(reviewId);

    return res.status(200).json(
        new ApiResponse(200, null, "Review deleted successfully")
    );
});

// Get review statistics
const getReviewStats = asyncHandler(async (req, res) => {
    const stats = await Review.aggregate([
        {
            $match: { isApproved: true, isPublished: true }
        },
        {
            $group: {
                _id: null,
                totalReviews: { $sum: 1 },
                averageRating: { $avg: "$rating" },
                fiveStarCount: { $sum: { $cond: [{ $eq: ["$rating", 5] }, 1, 0] } },
                fourStarCount: { $sum: { $cond: [{ $eq: ["$rating", 4] }, 1, 0] } },
                threeStarCount: { $sum: { $cond: [{ $eq: ["$rating", 3] }, 1, 0] } },
                twoStarCount: { $sum: { $cond: [{ $eq: ["$rating", 2] }, 1, 0] } },
                oneStarCount: { $sum: { $cond: [{ $eq: ["$rating", 1] }, 1, 0] } }
            }
        }
    ]);

    const result = stats[0] || {
        totalReviews: 0,
        averageRating: 0,
        fiveStarCount: 0,
        fourStarCount: 0,
        threeStarCount: 0,
        twoStarCount: 0,
        oneStarCount: 0
    };

    return res.status(200).json(
        new ApiResponse(200, result, "Review statistics retrieved successfully")
    );
});

export {
    createReview,
    getPublicReviews,
    getAllReviews,
    updateReviewStatus,
    deleteReview,
    getReviewStats
};