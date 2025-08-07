import type { IPiece } from "./interfaces/IPiece";

export class FilePosVerifier{
    public IsOnHFile(piece: IPiece){
        return piece.currentCoordinates.includes("h");
    }

    public IsOnAFile(piece: IPiece){
        return piece.currentCoordinates.includes("a");
    }
}