import {ContactModel, GuideDownloadModel} from '../models/contact.model.js';
import { sendEmail } from "../../../services/emailService.js";
import { ownerEmailTemplate } from '../services/email/ownerTemplate.js';
import { userWelcomeEmailTemplate } from '../services/email/userTemplate.js';


//generate a numerical id.
function generateNumericContactRequestId(length = 8) {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += Math.floor(Math.random() * 10); // Generates a random digit (0-9)
    }
    return result;
}

// User contact contnroller
export const ContactController = async (req, res) => {
    const requestID = generateNumericContactRequestId();
    try {

        //console.log('sent==',req.body);

        const contactObject = await ContactModel.create({
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email,
            subject: req.body.subject,
            message: req.body.message,
            requestID: requestID
        });

        // Send email to form owner
        const ownerSubject = 'MarketSpase Contact Request';
        const ownerMessage = ownerEmailTemplate(contactObject);
        const ownerEmails = ['ago.fnc@gmail.com'];
        await Promise.all(ownerEmails.map(email => sendEmail(email, ownerSubject, ownerMessage)));

        // Send welcome email to the user
        const userSubject = `MarketSpase Support Request - ${requestID}`;
        const userMessage = userWelcomeEmailTemplate(contactObject);
        await sendEmail(contactObject.email, userSubject, userMessage);

        res.status(200).json(contactObject);

    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: error.message
        })
    }
}



// User download contnroller
export const GuideDownloadController = async (req, res) => {
    try {

        //console.log('sent==',req.body);

        const downloadObject = await GuideDownloadModel.create({
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email,
            userDevice: req.body.userDevice,
            username: req.body.username,
        });  

        // Send email after successfully submitting the records
        const emailSubject = 'MarketSpase Business Guide Download';
        const emailMessage = `
            <h1>Business Guide Download Form</h1>
            <p>Kindly note that ${req.body.name} ${req.body.surname} downloaded the business guide document marketspase webiste.</p>

            <br>
            <h1>Complete Prospect Response</h1>
            <p>Name: ${req.body.name}</p>
            <p>Surname: ${req.body.surname}</p>
            <p>Email address: ${req.body.email}</p>
        `;

        const emailsToSend = ['ago.fnc@gmail.com'];

        for (const email of emailsToSend) {
            await sendEmail(email, emailSubject, emailMessage);
        }

        res.status(200).json(downloadObject);

    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: error.message
        })
    }
}