import {ContactModel, GuideDownloadModel} from '../models/contact.model.js';
import { sendEmail } from "../../../services/emailService.js";
  
// User contact contnroller
export const ContactController = async (req, res) => {
    try {

        //console.log('sent==',req.body);

        const contactObject = await ContactModel.create({
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email,
            subject: req.body.subject,
            message: req.body.message,
        });

        // Send email after successfully submitting the records
        const emailSubject = 'MarketSpase Contact Form';
        const emailMessage = `
            <h1>Contact Form</h1>
            <p>Kindly note that ${req.body.name} ${req.body.surname} filled the contact form on Diamond Project webiste.</p>

            <br>
            <h1>Complete Prospect Response</h1>
            <p>Name: ${req.body.name}</p>
            <p>Surname: ${req.body.surname}</p>
            <p>Email address: ${req.body.email}</p>
            <p>Subject: ${req.body.subject}</p>
            <p>Messsage: ${req.body.message}</p>
        `;

        const emailsToSend = ['ago.fnc@gmail.com'];

        for (const email of emailsToSend) {
            await sendEmail(email, emailSubject, emailMessage);
        }

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