import type { IPiece } from "./Interfaces/IPiece";

export class FilePosVerifier{
    public isOnHFile(piece: IPiece){
        return piece.currentCoordinates.includes("h");
    }

    public isOnAFile(piece: IPiece){
        return piece.currentCoordinates.includes("a");
    }
}