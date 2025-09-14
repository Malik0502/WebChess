import type { GameTile } from "../../board/entities/gameTile";
import { WHITE } from "../../common/constants/pieceColor";
import type { IPiece } from "./interfaces/IPiece";
import type { IMovementInfo } from "./pieceMovement/entities/IMovementInfo";
import type { SlidingMovement } from "./pieceMovement/slidingMovement";

export class Queen implements IPiece{
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

    private movement: SlidingMovement;
    
    constructor(name: string, color: string, startCoordinates: string, currentTile: GameTile, movement: SlidingMovement){
        this.name = name,
        this.color = color,
        this.value = 9,
        this.spritePath = this.color === WHITE ? "src/assets/pw.svg" : "src/assets/pb.svg";
        this.startCoordinates = startCoordinates;
        this.currentCoordinates = startCoordinates;
        this.hasMoved = false;
        this.selected = false;
        this.currentTile = currentTile;
        this.possibleMoves = [];
        this.movement = movement;
    }
    
    calcPossibleMoves(board: GameTile[][]){
        this.possibleMoves = [];
        
        var movementInfo: IMovementInfo = {
            pieceColor: this.color,
            possibleMoves: this.possibleMoves,
            board: board,
            pieceRow: this.currentTile.row,
            pieceCol: this.currentTile.col
        }

        const straightPossibleMovements: GameTile[] = this.movement.straightMovement(movementInfo);
        const diagonalPossibleMovements: GameTile[] = this.movement.diagonalMovement(movementInfo);

        this.possibleMoves.concat(straightPossibleMovements, diagonalPossibleMovements);
                
        this.markAsMoveOption();
    }

    markAsMoveOption(): void {
        this.possibleMoves.forEach(tile => {
            tile.isMoveOption = true;
        });
    }
}