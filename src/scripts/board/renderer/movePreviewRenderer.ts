import type { Board } from "../board";
import type { GameTile } from "../entities/gameTile";
import type { PieceRenderer } from "./pieceRenderer";
import type { TileRenderer } from "./tileRenderer";

export class MovePreviewRenderer{

    private board: Board;
    private canvasContext: CanvasRenderingContext2D;
    private tileRenderer: TileRenderer;
    private pieceRenderer: PieceRenderer;

    constructor(board: Board, canvasContext: CanvasRenderingContext2D, tileRenderer: TileRenderer, pieceRenderer: PieceRenderer){
        this.board = board;
        this.canvasContext = canvasContext;
        this.tileRenderer = tileRenderer;
        this.pieceRenderer = pieceRenderer;
    }

    paintMovePreview(): void {
        for (const row of this.board.gameTiles) {
            for (const tile of row) {
                if (!tile.isMoveOption) continue;

                if (!tile.isOccupied) {
                    this.paintMovePreviewEmptyTile(tile);
                    continue
                }
                this.paintMovePreviewOccupiedTile(tile);
            }
        }
    }

    private paintMovePreviewEmptyTile(tile: GameTile): void {
        this.canvasContext.fillStyle = "rgba(60, 60, 60, 0.4)";
        this.canvasContext.strokeStyle = "rgba(60, 60, 60, 0.4)";
        this.canvasContext.beginPath();
        this.canvasContext.arc(tile.centerPoint[0], tile.centerPoint[1], tile.width / 6, 0, 2 * Math.PI);
        this.canvasContext.lineWidth = 1;
        this.canvasContext.fill();
        this.canvasContext.stroke();
    }

    private paintMovePreviewOccupiedTile(tile: GameTile): void {
        this.canvasContext.strokeStyle = "rgba(60, 60, 60, 0.4)";
        this.canvasContext.beginPath();
        this.canvasContext.arc(tile.centerPoint[0], tile.centerPoint[1], tile.width / 2.25, 0, 2 * Math.PI);
        this.canvasContext.lineWidth = 8;
        this.canvasContext.stroke();
    }

    repaintMoveOptionTilesNormal(): void {
        for (const row of this.board.gameTiles) {
            for (const tile of row) {
                if (!tile.isMoveOption) continue;

                if (!tile.isOccupied) {
                    this.tileRenderer.drawChessRectangle(tile.cornerPoint[0], tile.cornerPoint[1], tile.width, tile.height, tile.color);
                    continue;
                }
                this.pieceRenderer.drawPieceOnBoard(tile.currentPiece!, tile, tile.isOccupied);
            }
        }
    }
}