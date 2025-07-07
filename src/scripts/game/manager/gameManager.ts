import type { Board } from "../../board/board";
import { GameTile } from "../../board/entities/gameTile";
import type { IPiece } from "../pieces/interfaces/IPiece";

export class GameManager{
    
    private board: Board;

    constructor(board: Board){
        this.board = board;
    }

    handleMouseClick(mousePos: [number, number]){
        const nearestTile: GameTile = this.calcNearestTile(mousePos);
        
        if(!nearestTile.isOccupied) return

        const pieceOnTile: IPiece = this.getPieceOnTile(nearestTile);

        console.log(pieceOnTile);
    }

    private calcNearestTile(mousePos: [x: number, y: number]) : GameTile{
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

    private getPieceOnTile(tile: GameTile) : IPiece{
        let piece: IPiece | undefined;
        
        this.board.gamePieces.forEach(gamePiece => {
            if(gamePiece.currentCoordinates == tile.coordinates){
                piece = gamePiece;
                this.refreshSelectedPieces(gamePiece);
                piece.selected = true;
            }
        });

        return piece!;
    }

    private refreshSelectedPieces(piece: IPiece){
        this.board.gamePieces.forEach(gamePiece => {
            if(gamePiece.selected){
                gamePiece.selected = false;
            }
        });
    }
}