import type { GameTile } from "../../../board/entities/gameTile";
import type { IPiece } from "./IPiece";

export interface IPieceFactory{
    createPiece(name: string, color: string, tile: GameTile): IPiece | undefined;
}