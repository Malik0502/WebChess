import type { Board } from "../../../board/board";
import { GameTile } from "../../../board/entities/gameTile";
import type { IPiece } from "../../pieces/interfaces/IPiece";
import type { TurnManager } from "../turnManagement/turnManager";
import type { MovePreviewRenderer } from "../../../board/renderer/movePreviewRenderer";
import type { MoveManager } from "../moveManagement/moveManager";
import type { PieceSelectManager } from "../pieceSelectManagement/pieceSelectManager";

export class GameManager{
    
    private movePreviewRenderer: MovePreviewRenderer;

    private turnManager: TurnManager;
    private moveManager: MoveManager;
    private pieceSelectManager: PieceSelectManager;

    private isPieceSelected: boolean;
    private selectedPiece: IPiece | undefined;

    private board: Board;

    constructor(board: Board, movePreviewRenderer: MovePreviewRenderer, turnManager: TurnManager, moveManager: MoveManager, pieceSelectManager: PieceSelectManager){
        this.movePreviewRenderer = movePreviewRenderer;

        this.moveManager = moveManager;
        this.turnManager = turnManager;
        this.pieceSelectManager = pieceSelectManager;

        this.isPieceSelected = false;
        
        this.board = board;
    }

    handleMouseClick(mousePos: [number, number]): void{
        const isAttack: boolean = true;
        const nearestTile: GameTile = this.calcNearestTile(mousePos);

        if(!this.isPieceSelected && !nearestTile.isOccupied) return;
        
        const pieceOnTile: IPiece = this.getPieceOnTile(nearestTile);
    
        // no piece is selected and selected piece on tile is not the same color as the active playing color
        if(!this.selectedPiece && pieceOnTile && !this.turnManager.isSelectedPieceEqualActiveTurnColor(pieceOnTile.color))
            return;

        // piece selected and clicked tile is not tile of selected piece
        // and clicked tile is possible move
        if(this.isPieceSelected && this.selectedPiece?.currentTile != nearestTile){
            if(this.selectedPiece?.possibleMoves.some(x => x.coordinates === nearestTile.coordinates)){
                this.moveManager.handleMoving(nearestTile, this.selectedPiece, this.board);
                this.isPieceSelected = false;
                this.selectedPiece = undefined
                return;
            }  
        }

        // clicked already selected piece a second time
        if(this.selectedPiece?.currentTile == nearestTile){
            this.pieceSelectManager.selectPiece(pieceOnTile, nearestTile, this.board);
            this.setPieceSelected(pieceOnTile)

            this.moveManager.deleteMoveOptions(this.board);
            this.selectedPiece = undefined
            return;
        }
        
        // switch selected piece to other piece of the same color
        if(!this.selectedPiece || this.selectedPiece && this.selectedPiece.color == pieceOnTile.color){
            this.moveManager.deleteMoveOptions(this.board);

            this.pieceSelectManager.selectPiece(pieceOnTile, nearestTile, this.board);
            this.setPieceSelected(pieceOnTile)

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

    private getPieceOnTile(tile: GameTile) : IPiece{
        return tile.currentPiece!;
    }

    private setPieceSelected(selectedPiece: IPiece){
        this.isPieceSelected = true;
        this.selectedPiece = selectedPiece;
    }
}