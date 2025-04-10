import { PartnersModel } from "../../partner/models/partner.model.js";
import { sendEmail } from "../../../services/emailService.js";
import { ownerEmailTemplate } from "../services/email/ownerTemplate.js";
import { userNotificationEmailTemplate } from "../services/email/userTemplate.js";
import { PlanModel } from "../../plan/models/plan.model.js";
import mongoose from "mongoose";
import { TransactionModel } from '../../transaction/models/transaction.model.js';
import { CampaignModel } from '../../ads/models/campaign.js';

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
        success: true,
      });
    } catch (error) {
      console.error('Error retrieving plans:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
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
        return res.status(400).json({success: false, message: 'Invalid partner ID format' });
      }
  
      // Validate and parse date range
      const start = startDate ? new Date(startDate) : new Date(new Date().getFullYear(), new Date().getMonth(), 1); // Default to first day of the current month
      const end = endDate ? new Date(endDate) : new Date(); // Default to the current date
  
      if (start > end) {
        return res.status(400).json({ success: false, message: 'Start date must be earlier than end date' });
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
        success: true,
      });
    } catch (error) {
      console.error('Error retrieving partner profit:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
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
      return res.status(400).json({ success: false, message: 'Invalid partner ID format' });
    }

    // Validate and parse date range
    const start = startDate ? new Date(startDate) : new Date(new Date().getFullYear(), new Date().getMonth(), 1); // Default to first day of the current month
    const end = endDate ? new Date(endDate) : new Date(); // Default to the current date

    if (start > end) {
      return res.status(400).json({ success: false, message: 'Start date must be earlier than end date' });
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
      success: true,
    });
  } catch (error) {
    console.error('Error retrieving partner expenses:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


export const calculatePartnerIncome = async (req, res) => {
  try {
    const { partnerId } = req.params;

    // 1. Get the partner
    const partner = await PartnersModel.findById(partnerId);
    if (!partner) {
      return res.status(400).json({ success: false, message: 'Invalid partner ID format' });
    }

    // 2. Get the partner Period directly.
    const period = partner.incomeTarget.period;

    let startDate, endDate;
    const now = new Date();

    // 3. Determine the date range based on the period
    switch (period.toLowerCase()) {
      case 'daily':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        break;
      case 'weekly':
        const startOfWeek = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - now.getDay()
        );
        startDate = new Date(startOfWeek);
        endDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - now.getDay() + 7
        );
        break;
      case 'monthly':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        break;
      case 'yearly':
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear() + 1, 0, 1);
        break;
      default:
        throw new Error('Invalid period');
    }

    // 4. Find campaigns created by the partner within the period
    const campaigns = await CampaignModel.find({
      createdBy: partnerId,
      createdAt: { $gte: startDate, $lt: endDate }, // Assuming 'createdAt' stores campaign creation date
    });

    // 5. Calculate total income from campaigns
    let totalIncome = 0;
    for (const campaign of campaigns) {
      // Example: Assuming income is 10% of the budget
      totalIncome += campaign.budget.budgetAmount * 0.1;

      // You'll need to adjust this calculation based on your actual income logic.
    }

    res.status(200).json({
      totalIncome,
      success: true,
    });
  } catch (error) {
    console.error('Error retrieving partner expenses:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export const getRandomTestimonials = async (req, res) => {
  try {
    const count = parseInt(req.query.count, 10) || 10; // Default to 10 if count is not provided or invalid

    // Find users with non-empty testimonial messages
    const usersWithTestimonials = await PartnersModel.aggregate([
      {
        $match: {
          'testimonial.message': { $exists: true, $ne: '' }, // Ensure testimonial.message exists and is not empty
        },
      },
      { $sample: { size: count } }, // Randomly select 'count' documents
      {
        $project: {
          _id: 0,
          name: 1,
          surname: 1,
          'testimonial.message': 1,
          'testimonial.country': 1,
          'testimonial.state': 1,
          profileImage: 1,
        },
      },
    ]);

    // Transform the data into the desired format
    const formattedTestimonials = usersWithTestimonials.map(user => ({
      name: `${user.name} ${user.surname}`,
      location: `${user.testimonial.state || ''}, ${user.testimonial.country || ''}`.trim().replace(/^,|,$/g, ''), // Format location
      message: user.testimonial.message,
      avatar: user.profileImage || './img/default_pp.png', // Use default avatar if profileImage is not provided
    }));

    res.status(200).json({
      data: formattedTestimonials,
      success: true,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getRecentPayouts = async (req, res) => {
  try {
    const payouts = await TransactionModel.find({ transactionType: 'Credit', status: 'Successful' })
      .populate('partnerId', 'name surname') // Fetch partner's name
      .sort({ createdAt: -1 }) // Sort by latest first
      .limit(15); // Limit to a reasonable number of recent payouts

    const formattedPayouts = payouts.map((payout) => ({
      name: `${payout.partnerId.name} ${payout.partnerId.surname.charAt(0)}.`,
      amount: `₦${payout.amount.toLocaleString()}`, // Format amount with currency symbol
      time: payout.createdAt.toLocaleString('en-US', { // Format time for readability
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
    }));

    res.status(200).json({
      data: formattedPayouts,
      success: true,
    });
  } catch (error) {
    console.error('Error fetching payout data:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}