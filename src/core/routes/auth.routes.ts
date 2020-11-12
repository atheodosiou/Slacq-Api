import express from 'express';
const router = express.Router();

//Import controllers
import * as authController from '../controllers/auth.controller';

router.post('/login', authController.login);
router.post('/register', authController.register);


export { router };