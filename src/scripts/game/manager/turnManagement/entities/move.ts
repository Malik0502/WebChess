import type { IPiece } from "../../../pieces/interfaces/IPiece";

export interface Move{
    start: string;
    end: string;
    piece: IPiece | undefined;
}