import type { Board } from "../../../board/board";
import type { GameTile } from "../../../board/entities/gameTile";
import type { MovePreviewRenderer } from "../../../board/renderer/movePreviewRenderer";
import type { PieceRenderer } from "../../../board/renderer/pieceRenderer";
import type { TileRenderer } from "../../../board/renderer/tileRenderer";
import { WHITE } from "../../../common/constants/pieceColor";
import { bRookA, bRookH, wRookA, wRookH } from "../../../common/constants/towerPositionArray";
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
            this.refreshGameInformation(selectedPiece, nearestTile, board, previouslyStandOnTile);
            this.turnManager.changeActiveColor(selectedPiece!.color);
            return;
        }
        
        
        this.handleCastling(move, nearestTile, selectedPiece, board, previouslyStandOnTile);
    }

    // blacks rook randomly repaints white rook so that they repaint the wrong model
    private handleCastling(move: Move, nearestTile: GameTile, selectedPiece: IPiece, board: Board, previouslyStandOnTile: GameTile){
        let rookMove: Move;
        let rook: IPiece;
        let rookCastlingDest: GameTile;
        if(this.castleHelper.isShortCastling(move)){
            if(selectedPiece.color !== WHITE){
                rookMove = {start: "h8", end: "f8"}
                rook = board.gamePieces[bRookH];
                rookCastlingDest = board.getGameTileByCoordinate(rookMove.end);
            }
            rookMove = {start: "h1", end: "f1"}
            rook = board.gamePieces[wRookH];
            rookCastlingDest = board.getGameTileByCoordinate(rookMove.end);
            this.turnManager.addToTurnHistory([move, rookMove], selectedPiece, nearestTile);
            this.refreshGameInformation(selectedPiece, nearestTile, board, previouslyStandOnTile);

            this.refreshGameInformation(rook, rookCastlingDest, board, previouslyStandOnTile);
            this.turnManager.changeActiveColor(selectedPiece!.color);
            return;
        }

        if(selectedPiece.color !== WHITE){
            rookMove = {start: "a8", end: "d8"}
            rook = board.gamePieces[bRookA];
            rookCastlingDest = board.getGameTileByCoordinate(rookMove.end);
        }
        rookMove = {start: "a1", end: "d1"}
        rook = board.gamePieces[wRookA];
        rookCastlingDest = board.getGameTileByCoordinate(rookMove.end);
        this.turnManager.addToTurnHistory([move, rookMove], selectedPiece, nearestTile);
        this.refreshGameInformation(selectedPiece, nearestTile, board, previouslyStandOnTile);
        this.refreshGameInformation(rook, rookCastlingDest, board, previouslyStandOnTile);
        this.turnManager.changeActiveColor(selectedPiece!.color);
        return;
    }

    private refreshGameInformation(selectedPiece: IPiece, nearestTile: GameTile, board: Board, previouslyStandOnTile: GameTile){
        this.movePiece(selectedPiece!, nearestTile, board);
        this.controlManager.calcControlledTilesAfterMoving(previouslyStandOnTile, selectedPiece, board);   
    }
 
    private movePiece(piece: IPiece, clickedTile: GameTile, board: Board): void{
        this.tileRenderer.drawChessRectangle(piece.currentTile.cornerPoint[0], piece.currentTile.cornerPoint[1], clickedTile.width, clickedTile.height, piece.currentTile.color);
        this.pieceRenderer.drawPieceOnBoard(piece, clickedTile, true);

        this.changePropsAfterMove(piece, clickedTile, board);
    }

    private changePropsAfterMove(piece: IPiece, clickedTile: GameTile, board: Board): void{
        if (clickedTile.isOccupied && clickedTile.coordinates != piece.currentCoordinates) this.capturePiece(clickedTile, board)

        
        piece.currentTile.isOccupied = false;
        this.movePreviewRenderer.repaintMoveOptionTilesNormal();
        piece.possibleMoves.forEach(x => x.isMoveOption = false);
        piece.selected = false;
        piece.hasMoved = true;
        piece.possibleMoves = [];
        piece.currentCoordinates = clickedTile.coordinates;
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