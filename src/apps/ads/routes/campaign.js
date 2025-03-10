import express from 'express';
import { 
    createFacebookCampaign,
    getCampaignsCreatedBy,
    createYoutubeCampaign,
    createLinkedinCampaign,
    getCampaign
} from '../controllers/campaign.js'
import { getActiveAds } from '../services/adService.js';

const CampaignRouter = express.Router();

// create facebook campaign
CampaignRouter.post('/facebook', createFacebookCampaign);

// create youtbue campaign
CampaignRouter.post('/youtube', createYoutubeCampaign);

// create linkedin campaign
CampaignRouter.post('/linkedin', createLinkedinCampaign);

// Get all campaigns createdBy
CampaignRouter.get('/all-createdBy/:createdBy', getCampaignsCreatedBy);

// Get a camapaign
CampaignRouter.get('/:id', getCampaign);

// Get all active ads
/* Endpoint to get all active ads */
CampaignRouter.get('/active-ads', async (req, res) => {
    try {
      const activeAds = await getActiveAds();
      res.status(200).json(activeAds);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch active ads' });
    }
});

export default CampaignRouter;