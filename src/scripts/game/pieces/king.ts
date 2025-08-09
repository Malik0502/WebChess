import type { GameTile } from "../../board/entities/gameTile";
import type { IPiece } from "./Interfaces/IPiece";

export class King implements IPiece{
    name: string;
    color: string;
    value: number;
    spritePath: string;
    startCoordinates: string;
    currentCoordinates: string;
    hasMoved: boolean;
    selected: boolean;
    currentTile: GameTile;
    possibleMoves: GameTile[];
    
    constructor(name: string, color: string, startCoordinates: string, currentTile: GameTile){
        this.name = name,
        this.color = color,
        this.value = 0,
        this.spritePath = this.color === "white" ? "src/assets/pw.svg" : "src/assets/pb.svg";
        this.startCoordinates = startCoordinates;
        this.currentCoordinates = startCoordinates;
        this.hasMoved = false;
        this.selected = false;
        this.currentTile = currentTile
        this.possibleMoves = [];
    }
    
    calcPossibleMoves(board: GameTile[][]){
        throw new Error("Method not implemented.");
    }

    markAsMoveOption(): void {
        throw new Error("Method not implemented.");
    }
}