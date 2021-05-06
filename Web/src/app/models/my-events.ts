export class MyEvents {
    constructor(
        public eventId:string, 
        public name:string, 
        public eventStart:Date, 
        public eventEnd:Date, 
        public city:string, 
        public shipName: string, 
        public teamName:string, 
        public actualEventStart?: string
        ){}
}
