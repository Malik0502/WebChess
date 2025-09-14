import { WHITE } from "../../../common/constants/pieceColor";
import { PAWN } from "../../../common/constants/pieceNames";
import { PieceNotationMap } from "../../../common/records/pieceNotationMap";
import type { IPiece } from "../../pieces/interfaces/IPiece";
import type { Move } from "./entities/move";
import type { Turn } from "./entities/turn";

export class AlgebraicNotationParser{
    parseAlgebraicNotation(turn: Turn, piece: IPiece): string{
        
        const isWhite: boolean = piece.color == WHITE;
        const hasCaptured: boolean = isWhite ? turn.isBlackCaptured! : turn.isWhiteCaptured!; 

        const pieceSymbol: string = PieceNotationMap[piece.name]
        const pieceMove: Move = isWhite ? turn.whiteMove! : turn.blackMove!;
        
        if(hasCaptured){
            if(piece.name == PAWN){
                return `${pieceMove.start[0]}x${pieceMove.end}`
            }
            return `${pieceSymbol}x${pieceMove.end}`;    
        }

        return `${pieceSymbol}${pieceMove.end}`;
    }
}