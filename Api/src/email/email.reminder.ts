import { CronJob } from 'cron';
import {transporter} from './email.index'

import UserRepo from '../database/user.repo';
import EventRepo from '../database/event.repo';
/**
 * Class EmailReminder
 * That checks the database every hour for due dates of events
 * Sends an email to particpants of that event if within 3 days
 * of the start date of the event.
 * Uses CronJob to do a job in intervals.
 * 
 *  https://stackoverflow.com/questions/64777543/how-to-make-a-cron-job-for-a-typescript-class-method
 */
export default class EmailReminder{

    cronJob: CronJob;
    /**
     *
     */
    constructor() {
        //0 1 * * * -> Does the job every 1 day at 1AM
        this.cronJob = new CronJob('0 1 * * * *', async () => {
            try {
              await this.checktask();
            } catch (e) {
              console.error(e);
            }
          });
          
          // Start job
          if (!this.cronJob.running) {
            this.cronJob.start();
          }
    }

    async checktask(): Promise<void>{
     // const user = await UserRepo.findById(this.emailId)
     // const event = await EventRepo.findById(this.eventId);


      const email = await transporter.sendMail({
        from: '"Tregatta/Oxbridge" <oxbridge.noreply@gmail.com>',
        to: "",
        subject: "Do not forget your upcomming race event at Oxbridge",
        text: "Your event starts at: ",
        headers: {'x-myheader': 'Tregatta/Oxbridge Event'}

      });


    }
}

const emailReminder = new EmailReminder();