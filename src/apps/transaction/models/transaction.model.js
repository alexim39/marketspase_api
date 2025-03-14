// models/transaction.js
import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  partnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Partner', // Corrected ref to 'Partner' (assuming this is your Partner model name)
    required: true,
  },
  amount: Number,
  reference: String,
  status: String,
  paymentMethod: String,
  transactionType: String,
  bankDetail: {
    bankCode: { type: String }, // Removed required: false (default is false)
    accountNumber: { type: String }, // Removed required: false
    accountName: { type: String }, // Removed required: false
    bankName: { type: String }, // Removed required: false
  },
  // Other transaction details...
},
{
  timestamps: true
});

export const TransactionModel = mongoose.model('Transaction', transactionSchema);


