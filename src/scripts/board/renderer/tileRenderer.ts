import { BlackTileColor, WhiteTileColor } from "../../common/constants/canvasColors";
import type { Board } from "../board";
import type { GameTile } from "../entities/gameTile";

export class TileRenderer{

    private canvasCtx: CanvasRenderingContext2D;
    private board: Board;

    constructor(canvasCtx: CanvasRenderingContext2D, board: Board){
        this.canvasCtx = canvasCtx;
        this.board = board;   
    }

    public drawChessboardPattern(darkTileColor: string, whiteTileColor: string, gameTileWidth: number, gameTileHeight: number): void {
        let xPosRectangle: number = 0;
        let yPosRectangle: number = 0;
        let lastColor: string = darkTileColor;
    
        for (let y = 8; y >= 1; y--) {
            const rowTiles: GameTile[] = [];
            const rowIndex: number = 8 - y;
    
            for (let x = 1; x <= 8; x++) {
                const colIndex: number = x - 1;
    
                // change tile color
                if (lastColor === darkTileColor) {
                    this.canvasCtx.fillStyle = whiteTileColor;
                    lastColor = whiteTileColor;
                } else {
                    this.canvasCtx.fillStyle = darkTileColor;
                    lastColor = darkTileColor;
                }
    
                this.drawChessRectangle(xPosRectangle, yPosRectangle, gameTileWidth, gameTileHeight, this.canvasCtx.fillStyle);
    
                const tile = this.board.createGameTile(
                    gameTileWidth,
                    gameTileHeight,
                    yPosRectangle,
                    xPosRectangle,
                    lastColor,
                    x,
                    this.board.convertNumCoordToChessCoord(x, y),
                    rowIndex,
                    colIndex
                    );
    
                    rowTiles.push(tile);
                    xPosRectangle += Math.round(gameTileWidth);
                }
    
            this.board.gameTiles.push(rowTiles);
    
            // calculate rectangle start pos in new row
            yPosRectangle += Math.round(gameTileHeight);
            xPosRectangle = 0;
    
            // invert next rows start color
            lastColor = lastColor === darkTileColor ? whiteTileColor : darkTileColor;
        }
    }

    drawChessRectangle(xCornerPoint: number, yCornerPoint: number, tileWidth: number, tileHeight: number, tileColor: string) {
        this.canvasCtx.fillStyle = tileColor;
        this.canvasCtx.fillRect(xCornerPoint, yCornerPoint, tileWidth, tileHeight);
    }

    drawCoordinatesOnBoard(): void {
        this.canvasCtx.font = "24px serif";
        for (const row of this.board.gameTiles) {
            for (const tile of row) {
                this.drawCoordinateOnBoard(tile);
            }
        }
    }

    drawCoordinateOnBoard(tile: GameTile): void {
        this.canvasCtx.fillStyle = tile.color === BlackTileColor ? WhiteTileColor : BlackTileColor;
        if (tile.coordinates.includes("a")) {
            this.canvasCtx.fillText(tile.coordinates.charAt(1), tile.centerPoint[0] - tile.width / 2, tile.centerPoint[1] - tile.height / 4)
        }

        if (tile.coordinates.includes("1")) {
            this.canvasCtx.fillText(tile.coordinates.charAt(0), tile.centerPoint[0] + tile.width / 2.66, tile.centerPoint[1] + tile.height / 2.5)
        }
    }
}