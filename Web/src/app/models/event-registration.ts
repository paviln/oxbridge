export class EventRegistration {
    constructor(
        public shipId: number, 
        public eventId: number, 
        public teamName: string, 
        public trackColor?: string, 
        public eventRegId?: number 
        ){}
}
