import type { IPiece } from "./IPiece";

export interface IPieceFactory{
    createPiece(name: string, color: string, coordinate: string, gameTileArrayPos: number): IPiece | undefined;
}