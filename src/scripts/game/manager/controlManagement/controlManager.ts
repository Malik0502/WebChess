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

        //this.logAllControlledTilesToConsole(board.gameTiles);
    }


    // something is wrong
    // pawns are calculating wrong
    // resetting control array in tiles seem to fail as well
    // King cant move to squares he should be able to go because knight moved away
    
    calcControlledTilesAfterMoving(previouslyStandOnTile: GameTile, piece: IPiece, board: Board){
        const controllingPieces: IPiece[] = this.getRelevantControllingPieces(previouslyStandOnTile, piece);
        this.resetControlTiles(previouslyStandOnTile);
        this.resetControlTiles(piece.currentTile);

        //console.log(controllingPieces);
        //console.log(previouslyStandOnTile);
        //console.log(piece.currentTile);

        const isAttack: boolean = false;

        controllingPieces.forEach(piece => {
            this.resetPieceControlledTiles(piece);
            let controlledTiles: GameTile[] = [];
            if(piece instanceof Pawn){
                controlledTiles = piece.calcVerticalMoves(board.gameTiles, piece.currentTile.row, piece.currentTile.col, piece.color);
            }else{
                controlledTiles = piece.calcPossibleMoves(board.gameTiles, isAttack);
            }

            this.fillTilesControl(controlledTiles, piece);
        })

        // old doe
        // controllingPieces.forEach(piece => {
        //     this.resetPieceControlledTiles(piece);
        //     let controlledTiles: GameTile[] = [];
        //     if(piece instanceof Pawn){
        //         controlledTiles = piece.calcVerticalMoves(board.gameTiles, piece.currentTile.row, piece.currentTile.col, piece.color);
        //     }else{
        //         controlledTiles = piece.calcPossibleMoves(board.gameTiles, isAttack);
        //     }

        //     this.fillTilesControl(controlledTiles, piece);
        // });

        // this.logAllControlledTilesToConsole(board.gameTiles);
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

    private logAllControlledTilesToConsole(gameTiles: GameTile[][]){
        const controlledTiles: GameTile[] = []

        gameTiles.forEach(row => {
            row.forEach(tile => {
                if(tile.control.controllingPieces.length > 0) controlledTiles.push(tile);
            });
        });

        console.log(controlledTiles);
    }

    private fillTilesControl(controlledTiles: GameTile[], piece: IPiece){
        controlledTiles.forEach(tile => {
            tile.control.controllingPieces.push(piece);
            tile.control.whiteControlling = this.countControllingPieces(tile.control.controllingPieces, WHITE);
            tile.control.blackControlling = this.countControllingPieces(tile.control.controllingPieces, BLACK);
        })
    }

    private resetControlTiles(tile: GameTile){
        tile.control.controllingPieces = [];
    }

    private resetPieceControlledTiles(piece: IPiece){
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