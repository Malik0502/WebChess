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

    calcControlledTilesAfterMoving(previouslyStandOnTile: GameTile, piece: IPiece, board: Board){
        
        const controllingPieces: IPiece[] = this.getRelevantControllingPieces(previouslyStandOnTile, piece);

        this.resetPiecesInTileControl(piece);
        this.resetImportantControlTiles(previouslyStandOnTile, piece.currentTile);
        const isAttack: boolean = false;

        controllingPieces.forEach(piece => {
            this.resetPiecesInTileControl(piece);

            let controlledTiles: GameTile[] = [];

            if(piece instanceof Pawn){
                controlledTiles = piece.calcVerticalMoves(board.gameTiles, piece.currentTile.row, piece.currentTile.col, piece.color);
            }
            else{
                controlledTiles = piece.calcPossibleMoves(board.gameTiles, isAttack)
            }

            this.fillTilesControl(controlledTiles, piece)
        });
    }

    private getRelevantControllingPieces(previouslyStandOnTile: GameTile, piece: IPiece): IPiece[]{
        const result: IPiece[] = [];
        
        result.push(...this.getPiecesControllingTile(previouslyStandOnTile));
        result.push(...this.getPiecesControllingTile(piece.currentTile));
        result.push(piece);

        const uniqueResult = [
            ...new Map(result.map(item => [item.currentCoordinates, item])).values()
        ];

        return uniqueResult;
    }

    private fillTilesControl(controlledTiles: GameTile[], piece: IPiece){
        controlledTiles.forEach(tile => {
            tile.control.controllingPieces.push(piece);
            tile.control.whiteControlling = this.countControllingPieces(tile.control.controllingPieces, WHITE);
            tile.control.blackControlling = this.countControllingPieces(tile.control.controllingPieces, BLACK);
        })
        piece.controlledTiles.push(...controlledTiles);
    }

    private resetImportantControlTiles(previouslyStandOnTile: GameTile, newTile: GameTile){
        this.resetTileControl(previouslyStandOnTile);
        this.resetTileControl(newTile);
    }

    private resetTileControl(tile: GameTile){
        tile.control.controllingPieces = [];
    }

    private resetPiecesInTileControl(piece: IPiece){
        piece.controlledTiles.forEach(tile => {
            const index: number = tile.control.controllingPieces.indexOf(piece);
            if(index > -1){
                tile.control.controllingPieces.splice(index, 1);
                piece.color == WHITE ? tile.control.whiteControlling-- : tile.control.blackControlling--;
            }
        });

        piece.controlledTiles = [];
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