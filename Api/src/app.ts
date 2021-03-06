import { Express, Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import {errorHandler} from 'express-http-custom-error';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import routes from './routes';
import dotenv from 'dotenv';
import * as cron from 'node-cron';
import {sendEventReminder} from './services/eventService';
const express = require('express');

const app = express();

const env = dotenv.config({ path: './.env' });

if (env.error) {
  throw new Error('Failed to load envirement config.');
}
app.use(cors());

// Parse body params and attache them to req.body.
app.use(express.json({limit: '50mb'}));
const options = {limit: '50mb', extended: true, parameterLimit: 50000};
app.use(express.urlencoded(options));

app.use(helmet());

app.use(express.static('public'));

mongoose.set('useUnifiedTopology', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);

// MAKE DB CONNECTION
mongoose.connect('mongodb://localhost:27017/OxbridgeDB');

// ROUTING
app.use('/api', routes);

// Run every 5 ish sec */10 0 0 * * *
cron.schedule('*/10 0 0 * * *', () => {
  sendEventReminder();
});

// SERVER START
app.listen(process.env.PORT || 3000, () => {
  console.log('We are now listening on port 3000 (serverside)');
});

app.use(errorHandler);

export default app;
