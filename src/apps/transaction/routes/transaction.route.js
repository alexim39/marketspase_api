import express from 'express';
import { 
    confirmPayment,
    getTransactions,
    withdrawRequest
} from '../controllers/transaction.controller.js'

const TransactionRouter = express.Router();

// confirm payment
TransactionRouter.post('/confirm-payment', confirmPayment);

// get transactions
TransactionRouter.get('/transaction/:partnerId', getTransactions);

// confirm payment
TransactionRouter.post('/withdraw-request', withdrawRequest);

export default TransactionRouter;