export interface Turn{
    turn: number;
    isWhiteCaptured: boolean | undefined;
    isBlackCaptured: boolean | undefined;
    whiteMove: [start: string, end: string] | undefined;
    blackMove: [start: string, end: string] | undefined;
    whiteAlgebraicNotation: string | undefined;
    blackAlgebraicNotation: string | undefined;
}