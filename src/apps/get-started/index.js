import express from 'express';
const app = express();
app.use(express.json()); // Use json middleware
app.use(express.urlencoded({extended: false})); // Use formdata middleware
import GetStartedRouter from './routes/get-started.route.js';
export default GetStartedRouter;