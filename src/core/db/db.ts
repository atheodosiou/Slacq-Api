import { ConnectionOptions, connect } from 'mongoose';
import dotenv from 'dotenv';
import { Console } from 'console';

dotenv.config();

const options: ConnectionOptions = { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true };

export function connectToDB(){
    console.log('Connecting to db...')
    return connect((process.env.CONNECTION_STRING as string), options);
}