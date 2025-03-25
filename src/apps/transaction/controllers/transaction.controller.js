import { TransactionModel } from "../models/transaction.model.js";
import { PartnersModel } from "./../../partner/models/partner.model.js";
import { sendEmail } from "../../../services/emailService.js";
import { ownerEmailTemplate } from "../services/email/ownerTemplate.js";
import { userWithdrawalEmailTemplate } from "../services/email/userTemplate.js";
import { processPayment } from "../services/process-payment.js"



export const getTransactions = async (req, res) => {
  try {
    const { partnerId } = req.params;

    // Find transactions where partnerId matches the provided ID and sort by creation date in descending order
    const transac = await TransactionModel.find({ partnerId }).sort({ createdAt: -1 });

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
    const partner = await PartnersModel.findById(partnerId);

    if (!partner) {
      return res.status(400).json({
        message: "Partner not found",
        data: null,
      });
    }

    // Check if the partner has sufficient balance
    if (partner.balance < amount) {
      return res.status(401).json({
        code: 401,
        message: "Insufficient balance for transaction",
        data: null,
      });
    }

    // Deduct the amount from partner's balance
    partner.balance -= amount;
    await partner.save();

    // Generate a unique reference ID
    const reference = Math.floor(100000000 + Math.random() * 900000000).toString();

    // Record the transaction as pending
    const transaction = new TransactionModel({
      partnerId: partner._id,
      amount: amount,
      status: "Pending",
      paymentMethod: "Withdrawal",
      transactionType: "Credit", // its credit when the user bank account is credite
      bankDetail: {
        bankCode: bank,
        accountNumber: accountNumber,
        accountName: accountName,
      },
      reference,
    });
    await transaction.save();

    // Process the automatic payment
    const paymentResponse = await processPayment(bank, accountNumber, accountName, amount);

    if (paymentResponse.success) {
      // Update transaction status to successful
      transaction.status = "Successful";
      await transaction.save();

      // // Send email notification to owner
      // const ownerSubject = "New Withdrawal Processed";
      // const ownerMessage = ownerEmailTemplate(partner, req.body, "Successful");
      // const ownerEmails = ["ago.fnc@gmail.com"];
      // for (const email of ownerEmails) {
      //   await sendEmail(email, ownerSubject, ownerMessage);
      // }

      // // Send email notification to the user
      // const userSubject = "Withdrawal Successful";
      // const userMessage = userWithdrawalEmailTemplate(partner, req.body, "Successful");
      // await sendEmail(partner.email, userSubject, userMessage);

      return res.status(200).json({
        message: "Withdrawal successful, payment has been processed.",
        data: transaction,
      });
    } else {
      // If payment fails, refund balance and update transaction status
      partner.balance += amount;
      await partner.save();

      transaction.status = "Failed";
      await transaction.save();

      // Notify the user and owner of the failure
      const failureSubject = "Withdrawal Failed";
      const failureMessage = userWithdrawalEmailTemplate(partner, req.body, "Failed");
      await sendEmail(partner.email, failureSubject, failureMessage);

      return res.status(500).json({
        message: "Payment failed. Your balance has been refunded.",
        data: transaction,
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
