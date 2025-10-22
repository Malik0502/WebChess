import type { Board } from "../../../board/board";
import type { GameTile } from "../../../board/entities/gameTile";
import type { MovePreviewRenderer } from "../../../board/renderer/movePreviewRenderer";
import type { PieceRenderer } from "../../../board/renderer/pieceRenderer";
import type { TileRenderer } from "../../../board/renderer/tileRenderer";
import { WHITE } from "../../../common/constants/pieceColor";
import type { IPiece } from "../../pieces/interfaces/IPiece";
import type { CastleHelper } from "../../pieces/pieceMovement/castleHelper";
import type { ControlManager } from "../controlManagement/controlManager";
import type { Move } from "../turnManagement/entities/move";
import type { TurnManager } from "../turnManagement/turnManager";

export class MoveManager {

    private turnManager: TurnManager;
    private controlManager: ControlManager;
    private castleHelper: CastleHelper

    private tileRenderer: TileRenderer;
    private pieceRenderer: PieceRenderer;
    private movePreviewRenderer: MovePreviewRenderer;

    constructor(turnManager: TurnManager, controlManager: ControlManager, tileRenderer: TileRenderer, pieceRenderer: PieceRenderer, movePreviewRenderer: MovePreviewRenderer, castleHelper: CastleHelper){
        this.turnManager = turnManager;
        this.controlManager = controlManager;
        this.castleHelper = castleHelper;

        this.tileRenderer = tileRenderer;
        this.pieceRenderer = pieceRenderer;
        this.movePreviewRenderer = movePreviewRenderer;
    }

    public handleMoving(nearestTile: GameTile, selectedPiece: IPiece, board: Board){
        let move: Move = { start: selectedPiece.currentCoordinates, end: nearestTile.coordinates };

        const previouslyStandOnTile: GameTile = selectedPiece.currentTile;
        
        if(!this.castleHelper.isCastlingMove(selectedPiece, move)){
            this.turnManager.addToTurnHistory([move], selectedPiece, nearestTile);
            this.movePiece(selectedPiece!, nearestTile, board);
            this.controlManager.calcControlledTilesAfterMoving(previouslyStandOnTile, selectedPiece, board);
            this.turnManager.changeActiveColor(selectedPiece!.color);
            return;
        }
        
        
        this.handleCastling(move, nearestTile, selectedPiece);
    }

    // black castling doesnt work. king is moving already and algebraic notation is wrong
    // whites algebraic notation is correct but send 0-0 two times for short castling instead of 1 like on long 
    private handleCastling(move: Move, nearestTile: GameTile, selectedPiece: IPiece){
        let towerMove: Move;
        if(this.castleHelper.isShortCastling(move)){
            if(selectedPiece.color !== WHITE){
                towerMove = {start: "h8", end: "f8"}
            }
            towerMove = {start: "h1", end: "f1"}
            this.turnManager.addToTurnHistory([move, towerMove], selectedPiece, nearestTile);
        }

        if(selectedPiece.color !== WHITE){
            towerMove = {start: "a8", end: "d8"}
        }
        towerMove = {start: "a1", end: "d1"}
        this.turnManager.addToTurnHistory([move, towerMove], selectedPiece, nearestTile);
    }

    private movePiece(piece: IPiece, clickedTile: GameTile, board: Board): void{

        this.tileRenderer.drawChessRectangle(piece.currentTile.cornerPoint[0], piece.currentTile.cornerPoint[1], clickedTile.width, clickedTile.height, piece.currentTile.color);
        this.pieceRenderer.drawPieceOnBoard(piece, clickedTile, true);

        this.changePropsAfterMove(piece, clickedTile, board);
    }

    private changePropsAfterMove(piece: IPiece, clickedTile: GameTile, board: Board): void{

        if (clickedTile.isOccupied && clickedTile.coordinates != piece.currentCoordinates) this.capturePiece(clickedTile, board)

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

    public deleteMoveOptions(board: Board) {
        this.movePreviewRenderer.repaintMoveOptionTilesNormal();
        board.gameTiles.forEach(row => {
            row.forEach(col => col.isMoveOption = false)
        });

    }

    // just handles removing piece from array right now
    private capturePiece(clickedTile: GameTile, board: Board): void {
        board.gamePieces = board.gamePieces.filter(x => x.currentCoordinates != clickedTile.coordinates);
    }    
}