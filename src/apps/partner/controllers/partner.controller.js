import { PartnersModel } from "../models/partner.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv  from "dotenv"
dotenv.config()


// Utility function for error handling
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

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



