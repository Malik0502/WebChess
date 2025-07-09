import type { GameTile } from "../../../board/entities/gameTile";

export interface IPiece{
    name: string;
    color: string;
    value: number;
    spritePath: string;
    startCoordinates: string;
    currentCoordinates: string;
    currentArrayPos: number;
    hasMoved: boolean;
    selected: boolean;

    CalcPossibleMoves(board: GameTile[]): string[];

    MovePiece(): [startPosition: string, endPosition: string];
}