import type { IPiece } from "../game/pieces/interfaces/IPiece";
import type { IPieceFactory } from "../game/pieces/interfaces/IPieceFactory";
import { GameTile } from "./entities/gameTile";

export class Board{
    canvas: HTMLCanvasElement;
    canvasCtx: CanvasRenderingContext2D | null;
    whiteTileColor: string;
    darkTileColor: string;
    gameTiles: GameTile[][];
    gamePieces: IPiece[];
    gameTileWidth: number;
    gameTileHeight: number;


    spriteMap: Record<string, HTMLImageElement> = {
        "white-pawn": new Image(),
        "white-bishop": new Image(),
        "white-knight": new Image(),
        "white-rook": new Image(),
        "white-queen": new Image(),
        "white-king": new Image(),
        "black-pawn": new Image(),
        "black-bishop": new Image(),
        "black-knight": new Image(),
        "black-rook": new Image(),
        "black-queen": new Image(),
        "black-king": new Image(),
    }

    private piecePositions: Record<string, string> = {
        "e1": "white-king",
        "e8": "black-king",
        "d1": "white-queen",
        "d8": "black-queen",

        "c1": "white-bishop",
        "f1": "white-bishop",
        "c8": "black-bishop",
        "f8": "black-bishop",

        "b1": "white-knight",
        "g1": "white-knight",
        "b8": "black-knight",
        "g8": "black-knight",

        "a1": "white-rook",
        "h1": "white-rook",
        "a8": "black-rook",
        "h8": "black-rook",
    }

    private pieceFactory: IPieceFactory;

    constructor(canvas: HTMLCanvasElement, whiteTileColor: string, darkTileColor: string, pieceFactory: IPieceFactory){
        this.canvas = canvas;
        this.canvasCtx = canvas.getContext("2d");
        const canvasSize = this.getCanvasSize(); 
        this.whiteTileColor = whiteTileColor;
        this.darkTileColor = darkTileColor;
        this.gameTiles = [];
        this.gamePieces = [];
        this.connectImageSrcToSpriteMap();
        this.pieceFactory = pieceFactory;
        this.fillRecordWithPawns();
        
        this.gameTileWidth = Math.round(canvasSize[0] / 8)
        this.gameTileHeight = Math.round(canvasSize[1] / 8) 

        this.drawChessBoard();
    }

    private drawChessBoard(): void{
        this.drawChessboardPattern();
        Promise.all(
        Object.values(this.spriteMap).map(img => new Promise(resolve => img.onload = resolve))
        ).then(() => {
            this.drawStartPiecesOnChessBoard();
        });
    
        this.drawCoordinatesOnBoard();
        console.log(this.gamePieces)
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
                    this.canvasCtx!.fillStyle = this.whiteTileColor;
                    lastColor = this.whiteTileColor;
                } else {
                    this.canvasCtx!.fillStyle = this.darkTileColor;
                    lastColor = this.darkTileColor;
                }

                this.canvasCtx?.fillRect(
                    xPosRectangle,
                    yPosRectangle,
                    this.gameTileWidth,
                    this.gameTileHeight
                );

                const tile = this.createGameTile(
                    this.gameTileWidth, 
                    this.gameTileHeight, 
                    yPosRectangle, 
                    xPosRectangle, 
                    lastColor, 
                    x, 
                    this.convertNumCoordToChessCoord(x, y),
                    rowIndex,
                    colIndex
                );

