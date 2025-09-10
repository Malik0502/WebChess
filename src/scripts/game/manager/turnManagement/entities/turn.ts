export interface Turn{
    turn: number;
    whiteMove: [start: string, end: string] | undefined;
    blackMove: [start: string, end: string] | undefined;
    whiteAlgebraicNotation: string | undefined;
    blackAlgebraicNotation: string | undefined;
}