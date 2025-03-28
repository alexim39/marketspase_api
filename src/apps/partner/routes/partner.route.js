import express from 'express';
import { 
    checkPartnerUsername, getBalance, updateProfile, updateProfession, updateUsername,
} from '../controllers/partner.controller.js'

const partnerRouter = express.Router();

// get a partner
partnerRouter.get('/check-username/:username', checkPartnerUsername);

// get a partner balance
partnerRouter.get('/balance', getBalance);
// Update partner
partnerRouter.put('/update-profile', updateProfile);

// Update partner
partnerRouter.put('/update-profession', updateProfession);

// Update username
partnerRouter.put('/update-username', updateUsername)




export default partnerRouter;