import { WHITE } from "../../../common/constants/pieceColor";
import { PAWN } from "../../../common/constants/pieceNames";
import { PieceNotationMap } from "../../../common/records/pieceNotationMap";
import type { IPiece } from "../../pieces/interfaces/IPiece";
import type { CastleHelper } from "../../pieces/pieceMovement/castleHelper";
import type { Move } from "./entities/move";
import type { Turn } from "./entities/turn";

export class AlgebraicNotationParser{

    private castleHelper: CastleHelper;

    constructor(castleHelper: CastleHelper){
        this.castleHelper = castleHelper;
    }

    parseAlgebraicNotation(turn: Turn, piece: IPiece): string{
        
        const isWhite: boolean = piece.color == WHITE;
        const hasCaptured: boolean = isWhite ? turn.isBlackCaptured! : turn.isWhiteCaptured!; 

        const pieceSymbol: string = PieceNotationMap[piece.name]
        
        if(this.isCastling(turn, piece.color)){
            return this.convertCastlingToAlgebraic(turn, isWhite);
        }
        const pieceMove: Move = isWhite ? turn.whiteMove![0] : turn.blackMove![0];
        
        if(hasCaptured){
            if(piece.name == PAWN){
                return `${pieceMove.start[0]}x${pieceMove.end}`
            }
            return `${pieceSymbol}x${pieceMove.end}`;    
        }

        return `${pieceSymbol}${pieceMove.end}`;
    }

    private isCastling(turn: Turn, color: string): boolean{
        if(color === WHITE){
            if(turn.whiteMove!.length === 1) return false;
            if(turn.whiteMove!.length > 1) return true;
        }
        if(!turn.blackMove!) return false;
        return turn.blackMove!.length > 1;
    }

    private convertCastlingToAlgebraic(turn: Turn, isWhite: boolean): string{
        if(isWhite){
            if(this.castleHelper.isShortCastling(turn.whiteMove![0])){
                return "0-0"
            }
            return "0-0-0";
        }

        if(this.castleHelper.isShortCastling(turn.blackMove![0])){
            return "0-0"
        }
        return "0-0-0";
    }
}