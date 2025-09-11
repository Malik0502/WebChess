import { PiecePosition } from "../common/records/piecePosition";
import { SpriteMap } from "../common/records/spriteMap";
import type { IPiece } from "../game/pieces/interfaces/IPiece";
import type { IPieceFactory } from "../game/pieces/interfaces/IPieceFactory";
import type { SlidingMovement } from "../game/pieces/pieceMovement/slidingMovement";
import { GameTile } from "./entities/gameTile";

export class Board{
    canvas: HTMLCanvasElement;
    canvasCtx: CanvasRenderingContext2D | null;
    whiteTileColor: string;
    darkTileColor: string;
    // [row][col]
    gameTiles: GameTile[][];
    gamePieces: IPiece[];
    gameTileWidth: number;
    gameTileHeight: number;

    private pieceFactory: IPieceFactory;
    private movement: SlidingMovement;

    constructor(canvas: HTMLCanvasElement, whiteTileColor: string, darkTileColor: string, pieceFactory: IPieceFactory, movement: SlidingMovement){
        this.canvas = canvas;
        this.canvasCtx = canvas.getContext("2d");
        const canvasSize = this.getCanvasSize(); 
        this.whiteTileColor = whiteTileColor;
        this.darkTileColor = darkTileColor;
        this.gameTiles = [];
        this.gamePieces = [];
        this.connectImageSrcToSpriteMap();
        this.pieceFactory = pieceFactory;
        this.movement = movement;
        this.fillRecordWithPawns();
        
        this.gameTileWidth = Math.round(canvasSize[0] / 8)
        this.gameTileHeight = Math.round(canvasSize[1] / 8) 

        this.drawChessBoard();
    }

    private drawChessBoard(): void{
        this.drawChessboardPattern();
        Promise.all(
        Object.values(SpriteMap).map(img => new Promise(resolve => img.onload = resolve))
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
                const pieceName = PiecePosition[tile.coordinates];
                if (pieceName) {
                    const piece: IPiece = this.createGamePiece(pieceName, tile);
                    this.drawPieceOnBoard(piece, tile, false);
                    this.gamePieces.push(piece);
                }
            }
        }
    }

    public drawPieceOnBoard(piece: IPiece, tile: GameTile, shouldSquareRepaint: boolean): void{
        if(shouldSquareRepaint){
            this.canvasCtx!.fillStyle = tile.color;
            this.canvasCtx!.fillRect(tile.cornerPoint[0], tile.cornerPoint[1], tile.width, tile.height);
        }
        
        this.canvasCtx?.drawImage(
            SpriteMap[piece.name],
            tile.centerPoint[0] - tile.width / 2,
            tile.centerPoint[1] - tile.height / 1.83,
            tile.width,
            tile.height
        );
        tile.isOccupied = true;
        tile.currentPiece = piece;
    }

    public removePieceFromTile(piece: IPiece): void{
        this.canvasCtx!.fillStyle = piece.currentTile.color;
        this.canvasCtx?.fillRect(
            piece.currentTile.cornerPoint[0],
            piece.currentTile.cornerPoint[1],
            this.gameTileWidth,
            this.gameTileHeight
        );

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

        return this.pieceFactory.createPiece(pieceName, pieceColor, tile, this.movement)!;
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

    repaintPieces(piece: IPiece, tile: GameTile): void{
        if(!piece.selected){
            this.canvasCtx!.fillStyle = "rgba(246, 235, 114, 0.45)";
        }
        else{
            this.canvasCtx!.fillStyle = tile.color;
        }
        
        this.canvasCtx?.fillRect(tile.cornerPoint[0], tile.cornerPoint[1], this.gameTileWidth, this.gameTileHeight);
        this.drawCoordinateOnBoard(tile);
        this.drawPieceOnBoard(piece, tile, false)
    }

    private fillRecordWithPawns(){
        for (let col of "abcdefgh") {
            PiecePosition[`${col}2`] = "white-pawn";
            PiecePosition[`${col}7`] = "black-pawn";
        }
    }
}