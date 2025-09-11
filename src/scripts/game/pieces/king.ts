import type { GameTile } from "../../board/entities/gameTile";
import { WHITE } from "../../common/constants/pieceColor";
import type { IPiece } from "./interfaces/IPiece";

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
        this.spritePath = this.color === WHITE ? "src/assets/pw.svg" : "src/assets/pb.svg";
        this.startCoordinates = startCoordinates;
        this.currentCoordinates = startCoordinates;
        this.hasMoved = false;
        this.selected = false;
        this.currentTile = currentTile
        this.possibleMoves = [];
    }
    
    calcPossibleMoves(board: GameTile[][]){
        this.possibleMoves = [];
        
        for (let row = this.currentTile.row - 1; row <= this.currentTile.row + 1; row++) {
            if(row < 0 || row >= 8) continue;
            for (let col = this.currentTile.col - 1; col <= this.currentTile.col + 1; col++) {
                const currentTile = board[row][col];
                
                if(col < 0 || col >= 8) continue;

                if(currentTile.isOccupied && currentTile.currentPiece!.color == this.color) continue;

                this.possibleMoves.push(board[row][col]);
            }
        }

        this.markAsMoveOption();
        console.log(this.possibleMoves)
    }

    markAsMoveOption(): void {
        this.possibleMoves.forEach(tile => {
            tile.isMoveOption = true;
        });
    }
}