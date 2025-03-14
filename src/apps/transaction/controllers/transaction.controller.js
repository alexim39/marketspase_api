import { TransactionModel } from "../models/transaction.model.js";
import axios from "axios";
import { PartnersModel } from "./../../partner/models/partner.model.js";
import { sendEmail } from "../../../services/emailService.js";
import { ownerEmailTemplate } from "../services/email/ownerTemplate.js";
import { userWithdrawalEmailTemplate } from "../services/email/userTemplate.js";


// confirm payment
export const confirmPayment = async (req, res) => {
  const { reference, partnerId } = req.body;
  const paymentMethod = "Paystack";

  // Step 1: Verify the transaction with Paystack
  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACKTOKEN}`, // Replace with your Paystack secret key
        },
      }
    );

    const transactionData = response.data.data;
    if (transactionData.status !== "success") {
      return res.status(400).json({ message: "Transaction not successful" });
    }

    // Step 2: Find the user and update their balance
    const partner = await PartnersModel.findById(partnerId);
    if (!partner) {
      return res.status(404).json({ message: "User not found" });
    }

    const amountInNaira = transactionData.amount / 100; // Convert kobo to Naira
    partner.balance += amountInNaira;
    await partner.save();

    // Step 3: Save the transaction record
    const transaction = new TransactionModel({
      partnerId: partner._id,
      amount: amountInNaira,
      reference,
      paymentMethod,
      transactionType: "Credit",
      status: transactionData.status,
    });
    await transaction.save();

    return res
      .status(200)
      .json({ message: "Payment verified and balance updated", partner });
  } catch (error) {
    console.error("Payment verification failed:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};




export const getTransactions = async (req, res) => {
  try {
    const { partnerId } = req.params; // Assuming createdBy is passed as a query parameter

    // Find transactions where partnerId matches the provided ID
    const transac = await TransactionModel.find({ partnerId });

    res.status(200).json({
      message: "Transaction retrieved successfully!",
      data: transac,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Error retrieving transactions",
      error: error.message,
    });
  }
};




// Partner withdrawal request
export const withdrawRequest = async (req, res) => {
  const { bank, accountNumber, accountName, amount, partnerId } = req.body;

  try {
    // Find the partner by ID
    const partner = await PartnersModel.findById(partnerId); // Assuming you have a PartnersModel

    if (!partner) {
      return res.status(400).json({
        message: "Partner not found",
        data: null,
      });
    }

    // Check if the partner has sufficient balance
    if (partner.balance >= amount) {
      // Deduct the amount
      partner.balance -= amount;

      // Save the updated partner balance
      await partner.save();

      // Record the transaction
      const transaction = new TransactionModel({
        partnerId: partner._id,
        amount: amount,
        status: "Pending",
        paymentMethod: "Withdrawal",
        transactionType: "Debit",
        bankDetail: {
          bankCode: bank,
          accountNumber: accountNumber,
          accountName: accountName,
        },
        reference: Math.floor(100000000 + Math.random() * 900000000).toString(),
      });

      // Send email to owner
      // const ownerSubject = 'New Withdrawal Request';
      // const ownerMessage = ownerEmailTemplate(partner, req.body); // Assuming ownerEmailTemplate exists
      // const ownerEmails = ['ago.fnc@gmail.com'];
      // for (const email of ownerEmails) {
      //   await sendEmail(email, ownerSubject, ownerMessage); // Assuming sendEmail function exists
      // }

      // Send email to the user
      // const userSubject = 'Withdrawal Request Notification';
      // const userMessage = userWithdrawalEmailTemplate(partner, req.body); // Assuming userWithdrawalEmailTemplate exists
      // await sendEmail(partner.email, userSubject, userMessage);

      await transaction.save();

      res.status(200).json({
        message: "Withdraw request recorded.",
        data: transaction,
      });
    } else {
      return res.status(401).json({
        code: 401,
        message: "Insufficient balance for transaction",
        data: null,
      });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "An error occurred while processing the withdrawal.",
      error: error.message,
    });
  }
};