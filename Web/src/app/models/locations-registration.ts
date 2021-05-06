export class LocationsRegistration {
    constructor(
        public eventRegId: number, 
        public locationTime: string, 
        public longtitude: number, 
        public latitude: number, 
        public racePointNumber: number, 
        public raceScore: number, 
        public regId?:number
        ){}
}
