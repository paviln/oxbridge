import {describe, test} from '@jest/globals';
import {SendReminder} from '../src/services/emailService';

const emailUsername: string = "paviln@outlook.dk";
const date: Date = new Date;

describe('Send reminder to team participant', () => {
  test('email + date', () => {
    SendReminder(emailUsername, date);
  });
});

