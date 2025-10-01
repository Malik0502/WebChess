import type { Board } from "../../../board/board";
import { GameTile } from "../../../board/entities/gameTile";
import type { IPiece } from "../../pieces/interfaces/IPiece";
import type { Move } from "../turnManagement/entities/move";
import type { TurnManager } from "../turnManagement/turnManager";
import type { PieceRenderer } from "../../../board/renderer/pieceRenderer";
import type { MovePreviewRenderer } from "../../../board/renderer/movePreviewRenderer";
import type { TileRenderer } from "../../../board/renderer/tileRenderer";
import type { ControlManager } from "../controlManagement/controlManager";

export class GameManager{
    
    private pieceRenderer: PieceRenderer;
    private movePreviewRenderer: MovePreviewRenderer;
    private tileRenderer: TileRenderer;

    private turnManager: TurnManager;
    private controlManager: ControlManager;
    private isPieceSelected: boolean;
    private selectedPiece: IPiece | undefined;

    private board: Board;

    constructor(board: Board, pieceRenderer: PieceRenderer, movePreviewRenderer: MovePreviewRenderer, tileRenderer: TileRenderer, turnManager: TurnManager, controlManager: ControlManager){
        this.pieceRenderer = pieceRenderer;
        this.movePreviewRenderer = movePreviewRenderer;
        this.tileRenderer = tileRenderer;

        this.turnManager = turnManager;
        this.controlManager = controlManager;
        this.isPieceSelected = false;
        
        this.board = board;
    }

    handleMouseClick(mousePos: [number, number]): void{
        const isAttack: boolean = true;
        const nearestTile: GameTile = this.calcNearestTile(mousePos);

        if(!this.isPieceSelected && !nearestTile.isOccupied) return;
        
        const pieceOnTile: IPiece = this.getPieceOnTile(nearestTile);
    

        if(!this.selectedPiece && pieceOnTile && !this.turnManager.isSelectedPieceEqualActiveTurnColor(pieceOnTile.color))
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
            this.deleteMoveOptions();
            this.selectPiece(pieceOnTile, nearestTile);
            pieceOnTile.calcPossibleMoves(this.board.gameTiles, isAttack);
            this.movePreviewRenderer.paintMovePreview();
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
        return tile.currentPiece!;
    }

    private getTileOnPiece(piece: IPiece): GameTile {
        return piece.currentTile;
    }

    private handleMoving(nearestTile: GameTile){
        
        if(!this.selectedPiece) return
        let move: Move = {start: this.selectedPiece.currentCoordinates, end: nearestTile.coordinates};
        
        const previouslyStandOnTile: GameTile = this.selectedPiece.currentTile; 

        this.turnManager.addToTurnHistory(move, this.selectedPiece, nearestTile);
        this.movePiece(this.selectedPiece!, nearestTile);
        this.controlManager.calcControlledTilesAfterMoving(previouslyStandOnTile, this.selectedPiece, this.board);
        this.isPieceSelected = false;
        this.turnManager.changeActiveColor(this.selectedPiece!.color);
        this.selectedPiece = undefined;
    }

    private movePiece(piece: IPiece, clickedTile: GameTile): void {
        
        this.tileRenderer.drawChessRectangle(piece.currentTile.cornerPoint[0], piece.currentTile.cornerPoint[1], clickedTile.width, clickedTile.height, piece.currentTile.color);
        this.pieceRenderer.drawPieceOnBoard(piece, clickedTile, true);

        this.changePropsAfterMove(piece, clickedTile);
    }

    private selectPiece(pieceOnTile: IPiece, nearestTile: GameTile): void{
        // marks selected piece yellow
        this.pieceRenderer.repaintPieces(pieceOnTile, nearestTile);

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
                this.pieceRenderer.repaintPieces(gamePiece, this.getTileOnPiece(gamePiece));
                gamePiece.selected = false;
            }
        });
    }

    private changePropsAfterMove(piece: IPiece, clickedTile: GameTile): void{
        
        if(clickedTile.isOccupied && clickedTile.coordinates != piece.currentCoordinates) this.capturePiece(clickedTile)
        
        this.movePreviewRenderer.repaintMoveOptionTilesNormal();
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
        this.movePreviewRenderer.repaintMoveOptionTilesNormal();
        this.board.gameTiles.forEach(row => {
            row.forEach(col => col.isMoveOption = false)
        });

    }

    // just handles removing piece from array right now
    private capturePiece(clickedTile: GameTile): void{
        this.board.gamePieces = this.board.gamePieces.filter(x => x.currentCoordinates != clickedTile.coordinates);
    }
}