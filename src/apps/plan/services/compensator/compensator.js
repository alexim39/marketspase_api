import { PlanModel } from "../../models/plan.model.js";
import { PartnersModel } from "../../../partner/models/partner.model.js";
import { CampaignModel } from "../../../ads/models/campaign.js"; // New import

export const CalculateCompensationAndDistribute = async (amount, initiatingPartnerId) => {
  try {
    // Define compensation structure with percentage and distribution for each plan
    const compensationConfig = {
      StarterSpase: { percentage: 10, distribution: 4000 },
      GrowthSpase: { percentage: 15, distribution: 12000 },
      EliteSpase: { percentage: 20, distribution: 20000 },
      EmpireSpase: { percentage: 25, distribution: 40000 }
    };

    // Determine the distribution amount based on the passed-in amount
    let distributionAmount = compensationConfig.StarterSpase.distribution; // Default in case of invalid amount
    switch (amount) {
      case 10000:
        distributionAmount = compensationConfig.StarterSpase.distribution;
        break;
      case 30000:
        distributionAmount = compensationConfig.GrowthSpase.distribution;
        break;
      case 50000:
        distributionAmount = compensationConfig.EliteSpase.distribution;
        break;
      case 100000:
        distributionAmount = compensationConfig.EmpireSpase.distribution;
        break;
      default:
        console.log('Invalid amount. No matching plan found.');
        return;
    }

    // Fetch 4 random successful transactions for each plan with an active ad
    let selectedPartners = [];

    const result = await PlanModel.aggregate([
      { $match: { status: 'success', partnerId: { $ne: initiatingPartnerId } } }, // Exclude initiating partner
      {
        $lookup: {
          from: 'campaigns',
          localField: 'partnerId',
          foreignField: 'createdBy',
          as: 'adsInfo'
        }
      },
      { $unwind: '$adsInfo' },
      { $match: { 'adsInfo.isActive': true } },
      {
        $group: {
          _id: '$partnerId',
          transaction: { $first: '$$ROOT' }
        }
      },
      { $sample: { size: 10 } }, // Select more than 4 to ensure we get valid partners
      { $replaceRoot: { newRoot: '$transaction' } }
    ]);

    if (result.length === 0) {
      console.log(`No successful transactions with active ads found.`);
      return;
    }

    // Process transactions ensuring partners are only added after lead increment
    for (const transaction of result) {
      if (selectedPartners.length >= 4) break; // Stop once we have 4 valid partners

      const { partnerId, plan } = transaction;
      const config = compensationConfig[plan];

      if (!config) {
        console.log(`No compensation config found for plan: ${plan}`);
        continue;
      }

      // Calculate profit based on distribution amount and plan's percentage
      const profit = (distributionAmount * config.percentage) / 100;

      // Select a random active campaign for this partner
      const randomCampaignArr = await CampaignModel.aggregate([
        { $match: { isActive: true, createdBy: partnerId } },
        { $sample: { size: 1 } }
      ]);

      if (randomCampaignArr.length > 0) {
        const selectedCampaign = randomCampaignArr[0];

        // Increment the campaign leads
        const updatedCampaign = await CampaignModel.findByIdAndUpdate(
          selectedCampaign._id,
          { $inc: { leads: 1 } },
          { new: true }
        );

        if (updatedCampaign) {
          console.log(`Campaign ${updatedCampaign._id} updated. New leads count: ${updatedCampaign.leads}`);

          // Update partner's balance only if campaign leads were successfully incremented
          const updatedPartner = await PartnersModel.findByIdAndUpdate(
            partnerId,
            { $inc: { balance: profit } },
            { new: true }
          );

          if (updatedPartner) {
            console.log(`Partner ${updatedPartner.username} (Plan: ${plan}) received ₦${profit}. New Balance: ₦${updatedPartner.balance}`);
            selectedPartners.push(partnerId);
          }
        }
      } else {
        console.log(`No active campaign found for partner ${partnerId}, skipping compensation.`);
      }
    }

    if (selectedPartners.length === 0) {
      console.log('No valid partners found for compensation.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};






/* import { PlanModel } from "../../models/plan.model.js";
import { PartnersModel } from "../../../partner/models/partner.model.js";

export const CalculateCompensationAndDistribute = async (amount) => {
  try {
    // Define compensation structure with percentage and distribution for each plan
    const compensationConfig = {
      StarterSpase: { percentage: 10, distribution: 4000 },
      GrowthSpase: { percentage: 15, distribution: 12000 },
      EliteSpase: { percentage: 20, distribution: 20000 },
      EmpireSpase: { percentage: 25, distribution: 40000 }
    };

    // Determine the distribution amount based on the passed-in amount
    let distributionAmount = compensationConfig.StarterSpase.distribution;  // Default in case of invalid amount
    switch (amount) {
      case 10000:
        distributionAmount = compensationConfig.StarterSpase.distribution;
        break;
      case 30000:
        distributionAmount = compensationConfig.GrowthSpase.distribution;
        break;
      case 50000:
        distributionAmount = compensationConfig.EliteSpase.distribution;
        break;
      case 100000:
        distributionAmount = compensationConfig.EmpireSpase.distribution;
        break;
      default:
        console.log('Invalid amount. No matching plan found.');
        return;
    }      

      
    // Fetch 4 random successful transactions for each plan with an active ad
    const transactions = [];

    const result = await PlanModel.aggregate([
      { $match: { status: 'success' } },                 // Match successful transactions only
      {
        $lookup: {
          from: 'campaigns',                             // Correct collection name (make sure it's right)
          localField: 'partnerId',
          foreignField: 'createdBy',
          as: 'adsInfo'
        }
      },
      { $unwind: '$adsInfo' },                           // Unwind to access individual ads
      { $match: { 'adsInfo.isActive': true } },          // Check for active ads using isActive field
      {
        $group: {                                        // Group by partner to ensure uniqueness
          _id: '$partnerId',
          transaction: { $first: '$$ROOT' }              // Take the first transaction per partner
        }
      },
      { $sample: { size: 4 } },                          // Randomly select 4 unique partners
      { $replaceRoot: { newRoot: '$transaction' } }      // Replace root to get original transaction structure
    ]);

    if (result.length > 0) {
      //console.log(`Found transactions:`, result);
      transactions.push(...result);                      // Add selected transactions to the list
    } else {
      console.log(`No successful transactions with active ads found.`);
    }


    // Process each transaction
    for (const transaction of transactions) {
      const { partnerId, plan } = transaction;
      const config = compensationConfig[plan];

      if (!config) {
        console.log(`No compensation config found for plan: ${plan}`);
        continue;
      }

      // Calculate profit based on the distribution amount and the plan's percentage
      const profit = (distributionAmount * config.percentage) / 100;  // Profit based on plan's percentage

      // Update partner's balance
      const updatedPartner = await PartnersModel.findByIdAndUpdate(
        partnerId,
        { $inc: { balance: profit } },  // Increment balance by profit
        { new: true }                   // Return the updated document
      );

      console.log(`Partner ${updatedPartner.username} (Plan: ${plan}) received ₦${profit}. New Balance: ₦${updatedPartner.balance}`);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
 */