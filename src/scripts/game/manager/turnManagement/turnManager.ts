import type { GameTile } from "../../../board/entities/gameTile";
import { black, white } from "../../../common/constants/pieceColor";
import type { IPiece } from "../../pieces/interfaces/IPiece";
import type { Turn } from "./entities/turn";

export class TurnManager{
    
    startColor: string;
    activeColor: string;
    turns: Turn[];

    constructor(){
        this.startColor = white;
        this.activeColor = this.startColor;
        this.turns = [];
    }

    isSelectedPieceEqualActiveTurn(pieceColor: string): boolean{
        return pieceColor == this.activeColor ? true : false;
    }

    changeActiveColor(lastPieceColor: string){
        this.activeColor = lastPieceColor == white ? black : white;
    }

    addToTurnHistory(move: [start: string, end: string], piece: IPiece, nearestTile: GameTile){
        if(piece.color == white){
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
            return;
        }
        this.turns[this.turns.length - 1].blackMove = move;
        this.turns[this.turns.length - 1].isWhiteCaptured = nearestTile.isOccupied;     
    }

    movesToAlgebraicNotation(turn: Turn, piece: IPiece, nearestTile: GameTile){
        
    }


}