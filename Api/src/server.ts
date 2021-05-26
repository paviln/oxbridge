import bodyParser from 'body-parser';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import routes from './routes';

const app = express();

const env = dotenv.config({path: __dirname + '/.env'});
if (env.error) {
  throw new Error('Failed to load envirement config.');
}

app.use(cors());

// Parse body params and attache them to req.body.
app.use(bodyParser.json({limit: '50mb'}));
const options = {limit: '50mb', extended: true, parameterLimit: 50000};
app.use(bodyParser.urlencoded(options));

app.use(helmet());

app.use(express.static('public'));

mongoose.set('useUnifiedTopology', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);

//  MAKE DB CONNECTION
mongoose.connect('mongodb://localhost:27017/OxbridgeDB');

//  ROUTING
app.use('/api', routes);

//  SERVER START
app.listen(process.env.PORT || 3000, () => {
  console.log('We are now listening on port 3000 (serverside)');
});
