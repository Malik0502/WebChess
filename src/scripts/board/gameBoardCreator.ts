import { gameTile } from "./entities/gameTile";

export class gameBoardCreator{
    canvas: HTMLCanvasElement;
    canvasCtx: CanvasRenderingContext2D | null;
    whiteTileColor: string;
    darkTileColor: string;
    gameTiles: gameTile[];

    constructor(canvas: HTMLCanvasElement, whiteTileColor: string, darkTileColor: string){
        this.canvas = canvas;
        this.canvasCtx = canvas.getContext("2d");
        this.whiteTileColor = whiteTileColor;
        this.darkTileColor = darkTileColor;
        this.gameTiles = [];
    }

    getCanvasSize(): [x: number, y: number]{
        return [this.canvas.width, this.canvas.height]
    }

    drawGameboard(): void{
        const canvasSize: [x: number, y: number] = this.getCanvasSize();
        const gameTileWidth: number = Math.round(canvasSize[0] / 8);
        const gameTileHeight: number = Math.round(canvasSize[1] / 8);

        let xPosRectangle: number = 0;
        let yPosRectangle: number = 0;
        let lastColor: string = this.darkTileColor;

        for(let y = 1; y <= 8; y++){

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

                this.addToGameTilesArray(gameTileWidth, gameTileHeight, yPosRectangle, xPosRectangle, lastColor, x);
            
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

    // Adds GameTiles to the appropriate class array
    private addToGameTilesArray(gameTileWidth: number, gameTileHeight: number ,yPosRectangle: number, xPosRectangle: number, lastColor: string, x: number) : void{
        if(x === 1){
            this.gameTiles.push(new gameTile(
            [gameTileWidth / 2, yPosRectangle + gameTileHeight / 2],
            gameTileWidth,
            gameTileHeight,
            lastColor,
            false,
            ))    
        }
        else{
            this.gameTiles.push(new gameTile(
            [xPosRectangle + gameTileWidth / 2, yPosRectangle + gameTileHeight / 2],
            gameTileWidth,
            gameTileHeight,
            lastColor,
            false,
            ))
        }
    }
}

window.onload = () =>{
    const gameBoard : gameBoardCreator = new gameBoardCreator(document.getElementById("game-canvas") as HTMLCanvasElement, "#F0D9B5", "#B58863")
    gameBoard.drawGameboard();
} 