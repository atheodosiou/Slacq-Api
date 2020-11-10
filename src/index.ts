import express, { Request, Response, NextFunction } from 'express';
import doenv from 'dotenv';
import { connectToDB } from './core/db/db';
import cors from 'cors';

const app = express();
doenv.config();

const baseUrl = '/api/v1'
app.use(express.json());

const corsOptions: cors.CorsOptions = {
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token", "X-Total-Count"],
    exposedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token", "X-Total-Count"],
    credentials: true,
    methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
    preflightContinue: false
};

app.use(cors(corsOptions));

//Import routes
import * as authRoutes from './core/routes/auth.routes';

app.use(`${baseUrl}/auth`, authRoutes.router);

//Error handling 404
app.use('/', (req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({ error: `Not found. Try using ${baseUrl} instead...` });
});

app.listen(process.env.PORT, () => {
    connectToDB().then(() => {
        console.log("Connection to db was successfull!")
        console.log(`Server is running on port ${process.env.PORT} ...`);
    }).catch(error => {
        console.error(`[ERROR] ${error?.message}`);
    });
})