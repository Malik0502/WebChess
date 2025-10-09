import type { GameTile } from "../../../board/entities/gameTile";
import type { CastleHelper } from "../pieceMovement/castleHelper";
import type { SlidingMovement } from "../pieceMovement/slidingMovement";
import type { IPiece } from "./IPiece";

export interface IPieceFactory{
    createPiece(name: string, color: string, tile: GameTile, movement: SlidingMovement, castleHelper: CastleHelper): IPiece | undefined;
}