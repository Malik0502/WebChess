import type { GameTile } from "../../board/entities/gameTile";
import { WHITE } from "../../common/constants/pieceColor";
import type { IPiece } from "./interfaces/IPiece";

export class Knight implements IPiece{
    name: string;
    color: string;
    value: number;
    spritePath: string;
    startCoordinates: string;
    currentCoordinates: string;
    hasMoved: boolean;
    selected: boolean;
    currentTile: GameTile;
    possibleMoves: GameTile[];
    controlledTiles: GameTile[];

    constructor(name: string, color: string, startCoordinates: string, currentTile: GameTile){
        this.name = name,
        this.color = color,
        this.value = 3,
        this.spritePath = this.color === WHITE ? "src/assets/pw.svg" : "src/assets/pb.svg";
        this.startCoordinates = startCoordinates;
        this.currentCoordinates = startCoordinates;
        this.hasMoved = false;
        this.selected = false;
        this.currentTile = currentTile;
        this.possibleMoves = [];
        this.controlledTiles = [];
    }
    
    calcPossibleMoves(board: GameTile[][], isAttack: boolean): GameTile[]{
        this.possibleMoves = [];

        const directionNorth: number = -2;
        const directionSouth: number = 2;
        const directionEast: number = 2;
        const directionWest: number = -2;

        this.calcVerticalMoves(board, directionNorth, isAttack);
        this.calcVerticalMoves(board, directionSouth, isAttack);

        this.calcHorizontalMoves(board, directionEast, isAttack);
        this.calcHorizontalMoves(board, directionWest, isAttack);

        this.markAsMoveOption();

        return this.possibleMoves;
    }


    calcVerticalMoves(board: GameTile[][], direction: number, isAttack: boolean){
        const currentTile: GameTile = this.currentTile;
        
        let moves: GameTile[] = [];

        if(currentTile.row < 2 && direction == -2) return;
        if(currentTile.row >= 6 && direction == 2) return;

        const verticalRight: GameTile | undefined = currentTile.col < 7 ? board[currentTile.row + direction][currentTile.col + 1] : undefined; 
        const verticalLeft: GameTile | undefined = currentTile.col > 0 ? board[currentTile.row + direction][currentTile.col -1] : undefined;
    
        moves.push(verticalRight!);
        moves.push(verticalLeft!);

        for (let index = 0; index < moves.length; index++) {
            const element = moves[index];
            
            if(!element) continue;

            if(element.isOccupied && element.currentPiece!.color == this.color && isAttack) continue;

            this.possibleMoves.push(element);
        }
    }

    calcHorizontalMoves(board: GameTile[][], direction: number, isAttack: boolean){
        const currentTile: GameTile = this.currentTile;
        
        let moves: GameTile[] = [];

        if(currentTile.col < 2 && direction == -2) return;
        if(currentTile.col >= 6 && direction == 2) return;

        const verticalRight: GameTile | undefined = currentTile.row < 7 ? board[currentTile.row + 1][currentTile.col + direction] : undefined; 
        const verticalLeft: GameTile | undefined = currentTile.row > 0 ? board[currentTile.row - 1][currentTile.col + direction] : undefined;
    
        moves.push(verticalRight!);
        moves.push(verticalLeft!);

        for (let index = 0; index < moves.length; index++) {
            const element = moves[index];
            
            if(!element) continue;

            if(element.isOccupied && element.currentPiece!.color == this.color && isAttack) continue;

            this.possibleMoves.push(element);
        }
    }

    
    markAsMoveOption(): void {
        this.possibleMoves.forEach(tile => {
            tile.isMoveOption = true;
        });
    }
}