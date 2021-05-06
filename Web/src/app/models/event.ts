export class Event {
    constructor(
        public eventId?:string, 
        public name?:string, 
        public eventStart?:string, 
        public eventEnd?:string, 
        public city?:string, 
        public eventCode?:string, 
        public eventStartTime?: string, 
        public eventEndTime?: string, 
        public isLive?:boolean, 
        public actualEventStart?: string
        ){}
}
