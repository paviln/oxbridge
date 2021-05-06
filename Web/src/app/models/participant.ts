export class Participant {
    constructor(
        public firstname: string, 
        public lastname: string, 
        public shipName:string, 
        public teamName: string, 
        public emailUsername: string, 
        public eventId?:string, 
        public eventRegId?: string
        ){}
}
