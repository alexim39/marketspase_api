import mongoose from 'mongoose';

// Define the transaction schema
const planSchema = new mongoose.Schema({
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
  reference: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ['success', 'pending', 'failed'],
    default: 'pending',
  },
  message: {
    type: String,
  },
  trans: {
    type: String,
  },
  plan: {
    type: String,
    enum: ['StarterSpase', 'GrowthSpase', 'EliteSpase', 'EmpireSpase'],
    default: function() {
      switch (this.amount) {
        case 10000:
          return 'StarterSpase';
        case 30000:
          return 'GrowthSpase';
        case 50000:
          return 'EliteSpase';
        case 100000:
          return 'EmpireSpase';
        default:
          return null;
      }
    },
    required: true,  // Ensure plan is always set
  },
 /*  linkId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction',
    default: null
  }, */
}, {
  timestamps: true,
});

// Index to speed up queries based on partnerId and reference
planSchema.index({ partnerId: 1, reference: 1 });

// Pre-save middleware to set randomized linkId
/* transactionSchema.pre('save', async function(next) {
  if (!this.linkId) {
    const [randomTransaction] = await mongoose.model('Transaction').aggregate([
      { $sample: { size: 1 } }  // Randomly select one transaction
    ]);

    this.linkId = randomTransaction ? randomTransaction._id : null;
  }
  next();
});
 */
// Create and export the model
export const PlanModel = mongoose.model('Plan', planSchema);
