import { CampaignModel } from '../../ads/models/campaign.js';
import { PartnersModel } from '../../partner/models/partner.model.js';
import { PlanModel } from '../../plan/models/plan.model.js';
import mongoose from 'mongoose';


export const getAnalytics = async (req, res) => {
  try {
    const { partnerId } = req.params;


    // Filter campaigns by createdBy (which references Partner)
    const totalCampaigns = await CampaignModel.countDocuments({ createdBy: partnerId });
    const activeCampaigns = await CampaignModel.countDocuments({ createdBy: partnerId, isActive: true });

    const totalLeads = await CampaignModel.aggregate([
      { $match: { createdBy: new mongoose.Types.ObjectId(partnerId) } },
      { $group: { _id: null, total: { $sum: '$leads' } } },
    ]);

    // Count the total number of partners referred by this partner
    const totalPartners = await PartnersModel.countDocuments({ partnerOf: partnerId });
    const activePartners = await PartnersModel.countDocuments({ partnerOf: partnerId, status: true });

    // Get revenue based on successful transactions by this partner
    const totalRevenue = await PlanModel.aggregate([
      { $match: { partnerId: new mongoose.Types.ObjectId(partnerId), status: 'success' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    // Get the distribution of plans purchased by this partner
    const planDistribution = await PlanModel.aggregate([
      { $match: { partnerId: new mongoose.Types.ObjectId(partnerId) } },
      { $group: { _id: '$plan', count: { $sum: 1 } } },
    ]);

    res.json({
      totalCampaigns,
      activeCampaigns,
      totalLeads: totalLeads[0]?.total || 0,
      totalPartners,
      activePartners,
      totalRevenue: totalRevenue[0]?.total || 0,
      planDistribution,
      message: 'Analytics retrieved successfully!',
      success: true,
    });

  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
