import type { Board } from "../../board/board";
import { GameTile } from "../../board/entities/gameTile";
import type { IPiece } from "../pieces/interfaces/IPiece";

export class GameManager{
    
    private board: Board;

    constructor(board: Board){
        this.board = board;
    }

    handleMouseClick(mousePos: [number, number]): void{
        const nearestTile: GameTile = this.calcNearestTile(mousePos);
        
        if(!nearestTile.isOccupied) return

        
        // Gets piece that stands on coordinates of nearest tile
        const pieceOnTile: IPiece = this.getPieceOnTile(nearestTile);
        
        if(nearestTile.isMoveOption){
            pieceOnTile.MovePiece();
        }

        // marks selected piece yellow
        this.board.repaintPieces(pieceOnTile, nearestTile);

        // toggle selection
        pieceOnTile.selected = !pieceOnTile.selected;

        // then unselect others, excluding the newly selected piece
        this.refreshSelectedPieces(pieceOnTile);

        const possibleMoves: string[] = pieceOnTile.CalcPossibleMoves(this.board.gameTiles);

        console.log(possibleMoves);
    }

    private calcNearestTile(mousePos: [x: number, y: number]): GameTile {
        let nearestTile: [tile: GameTile | undefined, posDifference: number] = [undefined, Infinity];

        for (const row of this.board.gameTiles) {
            for (const tile of row) {
                const distanceCpMp = Math.sqrt(
                    Math.pow(mousePos[0] - tile.centerPoint[0], 2) +
                    Math.pow(mousePos[1] - tile.centerPoint[1], 2)
                );

                if (distanceCpMp < nearestTile[1]) {
                    nearestTile = [tile, distanceCpMp];
                }
            }
        }

        return nearestTile[0]!;
    }


    // Gets the piece that stands on method parameter tile
    private getPieceOnTile(tile: GameTile) : IPiece{
        let piece: IPiece | undefined;
        
        this.board.gamePieces.forEach(gamePiece => {
            if(gamePiece.currentCoordinates == tile.coordinates){
                piece = gamePiece;
            }
        });

        return piece!;
    }

    private getTileOnPiece(piece: IPiece): GameTile {
        for (const row of this.board.gameTiles) {
            for (const tile of row) {
                if (tile.coordinates === piece.currentCoordinates) {
                    return tile;
                }
            }
        }

        throw new Error(`Tile for piece at ${piece.currentCoordinates} not found`);
    }

    private refreshSelectedPieces(selectedPiece: IPiece): void {
        this.board.gamePieces.forEach(gamePiece => {
            if (gamePiece !== selectedPiece && gamePiece.selected) {
                this.board.repaintPieces(gamePiece, this.getTileOnPiece(gamePiece));
                gamePiece.selected = false;
            }
        });
    }
}