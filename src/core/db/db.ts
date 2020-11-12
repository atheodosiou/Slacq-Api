import { ConnectionOptions, connect } from 'mongoose';
import { Environment } from '../environment';

const options: ConnectionOptions = { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true };

export function connectToDB(){
    console.log('Connecting to db...')
    return connect((Environment.CONNECTION_STRING as string), options);
}