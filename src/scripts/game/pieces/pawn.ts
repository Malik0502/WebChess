import type { GameTile } from "../../board/entities/gameTile";
import { FilePosVerifier } from "./filePosVerifier";
import type { IPiece } from "./Interfaces/IPiece";

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
    possibleMoves: GameTile[];
    
    private filePosVerifier: FilePosVerifier; 
    
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
        this.possibleMoves = [];

        this.filePosVerifier = new FilePosVerifier;
    }

    calcPossibleMoves(board: GameTile[][]){

            if(this.color === "white"){
                this.possibleMoves = this.calcArrayPosWhite(board);
            }
            else{
                this.possibleMoves = this.calcArrayPosBlack(board);
            }
             
        this.markAsMoveOption();
        console.log(this.possibleMoves);
    }
    
    private calcArrayPosBlack(board: GameTile[][]): GameTile[]{        
        let possibleMoves: GameTile[] = [];
        
        const pieceCol: number = this.currentTile.col;
        const pieceRow: number = this.currentTile.row;

        const frontOfPawn: GameTile = board[pieceRow + 1][pieceCol];
        const frontOfPawnTwo: GameTile = board[pieceRow + 2][pieceCol];
        
        // Not on "a" file and diagonal down left file has piece
        if(!this.filePosVerifier.isOnAFile(this) && board[pieceRow + 1][pieceCol - 1].isOccupied){
            // diagonal down left of pawn
            possibleMoves.push(board[pieceRow + 1][pieceCol - 1]);
        }

        // Not on "h" file and diagonal down right file has piece
        if(!this.filePosVerifier.isOnHFile(this) && board[pieceRow + 1][pieceCol + 1].isOccupied){
            // diagonal down right of pawn
            possibleMoves.push(board[pieceRow + 1][pieceCol + 1]);
        }

        if(!frontOfPawn.isOccupied) possibleMoves.push(frontOfPawn)

        if(!frontOfPawnTwo.isOccupied) possibleMoves.push(frontOfPawnTwo)

        return possibleMoves;
    }

    private calcArrayPosWhite(board: GameTile[][]): GameTile[]{
        let possibleMoves: GameTile[] = [];
        
        const pieceCol: number = this.currentTile.col;
        const pieceRow: number = this.currentTile.row;

        const frontOfPawn: GameTile = board[pieceRow - 1][pieceCol];
        const frontOfPawnTwo: GameTile = board[pieceRow - 2][pieceCol];
        
        // Not on "a" file and diagonal up left file has piece
        if(!this.filePosVerifier.isOnAFile(this) && board[pieceRow - 1][pieceCol - 1].isOccupied){
            // diagonal up left of pawn
            possibleMoves.push(board[pieceRow - 1][pieceCol - 1]);
        }

        // Not on "h" file and diagonal up right file has piece
        if(!this.filePosVerifier.isOnHFile(this) && board[pieceRow - 1][pieceCol + 1].isOccupied){
            // diagonal up right of pawn
            possibleMoves.push(board[pieceRow - 1][pieceCol + 1]);
        }

        if(!frontOfPawn.isOccupied) possibleMoves.push(frontOfPawn)

        if(!frontOfPawnTwo.isOccupied) possibleMoves.push(frontOfPawnTwo)

        return possibleMoves;
    }

    markAsMoveOption(): void {
        this.possibleMoves.forEach(tile => {
            tile.isMoveOption = true;
        });
    }
}