import type { Board } from "../../../board/board";
import { GameTile } from "../../../board/entities/gameTile";
import { BLACK, WHITE } from "../../../common/constants/pieceColor";
import type { IPiece } from "../../pieces/interfaces/IPiece";
import { Pawn } from "../../pieces/pawn";

// Logik falsch gedacht
// Ich muss ebenfalls Felder als kontrolliert sehen, auf denen eigene Figuren von mir stehen und die von anderen Figuren von mir angeschaut werden
// Das muss sein, damit der König nicht auf solche Felder ziehen kann und Pins etc. richtig funktionieren.
// Bei jeder Move Berechnung muss in dem Fall auch das block Feld berechnet werden.
// Ich muss alles ändern: 
// Dann würde ich eine Calc Methode schreiben die erstmal alle möglichen Züge einer Figur berechnet. 
// Das werf ich dann in eine neue Methode, die abhängig eines booleans entweder alle Züge bis zum blocker des gegners und oder der eigenen Figur behält und eine die eigene Farbblocker rauswirft um bewegungsberechnung zu ermöglichen

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