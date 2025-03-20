import mongoose from 'mongoose';
import { updateAdStatus } from '../services/adService.js';

/* Campaign schema*/
const campaignSchema = mongoose.Schema({
  targetAudience: {
    ageRangeTarget: { type: String, default: 'All' },
    genderTarget: { type: String, default: 'All' },
    educationTarget: { type: String, default: 'All' },
    relationshipTarget: { type: String, default: 'All' },
    industryTarget: { type: String, default: 'All' },
  },
  marketingObjectives: {
    adObjective: { type: String, required: true },
    successMeasurement: { type: String},
  },
  budget: {
    budgetType: { type: String, required: true },
    budgetAmount: { type: Number, required: true },
  },
  adDuration: {
    campaignStartDate: { type: Date, required: true },
    noEndDate: { type: Boolean, required: true },
    campaignEndDate: { type: Date },
  },
  adFormat: {
    adFormat: { type: String, required: true },
    deviceType: { type: String, required: true },
    adPreferences: {
      FacebookFeed: { type: Boolean, default: false },
      InstagramFeed: { type: Boolean, default: false },
      InstagramStories: { type: Boolean, default: false },
      FacebookStories: { type: Boolean, default: false },
      AudienceNetwork: { type: Boolean, default: false },
      MessengerInbox: { type: Boolean, default: false },
    },
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'partner', 
    required: true,
  },
  campaignName: {
    type:String,
    required: true,
  },
  deliveryStatus: {
    type:String,
    required: true,
    default: "Pending"
  },
  isActive: {
    type: Boolean,
    default: false // New field to track ad status
  },
  userDevice: {
    type: String,
  },
  leads: {
    type: Number,
    required: true,
    default: 0
  },
},
{
    timestamps: true
}
);

/* Middleware to update isActive status on save */
campaignSchema.post('save', async function () {
  await updateAdStatus();
});

/* Model */
export const CampaignModel = mongoose.model('Campaign', campaignSchema);