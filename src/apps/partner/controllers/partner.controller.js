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
