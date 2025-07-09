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

            if(index === this.currentArrayPos - 7 || index === this.currentArrayPos - 9){
                tile.isOccupied = true;
            }

            if(this.color === "white"){
                this.CalcArrayPosWhite(tile, index, possibleMoves)
            }
            else{
                this.CalcArrayPosBlack(tile, index, possibleMoves);
            }

        }
        
        console.log(possibleMoves)
        return possibleMoves;
    }
    
    private CalcArrayPosBlack(tile: GameTile, tileIndex: number, possibleMoves: string[]){
        let possibleMove: string = "";
        
    }

    private CalcArrayPosWhite(tile: GameTile, tileIndex: number,  possibleMoves: string[]){
        
        // in front of pawn
        if(tileIndex === this.currentArrayPos - 8 && !tile.isOccupied){
            possibleMoves.push(tile.coordinates);
        }

        // in front of pawn 1 tiles away
        if(!this.hasMoved && tileIndex === this.currentArrayPos - 16 && !tile.isOccupied){
            possibleMoves.push(tile.coordinates);
        }

        if(this.currentCoordinates.includes("a")){
            // diagonal left from pawn
            if(tileIndex === this.currentArrayPos - (8 - 1) && tile.isOccupied){
                possibleMoves.push(tile.coordinates);
            }
        }

        if(this.currentCoordinates.includes("h")){
            // diagonal right from pawn
            if(tileIndex === this.currentArrayPos - (8 + 1) && tile.isOccupied){
                possibleMoves.push(tile.coordinates);
            }
        }
    }
    
    MovePiece(): [startPosition: string, endPosition: string] {
        throw new Error("Method not implemented.");
    }
}