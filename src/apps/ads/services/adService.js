// adService.js
import { CampaignModel } from '../models/campaign.js';

/* Function to update ad status based on conditions */
// export async function updateAdStatus() {
export const updateAdStatus = async (req, res) => {
  const campaigns = await CampaignModel.find();
  const now = new Date();

  campaigns.forEach(async (campaign) => {
    const { adDuration, deliveryStatus } = campaign;

    const isWithinDateRange = adDuration.noEndDate ||
      (now >= new Date(adDuration.campaignStartDate) && now <= new Date(adDuration.campaignEndDate));

    const shouldBeActive = isWithinDateRange && deliveryStatus === "Active";

    if (campaign.isActive !== shouldBeActive) {
      campaign.isActive = shouldBeActive;
      await campaign.save();
    }
  });
}

/* Function to get all active ads */
// export async function getActiveAds() {
export const getActiveAds = async (req, res) => {
  return await CampaignModel.find({ isActive: true });
}
