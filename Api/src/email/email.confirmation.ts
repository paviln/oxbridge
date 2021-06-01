
import User, {IUser} from '../models/user';
import {Request, Response} from 'express';
import {Types} from "mongoose";
import {transporter} from './index'
import ShipRepo from '../database/ship.repo';
import UserRepo from '../database/user.repo';
import EventRepo from '../database/event.repo';
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
    constructor( eventId: number, shipId: number) {
        this.eventId = eventId;
        this.shipId = shipId;

        try {
            this.emailtask();
        } catch (error) {
            console.error(error);
        }

    }

    async emailtask(): Promise<void>{
        
        const ship = await ShipRepo.findById(this.shipId)
        if(!ship) return;
        const user = await UserRepo.findById(ship.emailUsername);
        if(!user) return;
        var event = await EventRepo.findById(this.eventId);
        if(!event) return;
        console.log("I am ship: "+ ship);
        console.log("I am User: "+ user);
        console.log("I am Event:" + event);
        const email = await transporter.sendMail({
            from: '"Tregatta/Oxbridge" <oxbridge.noreply@gmail.com>',
            to: user.emailUsername,
            subject: "Dear Participant, you are now registered for: " + event.name,
            html: `<h1>Email Confirmation</h1>
                    <h2>Hello ${user.firstname}</h2>
                    <p>Thank you for signing up on ${event.name}. Your event starts at: ${event.eventStart}</p>
                    </div>`,
            headers: { 'x-myheader': 'Tregatta/Oxbridge Event' }
            
        }).catch((err: any) => console.log(err));
    }
}