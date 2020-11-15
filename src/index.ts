import { StatusCodeExplanation } from './core/enums/statusCodeExplanation.enum';
import express, { Request, Response, NextFunction } from 'express';
import { IError } from './core/interfaces/error.interface';
import { Environment } from './core/environment';
import { connectToDB } from './core/db/db';
import cors from 'cors';

const app = express();
app.use(express.json()); 
app.use(cors(Environment.CORS_OPTIONS));

app.use(express.static('./public'))

//Routes
import { router } from './core/routes/index';
import { checkfileType } from './core/helpers/check-file-type';
app.use(router);

//Error handling 404
app.use('/', (req: Request, res: Response, next: NextFunction) => {
    const error: IError = { statusCode: 404, message: StatusCodeExplanation.NOT_FOUND, details: `Path not found. Try using ${Environment.BASE_URL} instead...` };
    res.status(error.statusCode).json(error);
});


app.listen(Environment.PORT, () => {
    connectToDB().then(() => {
        console.log("Connection to db was successfull!")
        console.log(`Server is running on port ${Environment.PORT} ...`);
    }).catch(error => {
        console.error(`[ERROR] ${error?.message}`);
    });
})