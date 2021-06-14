import {describe, test} from '@jest/globals';
import { error } from 'console';
import {SendReminder} from '../src/services/emailService';
import EmailConfirmation from '../src/email/email.confirmation';
import EmailForgotPassword from '../src/email/email.forgotPassword'


const emailUsername: string = "paviln@outlook.dk";
const password: string = "1234"
const date: Date = new Date;
const shipId: number = 1;
const eventId: number = 1;

describe('Send reminder to team participant', () => {
  test('email + date', () => {
    SendReminder(emailUsername, date);
  });
});

describe('Send confirmation to participant', () => {
  test('shipId + eventId', () => {
    new EmailConfirmation(shipId, eventId);
  });
});

describe('Send new password to user', () => {
  test('email + password', () => {
    new EmailForgotPassword(emailUsername,password);
  });
});


