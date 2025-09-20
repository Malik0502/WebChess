import type { IPiece } from "../../../pieces/interfaces/IPiece";

export class Control{

    controllingPieces: IPiece[];
    whiteControlling: number;
    blackControlling: number;

    constructor(controllingPieces: IPiece[], whiteControlling: number, blackControlling: number){
        this.controllingPieces = controllingPieces;
        this.whiteControlling = whiteControlling;
        this.blackControlling = blackControlling;
    }
}