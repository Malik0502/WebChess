import type { GameTile } from "../../../board/entities/gameTile";
import type { IMovementInfo } from "./entities/IMovementInfo";

const directions = {
    North: 1,
    South: -1,
    East: 1,
    West: -1,
} as const;

export class SlidingMovement{
    public diagonalMovement(movementInfo: IMovementInfo){

    }

    public straightMovement(movementInfo: IMovementInfo): GameTile[]{
        
        this.CalcVerticalMoves(movementInfo, directions.North);
        this.CalcVerticalMoves(movementInfo, directions.South);

        this.CalcHorizontalMoves(movementInfo, directions.East);
        this.CalcHorizontalMoves(movementInfo, directions.West);

        return movementInfo.possibleMoves;
    }

    private CalcVerticalMoves(movementInfo: IMovementInfo, direction: number){
        for (let index = movementInfo.pieceRow; index >= 0 && index <= 7; index += direction) {
            if(index == movementInfo.pieceRow) continue;
    
            const element: GameTile = movementInfo.board[index][movementInfo.pieceCol];
    
            if(element.currentPiece && element.currentPiece.color == movementInfo.pieceColor) break;
    
            if(element.isOccupied && element.currentPiece!.color != movementInfo.pieceColor){
                movementInfo.possibleMoves.push(element);
                break;
            }
    
            if(!element.isOccupied) movementInfo.possibleMoves.push(element);
        }
    }

    private CalcHorizontalMoves(movementInfo: IMovementInfo, direction: number){
        for (let index = movementInfo.pieceCol; index >= 0 && index <= 7; index += direction) {
            if(index == movementInfo.pieceCol) continue;
    
            const element: GameTile = movementInfo.board[movementInfo.pieceRow][index];
    
            if(element.currentPiece && element.currentPiece.color == movementInfo.pieceColor) break;
    
            if(element.isOccupied && element.currentPiece!.color != movementInfo.pieceColor){
                movementInfo.possibleMoves.push(element);
                break;
            }
    
            if(!element.isOccupied) movementInfo.possibleMoves.push(element);
        }
    }
}