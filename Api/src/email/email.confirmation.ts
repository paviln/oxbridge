
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

    eventId: Types.ObjectId;
    shipId: Types.ObjectId;
    /**
     *
     */
    constructor( eventId: Types.ObjectId, shipId: Types.ObjectId) {
        this.eventId = eventId;
        this.shipId = shipId;

        try {
            this.emailtask();
        } catch (error) {
            console.error(error);
        }

    }

    async emailtask(): Promise<void>{

        const user = await ShipRepo.findById(this.shipId)
        
        const event = await EventRepo.findById(this.eventId);
        console.log(user);
        console.log(event);
        const email = await transporter.sendMail({
            from: '"Tregatta/Oxbridge" <oxbridge.noreply@gmail.com>',
            to: user.emailUsername,
            subject: "Dear Participant, you are now registered for: " + event.name,
            text: "Your event " + event.name + " : "+ event.eventCode + " is in " + event.city + ". The event starts at: " + event.eventStart + ".",
            headers: { 'x-myheader': 'Tregatta/Oxbridge Event' }
            
        }).catch((error: any) =>{
            console.error(error);
        });
    }
}