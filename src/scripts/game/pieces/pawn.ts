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
        
        // in front of pawn
        if(tileIndex === this.currentArrayPos + 8 && !tile.isOccupied){
            possibleMoves.push(tile.coordinates);
            return;
        }

        // in front of pawn 1 tiles away
        if(!this.hasMoved && tileIndex === this.currentArrayPos + 16 && !tile.isOccupied && possibleMoves.length > 0){
            possibleMoves.push(tile.coordinates);
            return;
        }

        if(this.currentCoordinates.includes("h")){
            // diagonal down left from pawn
            if(tileIndex === this.currentArrayPos + (8 - 1) && tile.isOccupied){
                possibleMoves.push(tile.coordinates);
                return;
            }
        }

        if(this.currentCoordinates.includes("a")){
            // diagonal right from pawn
            if(tileIndex === this.currentArrayPos + (8 + 1) && tile.isOccupied){
                possibleMoves.push(tile.coordinates);
                return;
            }
        }

        // diagonal down left from pawn
        if(tileIndex === this.currentArrayPos + (8 - 1) && !this.currentCoordinates.includes("h") && tile.isOccupied){
                possibleMoves.push(tile.coordinates);
                return;
            }


        // diagonal down right from pawn
        if(tileIndex === this.currentArrayPos + (8 + 1) && !this.currentCoordinates.includes("a") && tile.isOccupied){
                possibleMoves.push(tile.coordinates);
                return;
        }
        
    }

    private CalcArrayPosWhite(tile: GameTile, tileIndex: number,  possibleMoves: string[]){
        
        // in front of pawn
        if(tileIndex === this.currentArrayPos - 8 && !tile.isOccupied){
            possibleMoves.push(tile.coordinates);
            return;
        }
        
        if(tileIndex === this.currentArrayPos - 8 && tile.isOccupied){
            possibleMoves.shift();
        }

        // in front of pawn 1 tiles away
        if(!this.hasMoved && tileIndex === this.currentArrayPos - 16 && !tile.isOccupied){
            possibleMoves.push(tile.coordinates);
            return;
        }

        if(this.currentCoordinates.includes("a")){
            // diagonal up right from pawn
            if(tileIndex === this.currentArrayPos - (8 - 1) && tile.isOccupied){
                possibleMoves.push(tile.coordinates);
                return;
            }
        }

        if(this.currentCoordinates.includes("h")){
            // diagonal up left from pawn
            if(tileIndex === this.currentArrayPos - (8 + 1) && tile.isOccupied){
                possibleMoves.push(tile.coordinates);
                return;
            }
        }

        // diagonal up right from pawn
        if(tileIndex === this.currentArrayPos - (8 - 1) && !this.currentCoordinates.includes("h") && tile.isOccupied){
                possibleMoves.push(tile.coordinates);
                return;
            }


        // diagonal up left from pawn
        if(tileIndex === this.currentArrayPos - (8 + 1) && !this.currentCoordinates.includes("a") && tile.isOccupied){
                possibleMoves.push(tile.coordinates);
                return;
        }

    }
    
    MovePiece(): [startPosition: string, endPosition: string] {
        throw new Error("Method not implemented.");
    }
}