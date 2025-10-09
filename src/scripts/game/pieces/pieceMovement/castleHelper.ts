import type { GameTile } from "../../../board/entities/gameTile";
import { WHITE } from "../../../common/constants/pieceColor";
import { Rook } from "../rook";

export class CastleHelper{
    public canRookCastle(tileWithRook: GameTile, color: string): boolean{
        if(!tileWithRook.isOccupied) return false;
        if(!(tileWithRook.currentPiece instanceof Rook)) return false;
        if(tileWithRook.currentPiece.color != color) return false;
        if(tileWithRook.currentPiece!.hasMoved) return false;
    
        return true;
    }
    
    public isLineBetweenPiecesFree(tileWithRook: GameTile, board: GameTile[][], color: string, castleType: number): boolean{
        if(color == WHITE){
            // for (let col = board[7][4]; col < ; col += castleType) {
            //     const element = array[col];
                
            // }
        }
        
    
    }
    // is line between to pieces free from enemy control?
}