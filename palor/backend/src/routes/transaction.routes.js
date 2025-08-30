import { Router } from 'express';
import {
  createTransaction,
  getUserTransactions,
  getTotalTransactions,
  updateTransaction,
  deleteTransaction,
  getTransactionById,
  getAllTransactions,
  getTransactionsByService,
  getTransactionsByPaymentMethod
} from '../controller/transaction.controller.js';
import { verifyAdmin, verifyJWT } from '../middleware/auth.middleware.js';
// import { verifyJWT, verifyAdmin } from '../middleware/auth.middleware.js'; // Uncomment if you want to use auth

const transactionRouter = Router();

// Create a transaction
transactionRouter.route('/create')
  .post(verifyJWT,verifyAdmin,createTransaction)
 


// Get total transactions (optionally by date range)
transactionRouter.route('/total')
  .get( verifyJWT,verifyAdmin,getTotalTransactions);

// Get transactions by service
transactionRouter.route('/service/:serviceId')
  .get(getTransactionsByService);

// Get transactions by payment method
transactionRouter.route('/payment/:paymentMethod')
  .get(getTransactionsByPaymentMethod);

export default transactionRouter;