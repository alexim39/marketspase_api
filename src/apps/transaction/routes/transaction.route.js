import express from 'express';
import { createTransaction} from '../controllers/transaction.controller.js'

const transactionRouter = express.Router();

// user new plan purchase transaction
transactionRouter.post('/plan', createTransaction);

export default transactionRouter;