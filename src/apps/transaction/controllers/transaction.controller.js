import { TransactionModel } from "../models/transaction.model.js";
import mongoose from 'mongoose';
import { sendEmail } from '../../../services/emailService.js';
import { ownerEmailTemplate } from '../services/email/ownerTemplate.js';
import { userEmailTemplate } from '../services/email/userTemplate.js';
import { PartnersModel } from './../../partner/models/partner.model.js'; 
import { CalculateCompensationAndDistribute } from '../services/compensator/compensator.js'; 

// Create and save a new transaction
export const createTransaction = async (req, res) => {
  try {
    const { partnerId, amount, currency, reference, status, message, trans } = req.body;

    // Validate required fields
    if (!partnerId || !amount || !reference) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate partnerId format
    if (!mongoose.Types.ObjectId.isValid(partnerId)) {
      return res.status(400).json({ error: 'Invalid partner ID format' });
    }

    // Validate amount
    if (amount < 10000) {
      return res.status(400).json({ error: 'Amount must be valid' });
    }

    // Validate currency and status with default options
    const allowedCurrencies = ['NGN', 'USD', 'EUR'];
    const allowedStatuses = ['success', 'pending', 'failed'];
    if (currency && !allowedCurrencies.includes(currency)) {
      return res.status(400).json({ error: 'Invalid currency option' });
    }
    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status option' });
    }

    // Check if the transaction reference already exists
    const existingTransaction = await TransactionModel.findOne({ reference });
    if (existingTransaction) {
      return res.status(409).json({ error: 'Transaction reference already exists' });
    }

    // Create a new transaction record
    const transaction = new TransactionModel({
      partnerId,
      amount,
      currency: currency || 'NGN',
      reference,
      status: status || 'pending',
      message,
      trans
    });

    // Save transaction to the database
    const savedTransaction = await transaction.save();

    // If the transaction is successful, update partner's balance
    if (status === 'success') {
      let repay = 0;

      switch (amount) {
        case 10000:
          repay = 3000;

          // start 1k ads
          break;
        case 30000:
          repay = 10000;

          // start 2k ads
          break;
        case 50000:
          repay = 15000;

          // start 5k ads
          break;
        case 100000:
          repay = 30000;

          // start 10k ads
          break;
        default:
          repay = 0;
          break;
      }

      const updatedPartner = await PartnersModel.findByIdAndUpdate(
        partnerId,
        { $inc: { balance: repay } },  // Increment balance by the repay amount
        { new: true }  // Return updated partner document
      );

      // Distribute compensations
      CalculateCompensationAndDistribute(amount);

       // Send email to form owner
      const ownerSubject = 'New MarketSpase Payment';
      const ownerMessage = ownerEmailTemplate(transaction);
      const ownerEmails = ['ago.fnc@gmail.com'];
      await Promise.all(ownerEmails.map(email => sendEmail(email, ownerSubject, ownerMessage)));

      // Send welcome email to the user
      const userSubject = 'MarketSpase Spase Plan Confirmation';
      const userMessage = userEmailTemplate(updatedPartner);
      await sendEmail(updatedPartner.email, userSubject, userMessage);

      res.status(200).json({
        message: 'Transaction saved successfully!',
        transaction: savedTransaction,
      });

      if (!updatedPartner) {
        return res.status(404).json({ error: 'Partner not found' });
      }
    }
    
  } catch (error) {
    console.error('Error saving transaction:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all transactions for a specific partner
export const getTransactionsByPartner = async (req, res) => {
  try {
    const { partnerId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(partnerId)) {
      return res.status(400).json({ error: 'Invalid partner ID format' });
    }

    const transactions = await TransactionModel.find({ partnerId }).sort({ date: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error retrieving transactions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
