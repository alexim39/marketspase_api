import express from 'express';
import { 
    getPartnerProfit, getPlansCount, getPartnerExpenses, calculatePartnerIncome, getRandomTestimonials,
    getRecentPayouts
} from '../controllers/dashboard.controller.js'

const DashboardRouter = express.Router();



// Get partner profit for a specified period
DashboardRouter.get('/partner-profit/:partnerId', getPartnerProfit);

// Get partner expenses for a specified period
DashboardRouter.get('/partner-expenses/:partnerId', getPartnerExpenses);

// Get partner profit for a specified period
DashboardRouter.get('/calculate-profit/:partnerId', calculatePartnerIncome);

// Get random testimonials for specified users
DashboardRouter.get('/random-testimonials', getRandomTestimonials);

// Get recent payouts for specified users
DashboardRouter.get('/recent-payouts', getRecentPayouts);

/**
 * @Note: Ensure this route is defined after the other routes to avoid conflicts.
 */
// get plans
DashboardRouter.get('/:partnerId', getPlansCount);
export default DashboardRouter;