// models/transaction.js
import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  partnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'partner',
    required: true,
  },
  amount: Number,
  reference: String,
  status: String,
  paymentMethod: String,
  transactionType: String,
  // Other transaction details...
},
{
  timestamps: true
});

export const TransactionModel = mongoose.model('Transaction', transactionSchema);
