import { PartnersModel } from "../../partner/models/partner.model.js";
import { sendEmail } from "../../../services/emailService.js";
import { ownerEmailTemplate } from "../services/email/ownerTemplate.js";
import { userNotificationEmailTemplate } from "../services/email/userTemplate.js";
import { PlanModel } from "../../plan/models/plan.model.js";
import mongoose from "mongoose";
import { TransactionModel } from '../../transaction/models/transaction.model.js';

// Function to get the total number of plans by partnerId and the total number of all plans
export const getPlansCount = async (req, res) => {
    try {
      const { partnerId } = req.params;
  
      // Get the total number of plans by partnerId
      const count = await PlanModel.countDocuments({ partnerId });
  
      // Get the total number of all plans in the database
      const total = await PlanModel.countDocuments();
  
      // Return the results
      res.status(200).json({
        count,
        total,
      });
    } catch (error) {
      console.error('Error retrieving plans:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
};


/**
 * Get the total profit made by a partner within a specified period and overall
 * @param {Object} req - The request object containing partnerId, startDate, and endDate
 * @param {Object} res - The response object
 */
export const getPartnerProfit = async (req, res) => {
    try {
      const { partnerId } = req.params;
      const { startDate, endDate } = req.query;
  
      // Validate partnerId
      if (!mongoose.Types.ObjectId.isValid(partnerId)) {
        return res.status(400).json({ error: 'Invalid partner ID format' });
      }
  
      // Validate and parse date range
      const start = startDate ? new Date(startDate) : new Date(new Date().getFullYear(), new Date().getMonth(), 1); // Default to first day of the current month
      const end = endDate ? new Date(endDate) : new Date(); // Default to the current date
  
      if (start > end) {
        return res.status(400).json({ error: 'Start date must be earlier than end date' });
      }
  
      // Aggregate profit from successful plans within the date range
      const result = await PlanModel.aggregate([
        {
          $match: {
            partnerId: new mongoose.Types.ObjectId(partnerId),
            status: 'success',
            createdAt: { $gte: start, $lte: end }, // Filter by date range
          },
        },
        {
          $group: {
            _id: null, // No need to group by partnerId since it's already filtered
            totalProfit: { $sum: '$amount' }, // Sum the amount field for profit
          },
        },
      ]);
  
      const profitInRange = result.length > 0 ? result[0].totalProfit : 0; // Return total profit in range or 0 if no data
  
      // Aggregate total profit from successful plans for all time
      const totalResult = await PlanModel.aggregate([
        {
          $match: {
            partnerId: new mongoose.Types.ObjectId(partnerId),
            status: 'success',
          },
        },
        {
          $group: {
            _id: null,
            totalProfit: { $sum: '$amount' }, // Sum the amount field for total profit
          },
        },
      ]);
  
      const totalProfit = totalResult.length > 0 ? totalResult[0].totalProfit : 0; // Return total profit or 0 if no data
  
      res.status(200).json({
        range: profitInRange,
        total: totalProfit,
      });
    } catch (error) {
      console.error('Error retrieving partner profit:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
};



/**
 * Get partner expenses for a specified month and total expenses
 * @param {Object} req - The request object containing partnerId, month, and year
 * @param {Object} res - The response object
 */
export const getPartnerExpenses = async (req, res) => {
  try {
    const { partnerId } = req.params;
    const { startDate, endDate } = req.query;

    // Validate partnerId
    if (!mongoose.Types.ObjectId.isValid(partnerId)) {
      return res.status(400).json({ error: 'Invalid partner ID format' });
    }

    // Validate and parse date range
    const start = startDate ? new Date(startDate) : new Date(new Date().getFullYear(), new Date().getMonth(), 1); // Default to first day of the current month
    const end = endDate ? new Date(endDate) : new Date(); // Default to the current date

    if (start > end) {
      return res.status(400).json({ error: 'Start date must be earlier than end date' });
    }
    // Aggregate expenses for the specified month
    const monthlyResult = await TransactionModel.aggregate([
      {
        $match: {
          partnerId: new mongoose.Types.ObjectId(partnerId),
          transactionType: 'Debit',
          createdAt: { $gte: start, $lte: end }, // Filter by date range
        },
      },
      {
        $group: {
          _id: null,
          totalMonthlyExpense: { $sum: '$amount' }, // Sum the amount field for monthly expenses
        },
      },
    ]);

    const monthlyExpense = monthlyResult.length > 0 ? monthlyResult[0].totalMonthlyExpense : 0;

    // Aggregate total expenses for all time
    const totalResult = await TransactionModel.aggregate([
      {
        $match: {
          partnerId: new mongoose.Types.ObjectId(partnerId),
          transactionType: 'Debit',
        },
      },
      {
        $group: {
          _id: null,
          totalExpense: { $sum: '$amount' }, // Sum the amount field for total expenses
        },
      },
    ]);

    const totalExpense = totalResult.length > 0 ? totalResult[0].totalExpense : 0;

    res.status(200).json({
      message: 'Expenses retrieved successfully.',
      range: monthlyExpense,
      total: totalExpense,
    });
  } catch (error) {
    console.error('Error retrieving partner expenses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};