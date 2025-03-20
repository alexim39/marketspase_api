import { CampaignModel } from '../models/campaign.js';

const COST_PER_6_DAYS = 1000;

/* Function to update ad status based on conditions */
export const updateAdStatus = async () => {
    const campaigns = await CampaignModel.find();
    const now = new Date();

    await Promise.all(campaigns.map(async (campaign) => {
        const { adDuration, budget } = campaign;
        const { campaignStartDate, campaignEndDate, noEndDate } = adDuration;
        const { budgetAmount } = budget;

        const startDate = new Date(campaignStartDate);
        const endDate = noEndDate ? now : new Date(campaignEndDate);
        const diffInDays = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
        const totalCost = Math.floor(diffInDays / 6) * COST_PER_6_DAYS;

        const isWithinDateRange = noEndDate || (now >= startDate && now <= endDate);
        const hasBudget = totalCost < budgetAmount;
        const isActive = isWithinDateRange && hasBudget;

        let deliveryStatus = campaign.deliveryStatus;

        if (isActive) {
            deliveryStatus = "Active";
        } else if (isWithinDateRange && !hasBudget) {
            deliveryStatus = "Expired";
        } else if (!isWithinDateRange) {
            deliveryStatus = "Inactive";
        } else if (!isActive && !hasBudget && !isWithinDateRange){
            deliveryStatus = "Inactive";
        } else if (!isActive && hasBudget && !isWithinDateRange){
            deliveryStatus = "Inactive";
        } else {
            if (now > endDate && !noEndDate) {
                if (totalCost < budgetAmount) {
                    deliveryStatus = "Completed";
                } else {
                    deliveryStatus = "Finished";
                }
            }
        }

        if (campaign.isActive !== isActive || campaign.deliveryStatus !== deliveryStatus) {
            campaign.isActive = isActive;
            campaign.deliveryStatus = deliveryStatus;
            await campaign.save();
        }
    }));
};


/* Function to get all active ads */
// export async function getActiveAds() {
export const getActiveAds = async (req, res) => {
  return await CampaignModel.find({ isActive: true });
}
