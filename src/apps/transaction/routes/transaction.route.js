import express from 'express';
import { 
    getTransactions,
    withdrawRequest
} from '../controllers/transaction.controller.js'

const TransactionRouter = express.Router();

// get transactions
TransactionRouter.get('/:partnerId', getTransactions);

// confirm payment
TransactionRouter.post('/withdraw-request', withdrawRequest);

export default TransactionRouter;