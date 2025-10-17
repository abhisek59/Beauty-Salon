import { Transaction } from '../models/transaction.models.js';
import { User } from '../models/user.models.js';
import { Service } from '../models/service.models.js';
import { Appointment } from '../models/appointment.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/apiResponse.js';

// Get dashboard overview statistics
const getDashboardOverview = asyncHandler(async (req, res) => {
    const { startDate, endDate } = req.query;
    
    // Date range filter for createdAt / transactionDate
    const dateFilter = {};
    if (startDate && endDate) {
        dateFilter.createdAt = { 
            $gte: new Date(startDate), 
            $lte: new Date(endDate) 
        };
    }

    // Get total counts
    const totalUsers = await User.countDocuments({ role: 'customer' });
    const totalStaff = await User.countDocuments({ role: 'staff' });
    const totalServices = await Service.countDocuments();
    
    // Get appointment statistics
    const totalAppointments = await Appointment.countDocuments(dateFilter);
    const completedAppointments = await Appointment.countDocuments({ 
        ...dateFilter, 
        status: 'completed' 
    });
    const pendingAppointments = await Appointment.countDocuments({ 
        ...dateFilter, 
        status: 'pending' 
    });
    const cancelledAppointments = await Appointment.countDocuments({ 
        ...dateFilter, 
        status: 'cancelled' 
    });

    // Count today's appointments specifically (appointments with appointmentDate equal to today)
    const startOfToday = new Date();
    startOfToday.setHours(0,0,0,0);
    const endOfToday = new Date();
    endOfToday.setHours(23,59,59,999);

    const todayAppointments = await Appointment.countDocuments({
        appointmentDate: { $gte: startOfToday, $lte: endOfToday }
    });

    // Get revenue statistics
    // Build match for transactions: use createdAt if dateFilter applied
    const txMatch = {};
    if (startDate && endDate) {
        txMatch.createdAt = dateFilter.createdAt;
    }

    const revenueData = await Transaction.aggregate([
        { $match: txMatch },
        { 
            $group: { 
                _id: null, 
                totalRevenue: { $sum: "$amount" },
                totalTransactions: { $sum: 1 }
            } 
        }
    ]);

    const totalRevenue = revenueData[0]?.totalRevenue || 0;
    const totalTransactions = revenueData[0]?.totalTransactions || 0;

    return res.status(200).json(new ApiResponse(200, {
        totalUsers,
        totalStaff,
        totalServices,
        totalAppointments,
        completedAppointments,
        pendingAppointments,
        cancelledAppointments,
        todayAppointments,
        totalRevenue,
        totalTransactions
    }, "Dashboard overview fetched successfully"));
});

// Get revenue analytics by date range
const getRevenueAnalytics = asyncHandler(async (req, res) => {
    const { startDate, endDate, groupBy = 'day' } = req.query;
    
    let dateGrouping;
    switch (groupBy) {
        case 'month':
            dateGrouping = {
                year: { $year: "$transactionDate" },
                month: { $month: "$transactionDate" }
            };
            break;
        case 'week':
            dateGrouping = {
                year: { $year: "$transactionDate" },
                week: { $week: "$transactionDate" }
            };
            break;
        default:
            dateGrouping = {
                year: { $year: "$transactionDate" },
                month: { $month: "$transactionDate" },
                day: { $dayOfMonth: "$transactionDate" }
            };
    }

    const matchFilter = {};
    if (startDate && endDate) {
        matchFilter.transactionDate = {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
        };
    }

    const revenueAnalytics = await Transaction.aggregate([
        { $match: matchFilter },
        {
            $group: {
                _id: dateGrouping,
                totalRevenue: { $sum: "$amount" },
                transactionCount: { $sum: 1 },
                avgTransactionAmount: { $avg: "$amount" }
            }
        },
        { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
    ]);

    return res.status(200).json(new ApiResponse(200, revenueAnalytics, "Revenue analytics fetched successfully"));
});

// Get popular services
const getPopularServices = asyncHandler(async (req, res) => {
    const { limit = 10 } = req.query;

    const popularServices = await Transaction.aggregate([
        {
            $group: {
                _id: "$serviceId",
                totalBookings: { $sum: 1 },
                totalRevenue: { $sum: "$amount" }
            }
        },
        {
            $lookup: {
                from: "services",
                localField: "_id",
                foreignField: "_id",
                as: "serviceDetails"
            }
        },
        { $unwind: "$serviceDetails" },
        {
            $project: {
                serviceName: "$serviceDetails.name",
                servicePrice: "$serviceDetails.price",
                totalBookings: 1,
                totalRevenue: 1
            }
        },
        { $sort: { totalBookings: -1 } },
        { $limit: parseInt(limit) }
    ]);

    return res.status(200).json(new ApiResponse(200, popularServices, "Popular services fetched successfully"));
});

// Get appointment statistics by status
const getAppointmentStats = asyncHandler(async (req, res) => {
    const { startDate, endDate } = req.query;
    
    const matchFilter = {};
    if (startDate && endDate) {
        matchFilter.appointmentDate = {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
        };
    }

    const appointmentStats = await Appointment.aggregate([
        { $match: matchFilter },
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 }
            }
        }
    ]);

    return res.status(200).json(new ApiResponse(200, appointmentStats, "Appointment statistics fetched successfully"));
});

// Get recent transactions
const getRecentTransactions = asyncHandler(async (req, res) => {
    const { limit = 10 } = req.query;

    const recentTransactions = await Transaction.find({})
        .populate('serviceId', 'name price')
        .populate('customerId', 'fullName email')
        .sort({ transactionDate: -1 })
        .limit(parseInt(limit));

    return res.status(200).json(new ApiResponse(200, recentTransactions, "Recent transactions fetched successfully"));
});

// Get customer growth analytics
const getCustomerGrowth = asyncHandler(async (req, res) => {
    const { startDate, endDate } = req.query;

    const matchFilter = { role: 'customer' };
    if (startDate && endDate) {
        matchFilter.createdAt = {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
        };
    }

    const customerGrowth = await User.aggregate([
        { $match: matchFilter },
        {
            $group: {
                _id: {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" }
                },
                newCustomers: { $sum: 1 }
            }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    return res.status(200).json(new ApiResponse(200, customerGrowth, "Customer growth analytics fetched successfully"));
});

export {
    getDashboardOverview,
    getRevenueAnalytics,
    getPopularServices,
    getAppointmentStats,
    getRecentTransactions,
    getCustomerGrowth
}; 