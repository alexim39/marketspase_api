import express from 'express';
import { createPlan} from '../controllers/plan.controller.js'

const PlanRouter = express.Router();

// user new plan purchase transaction
PlanRouter.post('/', createPlan);

export default PlanRouter;