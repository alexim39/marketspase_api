import express from 'express';
import {
    getAnalytics
} from '../controllers/analytics.controller.js'

const AnalyticsRouter = express.Router();


// partner account activation email request
AnalyticsRouter.get('/:partnerId', getAnalytics);


export default AnalyticsRouter;