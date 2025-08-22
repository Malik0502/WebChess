import type { IPiece } from "../../game/pieces/interfaces/IPiece";

export class GameTile{
    centerPoint: [x: number, y: number];
    width: number;
    height: number;
    color: string;
    isOccupied: boolean;
    coordinates: string;
    isMoveOption: boolean;
    row: number;
    col: number;
    currentPiece: IPiece | undefined;


    constructor(centerPoint: [x: number, y: number], width: number, height: number, color: string, isOccupied: boolean, coordinates: string, row: number, col: number){
        this.centerPoint = centerPoint;
        this.width = width;
        this.height = height;
        this.color = color;
        this.isOccupied = isOccupied;
        this.coordinates = coordinates;
        this.isMoveOption = false;
        this.row = row;
        this.col = col;
    }
}