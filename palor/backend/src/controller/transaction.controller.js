import { Transaction } from '../models/transaction.models.js';
import { asyncHandler } from '../utils/asyncHandler.js';

import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/apiResponse.js';


const createTransaction = asyncHandler(async (req, res) => {
    const { userId, serviceId, amount, paymentMethod, transactionDate } = req.body;

    if (!userId || !serviceId || !amount || !paymentMethod || !transactionDate) {
        throw new ApiError(400, "All fields are required");
    }
    const transaction = await Transaction.create({
        customerId:userId,
        serviceId,
        amount,
        paymentMethod,
        transactionDate
    });

    return res.status(201)
        .json(new ApiResponse(201, transaction, "Transaction created successfully"));
});
const updateTransaction = asyncHandler(async (req, res) => {
    const { transactionId } = req.params;
    const { amount, paymentMethod, transactionDate } = req.body;    
    if (!transactionId) {
        throw new ApiError(400, "Transaction ID is required");
    }
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
        throw new ApiError(404, "Transaction not found");
    }
    if (amount) transaction.amount = amount;
    if (paymentMethod) transaction.paymentMethod = paymentMethod;
    if (transactionDate) transaction.transactionDate = transactionDate;
    await transaction.save();
    return res.status(200)
        .json(new ApiResponse(200, transaction, "Transaction updated successfully"));
});
const deleteTransaction = asyncHandler(async (req, res) => {
    const { transactionId } = req.params;
    if (!transactionId) {
        throw new ApiError(400, "Transaction ID is required");
    }
    const transaction = await Transaction.findByIdAndDelete(transactionId);
    if (!transaction) {
        throw new ApiError(404, "Transaction not found");
    }   
    return res.status(200)
        .json(new ApiResponse(200, null, "Transaction deleted successfully"));
}); 

const getUserTransactions = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { startDate, endDate } = req.query; // Optional query params
    if (!userId) {
        throw new ApiError(400, "User ID is required");
    }   
    const query = { customerId: userId };
    if (startDate && endDate) {
        query.transactionDate = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const transactions = await Transaction.find(query).populate('serviceId');
    res.status(200).json({
        success: true,
        transactions
    });
});
const getTotalTransactions = asyncHandler(async (req, res) => {
    const { startDate, endDate } = req.query; // Optional query params
    const match = {};
    if (startDate && endDate) {
        match.transactionDate = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    // Aggregate to sum the amount field
    const result = await Transaction.aggregate([
        { $match: match },
        { $group: { _id: null, totalAmount: { $sum: "$amount" }, count: { $sum: 1 } } }
    ]);
    const totalAmount = result[0]?.totalAmount || 0;
    const totalTransactions = result[0]?.count || 0;
    res.status(200).json({
        success: true,
        totalTransactions,
        totalAmount
    });
});
const getTransactionById = asyncHandler(async (req, res) => {
    const { transactionId } = req.params;
    if (!transactionId) {
        throw new ApiError(400, "Transaction ID is required");
    }
    const transaction = await Transaction.findById(transactionId).populate('serviceId');
    if (!transaction) {
        throw new ApiError(404, "Transaction not found");
    }
    return res.status(200).json(new ApiResponse(200, transaction, "Transaction fetched successfully"));
});

const getAllTransactions = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const transactions = await Transaction.find({})
        .populate('serviceId')
        .skip(skip)
        .limit(parseInt(limit));
    const total = await Transaction.countDocuments();
    return res.status(200).json({
        success: true,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        transactions
    });
});

const getTransactionsByService = asyncHandler(async (req, res) => {
    const { serviceId } = req.params;
    if (!serviceId) {
        throw new ApiError(400, "Service ID is required");
    }
    const transactions = await Transaction.find({ serviceId }).populate('serviceId');
    return res.status(200).json({
        success: true,
        transactions
    });
});

const getTransactionsByPaymentMethod = asyncHandler(async (req, res) => {
    const { paymentMethod } = req.params;
    if (!paymentMethod) {
        throw new ApiError(400, "Payment method is required");
    }
    const transactions = await Transaction.find({ paymentMethod }).populate('serviceId');
    return res.status(200).json({
        success: true,
        transactions
    });
});

export {
    createTransaction,
    getUserTransactions,
    getTotalTransactions,
    updateTransaction,
    deleteTransaction,
    getTransactionById,
    getAllTransactions,
    getTransactionsByService,
    getTransactionsByPaymentMethod
}