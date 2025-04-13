import express from 'express';
import { 
    getTransactions,
    withdrawRequest, deleteSavedAccount
} from '../controllers/transaction.controller.js'

const TransactionRouter = express.Router();

// get transactions
TransactionRouter.get('/:partnerId', getTransactions);

// confirm payment
TransactionRouter.post('/withdraw-request', withdrawRequest);

// confirm payment
TransactionRouter.delete('/saved-accounts/:partnerId/:accountId', deleteSavedAccount);

export default TransactionRouter;