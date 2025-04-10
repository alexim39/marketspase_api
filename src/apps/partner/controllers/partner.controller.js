import { PartnersModel } from "../models/partner.model.js";
import dotenv  from "dotenv"
dotenv.config()
import mongoose from 'mongoose';
import { sendEmail } from "../../../services/emailService.js";


// Check if a partner exists
export const checkPartnerUsername = async (req, res) => {
  const { username } = req.params;
  const partner = await PartnersModel.findOne({ username });

  if (partner) {
    return res.status(200).json({success: true, user: partner});
  }

  res.status(404).json({
    message: "Username not found",
    success: false, 
  });
};


// Check if a partner exists
export const getBalance = async (req, res) => {
  const id = req.query.id;

  if (!id) {
    return res.status(400).json({ success: false, message: 'ID is required' });
  }

  try {
    // Assuming the id is the _id of the document.
    const partner = await PartnersModel.findById(id);

    if (!partner) {
      return res.status(404).json({ success: false, message: 'Partner not found' });
    }

    res.status(200).json({ partner: { success: true, balance: partner.balance } });
  } catch (error) {
    console.error('Error fetching partner:', error);
    res.status(500).json({ success: false,  message: 'Internal server error' });
  }
}

// Update a partner's profile
export const updateProfile = async (req, res) => {
  try {
    const { id, name, surname, bio, phone, address, dobDatePicker } = req.body;

    // Validate input
    if (!name || !surname || !phone) {
      return res.status(400).json({
        success: false, 
        message: "Name, surname, email, and phone are required.",
      });
    }

    // Update fields
    const updateData = {
      name,
      surname,
      bio,
      phone,
      address,
      dobDatePicker,
    };

    const partner = await PartnersModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!partner) {
      return res.status(404).json({
        success: false, 
        message: "Partner not found.",
      });
    }

    res.status(200).json({
      success: true, 
      message: "Partner updated successfully!",
      data: partner,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false, 
      message: "Internal server error",
    });
  }
};

// Update a partner's profession
export const updateProfession = async (req, res) => {
  try {
    const { id, jobTitle, educationBackground, hobby, skill } = req.body;

    if (!jobTitle || !educationBackground) {
      return res.status(400).json({
        success: false, 
        message: "Job title and education background are required.",
      });
    }

    const updateData = { jobTitle, educationBackground, hobby, skill };

    const partner = await PartnersModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!partner) {
      return res.status(404).json({
        success: false, 
        message: "Partner not found.",
      });
    }

    res.status(200).json({
      success: true, 
      message: "Partner's profession updated successfully!",
      data: partner,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Update a partner's username
export const updateUsername = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id, username } = req.body;

    if (!username || !id) {
      return res.status(404).json({
        success: false, 
        message: "Username and ID are required.",
      });
    }

    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
      return res.status(404).json({
        success: false, 
        message: "Username can only contain letters, numbers, and underscores."
      });
    }

    // Check if username already exists
    const existingPartner = await PartnersModel.findOne({ username }).session(
      session
    );
    if (existingPartner && existingPartner._id.toString() !== id) {
      // throw new Error("Username already in use by another partner.");
      return res.status(401).json({ success: false, message: "Username already in use by another partner." });
    }

    const partner = await PartnersModel.findById(id).session(session);
    if (!partner) {
      return res.status(404).json({
        success: false, 
        message: "Partner not found."
      });
    }
    partner.username = username;
    await partner.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true, 
      message: "Username updated successfully!",
      data: partner,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({
      success: false, 
      message: "Internal server error",
    });
  }
};

// Update a partner's SocialMedia
export const updateSocialMedia = async (req, res) => {
  try {
    const endpoint = req.params.endpoint; // Get the endpoint from the URL
    const { url, partnerId } = req.body; // Extract url and partnerId from the body

    // construct the social media field name from the provided endpoint.
    let socialMediaField;

    switch (endpoint) {
      case 'whatsappgrouplink':
        socialMediaField = 'socialMedia.whatsappGroupLink';
        break;
      case 'whatsappchatlink':
        socialMediaField = 'socialMedia.whatsappChatLink';
        break;
      case 'facebookPage':
        socialMediaField = 'socialMedia.facebookPage';
        break;
      case 'linkedinPage':
        socialMediaField = 'socialMedia.linkedinPage';
        break;
      case 'youtubePage':
        socialMediaField = 'socialMedia.youtubePage';
        break;
      case 'instagramPage':
        socialMediaField = 'socialMedia.instagramPage';
        break;
      case 'tiktokPage':
        socialMediaField = 'socialMedia.tiktokPage';
        break;
      case 'twitterPage':
        socialMediaField = 'socialMedia.twitterPage';
        break;
      default:
        return res.status(400).json({ success: false, message: 'Invalid endpoint' });
    }

    // Update the partner's social media link
    const updatedPartner = await PartnersModel.findByIdAndUpdate(
      partnerId,
      {
        [socialMediaField]: url,
      },
      { new: true } // Return the updated document
    );

    if (!updatedPartner) {
      return res.status(404).json({ success: false, message: 'Partner not found' });
    }

    res.status(200).json({
      success: true, 
      message: "Social page updated successfully!",
    });

  } catch (error) {
    console.error('Error updating social media links:', error);
    res.status(500).json({       
      success: false, 
      message: 'Internal server error' 
    });
  }
}


/**
 * Update the testimonial value for a partner
 * @param {Object} req - The request object containing partnerId and testimonial data
 * @param {Object} res - The response object
 */
export const updateTestimonial = async (req, res) => {
  try {
    const { message, country, state, partnerId } = req.body;

    // Validate partnerId
    if (!mongoose.Types.ObjectId.isValid(partnerId)) {
      return res.status(400).json({ success: false, message: 'Invalid partner ID format' });
    }

    // Validate testimonial fields
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ success: false, message: 'Testimonial message must be a non-empty string' });
    }
    if (country && typeof country !== 'string') {
      return res.status(400).json({ success: false, message: 'Country must be a string' });
    }
    if (state && typeof state !== 'string') {
      return res.status(400).json({ success: false, message: 'State must be a string' });
    }

    // Fetch the partner to check the current type of the testimonial field
    const partner = await PartnersModel.findById(partnerId);

    if (!partner) {
      return res.status(404).json({ success: false, message: 'Partner not found' });
    }

    // Check if the testimonial field is a string
    if (typeof partner.testimonial === 'string') {
      // Convert the string to the new object structure
      partner.testimonial = {
        message: partner.testimonial, // Use the existing string as the message
        country: country || 'Nigeria', // Default to 'Nigeria' if not provided
        state: state || '', // Default to an empty string if not provided
      };
    } else {
      // Update the testimonial object
      partner.testimonial.message = message;
      partner.testimonial.country = country || 'Nigeria';
      partner.testimonial.state = state || '';
    }

    // Save the updated partner document
    await partner.save();

    res.status(200).json({
      success: true,
      message: 'Testimonial updated successfully',
      partner,
    });
  } catch (error) {
    console.error('Error updating testimonial:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};