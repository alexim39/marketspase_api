import { ProspectSurveyModel } from '../models/get-started.model.js';
import { sendEmail } from '../../../services/emailService.js';
import { ownerEmailTemplate } from '../services/email/ownerTemplate.js';
import { userWelcomeEmailTemplate } from '../services/email/userTemplate.js';
import { PartnersModel } from "../../partner/models/partner.model.js";
import bcrypt from "bcryptjs";
import { generateUniqueUsername } from '../services/usernameGenerator.js'; // Adjust path as needed


/**
 * Handles prospect survey form submissions.
 * Saves the survey data to the database, checks for duplicate email addresses,
 * and sends emails to the owner and the survey submitter.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {Promise<void>}
 */
export const prospectSurveyFormHandler = async (req, res) => {
  try {
    const surveyData = req.body;

    // Check if email already exists
    const existingSurvey = await ProspectSurveyModel.findOne({ email: surveyData.email });
    if (existingSurvey) {
      return res.status(400).json({ message: 'Email address already exists', user: existingSurvey });
    }

    // Save the survey data to MongoDB
    const survey = new ProspectSurveyModel(surveyData);
    await survey.save();

    res.status(201).json(survey); // 201 Created

  } catch (error) {
    console.error('Error handling prospect survey form:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


/**
 * Handles prospect sign up form submissions.
 * * - Validates the request data.
 * - Checks if the prospect already exists as a partner.
 * - Retrieves prospect data from the Survey collection.
 * - Hashes the password and generates a unique username.
 * - Creates a new partner record in the database.
 * - Sends email notifications to the owner and a welcome email to the prospect.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Promise<void>}
 */
export const prospectSignUpFormHandler = async (req, res) => {
    try {
        const signUpData = req.body;

        // Input Validation: Check if required fields are present and valid
        if (!signUpData.email || !signUpData.password || !signUpData.confirmPassword) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Check if prospect already exists as a partner (case-insensitive)
        const existingPartner = await PartnersModel.findOne({
            email: signUpData.email.trim(),
        }).collation({ locale: "en", strength: 2 });

        if (existingPartner) {
            return res.status(409).json({ message: "Prospect already exists as a partner" }); // Use 409 Conflict
        }

        // Validate that password and confirmPassword match
        if (signUpData.password !== signUpData.confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" }); // Use 400 Bad Request
        }

        // Find the prospect's survey record (case-insensitive)
        const surveyRecord = await ProspectSurveyModel.findOne({
            email: signUpData.email.trim(),
        }).collation({ locale: "en", strength: 2 });

        if (!surveyRecord) {
            return res.status(404).json({ message: "Prospect survey record not found" }); // Use 404 Not Found
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(signUpData.password, 10);

        // Generate a unique username
        const username = await generateUniqueUsername(surveyRecord.name, surveyRecord.surname);

        // Create a new partner
        const newPartner = new PartnersModel({
            name: surveyRecord.name,
            surname: surveyRecord.surname,
            email: surveyRecord.email,
            password: hashedPassword,
            partnerOf: surveyRecord.referer,
            username
        });

        await newPartner.save();

        // Send email to form owner
        const ownerSubject = 'New MarketSpase Sign Up';
        const ownerMessage = ownerEmailTemplate(surveyRecord);
        const ownerEmails = ['ago.fnc@gmail.com'];
        await Promise.all(ownerEmails.map(email => sendEmail(email, ownerSubject, ownerMessage)));

        // Send welcome email to the user
        const userSubject = 'Welcome to MarketSpase';
        const userMessage = userWelcomeEmailTemplate(surveyRecord);
        await sendEmail(surveyRecord.email, userSubject, userMessage);

        // Exclude password from the response
        const { password: _, ...userObject } = newPartner.toJSON();
        res.status(201).json(userObject); // Use 201 Created for successful resource creation

    } catch (error) {
        console.error('Error handling prospect signup:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};