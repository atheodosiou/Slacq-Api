import express from 'express';
const router = express.Router();

//Import controllers
import * as userController from '../controllers/user.controller';

router.get('/me', userController.me);

export { router };