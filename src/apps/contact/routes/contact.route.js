import express from 'express';
import { ContactController, GuideDownloadController } from '../controllers/contact.controller.js'


const contactRouter = express.Router();

// User contact
contactRouter.post('/submit', ContactController);

// Download business guide pdf
contactRouter.post('/guide-download', GuideDownloadController);


export default contactRouter;