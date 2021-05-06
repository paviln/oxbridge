export class CheckPoint {
    constructor(
        public id: number, 
        public pin1: google.maps.Marker, 
        public pin2: google.maps.Marker, 
        public polyline: google.maps.Polyline
        ){}
}
