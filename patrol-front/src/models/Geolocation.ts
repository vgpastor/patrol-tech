export class Geolocation{
  public lat: number;
  public lon: number;
  public alt: number | null;
  public accuracy: number;

  constructor(lat: number, lon: number, alt: number| null, accuracy: number){
    this.lat = lat;
    this.lon = lon;
    this.alt = alt;
    this.accuracy = accuracy;
  }
}
