import { Router } from "express";
import { 
    createReview, 
    getPublicReviews, 
    getAllReviews, 
    updateReviewStatus, 
    deleteReview, 
    getReviewStats 
} from "../controller/review.controller.js";
import { verifyJWT, verifyAdmin } from "../middleware/auth.middleware.js";

const reviewRouter = Router();

// Public routes
reviewRouter.route('/public').get(getPublicReviews);
reviewRouter.route('/stats').get(getReviewStats);

// Protected routes (optional auth - can be anonymous)
reviewRouter.route('/create').post(createReview);

// Admin routes
reviewRouter.route('/admin/all').get(verifyJWT, verifyAdmin, getAllReviews);
reviewRouter.route('/admin/:reviewId/status').patch(verifyJWT, verifyAdmin, updateReviewStatus);
reviewRouter.route('/admin/:reviewId').delete(verifyJWT, verifyAdmin, deleteReview);

export default reviewRouter;