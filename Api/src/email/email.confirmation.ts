
import User, {IUser} from '../models/user';
import Ship, {IShip} from '../models/ship';
import Event, {IEvent} from '../models/event';
import {Request, Response} from 'express';
import {Types} from "mongoose";
import {transporter} from './index'
import { getEmailInfo } from '../config/config';
/**
 * Class EmailConfirmation
 * That sends an confirmation email 
 * to participants whenever they 
 * register themselves to an
 * existing event.
 * 
 */

export default class EmailConfirmation{

    eventId: number;
    shipId: number;
    /**
     *
     */
    constructor(shipId: number, eventId: number) {
        this.eventId = eventId;
        this.shipId = shipId;

        try {
            this.emailtask();
        } catch (error) {
            console.error(error);
        }

    }

    async emailtask(): Promise<void>{
       
        const ship = await Ship.findOne({shipId: this.shipId});
        if(!ship) return;
        const user = await User.findOne({emailUsername: ship.emailUsername});
        if(!user) return;
        const event = await Event.findOne({eventId: this.eventId});
        if(!event) return;
        const emaild = await transporter.sendMail({
            from: '"Tregatta/Oxbridge" <oxbridge.noreply@gmail.com>',
            to: user.emailUsername,
            subject: 'Dear Participant, you are now registered for: ' + event.name,
            html: `<h1>Email Confirmation</h1>
                    <h2>Hello ${user.firstname}</h2>
                    <p>Thank you for signing up on ${event.name}. Your event starts at: ${event.eventStart}</p>
                    </div>`,
            headers: { 'x-myheader': 'Tregatta/Oxbridge Event' }
        }).catch((err: any) => console.log(err));
    }
}