import type { GameTile } from "../../../board/entities/gameTile";
import type { IMovementInfo } from "./entities/IMovementInfo";

const directions = {
    North: 1,
    South: -1,
    East: 1,
    West: -1,
} as const;

export class SlidingMovement{

    diagonalMovement(movementInfo: IMovementInfo, isAttack: boolean){
        this.CalcNorthWestMoves(movementInfo, isAttack);
        this.CalcNorthEastMoves(movementInfo, isAttack);
        this.CalcSouthWestMoves(movementInfo, isAttack);
        this.CalcSouthEastMoves(movementInfo, isAttack);
        return movementInfo.possibleMoves;
    }

    straightMovement(movementInfo: IMovementInfo, isAttack: boolean): GameTile[]{
        
        this.CalcVerticalMoves(movementInfo, directions.North, isAttack);
        this.CalcVerticalMoves(movementInfo, directions.South, isAttack);

        this.CalcHorizontalMoves(movementInfo, directions.East, isAttack);
        this.CalcHorizontalMoves(movementInfo, directions.West, isAttack);

        return movementInfo.possibleMoves;
    }

    private CalcVerticalMoves(movementInfo: IMovementInfo, direction: number, isAttack: boolean){
        for (let index = movementInfo.pieceRow; index >= 0 && index <= 7; index += direction) {
            if(index == movementInfo.pieceRow) continue;
    
            const element: GameTile = movementInfo.board[index][movementInfo.pieceCol];
    
            if(element.currentPiece && element.currentPiece.color == movementInfo.pieceColor && isAttack) break;
    
            if(element.isOccupied){
                movementInfo.possibleMoves.push(element);
                break;
            }
    
            if(!element.isOccupied) movementInfo.possibleMoves.push(element);
        }
    }

    private CalcHorizontalMoves(movementInfo: IMovementInfo, direction: number, isAttack: boolean){
        for (let index = movementInfo.pieceCol; index >= 0 && index <= 7; index += direction) {
            if(index == movementInfo.pieceCol) continue;
    
            const element: GameTile = movementInfo.board[movementInfo.pieceRow][index];
    
            if(element.currentPiece && element.currentPiece.color == movementInfo.pieceColor && isAttack) break;
    
            if(element.isOccupied){
                movementInfo.possibleMoves.push(element);
                break;
            }
    
            if(!element.isOccupied) movementInfo.possibleMoves.push(element);
        }
    }

    private CalcNorthWestMoves(movementInfo: IMovementInfo, isAttack: boolean){
        let pieceRowIndex: number = movementInfo.pieceRow;
        
        for (let index = movementInfo.pieceCol; index >= 0 && pieceRowIndex >= 0; index--) {
            
            if(index == movementInfo.pieceCol){
                pieceRowIndex--;
                continue;
            };
            
            const element: GameTile = movementInfo.board[pieceRowIndex][index];
    
            if(element.currentPiece && element.currentPiece.color == movementInfo.pieceColor && isAttack) break;
    
            if(element.isOccupied){
                movementInfo.possibleMoves.push(element);
                pieceRowIndex--;
                break;
            }
    
            if(!element.isOccupied) movementInfo.possibleMoves.push(element);
            pieceRowIndex--;
        }
    }

    private CalcNorthEastMoves(movementInfo: IMovementInfo, isAttack: boolean){
        let pieceRowIndex: number = movementInfo.pieceRow;

        for (let index = movementInfo.pieceCol; index <= 7 && pieceRowIndex >= 0; index++) {
            if(index == movementInfo.pieceCol){
                pieceRowIndex--;
                continue;
            }
    
            const element: GameTile = movementInfo.board[pieceRowIndex][index];
    
            if(element.currentPiece && element.currentPiece.color == movementInfo.pieceColor && isAttack) break;
    
            if(element.isOccupied){
                movementInfo.possibleMoves.push(element);
                pieceRowIndex--;
                break;
            }
    
            if(!element.isOccupied) movementInfo.possibleMoves.push(element);
            pieceRowIndex--;
        }
    }

    private CalcSouthWestMoves(movementInfo: IMovementInfo, isAttack: boolean){
        let pieceRowIndex: number = movementInfo.pieceRow;

        for (let index = movementInfo.pieceCol; index >= 0 && pieceRowIndex <= 7; index--) {
            if(index == movementInfo.pieceCol){
                pieceRowIndex++;
                continue;
            }
    
            const element: GameTile = movementInfo.board[pieceRowIndex][index];
    
            if(element.currentPiece && element.currentPiece.color == movementInfo.pieceColor && isAttack) break;
    
            if(element.isOccupied){
                movementInfo.possibleMoves.push(element);
                pieceRowIndex++;
                break;
            }
    
            if(!element.isOccupied) movementInfo.possibleMoves.push(element);
            pieceRowIndex++;
        }
    }

     private CalcSouthEastMoves(movementInfo: IMovementInfo, isAttack: boolean){
        let pieceRowIndex: number = movementInfo.pieceRow;

        for (let index = movementInfo.pieceCol; index <= 7 && pieceRowIndex <= 7; index++) {
            if(index == movementInfo.pieceCol){
                pieceRowIndex++;
                continue;
            }
    
            const element: GameTile = movementInfo.board[pieceRowIndex][index];
    
            if(element.currentPiece && element.currentPiece.color == movementInfo.pieceColor && isAttack) break;
    
            if(element.isOccupied){
                movementInfo.possibleMoves.push(element);
                pieceRowIndex++;
                break;
            }
    
            if(!element.isOccupied) movementInfo.possibleMoves.push(element);
            pieceRowIndex++;
        }
    }

    
}