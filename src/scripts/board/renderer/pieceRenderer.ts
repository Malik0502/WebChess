import { SpriteMap } from "../../common/records/spriteMap";
import { StartPiecePosition } from "../../common/records/startPiecePosition";
import { StartPositionPieceColor } from "../../common/records/startPositionPieceColor";
import type { IPiece } from "../../game/pieces/interfaces/IPiece";
import type { Board } from "../board";
import type { GameTile } from "../entities/gameTile";
import type { TileRenderer } from "./tileRenderer";

export class PieceRenderer{

    private board: Board;
    private canvasContext: CanvasRenderingContext2D;
    private tileRenderer: TileRenderer;

    constructor(canvasContext: CanvasRenderingContext2D, board: Board, tileRenderer: TileRenderer){
        this.canvasContext = canvasContext;
        this.board = board;
        this.tileRenderer = tileRenderer;
    }

    drawStartPiecesOnChessBoard(): void {
        for (let row = 0; row < this.board.gameTiles.length; row++) {
            for (let col = 0; col < this.board.gameTiles[row].length; col++) {
                const tile = this.board.gameTiles[row][col];
                const pieceName = StartPiecePosition[tile.coordinates];
                const pieceColor = StartPositionPieceColor[tile.coordinates]
                if (pieceName) {
                    const piece: IPiece = this.board.createGamePiece(pieceName, pieceColor, tile);
                    this.drawPieceOnBoard(piece, tile, false);
                    this.board.gamePieces.push(piece);
                }
            }
        }
    }

    drawPieceOnBoard(piece: IPiece, tile: GameTile, shouldSquareRepaint: boolean): void {
        const spriteMapName: string = `${piece.color}-${piece.name}`;
    
        if (shouldSquareRepaint) {
            this.canvasContext.fillStyle = tile.color;
            this.canvasContext.fillRect(tile.cornerPoint[0], tile.cornerPoint[1], tile.width, tile.height);
        }
    
        this.canvasContext.drawImage(
            SpriteMap[spriteMapName]!,
            tile.centerPoint[0] - tile.width / 2,
            tile.centerPoint[1] - tile.height / 1.83,
            tile.width,
            tile.height
        );
        tile.isOccupied = true;
        tile.currentPiece = piece;
    }

    repaintPieces(piece: IPiece, tile: GameTile): void {
        if (!piece.selected) {
            this.canvasContext.fillStyle = "rgba(246, 235, 114, 0.45)";
        } else {
            this.canvasContext.fillStyle = tile.color;
        }

        this.canvasContext.fillRect(tile.cornerPoint[0], tile.cornerPoint[1], tile.width, tile.height);
        this.tileRenderer.drawCoordinateOnBoard(tile);
        this.drawPieceOnBoard(piece, tile, false)
    }
}