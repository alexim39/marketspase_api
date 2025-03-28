import { PartnersModel } from "../../partner/models/partner.model.js";
import { sendEmail } from "../../../services/emailService.js";
import { ownerEmailTemplate } from "../services/email/ownerTemplate.js";
import { userNotificationEmailTemplate } from "../services/email/userTemplate.js";

// Toggle notification
export const toggleNotification = async (req, res) => {
  try {
    const { state, partnerId } = req.body;

    // Validate input
    if (!partnerId) {
      return res.status(400).json({ success: false, message: 'Partner ID is required' });
    }
    if (typeof state !== 'boolean') {
      return res.status(400).json({ message: 'State must be a boolean' });
    }

    // Find the partner by ID
    const partner = await PartnersModel.findById(partnerId);

    if (!partner) {
      return res.status(404).json({ success: false, message: 'Partner not found' });
    }

    // Update the notification setting
    partner.notification = state;
    await partner.save();

    res.status(200).json({
      message: `Notifications ${state ? 'enabled' : 'disabled'} successfully`,
      data: {
        partnerId: partner._id,
        notificationState: partner.notification,
      },
      success: true,
    });
  } catch (error) {
    console.error('Error updating notification setting:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Toggle theme
export const toggleTheme = async (req, res) => {
  try {
    const { state, partnerId } = req.body;

    // Validate input
    if (!partnerId) {
      return res.status(400).json({success: false,  message: 'Partner ID is required' });
    }
    if (typeof state !== 'boolean') {
      return res.status(400).json({ success: false, message: 'State must be a boolean' });
    }

    // Find the partner by ID
    const partner = await PartnersModel.findById(partnerId);

    if (!partner) {
      return res.status(400).json({ success: false, message: 'Partner not found' });
    }

    // Update the notification setting
    partner.darkMode = state;
    await partner.save();

    res.status(200).json({
      message: `Theme ${state ? 'enabled' : 'disabled'} successfully`,
      data: {
        partnerId: partner._id,
        notificationState: partner.darkMode,
      },
      success: true,
    });
  } catch (error) {
    console.error('Error updating notification setting:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Get partner theme settings
export const getThemeSetting = async (req, res) => {
  try {
    const { partnerId } = req.params;
    const partner = await PartnersModel.findOne({ _id: partnerId }); // Corrected to _id

    if (!partner) {
      return res.status(404).json({ success: false, message: 'Partner not found' });
    }

    // get theme state from partner object
    const darkMode = partner.darkMode;

    res.status(200).json({ success: true, darkMode });

  } catch (error) {
    console.error('Error updating notification setting:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const setIncomeTarget = async (req, res) => {
  try {
    const { partnerId, targetAmount, period } = req.body;

    // Validate required fields
    if (!partnerId || targetAmount === undefined || !period) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Validate targetAmount
    if (targetAmount < 1000) {
      return res.status(400).json({ success: false, message: 'Target amount must be above 1000' });
    }

    // Validate period
    const allowedPeriods = ['daily', 'weekly', 'monthly', 'yearly'];
    if (!allowedPeriods.includes(period.toLowerCase())) {
      return res.status(400).json({ success: false, message: 'Invalid period. Allowed values are daily, weekly, monthly, or yearly' });
    }

    // Update the incomeTarget for the partner
    const updatedPartner = await PartnersModel.findByIdAndUpdate(
      partnerId,
      {
        $set: {
          'incomeTarget.targetAmount': targetAmount,
          'incomeTarget.period': period.toLowerCase(),
        },
      },
      { new: true } // Return the updated document
    );

    if (!updatedPartner) {
      return res.status(404).json({ success: false, message: 'Partner not found' });
    }

    res.status(200).json({
      message: 'Income target updated successfully',
      partner: updatedPartner,
      success: true,
    });
  } catch (error) {
    console.error('Error updating income target:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};