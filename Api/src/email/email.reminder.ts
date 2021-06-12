import { CronJob } from 'cron';
import { transporter } from './index'
/**
 * Class EmailReminder
 * That checks the database every hour for due dates of events
 * Sends an email to particpants of that event if within 3 days
 * of the start date of the event.
 * Uses CronJob to do a job in intervals.
 * 
 *  https://stackoverflow.com/questions/64777543/how-to-make-a-cron-job-for-a-typescript-class-method
 */
export default class EmailReminder {

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

  async checktask(): Promise<void> {
  /*  const user = await UserRepo.findById(this.emailId)
    const event = await EventRepo.findById(this.eventId);

    //Define min and max database of checking of events
    const max = new Date();
    const min = new Date();
    min.setDate(min.getDate() - 3);

    //Find the events that has not been checked
    const nonCheckedEvents = await EventRepo.findCheckedEvent();
    //add validation

    const email = await transporter.sendMail({
      from: '"Tregatta/Oxbridge" <oxbridge.noreply@gmail.com>',
      to: user.emailUsername,
      subject: "Dear Participant, you are now registered for: " + event.name,
      html: `<h1>Email Confirmation</h1>
              <h2>Hello ${user.firstname}</h2>
              <p>Thank you for signing up on ${event.name}. Your event starts at: ${event.eventStart}</p>
              </div>`,
      headers: { 'x-myheader': 'Tregatta/Oxbridge Event' }

    }).catch((err: any) => console.log(err)); */
  }
}

const emailReminder = new EmailReminder();