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
      success: true,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Error retrieving transactions",
      success: false,
    });
  }
};


// Partner withdrawal request
export const withdrawRequest = async (req, res) => {
  const { bank, accountNumber, accountName, amount, partnerId, saveAccount, bankName } = req.body;

  //console.log("withdrawRequest", req.body);return;

  try {
    // Find the partner by ID
    const partner = await PartnersModel.findById(partnerId);

    if (!partner) {
      return res.status(400).json({
        message: "Partner not found",
        success: false,
      });
    }

    // Check if the partner has sufficient balance
    if (partner.balance < amount) {
      return res.status(400).json({
        message: "Insufficient balance for transaction",
        success: false,
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
      const ownerSubject = "New Withdrawal Request";
      const ownerMessage = ownerEmailTemplate(partner);
      const ownerEmails = ["ago.fnc@gmail.com"];
      for (const email of ownerEmails) {
        await sendEmail(email, ownerSubject, ownerMessage);
      }

      // Send email notification to the user
      const userSubject = "Successful Withdrawal - MarketSpase";
      const userMessage = userWithdrawalEmailTemplate(partner, req.body);
      await sendEmail(partner.email, userSubject, userMessage);


      // If the user chooses to save the account, add it to their saved accounts
      if (saveAccount) {
        const existingAccount = partner.savedAccounts.find(
          (account) => account.accountNumber === accountNumber
        );

        if (!existingAccount) {
          partner.savedAccounts.push({
            bankCode: bank,
            accountNumber: accountNumber,
            accountName: accountName,
            bank: bankName,
          });
          await partner.save();
        }
      }

      return res.status(200).json({
        message: "Withdrawal successful, payment has been processed.",
        data: transaction,
        success: true,
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
        success: false,
      });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "An error occurred while processing the withdrawal.",
      success: false,
    });
  }
};


// Delete saved accounts
export const deleteSavedAccount = async (req, res) => {
  try {
    const { partnerId, accountId } = req.params;

    // Find the partner by ID
    const partner = await PartnersModel.findById(partnerId);

    if (!partner) {
      return res.status(404).json({ success: false, message: 'Partner not found' });
    }

    // Find the account to delete
    const accountIndex = partner.savedAccounts.findIndex(
      (account) => account._id.toString() === accountId
    );

    if (accountIndex === -1) {
      return res.status(404).json({ success: false, message: 'Saved account not found' });
    }

    // Remove the account from the savedAccounts array
    partner.savedAccounts.splice(accountIndex, 1);

    // Save the updated partner document
    await partner.save();

    res.status(200).json({
      success: true,
      message: 'Saved account deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting saved account:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the saved account',
    });
  }
};