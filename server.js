import express from 'express';
import mongoose from 'mongoose';
import dotenv  from "dotenv"
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';

import GetStartedRouter from './src/apps/get-started/routes/get-started.route.js';
import partnerRouter from './src/apps/partner/routes/partner.route.js';
import contactRouter from './src/apps/contact/routes/contact.route.js';
import userBoookingRouter from './src/apps/booking/routes/booking.route.js';
import emailSubscriptionRouter from './src/apps/email-subscription/routes/email-subscription.route.js';


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
app.use('/partners', partnerRouter);
app.use('/contact', contactRouter);
app.use('/booking', userBoookingRouter);
app.use('/emailSubscription', emailSubscriptionRouter);


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