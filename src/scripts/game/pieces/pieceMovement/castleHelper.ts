import type { GameTile } from "../../../board/entities/gameTile";
import { WHITE } from "../../../common/constants/pieceColor";
import type { Move } from "../../manager/turnManagement/entities/move";
import type { IPiece } from "../interfaces/IPiece";
import { King } from "../king";
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

    public isCastlingMove(piece: IPiece, move: Move): boolean{
        if(!(piece instanceof King)) return false;
        if(piece.hasMoved) return false;

        if(piece.color === WHITE){
            if(move.start === "e1" && move.end === "c1" || move.end === "g1") return true;
        }

        return move.start === "e8" && move.end === "c8" || move.end === "g8";
    }

    public isShortCastling(move: Move){
        if(move.start === "e1" && move.end === "c1" || move.start === "e8" && move.end === "c8") return false;

        return move.start === "e1" && move.end === "g1" || move.start === "e8" && move.end === "g8";
    }
}