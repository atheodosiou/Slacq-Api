import express from 'express';
const router = express.Router();

//Import controllers
import * as userController from '../controllers/user.controller';

router.get('/', userController.getAllUsers);
router.get('/me', userController.me);
router.post('/me/upload-avatar',userController.uploadAvatar)
router.get('/join/:id', userController.joinChannel);
router.get('/leave/:id', userController.leaveChannel);

export { router };