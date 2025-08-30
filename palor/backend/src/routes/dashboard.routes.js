import { Router } from 'express';
import {
    getDashboardOverview,
    getRevenueAnalytics,
    getPopularServices,
    getAppointmentStats,
    getRecentTransactions,
    getCustomerGrowth
} from '../controller/dashbaord.controller.js';
import { verifyJWT, verifyAdmin } from '../middleware/auth.middleware.js';

const dashboardRouter = Router();

// Dashboard overview - main dashboard statistics
dashboardRouter.route('/overview')
    .get(verifyJWT, verifyAdmin, getDashboardOverview);

// Revenue analytics - revenue grouped by date
dashboardRouter.route('/revenue-analytics')
    .get(verifyJWT, verifyAdmin, getRevenueAnalytics);

// Popular services - most booked services
dashboardRouter.route('/popular-services')
    .get(verifyJWT, verifyAdmin, getPopularServices);

// Appointment statistics - breakdown by status
dashboardRouter.route('/appointment-stats')
    .get(verifyJWT, verifyAdmin, getAppointmentStats);

// Recent transactions - latest transaction history
dashboardRouter.route('/recent-transactions')
    .get(verifyJWT, verifyAdmin, getRecentTransactions);

// Customer growth - new customer analytics
dashboardRouter.route('/customer-growth')
    .get(verifyJWT, verifyAdmin, getCustomerGrowth);

export default dashboardRouter;
