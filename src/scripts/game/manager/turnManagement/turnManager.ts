import type { GameTile } from "../../../board/entities/gameTile";
import { BLACK, WHITE } from "../../../common/constants/pieceColor";
import type { TableRenderer } from "../../../table/tableRenderer";
import type { IPiece } from "../../pieces/interfaces/IPiece";
import type { AlgebraicNotationParser } from "./algebraicNotationParser";
import type { Move } from "./entities/move";
import type { Turn } from "./entities/turn";

export class TurnManager{
    
    startColor: string;
    activeColor: string;
    turns: Turn[];

    private algebraicNotationParser: AlgebraicNotationParser;
    private tableRenderer: TableRenderer;

    constructor(algebraicNotationParser: AlgebraicNotationParser, tableRenderer: TableRenderer){
        this.startColor = WHITE;
        this.activeColor = this.startColor;
        this.turns = [];
        this.algebraicNotationParser = algebraicNotationParser;
        this.tableRenderer = tableRenderer;
    }

    isSelectedPieceEqualActiveTurnColor(pieceColor: string): boolean{
        return pieceColor == this.activeColor ? true : false;
    }

    changeActiveColor(lastPieceColor: string){
        this.activeColor = lastPieceColor == WHITE ? BLACK : WHITE;
    }

    addToTurnHistory(move: Move[], piece: IPiece, nearestTile: GameTile){
        if(piece.color == WHITE){
            let turn: Turn = { 
                turn: this.turns.length + 1, 
                whiteMove: move, 
                blackMove: undefined, 
                isBlackCaptured: nearestTile.isOccupied,
                isWhiteCaptured: undefined,
                whiteAlgebraicNotation: undefined, 
                blackAlgebraicNotation: undefined
            };
            this.turns.push(turn);
            this.addAlgebraicNotationToTurn(turn, piece);
            return;
        }

        let turn: Turn = this.turns[this.turns.length - 1];

        turn.blackMove = move;
        turn.isWhiteCaptured = nearestTile.isOccupied;     
        this.addAlgebraicNotationToTurn(turn, piece);
    }

    addAlgebraicNotationToTurn(turn: Turn, piece: IPiece){
        if(piece.color == WHITE){
            turn.whiteAlgebraicNotation = this.algebraicNotationParser.parseAlgebraicNotation(turn, piece);
            this.tableRenderer.renderTurns(this.turns);
            return;
        }

        turn.blackAlgebraicNotation = this.algebraicNotationParser.parseAlgebraicNotation(turn, piece);
        this.tableRenderer.renderTurns(this.turns);
    }
}