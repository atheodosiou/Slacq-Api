import express from 'express';
const router = express.Router();

//Import controllers
import * as channelController from '../controllers/channel.controller';

router.get('/', channelController.getAllChannels);
router.post('/', channelController.createChannel);
router.delete('/:id', channelController.deleteChannel);

export { router };