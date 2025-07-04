export class gameTile{
    centerPoint: [x: number, y: number];
    width: number;
    height: number;
    color: string;
    isOccupied: boolean;

    constructor(centerPoint: [x: number, y: number], width: number, height: number, color: string, isOccupied: boolean){
        this.centerPoint = centerPoint;
        this.width = width;
        this.height = height;
        this.color = color;
        this.isOccupied = isOccupied;
    }
}