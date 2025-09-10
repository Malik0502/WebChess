import type { Board } from "../../../board/board";
import { GameTile } from "../../../board/entities/gameTile";
import type { IPiece } from "../../pieces/interfaces/IPiece";
import type { TurnManager } from "../turnManagement/turnManager";

export class GameManager{
    
    private board: Board;
    private turnManager: TurnManager;
    private isPieceSelected: boolean;
    private selectedPiece: IPiece | undefined;

    constructor(board: Board, turnManager: TurnManager){
        this.board = board;
        this.turnManager = turnManager;
        this.isPieceSelected = false;
    }

    handleMouseClick(mousePos: [number, number]): void{
        const nearestTile: GameTile = this.calcNearestTile(mousePos);

        if(!this.isPieceSelected && !nearestTile.isOccupied) return;
        
        const pieceOnTile: IPiece = this.getPieceOnTile(nearestTile);
    

        if(!this.selectedPiece && pieceOnTile && !this.turnManager.isSelectedPieceEqualActiveTurn(pieceOnTile.color))
            return;

        if(this.isPieceSelected && this.selectedPiece?.currentTile != nearestTile){
            if(this.selectedPiece?.possibleMoves.some(x => x.coordinates === nearestTile.coordinates)){
                this.handleMoving(nearestTile);
                return;    
            }
        }

        if(this.selectedPiece?.currentTile == nearestTile){
            this.selectPiece(pieceOnTile, nearestTile);
            this.deleteMoveOptions();
            this.selectedPiece = undefined
            return;
        }
        
        if(!this.selectedPiece || this.selectedPiece && this.selectedPiece.color == pieceOnTile.color){
            this.selectPiece(pieceOnTile, nearestTile);
            pieceOnTile.calcPossibleMoves(this.board.gameTiles);
        }
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

    private handleMoving(nearestTile: GameTile){
        
        if(!this.selectedPiece) return
        let move: [start: string, end: string] = [this.selectedPiece.currentCoordinates, nearestTile.coordinates]
        this.turnManager.addToTurnHistory(move, this.selectedPiece.color);
        
        this.movePiece(this.selectedPiece!, nearestTile);
        this.isPieceSelected = false;
        this.turnManager.changeActiveColor(this.selectedPiece!.color);
        this.selectedPiece = undefined;
    }

    private movePiece(piece: IPiece, clickedTile: GameTile): void {
        
        this.board.removePieceFromTile(piece);
        this.board.drawPieceOnBoard(piece, clickedTile, true);

        this.changePropsAfterMove(piece, clickedTile);
    }

    private selectPiece(pieceOnTile: IPiece, nearestTile: GameTile): void{
        // marks selected piece yellow
        this.board.repaintPieces(pieceOnTile, nearestTile);

        // toggle selection
        pieceOnTile.selected = !pieceOnTile.selected;

        this.isPieceSelected = true;
        this.selectedPiece = pieceOnTile;

        // then unselect others, excluding the newly selected piece
        this.refreshSelectedPieces(pieceOnTile);
    }

    private refreshSelectedPieces(selectedPiece: IPiece): void {
        this.board.gamePieces.forEach(gamePiece => {
            if (gamePiece !== selectedPiece && gamePiece.selected) {
                this.board.repaintPieces(gamePiece, this.getTileOnPiece(gamePiece));
                gamePiece.selected = false;
            }
        });
    }

    private changePropsAfterMove(piece: IPiece, clickedTile: GameTile): void{
        
        if(clickedTile.isOccupied && clickedTile.coordinates != piece.currentCoordinates) this.capturePiece(clickedTile)
        
        piece.possibleMoves.forEach(x => x.isMoveOption = false);
        piece.selected = false;
        piece.hasMoved = true;
        piece.possibleMoves = [];
        piece.currentCoordinates = clickedTile.coordinates;
        piece.currentTile.isOccupied = false;
        piece.currentTile.currentPiece = undefined;

        piece.currentTile = clickedTile;

    }

    private deleteMoveOptions(){
        this.board.gameTiles.forEach(row => {
            row.forEach(col => col.isMoveOption = false)
        });
    }

    // just handles removing piece from array right now
    private capturePiece(clickedTile: GameTile): void{
        this.board.gamePieces = this.board.gamePieces.filter(x => x.currentCoordinates != clickedTile.coordinates);
    }
}