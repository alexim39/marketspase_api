import express from 'express';
import { 
    createPlan, getPlansByPartner
} from '../controllers/plan.controller.js'

const PlanRouter = express.Router();

// user new plan purchase transaction
PlanRouter.post('/', createPlan);

// get plans
PlanRouter.get('/:partnerId', getPlansByPartner);



export default PlanRouter;