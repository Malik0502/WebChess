import type { GameTile } from "../../board/entities/gameTile";
import { WHITE } from "../../common/constants/pieceColor";
import { FilePosVerifier } from "./filePosVerifier";
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
    possibleMoves: GameTile[];
    
    private filePosVerifier: FilePosVerifier; 
    
    constructor(name: string, color: string, startCoordinates: string, currentTile: GameTile){
        this.name = name,
        this.color = color,
        this.value = 1,
        this.spritePath = this.color === WHITE ? "src/assets/pw.svg" : "src/assets/pb.svg";
        this.startCoordinates = startCoordinates;
        this.currentCoordinates = startCoordinates;
        this.hasMoved = false;
        this.selected = false;
        this.currentTile = currentTile;
        this.possibleMoves = [];

        this.filePosVerifier = new FilePosVerifier;
    }

    calcPossibleMoves(board: GameTile[][]){

            if(this.color === WHITE){
                if(this.currentCoordinates.includes("8")){
                    this.convertPiece();
                    return;
                }
                this.possibleMoves = this.calcArrayPosWhite(board);
            }
            else{
                if(this.currentCoordinates.includes("1")){
                    this.convertPiece();
                    return;
                }
                this.possibleMoves = this.calcArrayPosBlack(board);
            }
             
        this.markAsMoveOption();
    }
    
    private calcArrayPosBlack(board: GameTile[][]): GameTile[]{        
        let possibleMoves: GameTile[] = [];
        
        const pieceCol: number = this.currentTile.col;
        const pieceRow: number = this.currentTile.row;

        const frontOfPawn: GameTile = board[pieceRow + 1][pieceCol];
        const frontOfPawnTwo: GameTile | undefined = !this.currentCoordinates.includes("2") ? board[pieceRow + 2][pieceCol] : undefined;
        
        // Not on "a" file and diagonal down left file has piece
        if(!this.filePosVerifier.isOnAFile(this) && board[pieceRow + 1][pieceCol - 1].isOccupied){
            // diagonal down left of pawn
            if(board[pieceRow + 1][pieceCol - 1].currentPiece!.color != this.color) possibleMoves.push(board[pieceRow + 1][pieceCol - 1]);
        }

        // Not on "h" file and diagonal down right file has piece
        if(!this.filePosVerifier.isOnHFile(this) && board[pieceRow + 1][pieceCol + 1].isOccupied){
            // diagonal down right of pawn
            if(board[pieceRow + 1][pieceCol + 1].currentPiece!.color != this.color) possibleMoves.push(board[pieceRow + 1][pieceCol + 1]);
        }

        // Tile in front of piece is not occupied
        if(!frontOfPawn.isOccupied) possibleMoves.push(frontOfPawn)

        if(!frontOfPawnTwo) return possibleMoves;

        // Tile in front and 2 in front of piece are not occupied + has not moved and is not on 2nd rank
        if(!frontOfPawn.isOccupied && !frontOfPawnTwo.isOccupied && !this.hasMoved && !this.currentCoordinates.includes("2")) possibleMoves.push(frontOfPawnTwo)

        return possibleMoves;
    }

    private calcArrayPosWhite(board: GameTile[][]): GameTile[]{
        let possibleMoves: GameTile[] = [];
        
        const pieceCol: number = this.currentTile.col;
        const pieceRow: number = this.currentTile.row;

        const frontOfPawn: GameTile = board[pieceRow - 1][pieceCol];
        const frontOfPawnTwo: GameTile | undefined = !this.currentCoordinates.includes("7") ? board[pieceRow - 2][pieceCol] : undefined;
        
        // Not on "a" file and diagonal up left file has piece
        if(!this.filePosVerifier.isOnAFile(this) && board[pieceRow - 1][pieceCol - 1].isOccupied){
            // diagonal up left of pawn
            if(board[pieceRow - 1][pieceCol - 1].currentPiece!.color != this.color) possibleMoves.push(board[pieceRow - 1][pieceCol - 1]); 
        }

        // Not on "h" file and diagonal up right file has piece
        if(!this.filePosVerifier.isOnHFile(this) && board[pieceRow - 1][pieceCol + 1].isOccupied){
            // diagonal up right of pawn
            if(board[pieceRow - 1][pieceCol + 1].currentPiece!.color != this.color) possibleMoves.push(board[pieceRow - 1][pieceCol + 1]);            
        }


        // Tile in front of piece is not occupied
        if(!frontOfPawn.isOccupied) possibleMoves.push(frontOfPawn)

        if(!frontOfPawnTwo) return possibleMoves;

        // Tile in front and 2 in front of piece are not occupied + has not moved and is not on 7th rank
        if(!frontOfPawn.isOccupied && !frontOfPawnTwo.isOccupied && !this.hasMoved && !this.currentCoordinates.includes("7")) possibleMoves.push(frontOfPawnTwo)

        return possibleMoves;
    }

    markAsMoveOption(): void {
        this.possibleMoves.forEach(tile => {
            tile.isMoveOption = true;
        });
    }

    private convertPiece(){
        console.log("Convert to other piece")
    }
}