                rowTiles.push(tile);
                xPosRectangle += Math.round(this.gameTileWidth);
            }

            this.gameTiles.push(rowTiles);
        
            // calculate rectangle start pos in new row
            yPosRectangle += Math.round(this.gameTileHeight);
            xPosRectangle = 0;

            // invert next rows start color
            lastColor = lastColor === this.darkTileColor ? this.whiteTileColor : this.darkTileColor;
        }

        console.log(this.gameTiles);
    }

    private drawStartPiecesOnChessBoard(): void {
        for (let row = 0; row < this.gameTiles.length; row++) {
            for (let col = 0; col < this.gameTiles[row].length; col++) {

                const tile = this.gameTiles[row][col];
                const pieceName = this.piecePositions[tile.coordinates];
                if (pieceName) {
                    const piece: IPiece = this.createGamePiece(pieceName, tile);
                    this.drawPieceOnBoard(piece, tile);
                    this.gamePieces.push(piece);
                }
            }
        }
    }

    private drawPieceOnBoard(piece: IPiece, tile: GameTile): void{
        this.canvasCtx?.drawImage(
            this.spriteMap[piece.name],
            tile.centerPoint[0] - tile.width / 2,
            tile.centerPoint[1] - tile.height / 1.83,
            tile.width,
            tile.height
        );
        tile.isOccupied = true;
        tile.currentPiece = piece;
    }

    private drawCoordinatesOnBoard(): void {
        this.canvasCtx!.font = "24px serif";
        for (const row of this.gameTiles) {
            for (const tile of row) {
                this.drawCoordinateOnBoard(tile);
            }
        }
    }

    private drawCoordinateOnBoard(tile: GameTile): void{
        this.canvasCtx!.fillStyle = tile.color === this.darkTileColor ? this.whiteTileColor : this.darkTileColor;
        if(tile.coordinates.includes("a")){
            this.canvasCtx?.fillText(tile.coordinates.charAt(1), tile.centerPoint[0] - tile.width / 2, tile.centerPoint[1] - tile.height / 4)
        }

        if(tile.coordinates.includes("1")){
            this.canvasCtx?.fillText(tile.coordinates.charAt(0), tile.centerPoint[0] + tile.width / 2.66, tile.centerPoint[1] + tile.height / 2.5)
        }
    }

    getCanvasSize(): [x: number, y: number]{
        return [this.canvas.width, this.canvas.height]
    }
    
    private createGameTile(gameTileWidth: number, gameTileHeight: number ,yPosRectangle: number, xPosRectangle: number, lastColor: string, x: number, coordinates: string, row: number, col: number) : GameTile{
        let gameTile: GameTile | undefined;
        if(x === 1){
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
        }
        else{
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

    private createGamePiece(pieceName: string, tile: GameTile): IPiece {
        const splitName = pieceName.split("-");
        const pieceColor = splitName[0];

        return this.pieceFactory.createPiece(pieceName, pieceColor, tile)!;
    }
 
    private convertNumCoordToChessCoord(xCoordinate: number, yCoordinate: number): string{
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

       return  chessCoordinates.get(xCoordinate)! + yCoordinate;
    }

    private connectImageSrcToSpriteMap(){
        this.spriteMap["white-pawn"].src = "src/assets/pw.svg"
        this.spriteMap["white-bishop"].src = "src/assets/bw.svg"
        this.spriteMap["white-knight"].src = "src/assets/nw.svg"
        this.spriteMap["white-rook"].src = "src/assets/rw.svg"
        this.spriteMap["white-queen"].src = "src/assets/qw.svg"
        this.spriteMap["white-king"].src = "src/assets/kw.svg"
        this.spriteMap["black-pawn"].src = "src/assets/pb.svg"
        this.spriteMap["black-bishop"].src = "src/assets/bb.svg" 
        this.spriteMap["black-knight"].src = "src/assets/nb.svg"
        this.spriteMap["black-rook"].src = "src/assets/rb.svg"
        this.spriteMap["black-queen"].src = "src/assets/qb.svg"
        this.spriteMap["black-king"].src = "src/assets/kb.svg"
    }

    repaintPieces(piece: IPiece, tile: GameTile): void{
        if(!piece.selected){
            this.canvasCtx!.fillStyle = "rgba(246, 235, 114, 0.45)";
        }
        else{
            this.canvasCtx!.fillStyle = tile.color;
        }
        
        this.canvasCtx?.fillRect(tile.centerPoint[0] - this.gameTileWidth / 2, tile.centerPoint[1] - this.gameTileHeight / 2, this.gameTileWidth, this.gameTileHeight);
        this.drawCoordinateOnBoard(tile);
        this.drawPieceOnBoard(piece, tile)
    }

    private fillRecordWithPawns(){
        for (let col of "abcdefgh") {
            this.piecePositions[`${col}2`] = "white-pawn";
            this.piecePositions[`${col}7`] = "black-pawn";
        }
    }
}