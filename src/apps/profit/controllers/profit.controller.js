import mongoose from 'mongoose';
import { ProfitModel } from '../models/profit.model.js';

// Get weekly profits
// This function retrieves the total profits for a specific partner for each day of the current week.
// It aggregates the profits from the database and formats them for response.
export const getWeeklyProfitByPartner = async (req, res) => {
    try {
      const { partnerId } = req.params;
  
      // Validate partnerId format
      if (!mongoose.Types.ObjectId.isValid(partnerId)) {
        return res.status(400).json({ success: false, message: 'Invalid partner ID format' });
      }
  
      // Get the start and end of the current week (Monday to Sunday)
      const now = new Date();
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 1));
      startOfWeek.setHours(0, 0, 0, 0);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);
  
      // Aggregate profits for each day of the week
      const weeklyProfits = await ProfitModel.aggregate([
        {
          $match: {
            partnerId: new mongoose.Types.ObjectId(partnerId),
            createdAt: { $gte: startOfWeek, $lte: endOfWeek },
          },
        },
        {
          $group: {
            _id: { $dayOfWeek: '$createdAt' }, // Group by day of the week
            totalProfit: { $sum: '$amount' },
          },
        },
        {
          $sort: { _id: 1 }, // Sort by day of the week
        },
      ]);
  
      // Map MongoDB dayOfWeek to day names and populate result array
      const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const data = Array(7).fill(0);
  
      weeklyProfits.forEach((profit) => {
        let dayIndex = (profit._id - 2 + 7) % 7;
        if (profit._id === 1) {
          dayIndex = 6;
        }
        data[dayIndex] = profit.totalProfit;
      });
  
      res.status(200).json({
        success: true,
        profits: {
          labels,
          data,
        },
      });
    } catch (error) {
      console.error('Error fetching weekly profits:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Get daily profit for a specific partner
// This function retrieves the total profit for a specific partner for the current day or a specified date.
export const getDailyProfit = async (req, res) => {
  try {
    /* Calling api */
    //GET /api/profits/daily/60d21b4667d0d8992e610c85
    //GET /api/profits/daily/60d21b4667d0d8992e610c85?date=2025-04-13


    const { partnerId } = req.params;
    let { date } = req.query; // Use query parameter for date

    // Validate partnerId format
    if (!mongoose.Types.ObjectId.isValid(partnerId)) {
      return res.status(400).json({ success: false, message: 'Invalid partner ID format' });
    }

    // If no date is provided, use the current day
    if (!date) {
      const now = new Date();
      date = now.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return res.status(400).json({ success: false, message: 'Invalid date format. Use YYYY-MM-DD' });
    }

    // Convert date string to Date objects for start and end of the day
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0); // Start of the day
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999); // End of the day

    // Aggregate profits for the specified partner and day
    const dailyProfit = await ProfitModel.aggregate([
      {
        $match: {
          partnerId: new mongoose.Types.ObjectId(partnerId),
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: null, // Group all matching documents
          totalProfit: { $sum: '$amount' },
        },
      },
    ]);

    // Extract total profit from the result
    const totalProfit = dailyProfit.length > 0 ? dailyProfit[0].totalProfit : 0;

    res.status(200).json({
      success: true,
      profit: totalProfit,
    });
  } catch (error) {
    console.error('Error fetching daily profit:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Get monthly profits for a specific partner
// This function retrieves the total profits for a specific partner for each day of the current month.  
export const getMonthlyProfitByPartner = async (req, res) => {
    try {
      const { partnerId } = req.params;
  
      // Validate partnerId format
      if (!mongoose.Types.ObjectId.isValid(partnerId)) {
        return res.status(400).json({ success: false, message: 'Invalid partner ID format' });
      }
  
      // Get the start and end of the current month
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      startOfMonth.setHours(0, 0, 0, 0);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      endOfMonth.setHours(23, 59, 59, 999);
  
      // Aggregate profits for each day of the month
      const monthlyProfits = await ProfitModel.aggregate([
        {
          $match: {
            partnerId: new mongoose.Types.ObjectId(partnerId),
            createdAt: { $gte: startOfMonth, $lte: endOfMonth },
          },
        },
        {
          $group: {
            _id: { $dayOfMonth: '$createdAt' }, // Group by day of the month
            totalProfit: { $sum: '$amount' },
          },
        },
        {
          $sort: { _id: 1 }, // Sort by day of the month
        },
      ]);
  
      // Populate result array with profits for each day
      const daysInMonth = endOfMonth.getDate();
      const data = Array(daysInMonth).fill(0);
  
      monthlyProfits.forEach((profit) => {
        data[profit._id - 1] = profit.totalProfit; // Adjust day index (1-based to 0-based)
      });
  
      // Generate labels for each day of the month
      const labels = Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString());
  
      res.status(200).json({
        success: true,
        labels,
        data,
      });
    } catch (error) {
      console.error('Error fetching monthly profits:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };