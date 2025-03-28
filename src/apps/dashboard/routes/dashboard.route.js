import express from 'express';
import { 
    getPartnerProfit, getPlansCount, getPartnerExpenses, calculatePartnerIncome
} from '../controllers/dashboard.controller.js'

const DashboardRouter = express.Router();

// get plans
DashboardRouter.get('/:partnerId', getPlansCount);

// Get partner profit for a specified period
DashboardRouter.get('/partner-profit/:partnerId', getPartnerProfit);

// Get partner expenses for a specified period
DashboardRouter.get('/partner-expenses/:partnerId', getPartnerExpenses);

// Get partner profit for a specified period
DashboardRouter.get('/calculate-profit/:partnerId', calculatePartnerIncome);

export default DashboardRouter;