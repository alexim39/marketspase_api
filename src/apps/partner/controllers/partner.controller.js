import { PartnersModel } from "../models/partner.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv  from "dotenv"
dotenv.config()
import mongoose from 'mongoose';
import { userAccountActivationEmailTemplate } from "../services/email/userActivationTemplate.js";
import { sendEmail } from "../../../services/emailService.js";


// Utility function for error handling
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// Check if a partner exists
export const checkPartnerUsername = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const partner = await PartnersModel.findOne({ username });

  if (partner) {
    return res.status(200).json(partner);
  }

  res.status(404).json({
    message: "Username not found",
    code: "404",
  });
});


// Partner login
export const partnerSignin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await PartnersModel.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWTTOKENSECRET, {
    expiresIn: "1d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.json({ message: "SignedIn" });
});

// Get partner details
export const getPartner = asyncHandler(async (req, res) => {
  const token = req.cookies["jwt"];
  const claims = jwt.verify(token, process.env.JWTTOKENSECRET);

  if (!claims) {
    return res.status(401).json({ message: "User unauthenticated" });
  }

  const user = await PartnersModel.findById(claims.id);
  const { password: _, ...userObject } = user.toJSON();
  res.status(200).json(userObject);
});

// Logout
export const partnerSignout = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", { maxAge: 0 });
  res.json({ message: "Logged out successfully" });
});

// Check if a partner exists
export const getBalance = asyncHandler(async (req, res) => {
  const id = req.query.id;

  if (!id) {
    return res.status(400).json({ error: 'ID is required' });
  }

  try {
    // Assuming the id is the _id of the document.
    const partner = await PartnersModel.findById(id);

    if (!partner) {
      return res.status(404).json({ error: 'Partner not found' });
    }

    res.json({ partner: { balance: partner.balance } });
  } catch (error) {
    console.error('Error fetching partner:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})

// Update a partner's profile
export const updateProfile = async (req, res) => {
  try {
    const { id, name, surname, bio, phone, address, dobDatePicker } = req.body;

    // Validate input
    if (!name || !surname || !phone) {
      return res.status(400).json({
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
        message: "Partner not found.",
      });
    }

    res.status(200).json({
      message: "Partner updated successfully!",
      data: partner,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update a partner's profession
export const updateProfession = async (req, res) => {
  try {
    const { id, jobTitle, educationBackground, hobby, skill } = req.body;

    if (!jobTitle || !educationBackground) {
      return res.status(400).json({
        message: "Job title and education background are required.",
      });
    }

    const updateData = { jobTitle, educationBackground, hobby, skill };

    const partner = await PartnersModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!partner) {
      return res.status(404).json({
        message: "Partner not found.",
      });
    }

    res.status(200).json({
      message: "Partner's profession updated successfully!",
      data: partner,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: error.message,
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
      throw new Error("Username and ID are required.");
    }

    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
      throw new Error(
        "Username can only contain letters, numbers, and underscores."
      );
    }

    // Check if username already exists
    const existingPartner = await PartnersModel.findOne({ username }).session(
      session
    );
    if (existingPartner && existingPartner._id.toString() !== id) {
      // throw new Error("Username already in use by another partner.");
      return res.status(401).json({ message: "Username already in use by another partner." });
    }

    const partner = await PartnersModel.findById(id).session(session);
    if (!partner) {
      throw new Error("Partner not found.");
    }

    //const oldUsername = partner.username;

    partner.username = username;
    await partner.save({ session });

    /* // Update related collections
    await ProspectSurveyModel.updateMany(
      { username: oldUsername },
      { $set: { username } },
      { session }
    );

    await BookingModel.updateMany(
      { username: oldUsername },
      { $set: { username } },
      { session }
    ); */

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      message: "Username updated successfully!",
      data: partner,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({
      message: error.message,
    });
  }
};

// Change a partner's password
export const changePassword = async (req, res) => {
  const { id, currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      message: "Current password and new password are required.",
    });
  }

  if (newPassword.length < 8) {
    return res.status(402).json({
      message: "New password must be at least 8 characters long.",
    });
  }

  if (currentPassword === newPassword) {
    return res.status(401).json({
      message: "Current password and new password cannot be the same.",
    });
  }

  try {
    const partner = await PartnersModel.findById(id);
    if (!partner) {
      return res.status(404).json({
        message: "Partner not found.",
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, partner.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Current password is incorrect.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    partner.password = hashedNewPassword;
    await partner.save();

    res.status(200).json({
      message: "Password changed successfully!",
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: error.message,
    });
  }
};

// Send email to user for account activation
export const accountActivationEmail = async (req, res) => {
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
    // partner.notification = state;
    // await partner.save();
 
     // Send email to the user
     const userSubject = "Account Activation Request";
     const userMessage = userAccountActivationEmailTemplate(partner);
     await sendEmail(partner.email, userSubject, userMessage);

    res.status(200).json({
      message: `Account activation email sent successfully`,
    });
  } catch (error) {
    console.error('Error updating notification setting:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Activate User Account
export const activateAccount = async (req, res) => {
  try {

    const { partnerId } = req.params;
    
    const updatedPartner = await PartnersModel.findByIdAndUpdate(
      partnerId,
      { status: true },
      { new: true } // Return the updated document
    );

    if (!updatedPartner) {
      return res.status(404).json({ message: 'Partner not found' });
    }

    res.status(200).json({
      success: true, 
      message: 'Account activated successfully.', 
      partner: updatedPartner 
    });


  } catch (error) {
    console.error('Error activating partner account:', error);
    return { success: false, message: 'Failed to activate account.' };
  }
};

