import { Board } from "../board";
import { SpriteMap } from "../../common/records/spriteMap";
import type { SpriteRenderer } from "./spriteRenderer";
import type { TileRenderer } from "./tileRenderer";
import type { PieceRenderer } from "./pieceRenderer";

export class BoardRenderer {
    board: Board;
    canvas: HTMLCanvasElement;
    private spriteRenderer: SpriteRenderer;
    private tileRenderer: TileRenderer;
    private pieceRenderer: PieceRenderer;

    private whiteTileColor: string;
    private darkTileColor: string;
    private gameTileWidth: number;
    private gameTileHeight: number;

    constructor(board: Board, canvas: HTMLCanvasElement, spriteRenderer: SpriteRenderer, tileRenderer: TileRenderer, pieceRenderer: PieceRenderer, whiteTileColor: string, darkTileColor: string) {
        this.board = board;
        this.canvas = canvas;
        this.spriteRenderer = spriteRenderer;
        this.tileRenderer = tileRenderer;
        this.pieceRenderer = pieceRenderer;
        
        this.whiteTileColor = whiteTileColor;
        this.darkTileColor = darkTileColor;

        const [w, h] = [canvas.width, canvas.height];
        this.gameTileWidth = Math.round(w / 8);
        this.gameTileHeight = Math.round(h / 8);

        this.spriteRenderer.connectImageSrcToSpriteMap();
    }

    drawChessBoard(): Promise<void> {
        this.tileRenderer.drawChessboardPattern(this.darkTileColor, this.whiteTileColor, this.gameTileWidth, this.gameTileHeight);

        return Promise.all(
            Object.values(SpriteMap).map(img => new Promise(resolve => img.onload = resolve))
        ).then(() => {
            this.pieceRenderer.drawStartPiecesOnChessBoard();
        }).then(() => {
            this.tileRenderer.drawCoordinatesOnBoard();
        });
    } 
}
