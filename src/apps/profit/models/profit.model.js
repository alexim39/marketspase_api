import mongoose from 'mongoose';

// Define the schema
const profitSchema = new mongoose.Schema({
  partnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Partner',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: [1, 'Amount must be greater than zero'],
  },
  currency: {
    type: String,
    enum: ['NGN', 'USD', 'EUR'],
    default: 'NGN',
  },
  plan: {
    type: String,
    enum: ['StarterSpase', 'GrowthSpase', 'EliteSpase', 'EmpireSpase'],
    required: true,  // Ensure plan is always set
  },

}, {
  timestamps: true,
});

// Create and export the model
export const ProfitModel = mongoose.model('Profit', profitSchema);
