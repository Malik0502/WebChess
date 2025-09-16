import { Board } from "./board";
import { SpriteMap } from "../common/records/spriteMap";
import { StartPiecePosition } from "../common/records/startPiecePosition";
import { StartPositionPieceColor } from "../common/records/startPositionPieceColor";
import type { IPiece } from "../game/pieces/interfaces/IPiece";
import { GameTile } from "./entities/gameTile";

export class BoardRenderer {
    board: Board;
    canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private whiteTileColor: string;
    private darkTileColor: string;
    private gameTileWidth: number;
    private gameTileHeight: number;

    constructor(board: Board, canvas: HTMLCanvasElement, whiteTileColor: string, darkTileColor: string) {
        this.board = board;
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
        this.whiteTileColor = whiteTileColor;
        this.darkTileColor = darkTileColor;

        const [w, h] = [canvas.width, canvas.height];
        this.gameTileWidth = Math.round(w / 8);
        this.gameTileHeight = Math.round(h / 8);

        this.connectImageSrcToSpriteMap();
        this.drawChessBoard();
    }

    private drawChessBoard(): void {
        this.drawChessboardPattern();
        Promise.all(
            Object.values(SpriteMap).map(img => new Promise(resolve => img.onload = resolve))
        ).then(() => {
            this.drawStartPiecesOnChessBoard();
        });

        this.drawCoordinatesOnBoard();
    }

    private drawChessboardPattern(): void {
        let xPosRectangle: number = 0;
        let yPosRectangle: number = 0;
        let lastColor: string = this.darkTileColor;

        for (let y = 8; y >= 1; y--) {
            const rowTiles: GameTile[] = [];
            const rowIndex: number = 8 - y;

            for (let x = 1; x <= 8; x++) {
                const colIndex: number = x - 1;

                // change tile color
                if (lastColor === this.darkTileColor) {
                    this.ctx.fillStyle = this.whiteTileColor;
                    lastColor = this.whiteTileColor;
                } else {
                    this.ctx.fillStyle = this.darkTileColor;
                    lastColor = this.darkTileColor;
                }

                this.drawChessRectangle(xPosRectangle, yPosRectangle, this.gameTileWidth, this.gameTileHeight, this.ctx.fillStyle);

                const tile = this.board.createGameTile(
                    this.gameTileWidth,
                    this.gameTileHeight,
                    yPosRectangle,
                    xPosRectangle,
                    lastColor,
                    x,
                    this.board.convertNumCoordToChessCoord(x, y),
                    rowIndex,
                    colIndex
                );

                rowTiles.push(tile);
                xPosRectangle += Math.round(this.gameTileWidth);
            }

            this.board.gameTiles.push(rowTiles);

            // calculate rectangle start pos in new row
            yPosRectangle += Math.round(this.gameTileHeight);
            xPosRectangle = 0;

            // invert next rows start color
            lastColor = lastColor === this.darkTileColor ? this.whiteTileColor : this.darkTileColor;
        }
    }

    private drawChessRectangle(xCornerPoint: number, yCornerPoint: number, tileWidth: number, tileHeight: number, tileColor: string) {
        this.ctx.fillStyle = tileColor;
        this.ctx.fillRect(xCornerPoint, yCornerPoint, tileWidth, tileHeight);
    }

    private drawStartPiecesOnChessBoard(): void {
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
            this.ctx.fillStyle = tile.color;
            this.ctx.fillRect(tile.cornerPoint[0], tile.cornerPoint[1], tile.width, tile.height);
        }

