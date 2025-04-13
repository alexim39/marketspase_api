import express from 'express';
import { 
    getWeeklyProfitByPartner, getDailyProfit, getMonthlyProfitByPartner
} from '../controllers/profit.controller.js'

const ProfitRouter = express.Router();

// user new plan purchase transaction
//PlanRouter.post('/', purchasePlan);

// get weekly profits
ProfitRouter.get('/weekly-profit/:partnerId', getWeeklyProfitByPartner);

// get daily profits
ProfitRouter.get('/daily-profit/:partnerId', getDailyProfit);

// get monthly profits
ProfitRouter.get('/monthly-profit/:partnerId', getMonthlyProfitByPartner);



export default ProfitRouter;