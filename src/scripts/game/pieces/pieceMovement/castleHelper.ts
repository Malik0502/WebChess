import type { GameTile } from "../../../board/entities/gameTile";
import { WHITE } from "../../../common/constants/pieceColor";
import { Rook } from "../rook";

export class CastleHelper{
    public canRookCastle(tileWithRook: GameTile, color: string, board: GameTile[][], castleType: number): boolean{
        if(!tileWithRook.isOccupied) return false;
        if(!(tileWithRook.currentPiece instanceof Rook)) return false;
        if(tileWithRook.currentPiece.color != color) return false;
        if(tileWithRook.currentPiece!.hasMoved) return false;
        if(!this.isLineBetweenPiecesFree(board, color, castleType)) return false;
        return true;
    }
    
    private isLineBetweenPiecesFree(board: GameTile[][], color: string, castleType: number): boolean{
        const startingRow: number = color === WHITE ? 7 : 0;

            for (let col = 4; col > 0 && col < 7 ; col += castleType) {
                if(col === 4) continue
                const element = board[startingRow][col];
                const elementControllingPieces: number = color === WHITE ? element.control.blackControlling : element.control.whiteControlling;

                if(element.isOccupied || elementControllingPieces > 0){
                    return false;
                }
                continue;
            }
            return true;
    }
}