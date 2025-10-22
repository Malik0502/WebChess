import type { Move } from "./move";

export interface Turn{
    turn: number;
    isWhiteCaptured: boolean | undefined;
    isBlackCaptured: boolean | undefined;
    whiteMove: Move[] | undefined;
    blackMove: Move[] | undefined;
    whiteAlgebraicNotation: string | undefined;
    blackAlgebraicNotation: string | undefined;
}