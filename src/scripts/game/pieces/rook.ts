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
    possibleMoves: GameTile[];
    
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
        this.possibleMoves = [];
    }
    
    calcPossibleMoves(board: GameTile[][]){
        this.possibleMoves = [];
        var rookRow: number = this.currentTile.row;
        var rookCol: number = this.currentTile.col;

        this.CalcMovesNorth(board, rookRow, rookCol);
        this.CalcMovesSouth(board, rookRow, rookCol);
        this.CalcMovesEast(board, rookRow, rookCol);
        this.CalcMovesWest(board, rookRow, rookCol);
        
        this.markAsMoveOption();
        console.log(this.possibleMoves);
    }

    private CalcMovesNorth(board: GameTile[][], rookRow: number, rookCol: number){
        for (let index = rookRow; index >= 0; index--) {
            if(index == rookRow) continue;

            const element: GameTile = board[index][rookCol];

            if(element.currentPiece && element.currentPiece.color == this.color) break;

            if(element.isOccupied && element.currentPiece!.color != this.color){
                this.possibleMoves.push(element);
                break;
            }

            if(!element.isOccupied) this.possibleMoves.push(element);
        }
    }

    private CalcMovesSouth(board: GameTile[][], rookRow: number, rookCol: number){

    }

    private CalcMovesEast(board: GameTile[][], rookRow: number, rookCol: number){

    }

    private CalcMovesWest(board: GameTile[][], rookRow: number, rookCol: number){

    }

    public markAsMoveOption(): void {
        this.possibleMoves.forEach(tile => {
            tile.isMoveOption = true;
        });
    }
}