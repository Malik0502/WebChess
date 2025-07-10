import type { GameTile } from "../../board/entities/gameTile";
import type { IPiece } from "./interfaces/IPiece";

export class Rook implements IPiece{
    name: string;
    color: string;
    value: number;
    spritePath: string;
    startCoordinates: string;
    currentCoordinates: string;
    hasMoved: boolean;
    selected: boolean;
    currentTile: GameTile;
    
    constructor(name: string, color: string, startCoordinates: string, currentTile: GameTile){
        this.name = name,
        this.color = color,
        this.value = 5,
        this.spritePath = this.color === "white" ? "src/assets/pw.svg" : "src/assets/pb.svg";
        this.startCoordinates = startCoordinates;
        this.currentCoordinates = startCoordinates;
        this.hasMoved = false;
        this.selected = false;
        this.currentTile = currentTile;
    }
    
    CalcPossibleMoves(board: GameTile[][]): string[] {
        throw new Error("Method not implemented.");
    }
    
    MovePiece(): [startPosition: string, endPosition: string] {
        throw new Error("Method not implemented.");
    }
}