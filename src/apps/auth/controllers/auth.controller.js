import { PartnersModel } from "../../partner/models/partner.model.js";
import bcrypt from "bcryptjs";
import { userPasswordResetLinkEmailTemplate } from "../services/email/userResetPasswordTemplate.js";
import { sendEmail } from "../../../services/emailService.js";
import crypto from 'crypto';
import jwt from "jsonwebtoken";
import { userAccountActivationEmailTemplate } from "../services/email/userActivationTemplate.js";
import dotenv  from "dotenv"
dotenv.config()



// Partner login
export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await PartnersModel.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ success: false, message: "Wrong email or password" });
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

    res.status(200).json({ success: true, message: "SignedIn" });

  } catch (error) {
    console.error("Error getting partner:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Logout
export const signout = async (req, res) => {
  res.cookie("jwt", "", { maxAge: 0 });
  res.json({ success: true, message: "Logged out successfully" });
};

// Get partner details
// Get partner details (modified to handle GET request with JWT)
export const getPartner = async (req, res) => {
  try {
    const token = req.cookies["jwt"];
    
    if (!token) {
      return res.status(401).json({ success: false, message: "User unauthenticated: JWT missing" });
    }

    const claims = jwt.verify(token, process.env.JWTTOKENSECRET);

    if (!claims) {
      return res.status(401).json({ success: false, message: "User unauthenticated: JWT invalid" });
    }

    const user = await PartnersModel.findById(claims.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const { password: _, ...userObject } = user.toJSON(); // Remove password from response

    res.status(200).json({success: true,  user: userObject});
    
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: "User unauthenticated: JWT expired" });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: "User unauthenticated: Invalid JWT" });
    }
    console.error("Error getting partner:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Send email to user for account activation
export const accountActivationEmail = async (req, res) => {
    try {
      const { state, partnerId } = req.body;
  
      // Validate input
      if (!partnerId) {
        return res.status(400).json({ success: false, message: 'Partner ID is required' });
      }
      if (typeof state !== 'boolean') {
        return res.status(400).json({ success: false, message: 'State must be a boolean' });
      }
  
      // Find the partner by ID
      const partner = await PartnersModel.findById(partnerId);
  
      if (!partner) {
        return res.status(404).json({ success: false, message: 'Partner not found' });
      }
  
      // Update the notification setting
      // partner.notification = state;
      // await partner.save();
   
       // Send email to the user
       const userSubject = "Account Activation Request - MarketSpase";
       const userMessage = userAccountActivationEmailTemplate(partner);
       await sendEmail(partner.email, userSubject, userMessage);
  
      res.status(200).json({
        success: true, 
        message: `Account activation email sent successfully`,
      });
    } catch (error) {
      console.error('Error updating notification setting:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
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
        return res.status(404).json({  success: false, message: 'Partner not found' });
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
  

export const forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;
      const partner = await PartnersModel.findOne({ email });
  
      if (!partner) {
        return res.json({ success: true, message: 'If the email is registered, a password reset link has been sent' });
      }
  
      const resetToken = crypto.randomBytes(20).toString('hex');
      const resetTokenExpiry = Date.now() + 3600000; // 1 hour
  
      partner.resetToken = resetToken;
      partner.resetTokenExpiry = resetTokenExpiry;
      await partner.save();

    // Send email to the user
    const userSubject = "Password Reset Link - MarketSpase";
    const userMessage = userPasswordResetLinkEmailTemplate(partner);
    await sendEmail(partner.email, userSubject, userMessage);
  
      res.json({ success: true, message: 'Password reset email sent.' });
    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({ success: false, message: 'An error occurred.' });
    }
};

  
export const resetPassword = async (req, res) => {
    try {
      const { password, token } = req.body;
      const partner = await PartnersModel.findOne({
        resetToken: token,
        resetTokenExpiry: { $gt: Date.now() },
      });
  
      if (!partner) {
        return res.status(400).json({ success: false, message: 'Invalid or expired token.' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      partner.password = hashedPassword;
      partner.resetToken = undefined;
      partner.resetTokenExpiry = undefined;
      await partner.save();
  
      res.status(200).json({ success: true, message: 'Password reset successfully.' });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({ success: false, message: 'An error occurred.' });
    }
  };

// Change a partner's password
export const changePassword = async (req, res) => {
    const { id, currentPassword, newPassword } = req.body;
  
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required.",
      });
    }
  
    if (newPassword.length < 8) {
      return res.status(402).json({
        success: false,
        message: "New password must be at least 8 characters long.",
      });
    }
  
    if (currentPassword === newPassword) {
      return res.status(401).json({
        success: false,
        message: "Current password and new password cannot be the same.",
      });
    }
  
    try {
      const partner = await PartnersModel.findById(id);
      if (!partner) {
        return res.status(404).json({
          success: false,
          message: "Partner not found.",
        });
      }
  
      const isMatch = await bcrypt.compare(currentPassword, partner.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Current password is incorrect.",
        });
      }
  
      const salt = await bcrypt.genSalt(10);
      const hashedNewPassword = await bcrypt.hash(newPassword, salt);
  
      partner.password = hashedNewPassword;
      await partner.save();
  
      res.status(200).json({
        success: true,
        message: "Password changed successfully!",
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({
        success: false,
        message: 'An error occurred while changing the password.'
      });
    }
};