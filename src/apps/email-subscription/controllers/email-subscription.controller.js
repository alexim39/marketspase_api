import {EmailSubscriptionModel} from '../models/email-subscription.model.js';
import { sendEmail } from "../../../services/emailService.js";

  
// User email subscription
export const emailSubscription = async (req, res) => {
    try {

        //console.log('sent==',req.body);

        const emailSubscription = await EmailSubscriptionModel.create({
            email: req.body.email,
            userDevice: req.body.userDevice,
            username: req.body.username,
        });

        // Send email after successfully submitting the records
        const emailSubject = 'MarketSpase Email Subscription';
        const emailMessage = `
            <h1>Email Subscription</h1>
            <p>Kindly note that someone subscribed to the email subscription form on MarkeSpase webiste: ${req.body.email}</p>
        `;

        const emailsToSend = ['ago.fnc@gmail.com'];

        for (const email of emailsToSend) {
            await sendEmail(email, emailSubject, emailMessage);
        }

        res.status(200).json({success: true, data: emailSubscription});

    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: 'internal server error',
            success: false,
        })
    }
}