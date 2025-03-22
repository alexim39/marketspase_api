import express from 'express';
import { 
    toggleNotification
} from '../controllers/settings.controller.js'

const SettingsRouter = express.Router();

// toggle notification settings
SettingsRouter.post('/notification', toggleNotification);

export default SettingsRouter;