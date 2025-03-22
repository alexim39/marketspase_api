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
      return res.status(400).json({ message: 'Partner ID is required' });
    }
    if (typeof state !== 'boolean') {
      return res.status(400).json({ message: 'State must be a boolean' });
    }

    // Find the partner by ID
    const partner = await PartnersModel.findById(partnerId);

    if (!partner) {
      return res.status(404).json({ message: 'Partner not found' });
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
    });
  } catch (error) {
    console.error('Error updating notification setting:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};