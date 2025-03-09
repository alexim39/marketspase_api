import { TransactionModel } from "../../models/transaction.model.js";
import { PartnersModel } from "../../../partner/models/partner.model.js";

export const CalculateCompensationAndDistribute = async (amount) => {
  try {
    //console.log('cold called to run', amount);

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

    //console.log(`Distribution Amount: ₦${distributionAmount}`);

    // Fetch one random successful transaction for each plan
    const plans = ['StarterSpase', 'GrowthSpase', 'EliteSpase', 'EmpireSpase'];
    const transactions = [];

    for (const plan of plans) {
      const result = await TransactionModel.aggregate([
        { $match: { status: 'success', plan: plan } },  // Filter by plan and status
        { $sample: { size: 1 } },                       // Randomly select 1 transaction for this plan
        { $group: {                                     // Ensure unique partner for each plan type
            _id: "$partnerId",
            transaction: { $first: "$$ROOT" }           // Keep the first transaction per partnerId
          }
        },
        { $replaceRoot: { newRoot: "$transaction" } }   // Replace root to get original transaction structure
      ]);

      if (result.length > 0) {
        transactions.push(result[0]);  // Add the selected transaction to the array
      } else {
        console.log(`No successful transactions found for plan: ${plan}`);
        return;  // Exit if any plan has no transactions
      }
    }

    //console.log("Randomly Selected Transactions:", transactions);

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
