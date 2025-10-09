import type { GameTile } from "../../board/entities/gameTile";
import { WHITE } from "../../common/constants/pieceColor";
import type { IPiece } from "./interfaces/IPiece";
import type { CastleHelper } from "./pieceMovement/castleHelper";
import { Rook } from "./rook";


// short castle: (king clicking on g1/8)
// king lands on g1/8 and rook on f1/8
// long castle: (king clicking on c1/8)
// king lands on c1/8 and rook on d1/8

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
    controlledTiles: GameTile[];

    private castleHelper: CastleHelper;

    constructor(name: string, color: string, startCoordinates: string, currentTile: GameTile, castleHelper: CastleHelper){
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
        this.controlledTiles = [];

        this.castleHelper = castleHelper; 
    }
    
    public calcPossibleMoves(board: GameTile[][], isAttack: boolean): GameTile[]{
        this.possibleMoves = [];

        for (let row = this.currentTile.row - 1; row <= this.currentTile.row + 1; row++) {
            if(row < 0 || row >= 8) continue;
            for (let col = this.currentTile.col - 1; col <= this.currentTile.col + 1; col++) {
                const currentTile = board[row][col];
                
                if(col < 0 || col >= 8) continue;

                if(currentTile.isOccupied && currentTile.currentPiece!.color == this.color && isAttack) continue;
                
                if(!isAttack && currentTile.coordinates == this.currentCoordinates) continue;
                
                const quantityControllingPieces: number = this.color == WHITE ? currentTile.control.blackControlling : currentTile.control.whiteControlling;

                this.calcCastleMoves(isAttack, board);
                
                if(quantityControllingPieces > 0) continue;

                this.possibleMoves.push(board[row][col]);
            }
        }

        this.markAsMoveOption();

        return this.possibleMoves;
    }
    
    public markAsMoveOption(): void {
        this.possibleMoves.forEach(tile => {
            tile.isMoveOption = true;
        });
    }

    

    calcCastleMoves(isAttack: boolean, board: GameTile[][]){
        if(!isAttack) return;
        if(this.hasMoved) return;
        
        if(this.color == WHITE){
            let rookTile: GameTile = board[7][0];
            if(this.castleHelper.canRookCastle(rookTile, this.color)) this.possibleMoves.push(board[7][2]);
                
            rookTile = board[7][7]
            if(this.castleHelper.canRookCastle(rookTile, this.color)) this.possibleMoves.push(board[7][6]);
                
            return;   
        }

        let rookTile: GameTile = board[0][7];
        if(this.castleHelper.canRookCastle(rookTile, this.color)) this.possibleMoves.push(board[0][6]);
            
        rookTile = board[0][0]
        if(this.castleHelper.canRookCastle(rookTile, this.color)) this.possibleMoves.push(board[0][2]);
        
    }
}