import express from 'express';
import { 
    checkPartnerUsername, getPartner, partnerSignout, partnerSignin, accountActivationEmail, activateAccount,
    getBalance, updateProfile, updateProfession, updateUsername, changePassword
} from '../controllers/partner.controller.js'

const partnerRouter = express.Router();

// partner login
partnerRouter.post('/signin', partnerSignin);
// get a partner
partnerRouter.get('/check-username/:username', checkPartnerUsername);
// Get partner
partnerRouter.get('/partner', getPartner);
// partner logout
partnerRouter.post('/signout', partnerSignout);
// get a partner balance
partnerRouter.get('/balance', getBalance);
// Update partner
partnerRouter.put('/update-profile', updateProfile);

// Update partner
partnerRouter.put('/update-profession', updateProfession);

// Update username
partnerRouter.put('/update-username', updateUsername)

// Change password
partnerRouter.put('/change-password', changePassword)

// partner account activation email request
partnerRouter.post('/activate', accountActivationEmail);

// partner account activation email request
partnerRouter.get('/activation/:partnerId', activateAccount);

export default partnerRouter;