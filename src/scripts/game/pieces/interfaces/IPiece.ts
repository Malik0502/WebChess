import type { GameTile } from "../../../board/entities/gameTile";

export interface IPiece {
    name: string;
    color: string;
    value: number;
    spritePath: string;
    startCoordinates: string;
    currentCoordinates: string;
    currentTile: GameTile;
    hasMoved: boolean;
    selected: boolean;
    possibleMoves: GameTile[];
    controlledTiles: GameTile[];

    calcPossibleMoves(board: GameTile[][], isAttack: boolean): GameTile[];
    markAsMoveOption(): void;
}
