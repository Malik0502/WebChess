import { BLACK, WHITE } from "../../../common/constants/pieceColor";
import type { IPiece } from "../../pieces/interfaces/IPiece";
import { Points } from "./points";

export class PointManager{
    capturedPieces: IPiece[] = [];
    points: Points = new Points()

    public addToCaptureHistory(piece: IPiece){
        this.capturedPieces.push(piece);
        this.calculatePoints();
    }

    private calculatePoints(){
        this.capturedPieces.forEach(piece => {
            if(piece.color === WHITE){
                this.points.white += piece.value;
            }
            else if(piece.color === BLACK){
                this.points.black += piece.value;
            }
        });
    }
}