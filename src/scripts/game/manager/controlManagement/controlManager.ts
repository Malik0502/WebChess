import type { Board } from "../../../board/board";
import { GameTile } from "../../../board/entities/gameTile";
import { BLACK, WHITE } from "../../../common/constants/pieceColor";
import type { IPiece } from "../../pieces/interfaces/IPiece";
import { Pawn } from "../../pieces/pawn";

export class ControlManager{
    calcControlledTilesOnStart(board: Board){
        const pieces: IPiece[] = board.gamePieces;
        const isAttack: boolean = false;

        pieces.forEach(piece => {
            let controlledTiles: GameTile[] = [];
            if(piece instanceof Pawn){
                controlledTiles = piece.calcVerticalMoves(board.gameTiles, piece.currentTile.row, piece.currentTile.col, piece.color);
            }else{
                controlledTiles = piece.calcPossibleMoves(board.gameTiles, isAttack);
            }
            piece.controlledTiles = controlledTiles;

            this.fillTilesControl(controlledTiles, piece);
        });
    }

    calcControlledTilesAfterMoving(tilePieceStandsOn: GameTile, board: Board){
        const controllingPieces: IPiece[] = this.getPiecesControllingTile(tilePieceStandsOn);
        const isAttack: boolean = false;

        controllingPieces.forEach(piece => {
            let controlledTiles: GameTile[] = [];
            if(piece instanceof Pawn){
                controlledTiles = piece.calcVerticalMoves(board.gameTiles, piece.currentTile.row, piece.currentTile.col, piece.color);
            }else{
                controlledTiles = piece.calcPossibleMoves(board.gameTiles, isAttack);
            }
        });
    }

    private fillTilesControl(controlledTiles: GameTile[], piece: IPiece){
        controlledTiles.forEach(tile => {
            tile.control.controllingPieces.push(piece);
            tile.control.whiteControlling = this.countControllingPieces(tile.control.controllingPieces, WHITE);
            tile.control.blackControlling = this.countControllingPieces(tile.control.controllingPieces, BLACK);
        })
    }

    private countControllingPieces(pieces: IPiece[], color: string): number{
        let count: number = 0;
        
        pieces.forEach(piece => {
            if(piece.color == color) count++;
        });

        return count;
    }

    private getPiecesControllingTile(tile: GameTile): IPiece[]{
        return tile.control.controllingPieces;
    }
}