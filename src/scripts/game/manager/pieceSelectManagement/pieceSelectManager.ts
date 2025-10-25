import type { Board } from "../../../board/board";
import type { GameTile } from "../../../board/entities/gameTile";
import type { PieceRenderer } from "../../../board/renderer/pieceRenderer";
import type { IPiece } from "../../pieces/interfaces/IPiece";

export class PieceSelectManager{
    
    private pieceRenderer: PieceRenderer;
    
    constructor(pieceRenderer: PieceRenderer){
        this.pieceRenderer = pieceRenderer;
    }

    selectPiece(pieceOnTile: IPiece, nearestTile: GameTile, board: Board): void{
        // marks selected piece yellow
        this.pieceRenderer.repaintPieces(pieceOnTile, nearestTile);

        // toggle selection
        pieceOnTile.selected = !pieceOnTile.selected;

        // then unselect others, excluding the newly selected piece
        this.refreshSelectedPieces(pieceOnTile, board);
    }

    private refreshSelectedPieces(selectedPiece: IPiece, board: Board): void {
        board.gamePieces.forEach(gamePiece => {
            if (gamePiece !== selectedPiece && gamePiece.selected) {
                this.pieceRenderer.repaintPieces(gamePiece, this.getTileOnPiece(gamePiece));
                gamePiece.selected = false;
            }
        });
    }

    private getTileOnPiece(piece: IPiece): GameTile {
        return piece.currentTile;
    }
}