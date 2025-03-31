import { PlanModel } from "../models/plan.model.js";
import mongoose from 'mongoose';
import { sendEmail } from '../../../services/emailService.js';
import { ownerEmailTemplate } from '../services/email/ownerTemplate.js';
import { userEmailTemplate } from '../services/email/userTemplate.js';
import { PartnersModel } from '../../partner/models/partner.model.js'; 
import { CalculateCompensationAndDistribute } from '../services/compensator/compensator.js'; 
import { CampaignModel } from '../../ads/models/campaign.js';
import { TransactionModel } from '../../transaction/models/transaction.model.js';

// Create and save a new transaction
export const createPlan = async (req, res) => {
  try {
    const { partnerId, amount, currency, reference, status, message, trans } = req.body;


    // Validate required fields
    if (!partnerId || !amount || !reference) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Validate partnerId format
    if (!mongoose.Types.ObjectId.isValid(partnerId)) {
      return res.status(400).json({ success: false, message: 'Invalid partner ID format' });
    }

    // Validate amount
    if (amount < 10000) {
      return res.status(400).json({ success: false, message: 'Amount must be at least 10,000' });
    }

    // Validate currency and status with default options
    const allowedCurrencies = ['NGN', 'USD', 'EUR'];
    const allowedStatuses = ['success', 'pending', 'failed'];
    if (currency && !allowedCurrencies.includes(currency)) {
      return res.status(400).json({ error: 'Invalid currency option' });
    }
    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status option' });
    }

    // Check if the transaction reference already exists
    const existingTransaction = await PlanModel.findOne({ reference });
    if (existingTransaction) {
      return res.status(409).json({ success: false, message: 'Transaction reference already exists' });
    }

    // Create a new transaction record
    const plan = new PlanModel({
      partnerId,
      amount,
      currency: currency || 'NGN',
      reference,
      status: status || 'pending',
      message,
      trans
    });

    // Save transaction to the database
    const savedPlan = await plan.save();

    // If the transaction is successful, update partner's balance
    if (status === 'success') {
      let repay = 0;

      // Map amounts to repay values for clarity and maintainability
      const repayMapping = {
        10000: 3000,
        30000: 10000,
        50000: 15000,
        100000: 30000
      };
      repay = repayMapping[amount] || 0;

      const updatedPartner = await PartnersModel.findByIdAndUpdate(
        partnerId,
        { $inc: { balance: repay } },  // Increment balance by the repay amount
        { new: true }  // Return updated partner document
      );

      if (!updatedPartner) {
        return res.status(404).json({ success: false, message: 'Partner not found' });
      }

      // Distribute compensations
      CalculateCompensationAndDistribute(amount);

      // Send email to form owner
      const ownerSubject = 'New MarketSpase Payment';
      const ownerMessage = ownerEmailTemplate(plan);
      const ownerEmails = ['ago.fnc@gmail.com']; // Consider moving this to a config file
      await Promise.all(ownerEmails.map(email => sendEmail(email, ownerSubject, ownerMessage)));

      // Send welcome email to the user
      const userSubject = 'MarketSpase Spase Plan Confirmation';
      const userMessage = userEmailTemplate(updatedPartner);
      await sendEmail(updatedPartner.email, userSubject, userMessage);

      // Activate default ads
      const now = new Date();  // Get the current date and time
      const twoDaysLater = new Date(now);
      twoDaysLater.setDate(now.getDate() + 14);  // Set the end date to 14 days later

      // Activate default ads for the partner
      const defaultAds = new CampaignModel({
        targetAudience: { ageRangeTarget: 'All', genderTarget: 'All' },
        marketingObjectives: { adObjective: 'Lead generation' },
        budget: { budgetType: 'Daily budget', budgetAmount: 2000 },
        adDuration: {
          campaignStartDate: now.toISOString(),  // Use current date as start date
          noEndDate: false,
          campaignEndDate: twoDaysLater.toISOString()  // Use date 12 days later as end date
        },
        adFormat: { adFormat: 'Search engine', deviceType: 'All devices' },
        createdBy: partnerId,
        campaignName: 'Google',
        deliveryStatus: 'Pending'
      });

      // Save the Ad document to the database
      await defaultAds.save();

      // Record the transaction  
      const transaction = new TransactionModel({
        partnerId: partnerId,
        amount: amount,  // Use the budget amount as the charge
        status: status,
        paymentMethod: 'Paystack',
        purpose: 'Plan purchase',
        transactionType: 'Debit',
        reference: Math.floor(100000000 + Math.random() * 900000000).toString() // Generate a random 9-digit number as a string
      });
      await transaction.save();

      res.status(200).json({
        message: 'Transaction saved successfully!',
        plan: savedPlan,
        success: true,
      });
    }
  } catch (error) {
    console.error('Error saving transaction:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Get all plans for a specific partner
export const getPlansByPartner = async (req, res) => {
  try {
    const { partnerId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(partnerId)) {
      return res.status(400).json({ success: false, message: 'Invalid partner ID format' });
    }

    const plans = await PlanModel.find({ partnerId }).sort({ date: -1 }); // Sort by date in descending order

    res.status(200).json({success: true, plans});
  } catch (error) {
    console.error('Error retrieving plans:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
