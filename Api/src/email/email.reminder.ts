import { CronJob } from 'cron';
import nodemailer from 'nodemailer';

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

    }
}

const emailReminder = new EmailReminder();