import type { IPiece } from "./interfaces/IPiece";

export class FilePosVerifier{
    isOnHFile(piece: IPiece){
        return piece.currentCoordinates.includes("h");
    }

    isOnAFile(piece: IPiece){
        return piece.currentCoordinates.includes("a");
    }
}