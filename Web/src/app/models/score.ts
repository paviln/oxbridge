import { LocationsRegistration } from './locations-registration';

export class Score {
    constructor(
        public placement: number, 
        public teamName: string, 
        public color:string, 
        public shipId: number, 
        public locationsRegistrations: LocationsRegistration[]
        ){}
}
