import type { GameTile } from "../../../board/entities/gameTile";
import { BISHOP, KING, KNIGHT, PAWN, QUEEN, ROOK } from "../../../common/constants/pieceNames";
import type { IPiece } from "../interfaces/IPiece";
import type { IPieceFactory } from "../interfaces/IPieceFactory";
import { King } from "../king";
import { Knight } from "../knight";
import { Pawn } from "../pawn";
import { Rook } from "../rook";
import { Bishop } from "../bishop";
import { Queen } from "../queen";
import type { SlidingMovement } from "../pieceMovement/slidingMovement";
import type { CastleHelper } from "../pieceMovement/castleHelper";

export class PieceFactory implements IPieceFactory{
    
    createPiece(name: string, color: string, tile: GameTile, movement: SlidingMovement, castleHelper: CastleHelper): IPiece | undefined {
        if (name.includes(PAWN)) {
            return new Pawn(name, color, tile.coordinates, tile);
        }
        if (name.includes(BISHOP)) {
            return new Bishop(name, color, tile.coordinates, tile, movement);
        }
        if (name.includes(KNIGHT)) {
            return new Knight(name, color, tile.coordinates, tile);
        }
        if (name.includes(ROOK)) {
            return new Rook(name, color, tile.coordinates, tile, movement);
        }
        if (name.includes(QUEEN)) {
            return new Queen(name, color, tile.coordinates, tile, movement);
        }
        if (name.includes(KING)) {
            return new King(name, color, tile.coordinates, tile, castleHelper);
        }

        return undefined;
    }
}