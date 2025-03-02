import express from 'express';
import { 
    checkPartnerUsername, getAllUsers,
    getPartnerByNames, getPartnerByName,
    partnerSignin, tiktokPage, twitterPage, updateTestimonial,
    getPartner, updateYoutubePage, updateInstagramPage,
    partnerSignout, updateFacebookPage, updateLinkedinPage,
    updateProfile, updateWhatsappGroupLink, updateWhatsappChatLink,
    updateUsername, unfollowPartner, checkFollowStatus, requestPasswordReset ,
    changePassword, updateProfession, followPartner, getPartnersOf, getPartnerById
} from '../controllers/partner.controller.js'

const partnerRouter = express.Router();

// get a partner
partnerRouter.get('/check-username/:username', checkPartnerUsername);

// partner login
partnerRouter.post('/signin', partnerSignin);

// Get partner
partnerRouter.get('/partner', getPartner);

// partner logout
partnerRouter.post('/signout', partnerSignout);

// Update partner
partnerRouter.put('/update-profile', updateProfile);

// Update partner
partnerRouter.put('/update-profession', updateProfession);

// Update username
partnerRouter.put('/update-username', updateUsername)

// Change password
partnerRouter.put('/change-password', changePassword)

// get all partners
partnerRouter.get('/getAllUsers', getAllUsers)

// get all partners
partnerRouter.get('/getPartnerByNames/:name/:surname', getPartnerByNames)

// get all partners
partnerRouter.get('/getPartnerByName/:name', getPartnerByName)

// follow
partnerRouter.post('/follow/:searchPartnerId', followPartner);

// unfollow
partnerRouter.post('/unfollow/:searchPartnerId', unfollowPartner);

// check follow
partnerRouter.get('/check-follow-status/:partnerId/:searchPartnerId', checkFollowStatus);

// Update partner social media pages
partnerRouter.put('/whatsappgrouplink', updateWhatsappGroupLink);
partnerRouter.put('/whatsappchatlink', updateWhatsappChatLink);
partnerRouter.put('/facebookPage', updateFacebookPage);
partnerRouter.put('/linkedinPage', updateLinkedinPage);
partnerRouter.put('/youtubePage', updateYoutubePage);
partnerRouter.put('/instagramPage', updateInstagramPage);
partnerRouter.put('/tiktokPage', tiktokPage);
partnerRouter.put('/twitterPage', twitterPage);
// update testimonial
partnerRouter.put('/testimonial', updateTestimonial);

// get all partnersOf
partnerRouter.get('/getPartnersOf/:partnerId', getPartnersOf);

// get partner by id
partnerRouter.get('/getById/:partnerId', getPartnerById);

// partner reset password request
partnerRouter.post('/reset-password-request', requestPasswordReset );


export default partnerRouter;