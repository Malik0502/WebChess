import type { GameTile } from "../../board/entities/gameTile";
import type { IPiece } from "./interfaces/IPiece";

export class Pawn implements IPiece{
    name: string;
    color: string;
    value: number;
    spritePath: string;
    startCoordinates: string;
    currentCoordinates: string;
    hasMoved: boolean;
    selected: boolean;
    currentArrayPos: number;
    
    constructor(name: string, color: string, startCoordinates: string, currentArrayPos: number){
        this.name = name,
        this.color = color,
        this.value = 1,
        this.spritePath = this.color === "white" ? "src/assets/pw.svg" : "src/assets/pb.svg";
        this.startCoordinates = startCoordinates;
        this.currentCoordinates = startCoordinates;
        this.hasMoved = false;
        this.selected = false;
        this.currentArrayPos = currentArrayPos;
    }

    CalcPossibleMoves(board: GameTile[]): string[] {
        let possibleMoves: string[] = [];

        for (let index = 0; index < board.length; index++) {
            const tile = board[index];

            if(this.color === "white"){
                this.CalcArrayPosWhite(tile, index, possibleMoves)
                if(this.currentArrayPos <= index){
                    break;
                }
            }
            else{
                if(index >= 16){
                    this.CalcArrayPosBlack(tile, index, possibleMoves);
                }
            }

        }
        
        return possibleMoves;
    }
    
    private CalcArrayPosBlack(tile: GameTile, tileIndex: number, possibleMoves: string[]){
        
        const frontOfPawn: number = this.currentArrayPos + 8;
        const frontOfPawnTwo: number = this.currentArrayPos + 16;
        const diagonalLeftPawn: number = this.currentArrayPos + (8 - 1);
        const diagonalRightPawn: number = this.currentArrayPos + (8 + 1); 

        if(tileIndex === frontOfPawn && !tile.isOccupied){
            possibleMoves.push(tile.coordinates);
            return;
        }

        if(!this.hasMoved && tileIndex === frontOfPawnTwo && !tile.isOccupied && possibleMoves.length > 0){
            possibleMoves.push(tile.coordinates);
            return;
        }

        if(this.currentCoordinates.includes("h")){
            if(tileIndex === diagonalLeftPawn && tile.isOccupied){
                possibleMoves.push(tile.coordinates);
                return;
            }
        }

        if(this.currentCoordinates.includes("a")){
            if(tileIndex === diagonalRightPawn && tile.isOccupied){
                possibleMoves.push(tile.coordinates);
                return;
            }
        }

        if(tileIndex === diagonalLeftPawn && !this.currentCoordinates.includes("h") && tile.isOccupied){
                possibleMoves.push(tile.coordinates);
                return;
            }


        if(tileIndex === diagonalRightPawn && !this.currentCoordinates.includes("a") && tile.isOccupied){
                possibleMoves.push(tile.coordinates);
                return;
        }
        
    }

    private CalcArrayPosWhite(tile: GameTile, tileIndex: number,  possibleMoves: string[]){
        
        const frontOfPawn: number = this.currentArrayPos - 8;
        const frontOfPawnTwo: number = this.currentArrayPos - 16;
        const diagonalLeftPawn: number = this.currentArrayPos - (8 + 1);
        const diagonalRightPawn: number = this.currentArrayPos - (8 - 1); 

        // in front of pawn
        if(tileIndex === frontOfPawn && !tile.isOccupied){
            possibleMoves.push(tile.coordinates);
            return;
        }
        
        if(tileIndex === frontOfPawn && tile.isOccupied){
            possibleMoves.shift();
        }

        if(!this.hasMoved && tileIndex === frontOfPawnTwo && !tile.isOccupied){
            possibleMoves.push(tile.coordinates);
            return;
        }

        if(this.currentCoordinates.includes("a")){
            if(tileIndex === diagonalRightPawn && tile.isOccupied){
                possibleMoves.push(tile.coordinates);
                return;
            }
        }

        if(this.currentCoordinates.includes("h")){
            if(tileIndex === diagonalLeftPawn && tile.isOccupied){
                possibleMoves.push(tile.coordinates);
                return;
            }
        }

        if(tileIndex === diagonalRightPawn && !this.currentCoordinates.includes("h") && tile.isOccupied){
                possibleMoves.push(tile.coordinates);
                return;
            }

        if(tileIndex === diagonalLeftPawn && !this.currentCoordinates.includes("a") && tile.isOccupied){
                possibleMoves.push(tile.coordinates);
                return;
        }

    }
    
    MovePiece(): [startPosition: string, endPosition: string] {
        throw new Error("Method not implemented.");
    }
}