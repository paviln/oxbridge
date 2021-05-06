import { Ship } from './ship';

export class EventSignUp {
    constructor(
        public teamName: string, 
        public eventCode: string, 
        public ship?: Ship
        ){}
}
