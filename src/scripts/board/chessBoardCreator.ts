import type { IPiece } from "../game/pieces/interfaces/IPiece";
import type { IPieceFactory } from "../game/pieces/interfaces/IPieceFactory";
import { PieceFactory } from "../game/pieces/pieceFactory";
import { GameTile } from "./entities/gameTile";

export class GameBoardCreator{
    canvas: HTMLCanvasElement;
    canvasCtx: CanvasRenderingContext2D | null;
    whiteTileColor: string;
    darkTileColor: string;
    gameTiles: GameTile[];
    gamePieces: IPiece[];


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
        this.whiteTileColor = whiteTileColor;
        this.darkTileColor = darkTileColor;
        this.gameTiles = [];
        this.gamePieces = [];
        this.connectImageSrcToSpriteMap();
        this.pieceFactory = pieceFactory;
    }

    drawChessBoard(): void{
        const canvasSize: [x: number, y: number] = this.getCanvasSize();
        const gameTileWidth: number = Math.round(canvasSize[0] / 8);
        const gameTileHeight: number = Math.round(canvasSize[1] / 8);

        let xPosRectangle: number = 0;
        let yPosRectangle: number = 0;
        let lastColor: string = this.darkTileColor;

        for(let y = 8; y >= 1; y--){

            for (let x = 1; x <= 8; x++) {

                // Determines the next tile color
                if(lastColor === this.darkTileColor) {
                    this.canvasCtx!.fillStyle = this.whiteTileColor;
                    lastColor = this.whiteTileColor;
                } else {
                    this.canvasCtx!.fillStyle = this.darkTileColor;
                    lastColor = this.darkTileColor;
                }
        
                this.canvasCtx?.fillRect(xPosRectangle, yPosRectangle, gameTileWidth, gameTileHeight);

                this.addToGameTilesArray(gameTileWidth, gameTileHeight, yPosRectangle, xPosRectangle, lastColor, x, this.convertNumCoordToChessCoord(x, y));
            
                // Adds width of gameTile to xPos to calc/draw next rectangle
                xPosRectangle += Math.round(gameTileWidth);
            }

            // Adds height of gameTile to yPos to calc/draw next row
            yPosRectangle += Math.round(gameTileHeight);
            xPosRectangle = 0;
            lastColor = lastColor === this.darkTileColor ? this.whiteTileColor : this.darkTileColor;
        }

        console.log(this.gameTiles)
    }

    drawPiecesOnChessBoard(): void{
        

        this.gameTiles.forEach(tile => {

            // fills second and seventh rank with pawns
            if(tile.coordinates.includes("2")){
                this.canvasCtx?.drawImage(this.spriteMap["white-pawn"], tile.centerPoint[0] - tile.width / 2, tile.centerPoint[1] - tile.height / 1.83, tile.width, tile.height);
                this.addToGamePiecesArray("white-pawn", tile.coordinates);
                tile.isOccupied = true;
            }
            else if(tile.coordinates.includes("7")){
                this.canvasCtx?.drawImage(this.spriteMap["black-pawn"], tile.centerPoint[0] - tile.width / 2, tile.centerPoint[1] - tile.height / 1.83, tile.width, tile.height);
                this.addToGamePiecesArray("black-pawn", tile.coordinates);
                tile.isOccupied = true;
            }

            // if coordinate is in piecePosition Record it will generate a piece on this coordinate
            const piece = this.piecePositions[tile.coordinates]
            if(piece){
                this.canvasCtx?.drawImage(
                    this.spriteMap[piece],
                    tile.centerPoint[0] - tile.width / 2,
                    tile.centerPoint[1] - tile.height / 1.83,
                    tile.width,
                    tile.height
                );
                tile.isOccupied = true;
                this.addToGamePiecesArray(piece, tile.coordinates);
            }
        });
    } 

    getCanvasSize(): [x: number, y: number]{
        return [this.canvas.width, this.canvas.height]
    }
    
    // Adds GameTiles to the appropriate class array
    private addToGameTilesArray(gameTileWidth: number, gameTileHeight: number ,yPosRectangle: number, xPosRectangle: number, lastColor: string, x: number, coordinates: string) : void{
        if(x === 1){
            this.gameTiles.push(new GameTile(
            [gameTileWidth / 2, yPosRectangle + gameTileHeight / 2],
            gameTileWidth,
            gameTileHeight,
            lastColor,
            false,
            coordinates,
            ))    
        }
        else{
            this.gameTiles.push(new GameTile(
            [xPosRectangle + gameTileWidth / 2, yPosRectangle + gameTileHeight / 2],
            gameTileWidth,
            gameTileHeight,
            lastColor,
            false,
            coordinates
            ))
        }
    }

    private addToGamePiecesArray(name: string, coordinate: string){
        const splitName = name.split("-");
        const pieceColor = splitName[0];
        this.gamePieces.push(this.pieceFactory.createPiece(name, pieceColor, coordinate))
            
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
    
}

window.onload = () =>{
    const gameBoard : GameBoardCreator = new GameBoardCreator(document.getElementById("game-canvas") as HTMLCanvasElement, "#F0D9B5", "#B58863", new PieceFactory())
    gameBoard.drawChessBoard();
    
    Promise.all(
        Object.values(gameBoard.spriteMap).map(img => new Promise(resolve => img.onload = resolve))
    ).then(() => {
        gameBoard.drawPiecesOnChessBoard();
    });

    console.log(gameBoard.gamePieces)

} 