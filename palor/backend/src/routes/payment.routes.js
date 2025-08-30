import { Router } from 'express';
import {
    processCashPayment,
    processCardPayment,
    processOnlinePayment,
    processPayPalPayment,
    createPayPalOrder,
    getPaymentHistory,
    validatePayment,
    processRefund,
    getPaymentStats
} from '../controller/payment.controller.js';
import { verifyJWT, verifyAdmin } from '../middleware/auth.middleware.js';

const paymentRouter = Router();

// Payment processing routes
paymentRouter.route('/cash')
    .post(verifyJWT, processCashPayment);

paymentRouter.route('/card')
    .post(verifyJWT, processCardPayment);

paymentRouter.route('/online')
    .post(verifyJWT, processOnlinePayment);

// PayPal specific routes
paymentRouter.route('/paypal/create-order')
    .post(verifyJWT, createPayPalOrder);

paymentRouter.route('/paypal/capture')
    .post(verifyJWT, processPayPalPayment);

// Payment management routes
paymentRouter.route('/history/:customerId')
    .get(verifyJWT, getPaymentHistory);

paymentRouter.route('/validate/:transactionId')
    .get(verifyJWT, validatePayment);

paymentRouter.route('/refund')
    .post(verifyJWT, verifyAdmin, processRefund);

paymentRouter.route('/stats')
    .get(verifyJWT, verifyAdmin, getPaymentStats);

export default paymentRouter;
