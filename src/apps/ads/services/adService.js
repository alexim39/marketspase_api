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


// // adService.js
// import { CampaignModel } from '../models/campaign.js';

// /* Function to update ad status based on conditions */
// export const updateAdStatus = async (req, res) => {
//   const campaigns = await CampaignModel.find();
//   const now = new Date();

//   campaigns.forEach(async (campaign) => {
//     const { adDuration, deliveryStatus } = campaign;

//     const isWithinDateRange = adDuration.noEndDate ||
//       (now >= new Date(adDuration.campaignStartDate) && now <= new Date(adDuration.campaignEndDate));

//     const shouldBeActive = isWithinDateRange && deliveryStatus === "Active";

//     if (campaign.isActive !== shouldBeActive) {
//       campaign.isActive = shouldBeActive;
//       await campaign.save();
//     }
//   });
// }




// import { CampaignModel } from '../models/campaign.js';

// const COST_PER_6_DAYS = 1000;

// /* Function to update ad status based on conditions */
// export const updateAdStatus = async () => {
//   const campaigns = await CampaignModel.find();
//   const now = new Date();

//   campaigns.forEach(async (campaign) => {
//     const { adDuration, deliveryStatus, budget } = campaign;
//     const { campaignStartDate, campaignEndDate, noEndDate } = adDuration;
//     const { budgetAmount } = budget;
    
//     // Calculate the number of days the ad has been active
//     const startDate = new Date(campaignStartDate);
//     const endDate = noEndDate ? now : new Date(campaignEndDate);
//     const diffInDays = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
    
//     // Calculate the total cost incurred
//     const totalCost = Math.floor(diffInDays / 6) * COST_PER_6_DAYS;
    
//     const isWithinDateRange = noEndDate || (now >= startDate && now <= endDate);
//     const shouldBeActive = isWithinDateRange && deliveryStatus === "Active";

//     if (campaign.isActive !== shouldBeActive) {
//       campaign.isActive = shouldBeActive;
//     }
    
//     // Check if the budget is fully consumed
//     if (totalCost >= budgetAmount && isWithinDateRange) {
//       campaign.deliveryStatus = "Expired";
//     } else if (totalCost < budgetAmount && isWithinDateRange) {
//       campaign.deliveryStatus = "Completed";
//     }
    
//     await campaign.save();
//   });
// };

/* Function to get all active ads */
// export async function getActiveAds() {
export const getActiveAds = async (req, res) => {
  return await CampaignModel.find({ isActive: true });
}
