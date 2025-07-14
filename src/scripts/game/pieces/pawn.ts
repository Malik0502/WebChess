import type { GameTile } from "../../board/entities/gameTile";
import type { IPiece } from "./interfaces/IPiece";

export class Pawn implements IPiece{
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
        this.value = 1,
        this.spritePath = this.color === "white" ? "src/assets/pw.svg" : "src/assets/pb.svg";
        this.startCoordinates = startCoordinates;
        this.currentCoordinates = startCoordinates;
        this.hasMoved = false;
        this.selected = false;
        this.currentTile = currentTile;
    }

    CalcPossibleMoves(board: GameTile[][]): string[] {
        let possibleMoves: string[] = [];

            if(this.color === "white"){
                this.CalcArrayPosWhite(board, possibleMoves)
            }
            else{
                this.CalcArrayPosBlack(board, possibleMoves);
            }
             
        return possibleMoves;
    }
    
    private CalcArrayPosBlack(board: GameTile[][], possibleMoves: string[]){
        
        const pieceCol: number = this.currentTile.col;
        const pieceRow: number = this.currentTile.row;


        const frontOfPawn: GameTile = board[pieceRow + 1][pieceCol];
        const frontOfPawnTwo: GameTile = board[pieceRow + 2][pieceCol];
        const diagonalLeftPawn: GameTile = board[pieceRow + 1][pieceCol - 1];
        const diagonalRightPawn: GameTile = board[pieceRow + 1][pieceCol + 1];
        
        console.log(frontOfPawn.coordinates, frontOfPawnTwo.coordinates, diagonalLeftPawn.coordinates, diagonalRightPawn.coordinates)
    }

    private CalcArrayPosWhite(board: GameTile[][], possibleMoves: string[]){

    }
    
    MovePiece(): [startPosition: string, endPosition: string] {
        throw new Error("Method not implemented.");
    }
}