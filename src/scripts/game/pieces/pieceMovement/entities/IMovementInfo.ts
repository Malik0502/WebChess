import type { GameTile } from "../../../../board/entities/gameTile";

export interface IMovementInfo{
    pieceColor: string;
    possibleMoves: GameTile[];
    board: GameTile[][];
    pieceRow: number;
    pieceCol: number;
}