        this.ctx.drawImage(
            SpriteMap[spriteMapName]!,
            tile.centerPoint[0] - tile.width / 2,
            tile.centerPoint[1] - tile.height / 1.83,
            tile.width,
            tile.height
        );
        tile.isOccupied = true;
        tile.currentPiece = piece;
    }

    removePieceFromTile(piece: IPiece): void {
        this.ctx.fillStyle = piece.currentTile.color;
        this.ctx.fillRect(
            piece.currentTile.cornerPoint[0],
            piece.currentTile.cornerPoint[1],
            this.gameTileWidth,
            this.gameTileHeight
        );
    }

    private drawCoordinatesOnBoard(): void {
        this.ctx.font = "24px serif";
        for (const row of this.board.gameTiles) {
            for (const tile of row) {
                this.drawCoordinateOnBoard(tile);
            }
        }
    }

    private drawCoordinateOnBoard(tile: GameTile): void {
        this.ctx.fillStyle = tile.color === this.darkTileColor ? this.whiteTileColor : this.darkTileColor;
        if (tile.coordinates.includes("a")) {
            this.ctx.fillText(tile.coordinates.charAt(1), tile.centerPoint[0] - tile.width / 2, tile.centerPoint[1] - tile.height / 4)
        }

        if (tile.coordinates.includes("1")) {
            this.ctx.fillText(tile.coordinates.charAt(0), tile.centerPoint[0] + tile.width / 2.66, tile.centerPoint[1] + tile.height / 2.5)
        }
    }

    repaintPieces(piece: IPiece, tile: GameTile): void {
        if (!piece.selected) {
            this.ctx.fillStyle = "rgba(246, 235, 114, 0.45)";
        } else {
            this.ctx.fillStyle = tile.color;
        }

        this.ctx.fillRect(tile.cornerPoint[0], tile.cornerPoint[1], this.gameTileWidth, this.gameTileHeight);
        this.drawCoordinateOnBoard(tile);
        this.drawPieceOnBoard(piece, tile, false)
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
        this.ctx.fillStyle = "rgba(60, 60, 60, 0.4)";
        this.ctx.strokeStyle = "rgba(60, 60, 60, 0.4)";
        this.ctx.beginPath();
        this.ctx.arc(tile.centerPoint[0], tile.centerPoint[1], tile.width / 6, 0, 2 * Math.PI);
        this.ctx.lineWidth = 1;
        this.ctx.fill();
        this.ctx.stroke();
    }

    private paintMovePreviewOccupiedTile(tile: GameTile): void {
        this.ctx.strokeStyle = "rgba(60, 60, 60, 0.4)";
        this.ctx.beginPath();
        this.ctx.arc(tile.centerPoint[0], tile.centerPoint[1], tile.width / 2.25, 0, 2 * Math.PI);
        this.ctx.lineWidth = 8;
        this.ctx.stroke();
    }

    repaintMoveOptionTilesNormal(): void {
        for (const row of this.board.gameTiles) {
            for (const tile of row) {
                if (!tile.isMoveOption) continue;

                if (!tile.isOccupied) {
                    this.drawChessRectangle(tile.cornerPoint[0], tile.cornerPoint[1], tile.width, tile.height, tile.color);
                    continue;
                }
                this.drawPieceOnBoard(tile.currentPiece!, tile, tile.isOccupied);
            }
        }
    }

    private connectImageSrcToSpriteMap() {
        SpriteMap["white-pawn"].src = "src/assets/pw.svg"
        SpriteMap["white-bishop"].src = "src/assets/bw.svg"
        SpriteMap["white-knight"].src = "src/assets/nw.svg"
        SpriteMap["white-rook"].src = "src/assets/rw.svg"
        SpriteMap["white-queen"].src = "src/assets/qw.svg"
        SpriteMap["white-king"].src = "src/assets/kw.svg"
        SpriteMap["black-pawn"].src = "src/assets/pb.svg"
        SpriteMap["black-bishop"].src = "src/assets/bb.svg"
        SpriteMap["black-knight"].src = "src/assets/nb.svg"
        SpriteMap["black-rook"].src = "src/assets/rb.svg"
        SpriteMap["black-queen"].src = "src/assets/qb.svg"
        SpriteMap["black-king"].src = "src/assets/kb.svg"
    }
}
