import dotenv from 'dotenv';

dotenv.config({path: __dirname + '/../.env'});
console.log(__dirname);
const env = process.env;

export default {
    jwtSectetKey: env.SECRET ?? ''
}