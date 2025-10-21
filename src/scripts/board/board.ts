import { StartPiecePosition } from "../common/records/startPiecePosition";
import { StartPositionPieceColor } from "../common/records/startPositionPieceColor";
import type { IPiece } from "../game/pieces/interfaces/IPiece";
import type { IPieceFactory } from "../game/pieces/interfaces/IPieceFactory";
import type { CastleHelper } from "../game/pieces/pieceMovement/castleHelper";
import type { SlidingMovement } from "../game/pieces/pieceMovement/slidingMovement";
import { GameTile } from "./entities/gameTile";

export class Board {
    gameTiles: GameTile[][];
    gamePieces: IPiece[];
    private pieceFactory: IPieceFactory;
    private movement: SlidingMovement;
    private castleHelper: CastleHelper;

    constructor(pieceFactory: IPieceFactory, movement: SlidingMovement, castleHelper: CastleHelper) {
        this.gameTiles = [];
        this.gamePieces = [];
        this.pieceFactory = pieceFactory;
        this.movement = movement;
        this.castleHelper = castleHelper;
        this.fillRecordWithPawns();
    }

    createGameTile(
        gameTileWidth: number,
        gameTileHeight: number,
        yPosRectangle: number,
        xPosRectangle: number,
        lastColor: string,
        x: number,
        coordinates: string,
        row: number,
        col: number
    ): GameTile {
        let gameTile: GameTile | undefined;
        if (x === 1) {
            gameTile = new GameTile(
                [gameTileWidth / 2, yPosRectangle + gameTileHeight / 2],
                gameTileWidth,
                gameTileHeight,
                lastColor,
                false,
                coordinates,
                row,
                col
            );
        } else {
            gameTile = new GameTile(
                [xPosRectangle + gameTileWidth / 2, yPosRectangle + gameTileHeight / 2],
                gameTileWidth,
                gameTileHeight,
                lastColor,
                false,
                coordinates,
                row,
                col
            );
        }

        return gameTile!;
    }

    createGamePiece(pieceName: string, pieceColor: string, tile: GameTile): IPiece {
        return this.pieceFactory.createPiece(pieceName, pieceColor, tile, this.movement, this.castleHelper)!;
    }

    convertNumCoordToChessCoord(xCoordinate: number, yCoordinate: number): string {
        const chessCoordinates: Map<number, string> = new Map([
            [1, "a"],
            [2, "b"],
            [3, "c"],
            [4, "d"],
            [5, "e"],
            [6, "f"],
            [7, "g"],
            [8, "h"],
        ]);

        return chessCoordinates.get(xCoordinate)! + yCoordinate;
    }

    fillRecordWithPawns(): void {
        for (let col of "abcdefgh") {
            StartPiecePosition[`${col}2`] = "pawn";
            StartPositionPieceColor[`${col}2`] = "white";
            StartPiecePosition[`${col}7`] = "pawn";
            StartPositionPieceColor[`${col}7`] = "black";
        }
    }
}
