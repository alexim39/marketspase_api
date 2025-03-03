import express from 'express';
import { 
    prospectSurveyFormHandler,
    prospectSignUpFormHandler
} from '../controllers/get-started.controller.js'

const GetStartedRouter = express.Router();

// prospet user survey
GetStartedRouter.post('/survey', prospectSurveyFormHandler);
// prospet user survey
GetStartedRouter.post('/signup', prospectSignUpFormHandler);

export default GetStartedRouter;