import * as dotenv from 'dotenv';
import cors, { CorsOptions } from 'cors';
dotenv.config();

const corsOptions: CorsOptions = {
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token", "X-Total-Count"],
    exposedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token", "X-Total-Count"],
    credentials: true,
    methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
    preflightContinue: false
};

export const Environment = {
    CONNECTION_STRING: process.env.CONNECTION_STRING,
    PORT: process.env.PORT,
    TOKEN_SECRET: process.env.TOKEN_SECRET,
    BASE_URL: '/api/v1',
    CORS_OPTIONS: corsOptions,
    avatarImageZise:10000000, // 1 Mb expresed in bytes
    avatarsPublicFolder:'./public/uploads/avatars'
}