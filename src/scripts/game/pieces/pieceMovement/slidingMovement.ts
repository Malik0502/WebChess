import type { GameTile } from "../../../board/entities/gameTile";
import type { IMovementInfo } from "./entities/IMovementInfo";

export class SlidingMovement{
    public diagonalMovement(movementInfo: IMovementInfo){

    }

    public straightMovement(movementInfo: IMovementInfo): GameTile[]{
        this.CalcMovesNorth(movementInfo);
        this.CalcMovesSouth(movementInfo);
        this.CalcMovesWest(movementInfo);
        this.CalcMovesEast(movementInfo);

        return movementInfo.possibleMoves;
    }

    private CalcMovesNorth(movementInfo: IMovementInfo){
            for (let index = movementInfo.pieceRow; index >= 0; index--) {
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
    
        private CalcMovesSouth(movementInfo: IMovementInfo){
            for (let index = movementInfo.pieceRow; index <= 7; index++) {
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
    
        private CalcMovesWest(movementInfo: IMovementInfo){
            for (let index = movementInfo.pieceCol; index >= 0; index--) {
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
    
        private CalcMovesEast(movementInfo: IMovementInfo){
            for (let index = movementInfo.pieceCol; index <= 7; index++) {
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