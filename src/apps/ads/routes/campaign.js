import express from 'express';
import { 
    createFacebookAd,
    getAds,
    createYoutubeAd,
    createLinkedinAd,
    getAd,
    createGoogleAd,
    createTiktokAd
} from '../controllers/campaign.js'
import { getActiveAds } from '../services/adService.js';

const CampaignRouter = express.Router();

// create facebook campaign
CampaignRouter.post('/facebook', createFacebookAd);

// create youtbue campaign
CampaignRouter.post('/google', createGoogleAd);

// create youtbue campaign
CampaignRouter.post('/youtube', createYoutubeAd);

// create linkedin campaign
CampaignRouter.post('/linkedin', createLinkedinAd);

// create tiktok campaign
CampaignRouter.post('/tiktok', createTiktokAd);

// Get all campaigns createdBy
CampaignRouter.get('/createdBy', getAds);

// Get a camapaign
CampaignRouter.get('/', getAd);

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