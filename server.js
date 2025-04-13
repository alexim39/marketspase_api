import express from 'express';
import mongoose from 'mongoose';
import dotenv  from "dotenv"
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';

import './src/services/cronJob.js'; // Import cron job to start it


import GetStartedRouter from './src/apps/get-started/index.js';
import PartnerRouter from './src/apps/partner/index.js';
import ContactRouter from './src/apps/contact/index.js';
import BookingRouter from './src/apps/booking/index.js';
import EmailSubscriptionRouter from './src/apps/email-subscription/index.js';
import PlanRouter from './src/apps/plan/index.js';
import AdsRouter from './src/apps/ads/index.js';
import TransactionRouter from './src/apps/transaction/index.js';
import SettingsRouter from './src/apps/settings/index.js';
import DashboardRouter from './src/apps/dashboard/index.js';
import AuthRouter from './src/apps/auth/index.js';
import AnalyticsRouter from './src/apps/analytics/index.js';
import ProfitRouter from './src/apps/profit/index.js';


const port = process.env.PORT || 3000;
const app = express();
app.use(express.json()); // Use json middleware
app.use(express.urlencoded({extended: false})); // Use formdata middleware
dotenv.config()
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: [
        'http://localhost:4200', 
        'http://localhost:4201', 
        'http://localhost:4202', 
        'http://localhost:4203', 

        'http://marketspase.com', 
        'https://marketspase.com', 

        'http://platform.marketspase.com', 
        'https://platform.marketspase.com', 

        'http://shop.marketspase.com',
        'https://shop.marketspase.com',

        'http://admin.marketspase.com',
        'https://admin.marketspase.com',

        'www.marketspase.com',
        'www.platform.marketspase.com',
        'www.shop.marketspase.com',
        'www.admin.marketspase.com',
    ]
}));

/* Routes */
app.get('/', (req, res) => res.send('Node server is up and running'));
app.use('/get-started', GetStartedRouter);
app.use('/partners', PartnerRouter);
app.use('/contact', ContactRouter);
app.use('/booking', BookingRouter);
app.use('/emailSubscription', EmailSubscriptionRouter);
app.use('/plan', PlanRouter);
app.use('/ads', AdsRouter);
app.use('/transaction', TransactionRouter);
app.use('/settings', SettingsRouter);
app.use('/dashboard', DashboardRouter);
app.use('/auth', AuthRouter);
app.use('/analytics', AnalyticsRouter);
app.use('/profit', ProfitRouter);


// Convert `import.meta.url` to `__dirname` equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'src', 'uploads')));

/* DB connection */
mongoose.connect(`mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.fblwb.mongodb.net/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority&appName=Cluster0`)
.then(() => {
    // Application Starts Only when MongoDB is connected
    console.log('Connected to mongoDB')
    app.listen(port, () => {
        console.log(`Server is running on port: http://localhost:${port}`)
    })
}).catch((error) => {
    console.error('Error from mongoDB connection ', error)
})