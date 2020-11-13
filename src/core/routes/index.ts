import express from 'express';
import { authenticateJWT } from '../midlewares/auth.midleware';
const router = express.Router();

import { router as authRouter } from './auth.routes';
import { router as userRouter } from './user.routes';
import { router as channelRouter } from './channel.routes';

const baseUrl = '/api/v1';

router.use(`${baseUrl}/auth`, authRouter);
router.use(`${baseUrl}/user`, authenticateJWT, userRouter);
router.use(`${baseUrl}/channels`, authenticateJWT, channelRouter);

export { router };