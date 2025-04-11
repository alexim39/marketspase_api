import express from 'express';
import { 
    survey,
    signUp
} from '../controllers/get-started.controller.js'

const GetStartedRouter = express.Router();

// prospet user survey
GetStartedRouter.post('/survey', survey);
// prospet user survey
GetStartedRouter.post('/signup', signUp);

export default GetStartedRouter;