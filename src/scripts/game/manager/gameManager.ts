import type { Board } from "../../board/board";
import { GameTile } from "../../board/entities/gameTile";

export class GameManager{
    
    private board: Board;

    constructor(board: Board){
        this.board = board;
    }

    handleMouseClick(mousePos: [number, number]){
        console.log(this.isPieceAtMousePos(mousePos))
    }

    isPieceAtMousePos(mousePos: [x: number, y: number]): boolean{
        return this.calcNearestTile(mousePos).isOccupied;
    }

    calcNearestTile(mousePos: [x: number, y: number]) : GameTile{
        let nearestTile: [tile: GameTile | undefined, posDifference: number] = [undefined, 0];
        this.board.gameTiles.forEach(tile => {

            // Euclidean distance formula to determine the nearest tile to the mouse click
            let distanceCpMp: number = Math.sqrt((Math.pow(mousePos[0] - tile.centerPoint[0], 2)) + (Math.pow(mousePos[1] - tile.centerPoint[1], 2)))

            if(distanceCpMp < nearestTile[1] || nearestTile[1] === 0){
                nearestTile = [tile, distanceCpMp]
            }
        });

        return nearestTile[0]!;
    }
}