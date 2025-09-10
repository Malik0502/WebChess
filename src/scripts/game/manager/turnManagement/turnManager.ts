import { black, white } from "../../../common/constants/pieceColor";
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

    addToTurnHistory(move: [start: string, end: string], pieceColor: string){
        if(pieceColor == white){
            let turn: Turn = { 
                turn: this.turns.length + 1, 
                whiteMove: move, 
                blackMove: undefined, 
                whiteAlgebraicNotation: undefined, 
                blackAlgebraicNotation: undefined
            };
            
            this.turns.push(turn);
            return;
        }

        this.turns[this.turns.length - 1].blackMove = move;        
    }
}