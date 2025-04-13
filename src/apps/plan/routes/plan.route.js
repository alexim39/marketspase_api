import express from 'express';
import { 
    purchasePlan, getPlansByPartner
} from '../controllers/plan.controller.js'

const PlanRouter = express.Router();

// user new plan purchase transaction
PlanRouter.post('/', purchasePlan);

// get plans
PlanRouter.get('/:partnerId', getPlansByPartner);



export default PlanRouter;