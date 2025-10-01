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
    controlledTiles: GameTile[];

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
        this.controlledTiles = [];

        this.filePosVerifier = new FilePosVerifier;
    }

    calcPossibleMoves(board: GameTile[][]): GameTile[]{

            if(this.color === WHITE){
                this.possibleMoves = this.calcArrayPosWhite(board);
            }
            else{
                this.possibleMoves = this.calcArrayPosBlack(board);
            }
             
        this.markAsMoveOption();

        return this.possibleMoves;
    }

    calcVerticalMoves(board: GameTile[][], pieceRow: number, pieceCol: number, color: string){
        if(color == WHITE){
            return this.calcWhiteControlledTiles(board, pieceRow, pieceCol);
        }
        return this.calcBlackControlledTiles(board, pieceRow, pieceCol);
    }
    
    private calcArrayPosBlack(board: GameTile[][]): GameTile[]{        
        const possibleMoves: GameTile[] = [];
        
        const pieceCol: number = this.currentTile.col;
        const pieceRow: number = this.currentTile.row;

        const frontOfPawn: GameTile = board[pieceRow + 1][pieceCol];
        const frontOfPawnTwo: GameTile | undefined = !this.currentCoordinates.includes("2") ? board[pieceRow + 2][pieceCol] : undefined;
        
        possibleMoves.push(...this.calcBlackAttackMoves(board, pieceRow, pieceCol));

        // Tile in front of piece is not occupied
        if(!frontOfPawn.isOccupied) possibleMoves.push(frontOfPawn)

        if(!frontOfPawnTwo) return possibleMoves;

        // Tile in front and 2 in front of piece are not occupied + has not moved and is not on 2nd rank
        if(!frontOfPawn.isOccupied && !frontOfPawnTwo.isOccupied && !this.hasMoved && !this.currentCoordinates.includes("2")) possibleMoves.push(frontOfPawnTwo)

        return possibleMoves;
    }

    private calcBlackAttackMoves(board: GameTile[][], pieceRow: number, pieceCol: number): GameTile[] {
        const moves: GameTile[] = [];

        if (!this.filePosVerifier.isOnAFile(this) && board[pieceRow + 1][pieceCol - 1].isOccupied && board[pieceRow + 1][pieceCol - 1].currentPiece!.color !== this.color){
            moves.push(board[pieceRow + 1][pieceCol - 1]);
        }

        if (!this.filePosVerifier.isOnHFile(this) && board[pieceRow + 1][pieceCol + 1].isOccupied && board[pieceRow + 1][pieceCol + 1].currentPiece!.color !== this.color){
            moves.push(board[pieceRow + 1][pieceCol + 1]);
        }
        return moves;
    }

    private calcBlackControlledTiles(board: GameTile[][], pieceRow: number, pieceCol: number): GameTile[] {
        const controlled: GameTile[] = [];

        if (!this.filePosVerifier.isOnAFile(this)){
            controlled.push(board[pieceRow + 1][pieceCol - 1]);
        }

        if (!this.filePosVerifier.isOnHFile(this)){
            controlled.push(board[pieceRow + 1][pieceCol + 1]);
        }
        return controlled;
    }

    private calcArrayPosWhite(board: GameTile[][]): GameTile[]{
        const possibleMoves: GameTile[] = [];
        
        const pieceCol: number = this.currentTile.col;
        const pieceRow: number = this.currentTile.row;

        const frontOfPawn: GameTile = board[pieceRow - 1][pieceCol];
        const frontOfPawnTwo: GameTile | undefined = !this.currentCoordinates.includes("7") ? board[pieceRow - 2][pieceCol] : undefined;
        
        possibleMoves.push(...this.calcWhiteAttackMoves(board, pieceRow, pieceCol));

        // Tile in front of piece is not occupied
        if(!frontOfPawn.isOccupied) possibleMoves.push(frontOfPawn)

        if(!frontOfPawnTwo) return possibleMoves;

        // Tile in front and 2 in front of piece are not occupied + has not moved and is not on 7th rank
        if(!frontOfPawn.isOccupied && !frontOfPawnTwo.isOccupied && !this.hasMoved && !this.currentCoordinates.includes("7")) possibleMoves.push(frontOfPawnTwo)

        return possibleMoves;
    }

    private calcWhiteAttackMoves(board: GameTile[][], pieceRow: number, pieceCol: number): GameTile[] {
        const moves: GameTile[] = [];

        if (!this.filePosVerifier.isOnAFile(this) && board[pieceRow - 1][pieceCol - 1].isOccupied && board[pieceRow - 1][pieceCol - 1].currentPiece!.color !== this.color){
            moves.push(board[pieceRow - 1][pieceCol - 1]);
        }

        if (!this.filePosVerifier.isOnHFile(this) && board[pieceRow - 1][pieceCol + 1].isOccupied && board[pieceRow - 1][pieceCol + 1].currentPiece!.color !== this.color){
            moves.push(board[pieceRow - 1][pieceCol + 1]);
        }

        return moves;
    }

    private calcWhiteControlledTiles(board: GameTile[][], pieceRow: number, pieceCol: number): GameTile[] {
        const controlled: GameTile[] = [];

        if (!this.filePosVerifier.isOnAFile(this)){
            controlled.push(board[pieceRow - 1][pieceCol - 1]);
        }

        if (!this.filePosVerifier.isOnHFile(this)){
            controlled.push(board[pieceRow - 1][pieceCol + 1]);
        }

        return controlled;
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