import express from 'express';
const app = express();
app.use(express.json()); // Use json middleware
app.use(express.urlencoded({extended: false})); // Use formdata middleware
import ProfitRouter from './routes/profit.routes.js';
export default ProfitRouter;