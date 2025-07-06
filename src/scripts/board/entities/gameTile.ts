export class GameTile{
    centerPoint: [x: number, y: number];
    width: number;
    height: number;
    color: string;
    isOccupied: boolean;
    coordinates: string;

    constructor(centerPoint: [x: number, y: number], width: number, height: number, color: string, isOccupied: boolean, coordinates: string){
        this.centerPoint = centerPoint;
        this.width = width;
        this.height = height;
        this.color = color;
        this.isOccupied = isOccupied;
        this.coordinates = coordinates;
    }
}